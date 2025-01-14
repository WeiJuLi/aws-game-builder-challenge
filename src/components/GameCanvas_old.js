import React, { useEffect, useRef } from "react";
import { Application, Sprite, Assets, AnimatedSprite, Texture } from "pixi.js"; // 2D rendering and game-related utilities
import gsap from "gsap"; // creating animations
import {
  loadObstacleAssets,
  generateObstacles,
  obstacleConfig,
  checkCollision,
} from "./Obstacle";
import { useNavigate } from "react-router-dom";

function GameCanvas() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize PixiJS Application
    const app = new Application();
    app.init({ width: 800, height: 600 }).then(() => {
      // Append the canvas to the DOM
      document.body.appendChild(app.canvas);

      // Add assets to load
      Assets.add({ alias: "background1", src: "/assets/bg800_600_1.png" });
      Assets.add({ alias: "background2", src: "/assets/bg800_600_2.png" });
      Assets.add({
        alias: "catSpriteSheet",
        src: "/assets/cat_sprite_sheet.json",
      });
      Assets.add({ alias: "snowFlake", src: "/assets/snowflake.png" });
      Assets.add({ alias: "moon", src: "/assets/moon.png" });
      Assets.add({ alias: "gift", src: "/assets/gift.png" });

      // Load the assets
      const texturesPromise = Assets.load([
        "background1",
        "background2",
        "catSpriteSheet",
        "snowFlake",
        "moon",
        "gift",
      ]);

      // When the promise resolves, use the loaded assets
      texturesPromise.then((textures) => {
        // Create and add the background
        const bg1 = Sprite.from(textures.background1);
        const bg2 = Sprite.from(textures.background2);

        // Position the second background right after the first
        bg1.x = 0;
        bg2.x = 800;

        // Add both sprites to the stage
        app.stage.addChild(bg1);
        app.stage.addChild(bg2);

        // Scroll the backgrounds
        app.ticker.add(() => {
          bg1.x -= 2; // Move left
          bg2.x -= 2; // Move left

          // Reset positions when they go out of view
          if (bg1.x <= -800) bg1.x = bg2.x + 800;
          if (bg2.x <= -800) bg2.x = bg1.x + 800;
        });

        // moon
        const moon = Sprite.from(textures.moon);
        moon.scale.set(0.3, 0.3);
        moon.x = 20;
        moon.y = 20;
        app.stage.addChild(moon);

        // snow flake animation
        for (let i = 0; i < 10; i++) {
          const sf = Sprite.from(textures.snowFlake);

          // Randomize size (scale)
          const scale = Math.random() * (0.2 - 0.05) + 0.05; // Between 0.2 and 0.5
          sf.scale.set(scale);

          // Set initial position
          sf.x = Math.random() * app.screen.width; // Random horizontal position
          sf.y = Math.random() * -app.screen.height;
          sf.alpha = 0.5;

          app.stage.addChild(sf);

          // Falling animation using GSAP
          const fallDuration = Math.random() * (5 - 3) + 3; // Random duration between 3 and 5 seconds
          const loopFall = () => {
            sf.y = Math.random() * -50; // Reset to start at y = -10
            sf.x = Math.random() * app.screen.width; // Randomize horizontal position again

            gsap.to(sf, {
              y: app.screen.height, // Fall to the bottom
              duration: fallDuration, // Use random duration
              ease: "linear",
              onComplete: loopFall, // Loop the animation
            });
          };

          loopFall(); // Start the animation
        }

        // Create obstacles and check collision every frame
        loadObstacleAssets().then(() => {
          const obstacles = generateObstacles(app, obstacleConfig);

          app.ticker.add(() => {
            obstacles.forEach((obstacle) => {
              obstacle.x -= 5; // Move obstacle left
              if (obstacle.x < -50) {
                obstacle.x = 850; // Reset obstacle position
              }

              if (checkCollision(cat, obstacle)) {
                app.ticker.stop(); // Stop game logic
                navigate("/game-over"); // Navigate to Game Over page
              }
            });
          });
        });

        // Define frames from the loaded sprite sheet
        const frames = [
          Assets.get("cat_run_1"),
          Assets.get("cat_run_2"),
          //Assets.get("cat_slide"),
          //Assets.get("cat_fat"),
          //Assets.get("cat_slim"),
        ];

        // Create an AnimatedSprite for the cat
        const cat = new AnimatedSprite(frames);
        cat.anchor.set(0.5); // Set anchor to the center
        cat.x = 200; // Center the cat horizontally
        cat.y = 350; // Center the cat vertically
        cat.animationSpeed = 0.05; // Adjust animation speed
        cat.scale.set(0.3, 0.3);
        cat.play(); // Start the animation

        // Add the cat sprite to the stage
        app.stage.addChild(cat);

        // Add GSAP animation for additional interactivity
        // Variable to hold the bounce animation
        let bounceAnimation;

        // Function to start or resume bounce animation
        const startBounce = () => {
          bounceAnimation = gsap.to(cat, {
            y: 370, // Lowest position of bounce
            duration: 0.35,
            yoyo: true,
            repeat: -1, // Infinite bounce
            ease: "sine.inOut",
          });
        };

        const stopBounce = () => {
          if (bounceAnimation) bounceAnimation.kill();
        };

        startBounce();

        // Variable to manage jump
        let jump = false;

        // Enable microphone and process voice input
        // Request microphone access
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser(); // Create an analyser
            const source = audioContext.createMediaStreamSource(stream); // Link microphone to analyser
            source.connect(analyser); // Connect the analyser to the audio source

            analyser.fftSize = 256; // Set the FFT size
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            let isCoolingDown = false; // cool down flag after high pitch and low pitch animation

            const checkAudio = () => {
              analyser.getByteFrequencyData(dataArray);

              const nyquist = audioContext.sampleRate / 2;
              const freqPerBin = nyquist / analyser.fftSize;

              const lowFreqStart = Math.floor(50 / freqPerBin);
              const lowFreqEnd = Math.ceil(150 / freqPerBin);
              const highFreqStart = Math.floor(450 / freqPerBin);
              const highFreqEnd = Math.ceil(800 / freqPerBin);

              let isLowFrequency = false;
              let isHighFrequency = false;

              if (isCoolingDown || cat.isLowFrequencyAnimating || jump) {
                return requestAnimationFrame(checkAudio);
              }

              if (
                dataArray
                  .slice(highFreqStart, highFreqEnd)
                  .some((value) => value > 200)
              ) {
                isHighFrequency = true;
              } else if (
                dataArray
                  .slice(lowFreqStart, lowFreqEnd)
                  .some((value) => value > 200)
              ) {
                isLowFrequency = true;
              }

              if (isLowFrequency && !cat.isLowFrequencyAnimating) {
                cat.isLowFrequencyAnimating = true;
                gsap.to(cat.scale, {
                  x: 0.3,
                  y: 0.1,
                  duration: 0.8,
                  ease: "power2.out",
                  onComplete: () => {
                    gsap.to(cat.scale, {
                      x: 0.3,
                      y: 0.3,
                      duration: 0.5,
                      ease: "power2.in",
                      onComplete: () => {
                        cat.isLowFrequencyAnimating = false;
                        setTimeout(() => {
                          isCoolingDown = false;
                        }, 500);
                      },
                    });
                  },
                });
              }

              if (isHighFrequency && !jump && !cat.isLowFrequencyAnimating) {
                jump = true;
                stopBounce();

                gsap.to(cat, {
                  y: 100,
                  duration: 0.5,
                  yoyo: true,
                  repeat: 1,
                  ease: "power2.out",
                  onComplete: () => {
                    cat.y = 350;
                    startBounce();
                    jump = false;
                    setTimeout(() => {
                      isCoolingDown = false;
                    }, 500);
                  },
                });
              }

              requestAnimationFrame(checkAudio);
            };

            checkAudio();
          })
          .catch((error) => {
            console.error("Microphone access error:", error);
          });
      });
    });

    return () => {
      
    };
  }, [navigate]);
  return <div></div>;
}

export default GameCanvas;

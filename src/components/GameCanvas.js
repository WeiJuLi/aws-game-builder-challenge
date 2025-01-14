import React, { useEffect, useRef, useState } from "react";
import {
  Application,
  Sprite,
  Assets,
  AnimatedSprite,
  Texture,
  Graphics,
} from "pixi.js"; // 2D rendering and game-related utilities
import gsap from "gsap"; // creating animations
import {
  loadObstacleAssets,
  generateObstacles,
  obstacleConfig,
  isPolygonCollision,
} from "./Obstacle";
import { useNavigate } from "react-router-dom";
import { catVertices1, updatePolygon } from "./CatCharacter";
import * as SAT from "sat";
import {
  startWebcam,
  startHandDetectionWithWorker,
  stopHandDetectionWithWorker,
} from "./HandDetect";
import "./GameCanvas.css";

// API - Post Method for sending playerName and collisionTimes
import EndGameModal from "./EndGameModal";
import { submitScore } from "./apiIndex";

function GameCanvas() {
  const navigate = useNavigate();
  const analyserRef = useRef(null);
  const animationFrameId = useRef(null);
  // Hand detect
  const MODEL_PATH = "/model/hand_landmarker.task";
  const videoRef = useRef(null); // For webcam input
  const canvasRef = useRef(null);
  const [handDetected, setHandDetected] = useState(false); // State to track hand detection
  const [collisionCount, setCollisionCount] = useState(0);
  const [showCrash, setShowCrash] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  //Load assets
  async function loadAssets() {
    const assets = [
      { alias: "background1", src: "/assets/bg1920_600_1.png" },
      { alias: "background2", src: "/assets/bg1920_600_2.png" },
      { alias: "catSpriteSheet", src: "/assets/cat_sprite_sheet.json" },
      { alias: "snowFlake", src: "/assets/snowflake.png" },
      { alias: "moon", src: "/assets/moon.png" },
    ];
    assets.forEach((asset) => Assets.add(asset));
    return await Assets.load(assets.map((asset) => asset.alias));
  }

  //Background
  function createScrollingBackground(app, textures) {
    const bgs = [];
    const bg1 = Sprite.from(textures.background1);
    const bg2 = Sprite.from(textures.background2);

    bg1.x = 0;
    bg2.x = 1920;

    app.stage.addChild(bg1, bg2);
    bgs.push(bg1, bg2);

    app.ticker.add(() => {
      bgs.forEach((bg, i) => {
        bg.x -= 5;
        if (bg.x <= -1920) bg.x += 3840;
      });
    });
    return bgs;
  }

  //Snowflakes
  function createSnowflakes(app, texture) {
    const snowflakes = [];
    for (let i = 0; i < 10; i++) {
      const snowflake = Sprite.from(texture);
      const scale = Math.random() * 0.15 + 0.05;

      snowflake.scale.set(scale);
      snowflake.x = Math.random() * app.screen.width;
      snowflake.y = Math.random() * -app.screen.height;
      snowflake.alpha = 0.5;

      app.stage.addChild(snowflake);

      const fallDuration = Math.random() * 2 + 3;

      const loopFall = () => {
        snowflake.y = Math.random() * -50;
        snowflake.x = Math.random() * app.screen.width;

        gsap.to(snowflake, {
          y: app.screen.height,
          duration: fallDuration,
          ease: "linear",
          onComplete: loopFall,
        });
      };

      loopFall();
    }
    return snowflakes;
  }

  //Moon
  function createMoon(app, texture) {
    const moon = Sprite.from(texture);
    moon.scale.set(0.3, 0.3);
    moon.x = 20;
    moon.y = 20;
    app.stage.addChild(moon);
    return moon;
  }

  //Cat
  function createCat(app) {
    const frames = [Assets.get("cat_run_1"), Assets.get("cat_run_2")];

    // Create AnimatedSprite
    const cat = new AnimatedSprite(frames);
    cat.anchor.set(0.5);
    cat.x = 200;
    cat.y = 380;
    cat.animationSpeed = 0.08;
    cat.scale.set(0.3, 0.3);
    cat.isAnimating = false;
    cat.play(); // Start animation

    app.stage.addChild(cat);
    return cat;
  }

  function triggerHighLowAnimation(cat, type) {
    if (cat.isAnimating) return; // Prevent overlapping animations
    cat.isAnimating = true;

    if (type === "low") {
      gsap.to(cat.scale, {
        x: 0.3,
        y: 0.1,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(cat.scale, {
            x: 0.3,
            y: 0.3,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => {
              cat.isAnimating = false; // Reset animation state
            },
          });
        },
      });
    } else if (type === "high") {
      gsap.to(cat, {
        y: 80,
        duration: 0.5,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(cat, {
            y: 380,
            duration: 0.75,
            ease: "power1.in",
            onComplete: () => {
              cat.isAnimating = false; // Reset animation state
            },
          });
        },
      });
    }
  }

  // drawVertices & gameLoop are for testing collision.
  // Draw the boundaries of cat
  function drawVertices(app, updateVertices) {
    const graphics = new Graphics();
    graphics.clear(); //Clean up the previous frame's graphic

    updateVertices.forEach(({ x, y }) => {
      graphics.circle(x, y, 2);
      graphics.fill("red");
      //console.log(x, y);
    });
    app.stage.addChild(graphics);
  }

  /*
  function gameLoop(app, currentPolygon, catVertices1, cat) {
    updatePolygon(currentPolygon, catVertices1, cat);
    drawVertices(app, currentPolygon.points);
    requestAnimationFrame(() =>
      gameLoop(app, currentPolygon, catVertices1, cat)
    );
  }
*/
  useEffect(() => {



    const app = new Application();
    let bgs = []; // Define in outer scope
    let snowflakes = []; // Define in outer scope
    let moon = null; // Define in outer scope
    let obstacles = []; // Define in outer scope

    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    app
      .init({ width: window.innerWidth, height: 600 })
      .then(async () => {
        const gameContainer = document.getElementById("game-container");
        if (gameContainer && !gameContainer.contains(app.canvas)) {
          gameContainer.appendChild(app.canvas);
        }

        try {
          const textures = await loadAssets();

          bgs = createScrollingBackground(app, textures);
          snowflakes = createSnowflakes(app, textures.snowFlake);
          moon = createMoon(app, textures.moon);
          const cat = createCat(app);

          const currentPolygon = new SAT.Polygon(
            new SAT.Vector(0, 0),
            catVertices1
          );

          // Initialize Hand detect
          // If obstacle is wall and detected == TRUE, then cat.alpha = 0.5
          let isWallInRange = false;
          await startWebcam(videoRef, MODEL_PATH);

          startHandDetectionWithWorker(videoRef, canvasRef, (detected) => {
            setHandDetected(detected);
            cat.alpha = detected && isWallInRange ? 0.5 : 1;
          });

          // Draw the boundary of cat by each frame for checking
          //gameLoop(app, currentPolygon, catVertices1, cat);

          let lastUpdateTime = Date.now();

          /*********** Load obstacle assets and check collision every frame**********/
          loadObstacleAssets().then(() => {
            obstacles = generateObstacles(app, obstacleConfig);
            console.log(obstacles);
            const graphics = new Graphics();
            app.stage.addChild(graphics);

            // Start game loop
            app.ticker.add(() => {
              const now = Date.now();
              const deltaTime = (now - lastUpdateTime) / 1000;
              lastUpdateTime = now;

              const canvasWidth = 800;
              updatePolygon(currentPolygon, catVertices1, cat);
              isWallInRange = false;
              obstacles.forEach((obstacle) => {
                // Move obstacle
                obstacle.x -= 550 * deltaTime;

                const obstacleBounds = obstacle.getBounds();
                if (
                  obstacle.alias === "wall" &&
                  obstacle.x > 0 &&
                  obstacle.x < canvasWidth
                ) {
                  isWallInRange = true;
                }

                // If obstacle is out of screen (x < 0) or is out of the canvas, skip detection and drawing.
                // or cat transparency < 100% don't detect collisions.
                if (
                  obstacle.x < 0 ||
                  obstacleBounds.x > canvasWidth ||
                  cat.alpha < 1
                ) {
                  return;
                }

                if (
                  isPolygonCollision(currentPolygon, obstacleBounds, graphics)
                ) {
                  setCollisionCount((prevCount) => prevCount + 1);
                  setShowCrash(true);
                  setTimeout(() => setShowCrash(false), 1000);
                }
              });

              const isAllObstaclesDone = obstacles.every(
                (obstacle) => obstacle.x < 0
              );
              if (isAllObstaclesDone) {
                setIsGameOver(true);
              }
            });
          });

          /*********** Enable microphone and process voice input************/
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

              const checkAudio = () => {
                analyser.getByteFrequencyData(dataArray);

                const nyquist = audioContext.sampleRate / 2;
                const freqPerBin = nyquist / analyser.fftSize;

                const lowFreqStart = Math.floor(50 / freqPerBin);
                const lowFreqEnd = Math.ceil(150 / freqPerBin);
                const highFreqStart = Math.floor(500 / freqPerBin);
                const highFreqEnd = Math.ceil(800 / freqPerBin);

                let isLowFrequency = false;
                let isHighFrequency = false;

                if (cat.isAnimating) {
                  //console.log("Cat is animating.");
                  animationFrameId.current = requestAnimationFrame(checkAudio);
                  return;
                }

                if (
                  dataArray
                    .slice(highFreqStart, highFreqEnd)
                    .some((value) => value > 200)
                ) {
                  isHighFrequency = true;
                  triggerHighLowAnimation(cat, "high");
                  //console.log("high pitch");
                } else if (
                  dataArray
                    .slice(lowFreqStart, lowFreqEnd)
                    .some((value) => value > 200)
                ) {
                  isLowFrequency = true;
                  triggerHighLowAnimation(cat, "low");
                  //console.log("low pitch");
                }

                animationFrameId.current = requestAnimationFrame(checkAudio);
              };

              checkAudio();
            })
            .catch((error) => {
              console.error("Microphone access error:", error);
            });
        } catch (error) {
          console.error("資源載入失敗:", error);
        }
      })
      .catch((error) => {
        console.error("PixiJS Application 初始化失敗:", error);
      });

    // 清理邏輯
    return () => {
      // 1. Destroy all sprites referencing textures
      bgs.forEach((bg) => {
        app.stage.removeChild(bg); // Remove from stage
        bg.destroy({ texture: false, baseTexture: false }); // Prevent texture destruction
      });
      console.log("All background sprites destroyed.");

      snowflakes.forEach((snowflake) => {
        gsap.killTweensOf(snowflake); // Stop GSAP animations
        app.stage.removeChild(snowflake); // Remove from stage
        snowflake.destroy({ texture: false, baseTexture: false }); // Prevent texture destruction
      });
      console.log("All snowflakes destroyed.");

      if (moon) {
        app.stage.removeChild(moon);
        moon.destroy({ texture: false, baseTexture: false }); // Prevent texture destruction
      }

      obstacles.forEach((obstacle) => {
        app.stage.removeChild(obstacle); // Remove from stage
        obstacle.destroy({ texture: false, baseTexture: false }); // Prevent texture destruction
      });
      console.log("All obstacles destroyed.");

      // 2. Unload assets only after all references to textures are cleared
      const backgroundAndMainAliases = [
        "background1",
        "background2",
        "catSpriteSheet",
        "snowFlake",
        "moon",
      ];
      backgroundAndMainAliases.forEach((alias) => {
        Assets.unload(alias);
        delete Assets.cache[alias];
      });
      console.log("Main assets unloaded.");

      const obstacleAliases = ["hang1", "hang2", "gift1", "gift2"];
      obstacleAliases.forEach((alias) => {
        Assets.unload(alias);
        delete Assets.cache[alias];
      });
      console.log("Obstacle assets unloaded.");

      gsap.globalTimeline.clear();

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.context.close();
      }

      stopHandDetectionWithWorker();
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }

      // 3. Destroy PixiJS app
      if (app) {
        app.destroy(true);
      }
      console.log("PixiJS app destroyed.");

      // 4. Remove Event Listener
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Input and Submit the player's records.
  const handleSubmit = async (playerName) => {
    try {
      await submitScore(playerName, collisionCount);
      navigate("/leaderboard", {
        state: {playerName, collisionCount}
      });
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  };

  return (
    <div className="canvas">
      <div className="camera">
        {" "}
        <video
          ref={videoRef}
          className="video-stream"
          autoPlay
          playsInline
        ></video>
        <div className="score">
          <h1>Collision</h1>
          <h1>{collisionCount}</h1>
          <h1>times</h1>
        </div>
        <canvas
          ref={canvasRef}
          width="160"
          height="120"
          style={{ display: "none" }}
        ></canvas>
      </div>

      <div id="game-container">
        <div className={`crash-image ${showCrash ? "show" : ""}`}>
          <img src="/assets/crash.png" alt="Crash!" />
        </div>
        {isGameOver && (
          <EndGameModal
            collisionCount={collisionCount}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default GameCanvas;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();
  const [permissionDenied, setPermissionDenied] = useState(false); // If user denies to use microphone, then show the permission guide.
  const catRef = useRef(null);
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      navigate("/game");
    } catch (error) {
      setPermissionDenied(true);
      alert("Please allow the use of microphone and camera to enter the game.");
    }
  };

  const handlePlayClick = () => {
    requestMicrophonePermission();
  };

  useEffect(() => {
    //
    const checkScreenSize = () => {
      const screenWidth = window.innerWidth;
      setIsScreenTooSmall(screenWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Animation of cat
    const tl = gsap.timeline({ repeat: -1 });
    return () => {
      tl.kill(); // Clean up the animation
    };
  }, []);

  return (
    <div>
      {isScreenTooSmall ? (
        <div style={styles.alertBox}>
          <p style={styles.alertText}>
            The screen width of your mobile phone is too small. To extend the
            reaction time for obstacles, we recommend playing the game on a
            computer or tablet.
          </p>
        </div>
      ) : (
        <div className="welcome">
          <div className="welcome-content">
            <img src="/assets/welcome.png" alt="Welcome"></img>

            <button onClick={handlePlayClick}>
              <img
                className="play-bnt"
                src="/assets/play_bnt_default.png"
                alt="play"
              ></img>
            </button>

            <div className="cat_demo">
              <img ref={catRef} src="/assets/logo.png" alt="Cat"></img>
            </div>
          </div>

          {permissionDenied && (
            <div className="permission-guide">
              <ol>
                <li>1. Click the icon next to the website's URL.</li>
                <li>
                  2. Change the "Microphone" and "Camera" setting to "Allow".
                </li>
                <li>3. Refresh the page.</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  alertBox: {
    padding: "20px",
    backgroundColor: "#ffeeba",
    color: "#856404",
    border: "1px solid #ffeeba",
    borderRadius: "5px",
    textAlign: "center",
    maxWidth: "600px",
    margin: "50px auto",
  },
  alertText: {
    fontSize: "16px",
    lineHeight: "1.5",
  },
};

export default Welcome;

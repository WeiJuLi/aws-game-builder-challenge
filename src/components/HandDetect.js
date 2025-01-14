let handWorker;
let handDetectFrameId;

// HackMD doc.
export const initializeHandDetectionWithWorker = (modelPath) => {
  handWorker = new Worker(new URL("./worker.js", import.meta.url));
  handWorker.postMessage({ type: "init", data: { modelPath } });

  return new Promise((resolve) => {
    handWorker.onmessage = (event) => {
      if (event.data.type === "init" && event.data.status === "success") {
        console.log("Worker initialized successfully.");
        resolve();
      }
    };
  });
};

export const startWebcam = async (videoRef, modelPath) => {
  try {
    // Enable the camera and set it to videoRef.
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoRef.current.srcObject = stream;
    // Notify the Worker to Initialize Model
    await initializeHandDetectionWithWorker(modelPath);

    console.log("Webcam and Worker initialized successfully.");
  } catch (error) {
    console.error("Error accessing webcam:", error);
  }
};

export const startHandDetectionWithWorker = (videoRef, canvasRef, onDetect) => {
  const detectHands = () => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.warn("Canvas reference is null, stopping detection.");
        return; 
      }
      
      const ctx = canvas.getContext("2d");

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      handWorker.postMessage({
        type: "detect",
        data: { frame: frameData },
      });

      detectHands();
    }, 100); // Performs a test every 100 milliseconds.
  };

  handWorker.onmessage = (event) => {
    if (event.data.type === "detect") {
      const detections = event.data.detections;
      // Triggers onDetect if a hand is detected.
      onDetect(detections.handednesses.length > 0);
    }
  };
  detectHands();
};

export const stopHandDetectionWithWorker = () => {
  if (handDetectFrameId) {
    cancelAnimationFrame(handDetectFrameId);
    handDetectFrameId = null;
  }
  if (handWorker) {
    handWorker.terminate();
    handWorker = null;
  }
};

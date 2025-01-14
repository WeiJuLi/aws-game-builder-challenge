import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

let handLandmarker;

self.onmessage = async (event) => {
  const { type, data } = event.data;

  if (type === "init") {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: data.modelPath, delegate: "CPU" },
      numHands: 1,
      imageDimensions: { width: 160, height: 120 },
    });
    self.postMessage({ type: "init", status: "success" });
  }

  if (type === "detect"){
    const { frame } = data;
    const detections = handLandmarker.detect(frame);
    self.postMessage({ type: "detect", detections });
  }
};
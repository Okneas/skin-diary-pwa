// src/features/photo/useMediaPipe.ts
import { useEffect, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export function useMediaPipe() {
  const [landmarker, setLandmarker] = useState<FaceLandmarker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let localLandmarker: FaceLandmarker | null = null;

    async function init() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.11/wasm"
        );
        localLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: false,
          runningMode: "IMAGE",
          numFaces: 1,
        });

        if (!cancelled) {
          setLandmarker(localLandmarker);
          setIsReady(true);
        }
      } catch (e) {
        console.error("MediaPipe init error:", e);
        if (!cancelled) setError("Не удалось загрузить модель анализа лица");
      }
    }

    init();
    return () => {
      cancelled = true;
      localLandmarker?.close();
    };
  }, []);

  return { landmarker, isReady, error };
}
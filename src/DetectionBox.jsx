import { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";

import camera from "./assets/camera.png";
import dog from "./assets/dog.png";
import cat from "./assets/cat.png";

export const DetectionBox = () => {
  const [detection, setDetection] = useState([]);
  const [onDetection, setOnDetection] = useState(false);
  const [confirmar, setConfirmar] = useState(null);
  const [model, setModel] = useState(null);
  const [webcam, setWebcam] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0); // Initialize with 0
  const canvasRef = useRef(null); // Use useRef for the canvas element

  useEffect(() => {
    const init = async () => {
      const URL = "/model/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      // Load the model and metadata
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      setMaxPredictions(loadedModel.getTotalClasses());
    };
    init();
  }, []);

  useEffect(() => {
    if (onDetection && model) {
      loadWebcam();
    } else if (!onDetection && webcam) {
      webcam.stop();
      setWebcam(null);
      setDetection([]);
      // Clean the canvas when detection is turned off
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      }
    }
  }, [onDetection, model]);

  function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Detect mobile platforms (iOS, Android, Windows Phone)
    return /android|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(userAgent);
  }
  

  async function loadWebcam() {
    const flip = false; // Set to false because we want the back camera not to flip.
    const isMobileDevice = isMobile();
  
    // Configure restrictions without `exact` for better compatibility
    const constraints = {
      video: {
        facingMode: isMobileDevice ? "environment" : "user",
      }
    };
  
    const webcamInstance = new tmImage.Webcam(300, 300, flip); // Width, height, flip (false)
    setWebcam(webcamInstance);
  
    // Configure the webcam with the constraints
    await webcamInstance.setup(constraints.video); // Request access to the camera
    await webcamInstance.play(); // Start the camera
  
    // Iniciar el loop de actualización de frames
    window.requestAnimationFrame(() => loop(webcamInstance));
  }
  

  async function loop(webcamInstance) {
    if (webcamInstance) {
      try {
        // Verify that update is a function before calling it
        if (typeof webcamInstance.update === "function") {
          webcamInstance.update(); // Update the webcam frame
          drawCanvas(webcamInstance); // Draw the webcam image on the canvas
          window.requestAnimationFrame(() => loop(webcamInstance)); // Call loop again
        } else {
          console.error("webcamInstance.update is not a valid function.");
        }
      } catch (error) {
        console.error("Loop Error:", error);
      }
    }
  }

  function drawCanvas(webcamInstance) {
    const canvas = canvasRef.current;
    if (canvas && webcamInstance) {
      const context = canvas.getContext("2d");
      context.drawImage(webcamInstance.canvas, 0, 0); // Draw the webcam image on the canvas
    }
  }

  async function predict() {
    // Predict can take in an image, video or canvas html element
    if (model && webcam) {
      const predictions = await model.predict(webcam.canvas);
      const results = predictions.slice(0, maxPredictions); // Ensure we don't exceed the number of classes

      setDetection(results);
    }
  }

  const handleWebCam = async () => {
    if (confirmar === null) {
      setConfirmar(true);
    } else if (confirmar) {
      setOnDetection((prev) => !prev);
      setConfirmar(null);
    }
  };

  const handleDetection = async () => {
    if (onDetection && model) {
      await predict(); // Execute prediction
    }
  };

  const isDogOrCat =
    detection[0]?.probability.toFixed(2) > 0.5
      ? detection[0]?.className
      : detection[1]?.className;

  const isDogOrCatProbability =
    isDogOrCat === "gato" // This depends on your model's class names, change if necessary
      ? detection[0]?.probability.toFixed(2)
      : detection[1]?.probability.toFixed(2);

  console.log("isDogOrCat:", isNaN((isDogOrCatProbability * 100).toFixed(2)));

  const isDogOrCatPercent = isNaN((isDogOrCatProbability * 100).toFixed(2))
    ? 0
    : (isDogOrCatProbability * 100).toFixed(2);

  return (
    <div className="flex mobile:flex-col md:flex-row lg:flex-row bg-[#E5E6D8] mt-5 items-center justify-center h-screen w-screen">	 
      <div className="flex flex-col items-center justify-center mx-5">
        <h2 className="font-bold text-2xl border-b-2 border-gray-800 mb-2">
          Detectron MK-2
        </h2>
        {confirmar && (
          <div className="bg-white font-extrabold text-center text-green-600 p-5 rounded-md shadow-md mb-5">
            {!onDetection
              ? "¡Press again to wake up the machine!"
              : "¡Press again to turn off the machine!"}
          </div>
        )}
        <div className="flex items-center justify-center mb-4">
          {onDetection ? (
            <canvas
              className="rounded-md"
              ref={canvasRef}
              width={300} // Ensure the width matches the webcam
              height={300} // Ensure the height matches the webcam
            />
          ) : (
            <div className="flex items-center justify-center bg-gray-200 p-5 rounded-md shadow-md">
              <img src={camera} alt="camera" className="" />
            </div>
          )}
        </div>
        <button
          onClick={handleWebCam}
          className={`p-2 ${ !onDetection ? 'bg-[#1FC473] hover:border-[#89dcb4]' : 'bg-none border-2 border-red-600 text-red-600 hover:border-[#dc8989]'} hover:border-4 rounded-md text-white font-semibold`} 
        >
          {onDetection ? "Stop IA" : "Start IA"}
        </button>
      </div>

      <div className="mobile:mt-5 sm:mx-5 md:mx-5 lg:mx-5 flex flex-col items-center justify-center"> 
        <h3 className="text-2xl mb-10 border-b-2 border-[#1FC473]">
          Detections
        </h3>
        {onDetection && (
          <>
            <p>
              It is a: {isDogOrCat} - {isDogOrCatPercent}%
            </p>
            <div className="mobile:mt-5 lg:mt-16">
              {isDogOrCat === "perro" && ( // Adjust class name as per your model
                <img src={dog} alt="dog" className="w-32 h-32" />
              )}
              {isDogOrCat === "gato" && ( // Adjust class name as per your model
                <img src={cat} alt="cat" className="w-32 h-32" />
              )}
            </div>
            <button
              className="lg:mt-12 p-2 bg-[#1fc4b4] hover:border-4 hover:border-[#89dcb4] rounded-md text-white font-semibold"
              onClick={handleDetection}
            >
              Detect
            </button>
          </>
        )}
      </div>
    </div>
  );
};

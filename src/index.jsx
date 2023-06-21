import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { StrictMode } from "react";
import FlowerHeart from "./FlowerHeart";


const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
  <StrictMode>
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [10, -2, 30],
      }}
    >
      <OrbitControls makeDefault />
      <directionalLight color={"#ffffff"} intensity={".5"} />
      <ambientLight color={"#808080"} intensity={".8"} />
      <hemisphereLight skyColor={"#cefeff"} groundColor={"#b3eaf0"} intensity={".2"} />
      <FlowerHeart />
      
    </Canvas>
    </StrictMode>
  </>
);

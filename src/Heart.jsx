import React, { useRef, forwardRef, useLayoutEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Model = forwardRef(function Model(props, ref) {
  const { nodes, materials } = useGLTF("/Human heart.glb");


  return (
    <mesh
      ref={ref}
      {...props}
      castShadow
      receiveShadow
      geometry={nodes.human_heart1.geometry}
     
    >
      <meshBasicMaterial
        color={new THREE.Color("skyblue")}
        wireframe
      ></meshBasicMaterial>
    </mesh>
  );
});

useGLTF.preload("/Human heart.glb");
export default Model;

// import { useThree, extend } from '@react-three/fiber'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// extend({ OrbitControls })

import {
  PivotControls,
  TransformControls,
  OrbitControls,
} from "@react-three/drei";
import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import * as THREE from "three";

import HeartModel from "./Heart";

const pointsCount = 10000;
let positions = Float32Array.from({ length: pointsCount * 3 }, () => 1);

let sampler = null;
export default function Experience() {
  const pointsRef = useRef();
  const lineRef = useRef();
  // const modelRef = createRef();

  const ref = useRef(null);
  // console.log(ref)

  let tempPosition = new THREE.Vector3();
  let previousTempPosition = new THREE.Vector3();
  useEffect(() => {
    sampler = new MeshSurfaceSampler(ref.current).build();
    // console.log(lineRef.current);
    sampler.sample(previousTempPosition);
    // console.log("useEffect runs on CPU too!!!")
    //! useful!
    // for (let i = 0; i < 3000; i++) {
    //   sampler.sample(tempPosition);
    //   pointsRef.current.geometry.attributes.position.array[i * 3] =
    //     tempPosition.x;
    //   pointsRef.current.geometry.attributes.position.array[i * 3 + 1] =
    //     tempPosition.y;
    //   pointsRef.current.geometry.attributes.position.array[i * 3 + 2] =
    //     tempPosition.z;
    // }

    // pointsRef.current.geometry.attributes.position.needsUpdate = true;
  }, []);

  let index = 0;
  useFrame(() => {
    // sampler.sample(previousTempPosition);
    // console.log("useframe runs on CPU");
    index++;
    //! useful!
    // pointsRef.current.geometry.drawRange.count = index;
    // if (index < 3000 && sampler) {
    //   sampler.sample(previousTempPosition);
    //   sampler.sample(tempPosition);

    //   pointsRef.current.geometry.attributes.position.array[index * 3] =
    //     tempPosition.x;
    //   pointsRef.current.geometry.attributes.position.array[index * 3 + 1] =
    //     tempPosition.y;
    //   pointsRef.current.geometry.attributes.position.array[index * 3 + 2] =
    //     tempPosition.z;
    // }
    // vertices.push(tempPosition)
    // pointsRef.current.geometry.attributes.position.needsUpdate = true;
    let pointFound = false;
    while (!pointFound) {
      sampler.sample(tempPosition);
      if (tempPosition.distanceTo(previousTempPosition) < 1) {
        lineRef.current.geometry.attributes.position.array[index * 3] =
          tempPosition.x;
        lineRef.current.geometry.attributes.position.array[index * 3 + 1] =
          tempPosition.y;
        lineRef.current.geometry.attributes.position.array[index * 3 + 2] =
          tempPosition.z;
        // lineRef.current.geometry.attributes.position.needsUpdate = true;
        previousTempPosition = tempPosition.clone();
        pointFound = true;
      }
    }
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  //! ref.current must trigger a setter function

  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={2}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <line ref={lineRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach={"attributes-position"}
            count={pointsCount}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <lineBasicMaterial
          attach="material"
          color={"#9c88ff"}
          linewidth={10}
          linecap={"round"}
          linejoin={"round"}
          blending={THREE.AdditiveBlending}
        />
      </line>
      {/* <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach={"attributes-position"}
            itemSize={3}
            count={pointsCount}
            array={positions}
          />
        </bufferGeometry>
        <pointsMaterial
          color="red"
          size={0.5}
          alphaTest={0.2}
          map={new THREE.TextureLoader().load(
            "https://assets.codepen.io/127738/dotTexture.png"
          )}
          vertexColors={"true"}
        />
      </points> */}
      <HeartModel ref={ref} scale={1} />
    </>
  );
}

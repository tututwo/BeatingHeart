// import { useThree, extend } from '@react-three/fiber'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// extend({ OrbitControls })

import {
  PivotControls,
  TransformControls,
  OrbitControls,
} from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import * as THREE from "three";

import HeartModel from "./Heart";

const pointsCount = 1000;
let positions = Float32Array.from({ length: pointsCount * 3 }, () => 1);
let i = 0;
let sampler = null;
export default function Experience() {
  const pointsRef = useRef();
  // const modelRef = createRef();

  const ref = useRef(null);
  // console.log(ref)
  const vertices = [];
  const tempPosition = new THREE.Vector3();
  //? produces a ball ?
  //   const positionMemo = useMemo(() => {

  //     if (ref.current) {
  //       for (let i = 0; i < pointsCount; i++) {
  //         const sampler = new MeshSurfaceSampler(ref.current).build();
  //         sampler.sample(tempPosition);

  //         vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
  //       }
  //     }
  //     return new Float32Array(vertices, 3);
  //   }, [ref.current]);
  // console.log(positionMemo)
  // console.log(positionMemo)
  // useEffect(() => {
  //   for (let i = 0; i < pointsCount; i++) {
  //     ;

  //     // vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
  //   }
  //   // positions = new THREE.Float32BufferAttribute(vertices, 3);
  //   // positions = new Float32Array(vertices, 3);
  //   // console.log(positions)
  // }, [ref.current]);

  //
  useEffect(() => {
    sampler = new MeshSurfaceSampler(ref.current).build();
    // sampler.sample(tempPosition);
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    // console.log(pointsRef.current.geometry.attributes.position)
  }, []);

  // useFrame(() => {
  //   i += 1;

  //   if (i<3000 && sampler) {

  //     sampler.sample(tempPosition);
  //     pointsRef.current.geometry.attributes.position.array[i * 3] = tempPosition.x;
  //     pointsRef.current.geometry.attributes.position.array[i * 3 + 1] = tempPosition.y;
  //     pointsRef.current.geometry.attributes.position.array[i * 3 + 2] = tempPosition.z;
  //   }

  // });

  // let pointsMemo = useMemo(() => {
  //   return ref.current
  // }, [ref.current])
  //! ref.current must trigger a setter function
  // console.log(pointsMemo);
  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={2}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <points ref={pointsRef}>
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
          size={1}
          alphaTest={0.2}
          // map={new THREE.TextureLoader().load(
          //   "https://assets.codepen.io/127738/dotTexture.png"
          // )}
          // vertexColors={"true"}
        />
      </points>
      <HeartModel ref={ref} scale={1} />
    </>
  );
}

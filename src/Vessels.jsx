import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";

import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import * as THREE from "three";

import HeartModel from "./Heart";

import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";

let pointsCount = 30000;
let positions = Float32Array.from({ length: pointsCount * 3 }, () => 0);

let sampler = null;
let previousPosition = new THREE.Vector3(0, 0, 0);
let tempPosition = new THREE.Vector3();
let index = 0;
export default function Vessels() {
  const heartModelRef = useRef();
  const lineRef = useRef();

  useEffect(() => {
    console.log(" useeffect?");
    sampler = new MeshSurfaceSampler(heartModelRef.current).build();
    // sampler.sample(previousPosition);
  }, []);

  const uniforms = useMemo(
    () => ({
      progress: { value: 0 },
      shakingStrength: { value: 0.1 },
      timeWindow: { value: 0.01 },
      speed: { value: 0.003 },
    }),
    []
  );
  //TODO 1. sample one point per frame
  useFrame(() => {
    if (index < pointsCount) {
      index++;

      let closetPointFound = false;
      while (!closetPointFound) {
        //TODO 5. sample one more point
        sampler.sample(tempPosition);
        //TODO 2. check the point's distance to the very first Point, previousPosition,
        //TODO if it's close to the 1st point, push it to the array
        //TODO if not, keep sampling. In the while loop
        if (tempPosition.distanceTo(previousPosition) < .81) {
          lineRef.current.geometry.attributes.position.array[index * 3] =
            tempPosition.x;
          lineRef.current.geometry.attributes.position.array[index * 3 + 1] =
            tempPosition.y;
          lineRef.current.geometry.attributes.position.array[index * 3 + 2] =
            tempPosition.z;

          //TODO 3. make the current tempPosition = the previousPoint. In the 2nd frame, the previousPoint means position from 1st frame
          previousPosition = tempPosition.clone();
          //TODO 4. exit the loop
          closetPointFound = true;
        }
      }
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  return (
    <>
      <line ref={lineRef} position={[1, -8, -1]}>
        <bufferGeometry>
          <bufferAttribute
            attach={"attributes-position"}
            count={pointsCount}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>

        <lineDashedMaterial
          color={"pink"}
          linewidth={5}
          dashSize={1}
          gapSize={50}
          scale={100}
          blending={THREE.AdditiveBlending}
        />
        {/* <shaderMaterial
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          opacity={0.8}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        /> */}
      </line>
      <HeartModel ref={heartModelRef} scale={1} />
    </>
  );
}

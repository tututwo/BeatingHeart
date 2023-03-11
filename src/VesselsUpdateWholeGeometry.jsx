import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import * as THREE from "three";

import HeartModel from "./Heart";

let pointsCount = 10000;
let positions = Float32Array.from({ length: pointsCount * 3 }, () => 0);

let sampler = null;

let previousPosition = new THREE.Vector3(0, 0, 0);
let vertices = [];
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
        if (tempPosition.distanceTo(previousPosition) < 2) {
          vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
          lineRef.current.geometry.attributes.position =
            new THREE.Float32BufferAttribute(vertices, 3);
          // console.log( lineRef.current.geometry)
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
      <line ref={lineRef} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach={"attributes-position"}
            count={pointsCount}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color={"pink"}
          linecap={"round"}
          linejoin={"round"}
          blending={THREE.AdditiveBlending}
        />
        
      </line>
      <HeartModel ref={heartModelRef} scale={1} />
    </>
  );
}

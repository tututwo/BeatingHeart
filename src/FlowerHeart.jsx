import HeartModel from "./Heart.jsx";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import * as three from "three";

import { useControls } from "leva";

import { randInt, getRandomColor } from "./utility.js";
import Flower from "./Flower/Flower.jsx";

let sampler = null;
let previousPosition = new three.Vector3(0, 0, 0);
let tempPosition = new three.Vector3();
let index = 0;
let pointsCount = 30000;

let vertices = Float32Array.from({ length: pointsCount * 3 }, () => 0);
let flowerPositions = [];
const createFlower = (position) => {
  const color = getRandomColor();
  return { position, color };
};
export default function FlowerHeart() {
  const heartModelGeometry = useRef();
  const lineRef = useRef();
  const [realFlowerPositions, setRealFlowerPositions] = useState([]);

  const { xPosition } = useControls({
    xPosition: {
      value: -2,
      min: -4,
      max: 4,
      step: 0.1,
    },
  });
  const [flowerCount, setFlowerCount] = useState(5);
  useEffect(() => {
    sampler = new MeshSurfaceSampler(heartModelGeometry.current).build();
    // console.log(heartModelGeometry);
  }, []);

  useFrame(() => {
    if (index < pointsCount) {
      index++;

      let closetPointFound = false;
      while (!closetPointFound) {
        //TODO 1. sample one point per frame
        sampler.sample(tempPosition);
        //TODO 2. check the point's distance to the very first Point, previousPosition,
        //TODO if it's close to the 1st point, push it to the array
        //TODO if not, keep sampling. In the while loop
        if (tempPosition.distanceTo(previousPosition) < 2) {
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

          /////////////////////////////////////////////////////////////////////////
          ////////////////////////////////! Flower time////////////////////////////////
          /////////////////////////////////////////////////////////////////////////
          if (index % 123 === 0) {
            // if (flowerPositions?.[randInt(pointsCount)]) {
            // create a flower
            const flower = createFlower(tempPosition.clone());
            setRealFlowerPositions((prevFlowerPositions) => [
              ...prevFlowerPositions,
              flower,
            ]);
          }
        }
      }
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  // console.log(realFlowerPositions);
  return (
    <>
      <line ref={lineRef} position-x={xPosition}>
        <bufferGeometry>
          {/* geometry.attributes.position */}
          <bufferAttribute
            attach={"attributes-position"}
            count={pointsCount}
            itemSize={3}
            array={vertices}
          />
        </bufferGeometry>
        <lineBasicMaterial color={"#E1E1E4"} />
      </line>

      <HeartModel visible={false} ref={heartModelGeometry} />

      {/*! Flowers */}

      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline
            blur
            visibleEdgeColor="white"
            edgeStrength={100}
            width={1000}
          />
        </EffectComposer>
        <group>
          {realFlowerPositions.map((flower, index) => (
            <Flower
              key={index}
              petalCount={10}
              starting={0}
              positions={flower.position}
              randomColor={flower.color}
              
            />
          ))}
        </group>
      </Selection>
    </>
  );
}

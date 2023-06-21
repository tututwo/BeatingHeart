import * as THREE from "three";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, memo, useState } from "react";
import { Petal } from "./PetalWithHook"; // assuming you have TubeGeometry component in this path

import { Outline,Select } from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";

const g = 1.61803398875; // golden ratio

const Flower = memo(function Flower({
  petalCount,
  starting,
  positions = { x: 0, y: 0, z: 0 },
  randomColor,
}) {
  const groupRef = useRef();
  const tl = useRef();
  //! whenever the model is
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      tl.current = gsap
        .timeline()
        .from(groupRef.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
        })
        .from(
          groupRef.current.rotation,
          {
            x: Math.PI * 2,
            y: Math.PI * 2,
            z: Math.PI * 2,
            duration: 2,
          },
          "<"
        );
    });

    return () => context.revert();
  }, []);
  useEffect(() => {
    const group = groupRef.current;
    if (group) {
      group.position.set(
        positions.x,
        positions.y,
        positions.z
        // Math.random() * 10,
        // -Math.random() * 10,
        // -Math.random() * 10
      );
    }
    for (let d = 0; d < petalCount; d++) {
      const index = d + starting;
      const a = Math.PI * 2 * index * g;

      const petalMesh = new THREE.Mesh();
      petalMesh.rotation.x = 10;
      petalMesh.rotation.y = a;
      petalMesh.rotation.z = 0;

      group.add(petalMesh);
    }
  }, [petalCount, starting]);
  const [hovered, hover] = useState(null);
  return (
    <>
      <Select enabled={hovered}>
        <group
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          ref={groupRef}
          rotation-x={Math.PI * 2 * (Math.random() - 0.5)}
          rotation-y={Math.PI * 2 * (Math.random() - 0.5)}
          position={[positions.x, positions.y, positions.z]}
          scale={0.5}
        >
          {Array(petalCount)
            .fill()
            .map((_, index) => (
              <Petal
                key={index}
                rotation={[10, Math.PI * 2 * (index + starting) * g, 0]}
                randomColor={randomColor}
              />
            ))}
        </group>
      </Select>
    </>
  );
});

export default Flower;

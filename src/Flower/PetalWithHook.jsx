
import { useTubeGeometry} from "../utility";
import * as THREE from "three";

export const Petal = ({
  tubularSegments = 8, // Set your default value here
  radialSegments = 16, // Set your default value here
  thickness = 1, // Set your default value here
  impulse = 2, // Set your default value here
  randomColor="white",
  ...props
}) => {
  const { vertices, normalAttribute, uvs, indices } = useTubeGeometry(
    tubularSegments,
    radialSegments,
    thickness,
    impulse
  );


  return (
    <mesh {...props}>
      {/* <boxBufferGeometry attach="geometry" args={[1, 1, 1]} /> */}
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={vertices.length / 3}
          array={new Float32Array(vertices)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-normal"
          count={normalAttribute.length / 3}
          array={new Float32Array(normalAttribute)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-uv"
          count={uvs.length / 2}
          array={new Float32Array(uvs)}
          itemSize={2}
        />
        <bufferAttribute
          attach="index"
          array={new Uint16Array(indices)}
          count={indices.length}
        />
      </bufferGeometry>
      {/* <meshBasicMaterial attach="material" color={getRandomColor()} wireframe /> */}
      <meshToonMaterial attach="material" color={randomColor}  side = { THREE.DoubleSide} />
    </mesh>
  );
};

export default Petal;

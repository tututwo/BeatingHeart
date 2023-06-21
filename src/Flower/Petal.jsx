import { useMemo } from "react";
// import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const Petal = ({ tubularSegments, radialSegments, thickness, impulse }) => {
  const { vertices, normalAttribute, uvs, indices } = useMemo(() => {
    const radiusFn = (segment) =>
      thickness *
      Math.exp(-Math.pow(segment - 0.5, 2) / (2.0 * impulse * impulse));

    const points = [
      new THREE.Vector3(0, 0, thickness),
      new THREE.Vector3(0, 0, 0),
    ];
    const curve = new THREE.CatmullRomCurve3(points);

    const frenetFrames = curve.computeFrenetFrames(tubularSegments, true);
    const { normals, binormals } = frenetFrames;

    let vertices = [];
    let normalAttribute = [];
    let uvs = [];
    let indices = [];
    for (let i = 0; i <= tubularSegments; i++) {
      const segmentCoordinate = curve.getPointAt(i / tubularSegments);
      let radius = radiusFn(i / tubularSegments);
      for (let r = 0; r <= radialSegments; r++) {
        const angle = (r / radialSegments) * Math.PI * 2;

        // the normal of each vertex
        let normal = normals[i]
          .clone()
          .multiplyScalar(-Math.cos(angle))
          .add(binormals[i].clone().multiplyScalar(Math.sin(angle)));
        normal.normalize();

        let vertex = segmentCoordinate
          .clone()
          .add(normal.clone().multiplyScalar(radius));

        normalAttribute.push(normal.x, normal.y, normal.z);
        vertices.push(vertex.x, vertex.y, vertex.z);

        uvs.push(i / tubularSegments, r / radialSegments);

        if (i > 0 && r > 0) {
          const a = (radialSegments + 1) * (i - 1) + (r - 1);
          const b = (radialSegments + 1) * i + (r - 1);
          const c = (radialSegments + 1) * i + r;
          const d = (radialSegments + 1) * (i - 1) + r;

          // Create two triangular faces for the current segment by connecting the vertices using their indices
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    }
    return { vertices, normalAttribute, uvs, indices };
  }, [tubularSegments, radialSegments, thickness, impulse]);

  return (
    <mesh>
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
        <bufferAttribute attach="index" array={new Uint16Array(indices)} />
      </bufferGeometry>
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
};

export default Petal;

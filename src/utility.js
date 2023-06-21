import React, { useMemo } from "react";
import * as THREE from "three";

export const useTubeGeometry = (
  tubularSegments,
  radialSegments,
  thickness,
  impulse
) => {
  return useMemo(() => {
    const radiusFn = (segment) => thickness * expImpulse(segment, impulse);

    const points = [
      // the origin and tip of the petal
      new THREE.Vector3(0, 0, 3), // how big/long each petal is gonna be
      new THREE.Vector3(0, 0, 0),
    ];

    //* Create a smooth 3d curve from a series of points
    const curve = new THREE.CatmullRomCurve3(points);

    //* Compute the Frenet frames for a set of points that define a curve
    const frenetFrames = curve.computeFrenetFrames(tubularSegments, true);
    const { normals, binormals } = frenetFrames;

    let vertices = [];
    let normalAttribute = [];
    let uvs = [];
    let indices = [];

    for (let i = 0; i <= tubularSegments; i++) {
      //* Returns a 3D coord for the ith tubular segment on the curve
      const segmentCoordinate = curve.getPointAt(i / tubularSegments); //Returns a vector for a given position on the curve according to the arc length.
      //* pass ith tubular segment to get the radius of that section of the curve
      let radius = radiusFn(i / tubularSegments);
      // details around the petal/ith tubular segment
      for (let r = 0; r <= radialSegments; r++) {
        const angle = (r / radialSegments) * Math.PI * 2;

        // get the normal vector of the ith tubular segment of the curve
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
        // In a 3D model, vertices are the points in space that define the shape of the object, but they don't say anything about how those points are connected. That's where indices come in.

        // Each face of a 3D model is usually defined by a triangle or a polygon, which is just a list of vertices. The indices are these lists. They define which vertices form the corners of each face.

        // For example, if you have four vertices [v0, v1, v2, v3], you could define two faces by the indices [v0, v1, v2] and [v2, v1, v3]. This would form a square with the first face being the triangle formed by v0-v1-v2 and the second face being the triangle formed by v2-v1-v3.

        // When you call geometry.setIndex(indices);, you're telling Three.js how to form the faces of your 3D object using the vertices you've defined.

        // Using indexed geometries has significant performance benefits because it allows you to share vertices between faces. For instance, in a square, two triangles share a side, meaning two vertices can be shared. With an indexed geometry, you can define those vertices once and reuse them, which is more memory-efficient.
        if (i > 0 && r > 0) {
          const a = (radialSegments + 1) * (i - 1) + (r - 1);
          const b = (radialSegments + 1) * i + (r - 1);
          const c = (radialSegments + 1) * i + r;
          const d = (radialSegments + 1) * (i - 1) + r;

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    }
    return { vertices, normalAttribute, uvs, indices };
  }, [tubularSegments, radialSegments, thickness, impulse]);
};
const expImpulse = (x, k) => {
  const h = k * x;
  return h ** (1 - h);
};
const random = (a, b) => {
  if (Array.isArray(a)) return a[(Math.random() * a.length) | 0];
  if (!a && a !== 0) return Math.random();
  if (!b && b !== 0) return Math.random() * a;

  if (a > b) [a, b] = [b, a]; // swap values
  return a + Math.random() * (b - a);
};

export const randInt = (a, b) => ~~random(a, b);

export function getRandomColor() {
  var color = new THREE.Color();
  color.setHSL(Math.random(), Math.random(), Math.random());
  return color;
}

uniform float u_time;
void main() {

  vec4 localPosition = vec4(position, 1.0);
  // vec4 localPosition = vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * localPosition;

}
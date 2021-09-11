const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

const settings = {
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  void main () {
    vec3 colorA = vec3(1.0, 0.6, 0);
    vec3 colorB = vec3(0.6, 1.0, 0);

    vec2 center = vUv - 0.5;
    center.x *= aspect;

    float dist = length(center);

    float alpha = smoothstep(0.256, 0.25, dist);
    vec3 color = mix(colorA, colorB, (vUv.x + vUv.y) * sin(time));
    gl_FragColor = vec4(color, alpha);
  }
`);


const sketch = ({ gl }) => {
  return createShader({
    clearColor: 'white',
    gl,
    frag,
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height
    }
  });
};

canvasSketch(sketch, settings);

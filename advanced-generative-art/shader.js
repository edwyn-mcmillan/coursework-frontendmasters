global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");

const settings = {
  animate: true,
  context: "webgl",
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor("#000", 1);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());
  const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main () {
      vUv = uv; // uv is built in to THREE.js, texture coord
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    varying vec2 vUv;
    uniform vec3 color; //for importing from JS
    uniform float time;
    void main () {
      gl_FragColor = vec4(vec3(vUv.x + sin(time), vUv.y, vUv.x) * color, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color("#00523") }
    },
    vertexShader,
    fragmentShader,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },

    render({ time }) {

      material.uniforms.time.value = time;
      controls.update();
      renderer.render(scene, camera);
    },

    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);

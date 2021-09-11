global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const eases = require("eases");
const BezierEasing = require("bezier-easing");

const settings = {
  dimensions: [512, 512],
  fps: 24,
  duration: 4,
  animate: true,
  context: "webgl",
};

const sketch = ({ context }) => {

  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("hsl(0, 0%, 95%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const palette = random.pick(palettes);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 20; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: random.pick(palette),
      wireframe: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight("hsl(0, 0%, 20%)"))

  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(0, 0, 4);
  scene.add(light)

  const easeFn = BezierEasing(0.82, -0.07, 0.39, 1.1);

  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      camera.aspect = viewportWidth / viewportHeight;
      const zoom = 1.5;
      camera.left = -zoom * camera.aspect;
      camera.right = zoom * camera.aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      // controls.update();
      const t = Math.sin(playhead * Math.PI);
      scene.rotation.z = easeFn(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);

global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");
const { Mesh } = require("three");

const settings = {
  animate: true,
  context: "webgl",
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // Background Color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 500);
  camera.position.set(3.5, 3.5, -6);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const loader = new THREE.TextureLoader();
  const earthTexture = loader.load("./imgs/earth.jpg");
  const moonTexture = loader.load("./imgs/moon.jpg");

  // Setup a material
  const earthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
  });

  // Setup a mesh with geometry + material
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  earthMesh.rotation.z = 0.23;
  scene.add(earthMesh);

  const moonMaterial = new THREE.MeshBasicMaterial({
    map: moonTexture
  })
  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonMesh.position.set(2.5, 1, 0);
  moonMesh.scale.setScalar(0.07)
  scene.add(moonMesh);

  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },

    render({ time }) {
      earthMesh.rotation.y = time * 0.15;
      moonMesh.rotation.y = time * 0.15;
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

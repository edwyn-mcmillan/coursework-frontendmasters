/*

 An example of a Sol LeWitt inspired "Wall Drawing" using a simple generative algorithm.

------ The instructions for this mural ------
- Using a 6x6 grid of evenly spaced points
- Connect two random points on the grid; forming a trapezoid with two parallel sides extending down
- Fill the trapezoid with a colour, then stroke with the background colour
- Find another two random points and repeat; continuing until all grid points are exhausted
- Layer the shapes by the average Y position of their two grid points

*/

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const { lerp } = require("canvas-sketch-util/math");
const palettes = require("nice-color-palettes/1000.json");

const settings = {
  dimensions: [2048, 1024],
};

const sketch = ({ width, height }) => {
  const nColors = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, nColors);
  const background = "white";

  const margin = width * 0.05;

  const createGrid = () => {
    const count = 6;
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);
        const px = lerp(margin, width - margin, u);
        const py = lerp(margin, height - margin, v);
        points.push([px, py]);
      }
    }
    return points;
  };

  let grid = createGrid();
  let shapes = [];

  while (grid.length > 2) {
    const pointsToRemove = random.shuffle(grid).slice(0, 2);
    if (pointsToRemove.length < 2) {
      break;
    }

    const color = random.pick(palette);
    grid = grid.filter((p) => !pointsToRemove.includes(p));
    const [a, b] = pointsToRemove;

    shapes.push({
      color,
      path: [[a[0], height - margin], a, b, [b[0], height - margin]],
      y: (a[1], b[1]) / 2,
    });
  }

  shapes.sort((a, b) => a.y - b.y);

  return ({ context, width, height }) => {
    context.globalAlpha = 1;
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    shapes.forEach(({ lineWidth, path, color }) => {
      context.beginPath();
      path.forEach(([x, y]) => {
        context.lineTo(x, y);
      });
      context.closePath();

      context.lineWidth = 20;
      context.globalAlpha = 0.85;
      context.fillStyle = color;
      context.fill();

      context.lineJoin = context.lineCap = "round";
      context.strokeStyle = background;
      context.globalAlpha = 1;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

const images = [
  { name: 'BG1 Clouds', scale: 1.25, x: -300, y: -300, alpha: 1 },
  { name: 'BG2 Sky', scale: 1.25, x: -300, y: -300, alpha: 0 },
  { name: 'BG1 Moon', scale: 0.75, x: -300, y: -300, alpha: 1 },
  { name: 'BG1 Buildings', scale: 1.15, x: -160, y: -232, alpha: 1 },
  { name: 'BG2 Buildings', scale: 1.15, x: -160, y: -280, alpha: 0 },
  { name: 'Bridge', scale: 1.0, x: 0, y: 0, alpha: 1 },
  { name: 'Bridge2', scale: 1.0, x: 0, y: 0, alpha: 0 },
  { name: 'BridgeRope', scale: 1.0, x: 0, y: -64, center: true, alpha: 1 },
  { name: 'BridgeRope2', scale: 1.0, x: 0, y: -64, center: true, alpha: 0 }
];

let loadedImages = [];

const loadImages = () => {
  return Promise.all(images.map(imgData => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = `images/${imgData.name}.png`;
      img.onload = () => resolve({ ...imgData, img });
    });
  }));
};

const drawScene = async () => {
  loadedImages = await loadImages();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  loadedImages.forEach(({ img, x, y, scale, alpha, center }) => {
    if (alpha <= 0) return;

    const width = img.width * scale;
    const height = img.height * scale;
    const drawX = center ? x + (img.width / 2.25) : x;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, drawX, y, width, height);
    ctx.restore();
  });

  // Auto-download after first render
  setTimeout(() => {
    exportCanvasAsPNG();
  }, 500);
};

const exportCanvasAsPNG = () => {
  const dataURL = canvas.toDataURL("image/png");

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'background_render.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

downloadBtn.addEventListener('click', () => {
  exportCanvasAsPNG();
});

drawScene();

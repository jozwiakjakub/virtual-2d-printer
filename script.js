const cube = document.getElementById('cube');
const nozzle = document.querySelector('.nozzle');

const rows = 12;
const cols = 12;
const pixels = [];

const pixelSize = 5;
const gap = 1;
const totalPixel = pixelSize + gap;

const startPos = { x: -60, y: 40 };
const endPos = { x: -60, y: 40 };
const pushStartPos = { x: -70, y: 110 };
const pushEndPos = { x: -46, y: 115 };

const layerHeights = [62, 68, 74, 80, 86, 92, 98, 104, 110, 116, 122, 128];

const letterMatrix = [
  [0,1,1,1,1,0,0,1,1,1,1,0],
  [1,1,1,1,1,1,0,1,1,1,1,0],
  [1,1,0,0,1,1,0,0,1,1,0,0],
  [1,1,0,0,1,1,0,0,1,1,0,0],
  [1,1,0,0,1,1,0,0,1,1,0,0],
  [1,1,1,1,1,1,0,0,1,1,0,0],
  [1,1,1,1,1,1,0,0,1,1,0,0],
  [1,1,0,0,1,1,0,0,1,1,0,0],
  [1,1,0,0,1,1,0,0,1,1,0,0],
  [1,1,0,0,1,1,0,0,1,1,0,0],
  [1,1,0,0,1,1,0,1,1,1,1,0],
  [1,1,0,0,1,1,0,1,1,1,1,0],
];

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const p = document.createElement('div');
    p.classList.add('pixel');
    cube.appendChild(p);
    pixels.push({ el: p, row: r, col: c, filled: letterMatrix[r][c] });
  }
}

let currentRow = rows - 1;
let currentCol = 0;
let leftToRight = true;

function moveNozzle(pos, delay = 150) {
  return new Promise(resolve => {
    nozzle.style.left = `calc(50% + ${pos.x}px)`;
    nozzle.style.top = `${pos.y}px`;
    setTimeout(resolve, delay);
  });
}

function moveNozzleOverPixel(p) {
  const px = (p.col * totalPixel) - ((cols - 1) * totalPixel) / 2;
  const py = layerHeights[p.row];
  return moveNozzle({ x: px, y: py });
}

function resetCubePosition() {
  cube.style.transition = 'none';
  cube.style.transform = 'translateX(-50%)';
  cube.style.filter = 'none';
}

async function printNextPixel() {
  if (currentRow >= 0) {
    const idx = currentRow * cols + currentCol;
    const p = pixels[idx];
    if (p.filled) {
      await moveNozzleOverPixel(p);
      p.el.style.backgroundColor = '#FF6A00';
    }

    if (leftToRight) currentCol++;
    else currentCol--;

    if (leftToRight && currentCol >= cols) {
      currentCol = cols - 1;
      currentRow--;
      leftToRight = false;
    } else if (!leftToRight && currentCol < 0) {
      currentCol = 0;
      currentRow--;
      leftToRight = true;
    }

    printNextPixel();
  } else {
    await moveNozzle(endPos);
    setTimeout(startPushSequence, 1000);
  }
}

async function startPushSequence() {
  await moveNozzle(pushStartPos, 300);
  await moveNozzle(pushEndPos, 300);

  cube.style.transition = 'transform 0.7s cubic-bezier(0.3, 1.5, 0.5, 1), filter 0.5s';
  cube.style.transform = 'translateX(250%) rotate(25deg) scale(1.1)';
  cube.style.filter = 'blur(2px) brightness(1.5)';

  await new Promise(r => setTimeout(r, 900));

  await moveNozzle(endPos, 300);
  resetCubePosition();
  pixels.forEach(p => p.el.style.backgroundColor = 'transparent');
  currentRow = rows - 1;
  currentCol = 0;
  leftToRight = true;
  moveNozzle(startPos);
  setTimeout(printNextPixel, 1000);
}

moveNozzle(startPos);
setTimeout(printNextPixel, 1000);

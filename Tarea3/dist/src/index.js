import { CanvasLocal } from './canvasLocal.js';
let canvas;
let graphics;
canvas = document.getElementById('circlechart');
graphics = canvas.getContext('2d');
const miCanvas = new CanvasLocal(graphics, canvas);
miCanvas.paint();
// Opcional: también hazlo disponible globalmente
if (typeof window !== 'undefined') {
    window.CanvasLocal = CanvasLocal;
}

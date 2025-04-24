import { CanvasLocal } from './canvasLocal.js';

let canvas: HTMLCanvasElement;
let graphics: CanvasRenderingContext2D;

canvas = <HTMLCanvasElement>document.getElementById('circlechart');
graphics = canvas.getContext('2d');

const miCanvas:CanvasLocal = new CanvasLocal(graphics, canvas);

miCanvas.paint();

// Valores iniciales de porcentajes
let porcentajes = [10, 30, 80, 50];

// Sobrescribimos el método paint para que use los valores del array
miCanvas.paint = function () {
  const colores = ['#00BFFF', '#7CFC00', '#FF1493', '#FF8C00'];
  const anchoBarra = 0.5;
  const baseAltura = 5;
  const espacio = 2;

  this.graphics.clearRect(0, 0, this.maxX, this.maxY);
  this.graphics.font = "bold 12px Arial";
  this.graphics.textAlign = "center";

  this.graphics.strokeStyle = '#888';
  this.drawLine(this.iX(0.5), this.iY(0), this.iX(9), this.iY(0));
  this.drawLine(this.iX(0.5), this.iY(0), this.iX(0.5), this.iY(5));
  for (let y = 0; y <= baseAltura; y++) {
    this.drawLine(this.iX(0.4), this.iY(y), this.iX(9), this.iY(y));
    this.graphics.fillText(`${y * 20}`, this.iX(0.2), this.iY(y) + 4);
  }

  let x = 1.5;
  for (let i = 0; i < porcentajes.length; i++) {
    const porcentaje = porcentajes[i];
    const alturaReal = (porcentaje / 100) * baseAltura;
    const baseY = 0;
    const color = colores[i];

    this.drawRmboide(this.iX(x), this.iY(baseY),
      this.iX(x - anchoBarra), this.iY(baseY + 0.3),
      this.iX(x - anchoBarra), this.iY(baseY + baseAltura + 0.3),
      this.iX(x), this.iY(baseY + baseAltura),
      "#ffffff");

    this.drawRmboide(this.iX(x), this.iY(baseY),
      this.iX(x + anchoBarra), this.iY(baseY + 0.3),
      this.iX(x + anchoBarra), this.iY(baseY + baseAltura + 0.3),
      this.iX(x), this.iY(baseY + baseAltura),
      "#eeeeee");

    this.drawRmboide(this.iX(x - anchoBarra), this.iY(baseY + baseAltura + 0.3),
      this.iX(x), this.iY(baseY + baseAltura),
      this.iX(x + anchoBarra), this.iY(baseY + baseAltura + 0.3),
      this.iX(x), this.iY(baseY + baseAltura + 0.6),
      "#dddddd");

    this.drawRmboide(this.iX(x), this.iY(baseY),
      this.iX(x - anchoBarra), this.iY(baseY + 0.3),
      this.iX(x - anchoBarra), this.iY(baseY + alturaReal + 0.3),
      this.iX(x), this.iY(baseY + alturaReal),
      this.oscurecerColor(color));

    this.drawRmboide(this.iX(x), this.iY(baseY),
      this.iX(x + anchoBarra), this.iY(baseY + 0.3),
      this.iX(x + anchoBarra), this.iY(baseY + alturaReal + 0.3),
      this.iX(x), this.iY(baseY + alturaReal),
      color);

    this.graphics.fillStyle = color;
    this.graphics.fillText(porcentaje + "%", this.iX(x), this.iY(-0.8));
    x += espacio;
  }
};

// Conectar los inputs de porcentaje para redibujar al cambiar
document.querySelectorAll(".porcentaje-input").forEach(input => {
  input.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    const index = parseInt(target.dataset.index!);
    const valor = Math.max(0, Math.min(100, parseInt(target.value)));
    porcentajes[index] = valor;
    miCanvas.paint();
  });
});
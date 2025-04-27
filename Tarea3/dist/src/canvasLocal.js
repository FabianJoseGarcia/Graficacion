export class CanvasLocal {
    constructor(g, canvas) {
        this.datos = [];
        this.tipoContenido = 'text';
        this.graphics = g;
        this.canvas = canvas;
        this.rWidth = 25;
        this.rHeight = 25;
        const tamano = Math.min(canvas.width, canvas.height);
        canvas.width = tamano;
        canvas.height = tamano;
        this.maxX = canvas.width;
        this.maxY = canvas.height;
        const pixelSize = Math.floor(Math.min(this.maxX, this.maxY) / 25);
        this.anchoPixel = pixelSize;
        this.altoPixel = pixelSize;
        this.centerX = 0;
        this.centerY = 0;
    }
    actualizarInfo(newData, tipo = 'text') {
        this.tipoContenido = tipo;
        this.datos = [...newData];
        this.paint();
    }
    iX(x) { return this.centerX + x * this.anchoPixel; }
    iY(y) { return this.centerY + y * this.altoPixel; }
    dibujarPixel(x, y) {
        this.graphics.fillRect(this.iX(x), this.iY(y), this.anchoPixel, this.altoPixel);
    }
    dibujarPatronPosicion(x, y) {
        const dibujarCuadro = (dx, dy, size, color) => {
            this.graphics.fillStyle = color;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    this.dibujarPixel(x + dx + i, y + dy + j);
                }
            }
        };
        // Fondo blanco
        this.graphics.fillStyle = "white";
        for (let i = -1; i < 8; i++) {
            for (let j = -1; j < 8; j++) {
                this.dibujarPixel(x + i, y + j);
            }
        }
        // Patrón de posición
        dibujarCuadro(0, 0, 7, "black");
        dibujarCuadro(1, 1, 5, "white");
        dibujarCuadro(2, 2, 3, "black");
    }
    dibujarPatronAlineamiento(x, y) {
        const dibujarCuadro = (dx, dy, size, color) => {
            this.graphics.fillStyle = color;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    this.dibujarPixel(x + dx + i, y + dy + j);
                }
            }
        };
        dibujarCuadro(-2, -2, 5, "black");
        dibujarCuadro(-1, -1, 3, "white");
        dibujarCuadro(0, 0, 1, "black");
    }
    dibujarLineasSincronizacion() {
        for (let i = 8; i < 25 - 8; i++) {
            this.graphics.fillStyle = (i % 2 === 0) ? "black" : "white";
            this.dibujarPixel(i, 6);
            this.dibujarPixel(6, i);
        }
    }
    generarFlujoBits() {
        const bits = [];
        bits.push('0100'); // Modo byte
        bits.push(this.datos.length.toString(2).padStart(8, '0'));
        for (const c of this.datos) {
            const ascii = c.charCodeAt(0);
            bits.push(ascii.toString(2).padStart(8, '0'));
        }
        return bits.join('').padEnd(152, '0');
    }
    paint() {
        if (this.datos.length === 0) {
            console.log("No hay datos para dibujar el QR.");
            return;
        }
        // Limpiar canvas con fondo blanco
        this.graphics.clearRect(0, 0, this.maxX, this.maxY);
        this.graphics.fillStyle = "white";
        this.graphics.fillRect(0, 0, this.maxX, this.maxY);
        const ocupado = Array.from({ length: 25 }, () => Array(25).fill(false));
        // Dibujar patrones de posición
        const marcarPatronPosicion = (x, y) => {
            for (let i = -1; i < 8; i++) {
                for (let j = -1; j < 8; j++) {
                    const px = x + i;
                    const py = y + j;
                    if (px >= 0 && px < 25 && py >= 0 && py < 25)
                        ocupado[px][py] = true;
                }
            }
            this.dibujarPatronPosicion(x, y);
        };
        marcarPatronPosicion(0, 0);
        marcarPatronPosicion(0, 18);
        marcarPatronPosicion(18, 0);
        // Líneas de sincronización
        this.dibujarLineasSincronizacion();
        for (let i = 8; i < 25 - 8; i++) {
            ocupado[i][6] = true;
            ocupado[6][i] = true;
        }
        // Patrón de alineamiento
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                const ax = 18 + dx;
                const ay = 18 + dy;
                if (ax >= 0 && ax < 25 && ay >= 0 && ay < 25)
                    ocupado[ax][ay] = true;
            }
        }
        this.dibujarPatronAlineamiento(18, 18);
        // Codificar y colocar los datos
        const flujoDeBits = this.generarFlujoBits();
        let subir = true;
        let indiceDeBit = 0;
        for (let col = 24; col >= 0; col -= 2) {
            if (col === 6)
                col--;
            for (let paso = 0; paso < 25; paso++) {
                const fila = subir ? 24 - paso : paso;
                for (let dx = 0; dx <= 1; dx++) {
                    const x = col - dx;
                    const y = fila;
                    if (x >= 0 && y >= 0 && x < 25 && y < 25 && !ocupado[x][y]) {
                        const bit = flujoDeBits[indiceDeBit++];
                        this.graphics.fillStyle = (bit === '1') ? "black" : "white";
                        this.dibujarPixel(x, y);
                        ocupado[x][y] = true;
                    }
                }
            }
            subir = !subir;
        }
        // Máscara de formato (sin afectar la legibilidad)
        this.graphics.fillStyle = "black";
        // Patrón de formato superior izquierdo
        for (let i = 0; i < 8; i++) {
            if (i === 6)
                continue;
            if (i % 2 === 0)
                this.dibujarPixel(i, 8);
            if (i < 7)
                this.dibujarPixel(8, i);
        }
    }
}
// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.CanvasLocal = CanvasLocal;
}

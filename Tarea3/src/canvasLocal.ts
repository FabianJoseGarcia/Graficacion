
export class CanvasLocal {
  protected graphics: CanvasRenderingContext2D;
  protected canvas: HTMLCanvasElement;
  protected rWidth: number;
  protected rHeight: number;
  protected maxX: number;
  protected maxY: number;
  protected anchoPixel: number;
  protected altoPixel: number; 
  protected centerX: number;
  protected centerY: number;
  protected datos: string[] = [];
  protected tipoContenido: 'text' | 'xml' | 'url' = 'text';


  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.graphics = g;
    this.canvas = canvas;

    // Dimensiones lógicas
    this.rWidth = 25;
    this.rHeight = 25;

    // Ajustar el canvas a un tamaño cuadrado
    const tamano = Math.min(canvas.width, canvas.height);
    canvas.width = tamano;
    canvas.height = tamano;

    // Dimensiones físicas
    this.maxX = canvas.width;
    this.maxY = canvas.height;

    // Calcular tamaño de cada módulo (pixel QR)
    const pixelSize = Math.floor(Math.min(this.maxX, this.maxY) / 25);
    this.anchoPixel = pixelSize;
    this.altoPixel = pixelSize;

    // Origen lógico (en este caso, no desplazado)
    this.centerX = 0;
    this.centerY = 0;
  }

 
   // Método para actualizar los datos y tipo de contenido a codificar en el QR
   
  public actualizarInfo(newData: string[], tipo: 'text' | 'xml' | 'url' = 'text'): void {
    this.tipoContenido = tipo;
    this.datos = [...newData];
    this.paint();
  }//FJG

  // Conversión de coordenadas lógicas a físicas en X
  private iX(x: number): number { return this.centerX + x * this.anchoPixel; }

  // Conversión de coordenadas lógicas a físicas en Y
  private iY(y: number): number { return this.centerY + y * this.altoPixel; }

  // Dibuja un módulo (pixel QR) en la posición indicada
  private dibujarPixel(x: number, y: number): void {
    this.graphics.fillRect(this.iX(x), this.iY(y), this.anchoPixel, this.altoPixel);
  }

  
   //Dibuja el patrón de posición QR (esquinas superior izquierda, superior derecha y esquina inferior izquierda)
   
  private dibujarPatronPosicion(x: number, y: number): void {
    const dibujarCuadro = (dx: number, dy: number, size: number, color: string) => {
      this.graphics.fillStyle = color;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          this.dibujarPixel(x + dx + i, y + dy + j);
        }
      }
    };

    // Fondo blanco alrededor
    this.graphics.fillStyle = "white";
    for (let i = -1; i < 8; i++) {
      for (let j = -1; j < 8; j++) {
        this.dibujarPixel(x + i, y + j);
      }
    }

    // Dibujar estructura del patrón
    dibujarCuadro(0, 0, 7, "black");
    dibujarCuadro(1, 1, 5, "white");
    dibujarCuadro(2, 2, 3, "black");
  }

  
  private dibujarPatronAlineamiento(x: number, y: number): void {
    const dibujarCuadro = (dx: number, dy: number, size: number, color: string) => {
      this.graphics.fillStyle = color;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          this.dibujarPixel(x + dx + i, y + dy + j);
        }
      }//FJG

    };

    // Patrón de alineamiento (concentrico)
    dibujarCuadro(-2, -2, 5, "black");
    dibujarCuadro(-1, -1, 3, "white");
    dibujarCuadro(0, 0, 1, "black");
  }

  
   //Dibuja las líneas de sincronización (horizontal y vertical)
   
  private dibujarLineasSincronizacion(): void {
    for (let i = 8; i < 25 - 8; i++) {
      this.graphics.fillStyle = (i % 2 === 0) ? "black" : "white";
      this.dibujarPixel(i, 6);
      this.dibujarPixel(6, i);
    }
  }

    //Genera el flujo de bits a partir de los datos de entrada
   // Retorna un string de bits codificados en modo Byte
   
  private generarFlujoBits(): string {
    const bits: string[] = [];

    // Modo Byte (0100)
    bits.push('0100');

    // Cantidad de caracteres (8 bits)
    bits.push(this.datos.length.toString(2).padStart(8, '0'));

    // Codificar cada carácter en ASCII (8 bits)
    for (const c of this.datos) {
      const ascii = c.charCodeAt(0);
      bits.push(ascii.toString(2).padStart(8, '0'));
    }

    // Rellenar hasta alcanzar longitud estándar
    return bits.join('').padEnd(152, '0');
  }

  // Renderiza todo el código QR en el canvas
   
  public paint(): void {
    if (this.datos.length === 0) {
      console.log("No hay datos para dibujar el QR.");
      return;
    }

    // Limpiar fondo
    this.graphics.clearRect(0, 0, this.maxX, this.maxY);
    this.graphics.fillStyle = "white";                                                                                                                                                    //FJG

    this.graphics.fillRect(0, 0, this.maxX, this.maxY);

    // Matriz de ocupación de módulos
    const ocupado: boolean[][] = Array.from({ length: 25 }, () => Array(25).fill(false));

    // Dibujar patrones de posición y marcar ocupados
    const marcarPatronPosicion = (x: number, y: number) => {
      for (let i = -1; i < 8; i++) {
        for (let j = -1; j < 8; j++) {
          const px = x + i;
          const py = y + j;
          if (px >= 0 && px < 25 && py >= 0 && py < 25) ocupado[px][py] = true;
        }
      }
      this.dibujarPatronPosicion(x, y);
    };

    marcarPatronPosicion(0, 0);
    marcarPatronPosicion(0, 18);
    marcarPatronPosicion(18, 0);

    // Dibujar líneas de sincronización
    this.dibujarLineasSincronizacion();
    for (let i = 8; i < 25 - 8; i++) {
      ocupado[i][6] = true;
      ocupado[6][i] = true;
    }

    // Dibujar patrón de alineamiento y marcar área
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const ax = 18 + dx;
        const ay = 18 + dy;
        if (ax >= 0 && ax < 25 && ay >= 0 && ay < 25) ocupado[ax][ay] = true;
      }
    }
    this.dibujarPatronAlineamiento(18, 18);

    // Codificar datos y colocarlos
    const flujoDeBits = this.generarFlujoBits();
    let subir = true;
    let indiceDeBit = 0;

    for (let col = 24; col >= 0; col -= 2) {
      if (col === 6) col--; // Saltar columna de sincronización

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

    // Dibujar máscara de formato (simplificada)
    this.graphics.fillStyle = "black";
    for (let i = 0; i < 8; i++) {
      if (i === 6) continue;
      if (i % 2 === 0) this.dibujarPixel(i, 8);
      if (i < 7) this.dibujarPixel(8, i);
    }
  }
}

// Exponer clase al ámbito global 
if (typeof window !== 'undefined') {
  (window as any).CanvasLocal = CanvasLocal;
}
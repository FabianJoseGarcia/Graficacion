
export class CanvasLocal {
  //atributos
  protected graphics: CanvasRenderingContext2D;
  protected rWidth:number;
  protected rHeight:number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;
  
      
  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.graphics = g;
    this.rWidth = 6;
    this.rHeight= 4;
    this.maxX = canvas.width - 1
    this.maxY = canvas.height - 1;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    this.centerX = this.maxX/2;
    this.centerY = this.maxY/2;
  }

  iX(x: number):number{return Math.round(this.centerX + x/this.pixelSize);}
  iY(y: number): number{ return Math.round(this.centerY - y / this.pixelSize); }
  
  drawLine(x1: number, y1: number, x2: number, y2:number) {
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.closePath();
    this.graphics.stroke();
  }

  /*fx(x:number):number {
    return Math.sin(x*2.5);
  }*/


  paint() {
    

    //this.drawLine(100.5,100, 500,100.5);
    //this.drawLine(500, 100, 300, 400);
    //this.drawLine(300, 400, 100,100);
   /* this.drawLine(this.iX(-3), this.iY(0), this.iX(3), this.iY(0));
    this.drawLine(this.iX(0), this.iY(2), this.iX(0), this.iY(-2));


    //dibuja la cuadricula
    /*this.graphics.strokeStyle = 'lightgray';
    for (let x = -3; x <= 3; x+=0.25){
      this.drawLine(this.iX(x), this.iY(-2), this.iX(x), this.iY(2));
    }
    for (let y = -2; y <= 2; y+=0.25){
      this.drawLine(this.iX(-3), this.iY(y), this.iX(3), this.iY(y));
    }
    //dibuja las divisiones
    this.graphics.strokeStyle = 'black';
    for (let x = -3; x <= 3; x++){
      this.drawLine(this.iX(x), this.iY(-0.1), this.iX(x), this.iY(0.1));
      this.graphics.strokeText(x+"", this.iX(x-0.1), this.iY(-0.2));
    }
    for (let y = -2; y <= 2; y++){
      this.drawLine(this.iX(-0.1), this.iY(y), this.iX(0.1), this.iY(y));
    }
    this.graphics.strokeText("X", this.iX(2.9), this.iY(0.2));
    this.graphics.strokeText("Y", this.iX(-0.2), this.iY(1.8));
    //dibujar la funcion
    this.graphics.strokeStyle = 'red';
    let paso: number = 0.1;
    for (let x = -3; x <= 3; x+=paso){
      this.drawLine(this.iX(x), this.iY(this.fx(x)), this.iX(x+paso), this.iY(this.fx(x+paso)));
    }
    /*this.graphics.strokeStyle = 'red';
    this.drawLine(this.iX(0), this.iY(0), this.iX(2), this.iY(0));
    this.drawLine(this.iX(2), this.iY(0), this.iX(1), this.iY(1.5));
    this.drawLine(this.iX(1), this.iY(1.5), this.iX(0), this.iY(0));*/


    //this.drawLine(320, 40, 480, 400);
    //this.drawLine(320, 40, 140, 400);
    //this.drawLine(140, 400, 480, 400);
  let lado = 3; // Longitud del lado del cuadrado
  let side = 0.9 * lado; // Ajuste del tamaño
  let sideHalf = 0.4 * side; // Mitad del lado
  

  let xA, yA, xB, yB, xC, yC, xD, yD;
  let xA1, yA1, xB1, yB1, xC1, yC1, xD1, yD1;
  let p, q;
  
  q = 0.04; // Factor de reducción
  p = 1 - q;

  xA = -sideHalf;
  yA = -sideHalf;
  xB = sideHalf;
  yB = -sideHalf;
  xC = sideHalf;
  yC = sideHalf;
  xD = -sideHalf;
  yD = sideHalf;



      for (let i = 0; i < 40; i++) {
        // Dibuja el cuadrado
        this.drawLine(this.iX(xA), this.iY(yA), this.iX(xB), this.iY(yB));
        this.drawLine(this.iX(xB), this.iY(yB), this.iX(xC), this.iY(yC));
        this.drawLine(this.iX(xC), this.iY(yC), this.iX(xD), this.iY(yD));
        this.drawLine(this.iX(xD), this.iY(yD), this.iX(xA), this.iY(yA));

       // calcualar los vertices del cuadrado
        xA1 = p * xA + q * xB;
        yA1 = p * yA + q * yB;
        xB1 = p * xB + q * xC;
        yB1 = p * yB + q * yC;
        xC1 = p * xC + q * xD;
        yC1 = p * yC + q * yD;
        xD1 = p * xD + q * xA;
        yD1 = p * yD + q * yA;

        // vértices para el cuadrado 
        xA = xA1;
        yA = yA1;
        xB = xB1;
        yB = yB1;
        xC = xC1;
        yC = yC1;
        xD = xD1;
        yD = yD1;
      }
    
  }


     /*for (let i = 0; i < 50; i++){
        this.drawLine(xA, yA, xB, yB);
        this.drawLine(xB, yB, xC, yC);
        this.drawLine(xC, yC, xA, yA);
        xA1 = p * xA + q * xB;
        yA1 = p * yA + q * yB;
        xB1 = p * xB + q * xC;
        yB1 = p * yB + q * yC;
        xC1 = p * xC + q * xA;
        yC1 = p * yC + q * yA;
        xA = xA1; xB = xB1; xC = xC1;
        yA = yA1; yB = yB1; yC = yC1;
    } 
    */
  }


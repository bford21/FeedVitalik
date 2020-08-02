export class Unicorn {
    public x = 0;
    public y = -100.0;
    private width = 90;
    private height = 90;

    private unicorn = new Image();
    private unicornSrc = '../../assets/Images/unicorn.png';

    constructor(private context: CanvasRenderingContext2D, canvasWidth, canvasHeight) {
        this.x = Math.floor(Math.random() * canvasWidth);
        this.y = canvasHeight-150;
        this.unicorn.src = this.unicornSrc;
    }

    public draw() {
        this.context.drawImage(this.unicorn, this.x, this.y, this.width, this.height);
    }
}

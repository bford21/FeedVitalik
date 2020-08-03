export class Dollar {
    public x = 0;
    public y = -100.0;
    private width = 24.5;
    private height = 49;
    private speed;

    private dollar = new Image();
    private dollarSrc = '../../assets/Images/dollar.png';

    constructor(private context: CanvasRenderingContext2D, canvasWidth) {
        this.x = Math.floor(Math.random() * canvasWidth);
        this.dollar.src = this.dollarSrc;
        this.setSpeed();
        this.setSize();
    }

    public moveDown() {
        this.y = this.y + this.speed;
        this.draw();
    }

    private draw() {
        this.context.drawImage(this.dollar, this.x, this.y, this.width, this.height);
    }

    private setSpeed(){
        this.speed = this.generateRandom(0.5, 5.0);
    }

    private setSize() {
        const random = this.generateRandom(0.5, 5.0);
        if(random > 4.0) {
            this.width = 49;
            this.height = 98;
        }
    }

    // min included, max excluded
    private generateRandom(min, max) {
        return Math.random() < 0.5 ? (( 1 - Math.random()) * (max - min) + min) : (Math.random() * (max - min) + min);
    }
    
}

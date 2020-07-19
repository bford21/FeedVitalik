export class Eth {
    private x = 0;
    private y = 0;
    // Eventually these will be randomized
    private width = 100;
    private height = 100;
    private eth = new Image();
    private ethSrc = '../../assets/Images/vitalikSmile_Transparent.png';

    constructor(private context: CanvasRenderingContext2D) {}

    moveRight() {
      this.y--;
      this.draw();
    }

    private draw() {
        this.eth.src = this.ethSrc;
        this.eth.onload = (() => {
            if (this.eth.src.length > 0) {
                this.context.drawImage(this.eth, this.x, this.y, this.width, this.height);
            }
        });
    }
}

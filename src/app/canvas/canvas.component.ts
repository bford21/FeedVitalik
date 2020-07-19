import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy, HostListener } from '@angular/core';
import { Eth } from '../models/eth';

const vitalikWidth = 90;
const vitalikHeight = 210;

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  UP_ARROW = 'ArrowUp',
  A = 'a',
  D = 'd'
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  private context: CanvasRenderingContext2D;
  vitalikSmile = new Image();
  vitalikSmileSrc = '../../assets/Images/vitalikSmile_Transparent.png';
  vitalikXCoord;
  vitalikYCoord;
  groundYCoord = 0;
  canvasHeight = 0;
  canvasWidth = 0;
  requestId;
  interval;
  eth: Eth[] = [];
  jumping = false;

  constructor(private ngZone: NgZone) {}

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.key === KEY_CODE.RIGHT_ARROW || event.key === KEY_CODE.D) {
      this.moveRight();
    }

    if (event.key === KEY_CODE.LEFT_ARROW || event.key === KEY_CODE.A) {
      this.moveLeft();
    }

    if (event.key === KEY_CODE.UP_ARROW) {
      // this.jumping = true;
    }

  }

  move() {
    console.log('moved');
  }

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    const el = document.getElementById('canvas');
    this.fixDpi(el);
    this.context.imageSmoothingEnabled = false;
    this.vitalikSmile.src = this.vitalikSmileSrc;

    // Redraw canvas every 10ms
    this.ngZone.runOutsideAngular(() =>
      setInterval(() => {
        this.drawCanvas();
      }, 500)
    );

  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  drawCanvas() {
    this.clearCanvas();

    // if (this.jumping) {
    //   console.log(this.vitalikYCoord);
    //   console.log('Ground: ' + this.groundYCoord);

    //   if (this.vitalikYCoord >= (this.groundYCoord - 50)) {
    //     this.vitalikYCoord -= 5;
    //     this.jumping = false;
    //   }
    // } else if (this.vitalikYCoord < this.groundYCoord) {
    //   this.vitalikYCoord += 5;
    // }

    this.context.drawImage(this.vitalikSmile, this.vitalikXCoord, this.vitalikYCoord, vitalikWidth, vitalikHeight);
    this.requestId = requestAnimationFrame(() => this.drawCanvas);
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  moveRight() {
    if (this.vitalikXCoord < (this.canvasWidth - 50) ) {
      this.vitalikXCoord += 10;
    }
    this.drawCanvas();
  }

  moveLeft() {
    if (this.vitalikXCoord > -50) {
      this.vitalikXCoord -= 10;
    }
    this.drawCanvas();
  }

  fixDpi(el) {
    const dpi = window.devicePixelRatio;
    const style = {
      height() {
        return +getComputedStyle(el).getPropertyValue('height').slice(0, -2);
      },
      width() {
        return +getComputedStyle(el).getPropertyValue('width').slice(0, -2);
      }
    };

    const w = (style.width() * dpi).toString();
    const h = (style.height() * dpi).toString();
    el.setAttribute('width', w);
    el.setAttribute('height', h);

    // Set initial starting position for vitalik
    this.groundYCoord = (style.height() * dpi) - 300;
    this.vitalikYCoord = this.groundYCoord;
    this.vitalikXCoord = (style.width() / 2);
    this.canvasWidth = style.width() * dpi;
    this.canvasHeight = style.height() * dpi;
  }
}

import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

const vitalikWidth = 90;
const vitalikHeight = 210;

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  A = 'a',
  D = 'd'
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  constructor() { }

  context;
  vitalikSmile = new Image();
  vitalikSmileSrc = '../../assets/Images/vitalikSmile_Transparent.png';
  charX = 500;
  charY = 300;
  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {
  //   console.log(event);

  //   if (event.key === KEY_CODE.RIGHT_ARROW || event.key === KEY_CODE.D) {
  //     console.log('right');
  //     this.moveRight();
  //   }

  //   if (event.key === KEY_CODE.LEFT_ARROW || event.key === KEY_CODE.A) {
  //     console.log('left');
  //     this.moveLeft();
  //   }

  //   // window.addEventListener('keypress', this.move(), false);
  // }

  move() {
    console.log('moved');
  }

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    const el = document.getElementById('canvas');
    this.fixDpi(el);
    this.context.imageSmoothingEnabled = false;

    this.vitalikSmile.src = this.vitalikSmileSrc;
    this.vitalikSmile.onload = () => {
      if (this.vitalikSmile.src.length > 0) {
        this.context.drawImage(this.vitalikSmile, this.charX, this.charY, vitalikWidth, vitalikHeight);
      }
    };
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
    this.charX = (style.width() / 2);
    el.setAttribute('width', w);
    el.setAttribute('height', h);
    this.charY = (style.height() * dpi) - 300;
  }

  drawVitalik() {
    this.context.clearImage();
    this.context.drawImage(this.vitalikSmile, this.charX, this.charY, vitalikWidth, vitalikHeight);
  }

  moveRight() {
    this.charX += 10;
    this.drawVitalik();
  }

  moveLeft() {
    this.charX -= 10;
    this.drawVitalik();
  }
}

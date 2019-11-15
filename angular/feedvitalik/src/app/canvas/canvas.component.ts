import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

const vitalikWidth = 90;
const vitalikHeight = 210;

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
  charX = 100;
  charY = 300;

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
    el.setAttribute('width', w);
    el.setAttribute('height', h);
    this.charY = (style.height() * dpi) - 300;
  }
}

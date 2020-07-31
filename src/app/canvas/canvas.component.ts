import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy, HostListener, EventEmitter, Output } from '@angular/core';
import { Eth } from '../models/eth';
import Web3 from 'web3';

const vitalikWidth = 90;
const vitalikHeight = 210;

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  A = 'a',
  D = 'd',
  W = 'w',
  S = 's'
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
  @Output() score: EventEmitter<any> = new EventEmitter<any>();
  @Output() lastEaten: EventEmitter<any> = new EventEmitter<any>();
  @Output() largestEaten: EventEmitter<any> = new EventEmitter<any>();

  web3: any;

  constructor(private ngZone: NgZone) {}

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    // if (event.key === KEY_CODE.RIGHT_ARROW && event.key === KEY_CODE.DOWN_ARROW) {

    // }

    if (event.key === KEY_CODE.RIGHT_ARROW || event.key === KEY_CODE.D) {
      this.moveRight();
    }

    if (event.key === KEY_CODE.LEFT_ARROW || event.key === KEY_CODE.A) {
      this.moveLeft();
    }

    if (event.key === KEY_CODE.UP_ARROW || event.key === KEY_CODE.W) {
      this.moveUp();
    }

    if (event.key === KEY_CODE.DOWN_ARROW || event.key === KEY_CODE.S) {
      this.moveDown();
    }



  }

  ngOnInit() {
    this.score.emit(1000);
    this.lastEaten.emit(2000);
    this.largestEaten.emit(2523);
    this.context = this.canvas.nativeElement.getContext('2d');
    const el = document.getElementById('canvas');
    this.fixDpi(el);
    this.context.imageSmoothingEnabled = false;
    this.vitalikSmile.src = this.vitalikSmileSrc;

    // Redraw canvas every 10ms
    this.ngZone.runOutsideAngular(() =>
      setInterval(() => {
        this.drawCanvas();
      }, 20)
    );

    this.web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/'));

    // subscribe to new block headers
    const subscription = this.web3.eth.subscribe('newBlockHeaders', (error, result) => {
      if (!error) {
          console.log(result);
          this.getBlock(result.number);
          return;
      }
      console.error(error);
      })
    .on('connected', (subscriptionId) => {
      console.log(subscriptionId);
    })
    .on('data', (blockHeader) => {
      console.log('Data: ' + blockHeader);
    })
    .on('error', console.error);

    subscription.unsubscribe((error, success) => {
        if (success) {
            console.log('Successfully unsubscribed!');
        }
    });

  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  getBlock(block: any) {
    console.log(block);
    this.web3.eth.getBlock(block, true).then(result => {
      console.log('Transactions: ', result.transactions);
      this.createEth(result.transactions);
    });
  }

  createEth(transactions) {
    transactions.forEach(transaction => {
      if (transaction.value > 0) {
        const newEth = new Eth(this.context, transaction, this.canvasWidth);
        this.eth.push(newEth);
      }
    });
  }
  drawCanvas() {
    this.clearCanvas();

    this.eth.forEach((eth, index) => {
      // Remove eth that have moved off screen
      if (eth.y > this.canvasHeight) {
        this.eth.splice(index, 1);
      }
      eth.moveDown();
    });
    this.context.drawImage(this.vitalikSmile, this.vitalikXCoord, this.vitalikYCoord, vitalikWidth, vitalikHeight);
    this.requestId = requestAnimationFrame(() => this.drawCanvas);
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  moveRight() {
    if (this.vitalikXCoord < (this.canvasWidth - 50) ) {
      this.vitalikXCoord += 12;
    }
  }

  moveLeft() {
    if (this.vitalikXCoord > -50) {
      this.vitalikXCoord -= 12;
    }
  }

  moveDown() {
    if (this.vitalikYCoord < (this.canvasHeight - vitalikHeight)) {
      this.vitalikYCoord += 10;
    }
  }

  moveUp() {
    if (this.vitalikYCoord > this.groundYCoord) {
      this.vitalikYCoord -= 10;
    }
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

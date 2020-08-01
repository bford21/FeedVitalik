import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy, HostListener, EventEmitter, Output } from '@angular/core';
import { Eth } from '../models/eth';
import Web3 from 'web3';
import { formatDate } from '@angular/common';

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
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @Output() transaction: EventEmitter<any> = new EventEmitter<any>();

  private context: CanvasRenderingContext2D;

  vitalikSmile = new Image();
  vitalikSmileSrc = '../../assets/Images/vitalikSmile_Transparent.png';
  vitalikOpenMouth = new Image();
  vitalikOpenMouthSrc = '../../assets/Images/vitalikOpenMouth_Transparent.png';
  vitalikXCoord;
  vitalikYCoord;

  groundYCoord = 0;
  canvasHeight = 0;
  canvasWidth = 0;
  requestId;
  interval;
  eth: Eth[] = [];
  web3: any;

  // Scoreboard
  score = 0;
  largestEth = 0;
  lastEth = 0
  latestBlock = 0;

  // Local storage
  guid = this.generateGuid()
  date: any;

  constructor(private ngZone: NgZone,) {
    this.date = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  }

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
    this.context = this.canvas.nativeElement.getContext('2d');
    const el = document.getElementById('canvas');
    this.fixDpi(el);
    this.context.imageSmoothingEnabled = false;
    this.vitalikSmile.src = this.vitalikSmileSrc;
    this.vitalikOpenMouth.src = this.vitalikOpenMouthSrc;

    // Redraw canvas every 10ms
    this.ngZone.runOutsideAngular(() =>
      setInterval(() => {
        this.drawCanvas();
      }, 20)
    );
    
    // Store data in localstorage
    this.ngZone.runOutsideAngular(() =>
      setInterval(() => {
        this.storeData()
      }, 1000)
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
    this.latestBlock = block;
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
    this.context.drawImage(this.vitalikSmile, this.vitalikXCoord, this.vitalikYCoord, vitalikWidth, vitalikHeight);

    this.eth.forEach((eth, index) => {
      // Remove eth that have moved off screen
      if (eth.y > this.canvasHeight) {
        this.eth.splice(index, 1);
      }

      // Check if being eaten
      if (this.isEaten(eth)){
        this.processEatenTransaction(eth.transaction)
        this.eth.splice(index, 1);
        this.context.drawImage(this.vitalikOpenMouth, this.vitalikXCoord, this.vitalikYCoord, vitalikWidth, vitalikHeight);
      }
      eth.moveDown();
    });

    if(this.eth.length < 1) {
      this.drawWaitingForBlock();
    }

    this.drawScoreboard()

    this.requestId = requestAnimationFrame(() => this.drawCanvas);
  }

  isEaten(eth){
    if(this.vitalikXCoord+70  > eth.x && this.vitalikXCoord-80 < eth.x && this.vitalikYCoord+70 > eth.y && this.vitalikYCoord-40 < eth.y){
      return true
    } else {
      return false
    }
  }

  drawWaitingForBlock() {
    this.context.font = "15px 'Press Start 2P'";
    this.context.fillStyle = "blue";
    this.context.fillText("Waiting for next block to be mined...", (this.canvasWidth / 2) - 200, (this.canvasHeight / 2) - 100);
  }

  drawScoreboard(){
    this.context.font = "25px 'Press Start 2P'";
    this.context.fillStyle = "red";
    this.context.fillText("Score: " + this.score.toFixed(4) + " eth", 10, 40);

    this.context.font = "15px 'Press Start 2P'";
    this.context.fillStyle = "blue";
    this.context.fillText("Last: " + this.lastEth.toFixed(4) + " eth", 10, 80);
    this.context.fillText("Largest: " + this.largestEth.toFixed(4) + " eth", 10, 105);

    this.context.font = "15px 'Press Start 2P'";
    this.context.fillStyle = "blue";
    this.context.fillText("Last Block: #" + this.latestBlock, 10, this.canvasHeight-10);
  }

  processEatenTransaction(transaction){
    const ethValue = this.convertWeiToEth(transaction.value)
    this.score += ethValue
    this.lastEth = ethValue;
    if(ethValue > this.largestEth) {
      this.largestEth = ethValue;
    }
    this.transaction.emit(transaction);
  }

  storeData(){
    var data = {
      'guid': this.guid,
      'date': this.date,
      'score': this.score,
      'largest': this.largestEth
    };

    localStorage.setItem(this.guid, JSON.stringify(data));
  }

  generateGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  convertWeiToEth(wei){
    return wei / 10**18;
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

import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy, HostListener, EventEmitter, Output, Input } from '@angular/core';
import { Eth } from '../models/eth';
import Web3 from 'web3';
import { formatDate } from '@angular/common';
import { Unicorn } from '../models/unicorn';
import { Dollar } from '../models/dollar';
import { SharedDataService } from '../services/shared.service';

const vitalikWidth = 90;
const vitalikHeight = 210;
const canvasRedrawRate = 15;

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  A = 'a',
  D = 'd',
  W = 'w',
  S = 's',
  ENTER = 'Enter',
  SPACE = ' '
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @Output() transaction: EventEmitter<any> = new EventEmitter<any>();
  @Output() powerUpSound: EventEmitter<any> = new EventEmitter<any>();
  @Output() gameOverSound: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetEatenTxs: EventEmitter<any> = new EventEmitter<any>();

  private context: CanvasRenderingContext2D;

  vitalikSmile = new Image();
  vitalikOpenMouth = new Image();

  vitalikXCoord;
  vitalikYCoord;
  vitalikSpeed;

  groundYCoord = 0;
  canvasHeight = 0;
  canvasWidth = 0;
  requestId;
  interval;
  eth: Eth[] = [];
  dollars: Dollar[] = [];

  web3: any;
  unicorn: Unicorn;
  powerUpTimer;
  powerUpLength = 20000; // 20 Seconds
  powerUpActive = false;
  playPowerUpSound = true;

  // Scoreboard
  score = 0;
  largestEth = 0;
  lastEth = 0;
  latestBlock = 0;

  died = false;

  // Local storage
  guid = this.generateGuid();
  date: any;

  jumping = false;

  // Wallet Variables
  address;
  niftyId;
  niftyWealth;
  niftyHealth;
  niftyPower;
  niftySpeed;
  niftyLuck;
  livesLeft = 0;
  unisocksHolder = false;

  constructor(private ngZone: NgZone,
    private sharedService: SharedDataService
  ) {
    this.date = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.key === KEY_CODE.SPACE) {
      this.jump();
    }

    if (event.key === KEY_CODE.ENTER && this.died) {
      this.restartGame();
    }

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
    this.sharedService.niftyDudeId$.subscribe(id => {
      this.niftyId = id
      if (id == null) {
        this.vitalikSmile.src = '../../assets/Images/vitalikSmile_Transparent.png';
        this.vitalikOpenMouth.src = '../../assets/Images/vitalikOpenMouth_Transparent.png';;
      } else {
        this.vitalikSmile.src = 'https://niftydudes.com/img/dudes/' + id + '.png';
        this.vitalikOpenMouth.src = 'https://niftydudes.com/img/dudes/' + id + '.png';
      }
    });

    this.sharedService.vitalikId$.subscribe(id => {
      this.niftyId = id
      if (id == null) {
        this.vitalikSmile.src = '../../assets/Images/vitalikSmile_Transparent.png';
        this.vitalikOpenMouth.src = '../../assets/Images/vitalikOpenMouth_Transparent.png';;
      } else {
        this.vitalikSmile.src = '../../assets/Images/vitalik collection/' + id + '.png';
        this.vitalikOpenMouth.src = '../../assets/Images/vitalik collection/' + id + '.png';
      }
    });

    this.sharedService.unisocksHolder$.subscribe(holder => {
      if (holder) {
        this.unisocksHolder = holder;
      }
    });

    this.sharedService.address$.subscribe(address => {
      this.address = address;
    });

    this.sharedService.health$.subscribe(health => {
      this.niftyHealth = health;
      this.setLives();
    });
    this.sharedService.wealth$.subscribe(wealth => {
      this.niftyWealth = wealth;
    });
    this.sharedService.power$.subscribe(power => {
      this.niftyPower = power;
    });
    this.sharedService.speed$.subscribe(speed => {
      this.niftySpeed = speed;
    });
    this.sharedService.luck$.subscribe(luck => {
      this.niftyLuck = luck;
    })


    this.context = this.canvas.nativeElement.getContext('2d');
    const el = document.getElementById('canvas');
    this.fixDpi(el);
    this.setVitalikSpeed();
    this.context.imageSmoothingEnabled = false;
    
    this.vitalikSmile.src = '../../assets/Images/vitalikSmile_Transparent.png';
    this.vitalikOpenMouth.src = '../../assets/Images/vitalikOpenMouth_Transparent.png';
    this.powerUpTimer = this.powerUpLength;

    // Redraw canvas every 10ms
    this.ngZone.runOutsideAngular(() =>
      setInterval(() => {
        if (!this.died) {
          this.drawCanvas();
        } else {
          this.drawGameOver();
        }
      }, canvasRedrawRate)
    );

    // Store data in localstorage
    this.ngZone.runOutsideAngular(() =>
      setInterval(() => {
        this.storeData();
      }, 1000)
    );
    
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/53c3f91878ef4f2eb75f11b11e9b0c76'));
    

    // subscribe to new block headers
    const subscription = this.web3.eth.subscribe('newBlockHeaders', (error, result) => {
      if (!error) {
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
      this.createEth(result.transactions);
    });
  }

  setLives() {
    // Sets the number of lives the user has
    // Nifty dudes with greater than 50 health and less than 80 have 2 lives
    // Nifty dudes with greater than or equal to 80 health have 3
    if(this.niftyHealth >= 50 && this.niftyHealth < 80) {
      this.livesLeft = 1;
    } else if (this.niftyHealth >= 80) {
      this.livesLeft = 2;
    }
  }

  createEth(transactions) {
    transactions.forEach((transaction, index) => {
      if (transaction.value > 0) {
        const newEth = new Eth(this.context, transaction, this.canvasWidth, this.unisocksHolder);
        this.eth.push(newEth);

        this.createDollar(index);
      }
    });
  }

  createDollar(index) {
    // One dollar is created every 20 transactions
    // Nifty dudes with wealth less than 50 dollars are created every 30 transactions
    // Nifty dudes with wealth greater than or equal to 50 but less than 80 dollars are created every 10 transactions
    // Nifty dudes with wealth greater than or equal to 80 dollars are created every 5 transactions

    let createDollar = false;
    if (this.niftyId && this.niftyWealth >= 80) {
      if ((index % 5) === 0) {
        createDollar = true
      }
    } else if(this.niftyId && this.niftyWealth >= 50 && this.niftyWealth < 80) {
      if ((index % 10) === 0) {
        createDollar = true
      }
    } else if (this.niftyId && this.niftyWealth < 50) {
      if ((index % 30) === 0) {
        createDollar = true
      }
    } else {
      if ((index % 20) === 0) {
        createDollar = true
      }
    }

    if(createDollar){
      const newDollar = new Dollar(this.context, this.canvasWidth);
      this.dollars.push(newDollar);
    }
  }

  setVitalikSpeed() {
    this.vitalikSpeed = this.canvasWidth * 0.02;
  }

  drawCanvas() {
    this.clearCanvas();

    if (this.jumping === true) {
      let speed = 30;
      let jumpHeight = 1;
      if(this.niftyPower >= 50) {
        jumpHeight = 150;
        speed = 60;
      }

      if (this.vitalikYCoord > (this.groundYCoord - (vitalikHeight + jumpHeight))) {
        this.vitalikYCoord -= speed;
      } else {
        if (this.vitalikYCoord < ((this.canvasHeight - (vitalikHeight + jumpHeight)) - (speed + 1))) {
          this.vitalikYCoord = this.groundYCoord;
          this.jumping = false;
        }
      }
    }

    this.context.drawImage(this.vitalikSmile, this.vitalikXCoord, this.vitalikYCoord, vitalikWidth, vitalikHeight);

    this.eth.forEach((eth, index) => {
      // Remove eth that have moved off screen
      if (eth.y > this.canvasHeight) {
        this.eth.splice(index, 1);
      }

      if (this.isEaten(eth)) {
        this.processEatenTransaction(eth.transaction);
        this.eth.splice(index, 1);
        this.context.drawImage(this.vitalikOpenMouth, this.vitalikXCoord, this.vitalikYCoord, vitalikWidth, vitalikHeight);
      }
      eth.moveDown();
    });

    this.dollars.forEach((dollar, index) => {
      // Remove dollars that have moved off screen
      if (dollar.y > this.canvasHeight) {
        this.dollars.splice(index, 1);
      }

      if (this.isEaten(dollar) && this.livesLeft == 0) {
        this.dollars.splice(index, 1);
        this.context.drawImage(this.vitalikOpenMouth, this.vitalikXCoord, this.vitalikYCoord, vitalikWidth, vitalikHeight);
        this.endGame();
      } else if (this.isEaten(dollar)) {
        this.livesLeft = this.livesLeft - 1;
        this.dollars.splice(index, 1);
      }
      dollar.moveDown();
    });

    if (this.powerUpActive) {
      // Delete old unicorn powerup
      if (this.unicorn !== undefined) {
        this.unicorn = undefined;
      }

      if (this.powerUpTimer > 0) {
        // Subtract the current rate that drawCanvas is being called
        if(this.niftyLuck > 75) {
          this.powerUpTimer -= canvasRedrawRate - 10;
        } else {
          this.powerUpTimer -= canvasRedrawRate;
        }
        this.drawPowerUpMeter();
      } else if (this.powerUpTimer <= 0) {
        // Powerup has ran out of time, reset
        this.powerUpActive = false;
        this.powerUpTimer = this.powerUpLength;
        this.setVitalikSpeed();
        this.playPowerUpSound = true; // Reset to true so sound plays next time around
      }
    }

    if (this.eth.length < 1) {
      this.drawWaitingForBlock();

      // Create new unicorn if one does not exist
      if (this.unicorn === undefined && this.niftyLuck !== null && this.niftyLuck > 20) {
        this.unicorn = new Unicorn(this.context, this.canvasWidth, this.canvasHeight);
      }

      if (this.unicorn !== undefined){
        if (this.checkIfRidingUnicorn(this.unicorn)) {
          // Only play power up sound once
          if (this.playPowerUpSound) {
            this.powerUpSound.emit(true);
            this.playPowerUpSound = false;
          }
          this.powerUpActive = true;
          this.vitalikSpeed += this.canvasWidth * 0.00055;
        } else if (this.powerUpActive === false) {
          this.unicorn.draw();
        }
      }
    }

    this.drawScoreboard();

    this.requestId = requestAnimationFrame(() => this.drawCanvas);
  }

  endGame() {
    this.died = true;
    this.gameOverSound.emit(true);
  }

  drawGameOver() {
    this.clearCanvas();
    this.drawScoreboard();
    this.context.font = "45px 'Press Start 2P'";
    this.context.fillStyle = 'red';
    this.context.fillText('GAME OVER', ((this.canvasWidth / 2) - 170), (this.canvasHeight / 2));

    this.context.font = "2rem 'Press Start 2P'";
    this.context.fillStyle = 'blue';
    this.context.fillText('Press enter to play again', ((this.canvasWidth / 2) - 220), ((this.canvasHeight / 2) + 50));
  }

  restartGame() {
    this.died = false;
    this.score = 0;
    this.largestEth = 0;
    this.lastEth = 0;
    this.powerUpActive = false;
    this.powerUpTimer = 0;
    this.setVitalikSpeed();
    this.eth = [];
    this.dollars = [];
    this.resetEatenTxs.emit(true);
    this.guid = this.generateGuid();
  }

  checkIfRidingUnicorn(unicorn) {
    if (this.vitalikXCoord + 70 > unicorn.x && this.vitalikXCoord - 80 < unicorn.x) {
      return true;
    } else {
      return false;
    }
  }

  isEaten(item) {
    const centerX = item.x + (item.width / 2);
    const centerY = item.y + (item.height / 2);

    if (this.vitalikXCoord + vitalikWidth  > centerX && this.vitalikXCoord < centerX && this.vitalikYCoord + item.height + 20 > centerY && this.vitalikYCoord < centerY) {
      return true;
    } else {
      return false;
    }
  }

  drawPowerUpMeter() {
    this.context.font = "2rem 'Press Start 2P'"
    this.context.fillStyle = 'red';
    this.context.fillText('Speed Boost', (this.canvasWidth / 2) - 140, 25);
    this.context.fillRect((this.canvasWidth / 2) - 150, 35, (this.powerUpTimer / 100), 15);
  }

  drawWaitingForBlock() {
    this.context.font = "2rem 'Press Start 2P'";
    this.context.fillStyle = 'blue';
    this.context.fillText('Waiting for next block to be mined...', (this.canvasWidth / 2) - 280, (this.canvasHeight / 2) - 100);
  }

  drawScoreboard(){
    this.context.font = "2.5rem 'Press Start 2P'";
    this.context.fillStyle = 'red';
    this.context.fillText('Score: ' + this.score.toFixed(4) + ' eth', 10, 40);

    this.context.font = "2rem 'Press Start 2P'";
    this.context.fillStyle = 'blue';
    this.context.fillText('Last: ' + this.lastEth.toFixed(4) + ' eth', 10, 80);
    this.context.fillText('Largest: ' + this.largestEth.toFixed(4) + ' eth', 10, 105);

    this.context.font = "2rem 'Press Start 2P'";
    this.context.fillStyle = 'blue';
    this.context.fillText('Last Block: #' + this.latestBlock, 10, this.canvasHeight - 10);
  }

  processEatenTransaction(transaction) {
    const ethValue = this.convertWeiToEth(transaction.value);
    this.score += ethValue;
    this.lastEth = ethValue;
    if (ethValue > this.largestEth) {
      this.largestEth = ethValue;
    }
    this.transaction.emit(transaction);
  }

  storeData() {
    const data = {
      guid: this.guid,
      date: this.date,
      score: this.score,
      largest: this.largestEth
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

  convertWeiToEth(wei) {
    return wei / 10**18;
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  moveRight() {
    // let speed = 50;
    // if(this.niftySpeed >= 80){
    //   speed = speed + 50
    // }
    if (this.vitalikXCoord < (this.canvasWidth - 50) ) {
      if(this.niftySpeed >= 80) {
        this.vitalikXCoord += this.vitalikSpeed + 50;
      }
      else if(this.niftySpeed < 20 && this.niftySpeed != null) {
        this.vitalikXCoord += this.vitalikSpeed - 5;
      } else {
        this.vitalikXCoord += this.vitalikSpeed;
      }
    }
  }

  moveLeft() {
    if (this.vitalikXCoord > -50) {
      if(this.niftySpeed >= 80) {
        this.vitalikXCoord -= this.vitalikSpeed + 50;;
      } else if(this.niftySpeed < 20 && this.niftySpeed != null){
        this.vitalikXCoord -= (this.vitalikSpeed - 5);
      } else {
        this.vitalikXCoord -= this.vitalikSpeed;
      }
    }
  }

  moveDown() {
    if (this.vitalikYCoord < (this.canvasHeight - vitalikHeight)-26) {
      this.vitalikYCoord += 25;
    }
  }

  moveUp() {
    if (this.vitalikYCoord > this.groundYCoord) {
      this.vitalikYCoord -= 25;
    }
  }

  jump() {
    this.jumping = true;
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

import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'feedvitalik';
  score = 0;
  lastEth = 0;
  largestEth = 0;
  playSound = true;
  eatenTransactions: any = [];

  constructor() {}

    ngOnInit() {
    }

    processEatenTransaction($event){
      const ethValue = this.convertWeiToEth($event.value)
      this.score += ethValue
      this.lastEth = ethValue;
      if(ethValue > this.largestEth) {
        this.largestEth = ethValue;
      }
      this.eatenTransactions.push($event)
    }

    toggleMusic(){
      if(this.playSound){
        this.playSound = false;
        document.getElementById('musicOn').style.visibility='hidden';
        document.getElementById('musicOff').style.visibility='visible';
        console.log("toggled off");
      }else{
        this.playSound = true;
        document.getElementById('musicOn').style.visibility='visible';
        document.getElementById('musicOff').style.visibility='hidden';
        console.log("toggled on");
      }
    }

    convertWeiToEth(wei){
      return wei / 10**18;
    }
}

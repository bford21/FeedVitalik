import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  eatenTransactions: any = [];
  playsound;
  chew = new Audio("../assets/shortChew.wav"); // buffers automatically when created
  powerupMusic = new Audio("../assets/powerup.mp3");
  gameOverMusic = new Audio("../assets/gameOver.mp3");
  constructor() {}

    ngOnInit() {
      this.initSettings();
    }

    processEatenTransaction($event){
      this.eatenTransactions.push($event)
      if(this.playsound === true) {
        this.chew.play()
      }
    }

    initSettings() {
      const settings = JSON.parse(localStorage.getItem('settings'));

      if(settings === null) {
        this.storeDefaultSettings();
      } else {
        this.playsound = settings.sound;
        document.getElementById('bg').style.backgroundImage = "url('../assets/Images/backgrounds/bg" + settings.background + ".png')"
      }
    }

    storeDefaultSettings() {
      var data = {
        'sound': true,
        'background': 1,
      };
  
      localStorage.setItem('settings', JSON.stringify(data));
    }

    changeSoundSetting($event) {
      console.log('Sound preferences changed to ' + $event)
      this.playsound = $event;
    }

    powerUpSound() {
      if(this.playsound) {
        this.powerupMusic.play();
      }
    }

    gameOverSound(){
      if(this.playsound) {
        this.gameOverMusic.play();
      }
    }

    resetEatenTxs() {
      this.eatenTransactions = [];
    }

}

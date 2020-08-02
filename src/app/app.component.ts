import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  eatenTransactions: any = [];
  playsound;
  sound = new Audio("../assets/shortChew.wav"); // buffers automatically when created
  constructor() {}

    ngOnInit() {
      this.initSettings();
    }

    processEatenTransaction($event){
      this.eatenTransactions.push($event)
      if(this.playsound === true) {
        this.sound.play()
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
}

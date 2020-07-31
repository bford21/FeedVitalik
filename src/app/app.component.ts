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

  constructor() {}

    ngOnInit() {
    }

    updateScore($event){
      this.score += $event
      this.lastEth = $event;
      if($event > this.largestEth) {
        this.largestEth = $event;
      }
    }
}

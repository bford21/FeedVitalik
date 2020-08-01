import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() eatenTransactions: [];

  constructor() {}

  convertToEth(wei){
    return wei / 10**18
  }

  ConvertToGwei(wei) {
    return wei / 10**9
  }

  expandModal() {
    document.getElementById('dialog').style.width = "65%";
  }

  resetModalWidth() {
    document.getElementById('dialog').style.width = "600px";
  }

  populateLeaderboard(){
    const allScores = [];
    const top3 = [{
      "score": 0
    }];
    console.log('Populate Leaderboard');

    // Loop through localStorage and get all objects with score property
    // Then store in array called allScores
    for(let i=0; i < localStorage.length; i++){
      const object = JSON.parse(localStorage.getItem(localStorage.key(i)));
      
      if (object.score != undefined){
        allScores.push(object);
      }
    }

    // Sort array by score (Smallest to Largest)
    allScores.sort(this.dynamicSort("score"));
    
    // Loop through sorted array started at highest and printout top 3
    let num = 1;
    for(let i=allScores.length-1; i>allScores.length-6; i--){
      document.getElementById("score"+num).innerHTML = allScores[i].score
      document.getElementById("date"+num).innerHTML = allScores[i].date
      document.getElementById("largest"+num).innerHTML = allScores[i].largest
      num++;
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  clearScores(){
    if(window.confirm("Are you sure you want to clear all scores? This cannot be undone.")){
      console.log("Confirmed - clearing localStorage");
      localStorage.clear();

      for(var i =1; i < 5; i++){
        document.getElementById("score"+i).innerHTML = "";
        document.getElementById("date"+i).innerHTML = ""; 
        document.getElementById("total"+i).innerHTML = "";
        document.getElementById("largest"+i).innerHTML = "";
      }
    }
  }
}

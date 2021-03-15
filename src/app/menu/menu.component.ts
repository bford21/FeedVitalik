import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SharedDataService } from '../services/shared.service';
import { Web3Service } from '../services/web3.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @ViewChild('myModal', {static:true}) myModal:ElementRef;
  @ViewChild('char', {static:true}) char:ElementRef;
  @Input() eatenTransactions: [];
  @Output() changeSound: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeCharacter: EventEmitter<any> = new EventEmitter<any>();
  sound;
  background;
  address
  niftyIds = []
  selectedNiftyDudeId;
  displayAddress;
  unisocksHolder = false;
  niftyWealth;
  niftyHealth;
  niftyPower;

  constructor(private web3: Web3Service,
    private sharedService: SharedDataService
  ) {}

  ngOnInit() {
    this.sharedService.unisocksHolder$.subscribe(socksHolder => {
      this.unisocksHolder = socksHolder;
    });

    this.sharedService.niftyDudeId$.subscribe(id => {
      this.selectedNiftyDudeId = id;
      this.getNiftySkills(this.selectedNiftyDudeId);
    });

    this.sharedService.health$.subscribe(health => {
      this.niftyHealth = health;
    });

    this.sharedService.wealth$.subscribe(wealth => {
      this.niftyWealth = wealth;
    });

    this.sharedService.power$.subscribe(power => {
      this.niftyPower = power;
    });
  }

  preventFocus(event){
    event.preventDefault();
    event.target.blur()
  }

  connectWallet(){
    this.web3.connectAccount().then((acc) => {
      if(acc.length > 0) {
        this.address = acc.toString();
        this.sharedService.address$.next(this.address)
        this.displayAddress = this.address.substring(0,6) + '...' + this.address.substring((this.address.length - 4), this.address.length);
        this.clearTraits(true);
        this.getNiftyDudesBalance();
        this.getUnisocksBalance();
      }
    });
  }

  clearTraits(clearAddressData = false){
    if(clearAddressData) {
      this.sharedService.unisocksHolder$.next(false);
      this.sharedService.address$.next(null);
    }
    this.sharedService.health$.next(null);
    this.sharedService.wealth$.next(null);
    this.sharedService.power$.next(null);
    this.sharedService.speed$.next(null);
    this.sharedService.luck$.next(null);
    this.sharedService.niftyDudeId$.next(null);
  }

  getNiftyDudesBalance() {
    // TODO: Eventually pass in this.address

    // 0x8919014b0f6746407ce40670737bf8aab96f8124
    // '0x4202c5aa18c934b96bc4aedb3da4593c44076618'
    this.web3.getNiftyDudes('0x6ca323ab76aa6d0c7406520f49795470662e9c84').then((ids) => {
      this.niftyIds = ids;
      if(this.niftyIds.length > 0) {
        this.myModal.nativeElement.click();
        this.char.nativeElement.click();
      }
      // If user holds 1 nifty dude automatically set it as character
      // Will only use as a fall back if i can't open modal automaitcally to specific tab
      // if(this.niftyIds.length = 1) {
      //   this.setCharacter(this.niftyIds[0])
      // }
    })
  }

  getUnisocksBalance() {
    // Unisocks test address
    // 0xb3bD6999Bf4B87Cc9E3fEb6eF06A45B356FbfE37
    this.web3.getUnisocksBalance('0xb3bD6999Bf4B87Cc9E3fEb6eF06A45B356FbfE37').then(balance => {
      if(balance > 0){
        this.sharedService.unisocksHolder$.next(true);
      }
    })
  }

  getNiftySkills(id) {
    this.web3.getNiftySkills(id).then(skills => {
      this.sharedService.wealth$.next(skills[3])
      this.sharedService.health$.next(skills[5])
      this.sharedService.power$.next(skills[1])
    });
  }

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
      localStorage.clear();
      this.storeSettings();

      for(var i =1; i <= 5; i++){
        document.getElementById("score"+i).innerHTML = "";
        document.getElementById("date"+i).innerHTML = ""; 
        document.getElementById("largest"+i).innerHTML = "";
      }
    }
  }

  readSettings() {
    const settings = JSON.parse(localStorage.getItem('settings'));
    this.sound = settings.sound;
    this.background = settings.background;
    console.log('Reading setting bg = ' + this.background )
  }

  setSound(value) {
    this.sound = value;
    this.storeSettings();
    this.changeSound.emit(this.sound)
  }

  setBackground(value) {
    this.background = value;
    this.storeSettings();
    document.getElementById('bg').style.backgroundImage = "url('../assets/Images/backgrounds/bg" + this.background + ".png')"
  }

  setCharacter(id) {
    this.clearTraits();
    this.sharedService.niftyDudeId$.next(id)
  }

  storeSettings() {
    var data = {
      'sound': this.sound,
      'background': this.background,
    };

    localStorage.setItem('settings', JSON.stringify(data));
  }
}
function AutoUnsubscribe() {
  throw new Error('Function not implemented.');
}


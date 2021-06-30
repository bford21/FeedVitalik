import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SharedDataService } from '../services/shared.service';
import { Web3Service } from '../services/web3.service';
import tokenMap from '../feed_vitalik_token_id_map.json'
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
  punksterIds = []
  displayAddress;
  unisocksHolder = false;
  niftyWealth;
  niftyHealth;
  niftyPower;
  niftySpeed;
  niftyLuck;
  feedVitalikIds = []
  vitalikSkillMap = []

  constructor(private web3: Web3Service,
    private sharedService: SharedDataService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.sharedService.unisocksHolder$.subscribe(socksHolder => {
      this.unisocksHolder = socksHolder;
    });

    this.sharedService.niftyDudeId$.subscribe(id => {
      this.getNiftySkills(id);
    });

    this.sharedService.vitalikId$.subscribe(id => {
      this.getVitalikSkills(id);
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

    this.sharedService.speed$.subscribe(speed => {
      this.niftySpeed = speed;
    });

    this.sharedService.luck$.subscribe(luck => {
      this.niftyLuck = luck;
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
        this.getFeedVitalikBalance();
        this.getPunkstersBalance();
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

  getFeedVitalikBalance(){
    const traitNames = ["Health", "Wealth", "Power", "Speed", "Luck"]
    const url = "https://api.opensea.io/api/v1/assets?owner=" + this.address + "&token_ids=104153413670663298601451918013900788479056968112890839500332734933049192480769&token_ids=104153413670663298601451918013900788479056968112890839500332734931949680852993&token_ids=104153413670663298601451918013900788479056968112890839500332734930850169225217&token_ids=104153413670663298601451918013900788479056968112890839500332734929750657597441&token_ids=104153413670663298601451918013900788479056968112890839500332734928651145969665&token_ids=104153413670663298601451918013900788479056968112890839500332734927551634341889&token_ids=104153413670663298601451918013900788479056968112890839500332734926452122714113&token_ids=104153413670663298601451918013900788479056968112890839500332734925352611086337&token_ids=104153413670663298601451918013900788479056968112890839500332734924253099458561&token_ids=104153413670663298601451918013900788479056968112890839500332734923153587830785&token_ids=104153413670663298601451918013900788479056968112890839500332734922054076203009&token_ids=104153413670663298601451918013900788479056968112890839500332734920954564575233&token_ids=104153413670663298601451918013900788479056968112890839500332734919855052947457&token_ids=104153413670663298601451918013900788479056968112890839500332734918755541319681&token_ids=104153413670663298601451918013900788479056968112890839500332734917656029691905&token_ids=104153413670663298601451918013900788479056968112890839500332734916556518064129&token_ids=104153413670663298601451918013900788479056968112890839500332734915457006436353&token_ids=104153413670663298601451918013900788479056968112890839500332734914357494808577&token_ids=104153413670663298601451918013900788479056968112890839500332734913257983180801&token_ids=104153413670663298601451918013900788479056968112890839500332734912158471553025&token_ids=104153413670663298601451918013900788479056968112890839500332734911058959925249&limit=25"
    this.http.get<any>(url).subscribe(data => {

      data.assets.forEach(asset => {
        let vitalikId = null

        // Map opensea token_ids to feed vitalik numbers
        for (var key in tokenMap) {
          if (asset.token_id == key){
            this.feedVitalikIds.push(tokenMap[key])
            vitalikId = tokenMap[key]
          }
        }

        // Get vitalik traits
        let traits = []
        asset.traits.forEach(trait => {
          if(traitNames.includes(trait.trait_type)){
            traits.push(trait.value)
          }
        });
        this.vitalikSkillMap.push({
          vitalikId: vitalikId,
          traits: traits
        })
      });
      console.log(this.feedVitalikIds)
      console.log(this.vitalikSkillMap)
    })
  }

  getNiftyDudesBalance() {
    this.web3.getNiftyDudes(this.address).then((ids) => {
      this.niftyIds = ids;
      if(this.niftyIds.length > 0) {
        this.myModal.nativeElement.click();
        this.char.nativeElement.click();
      }
    })
  }

  getPunkstersBalance() {
    // TODO: Change to this.address
    this.web3.getPunksters('0x6186290b28d511bff971631c916244a9fc539cfe').then((ids) => {
      this.punksterIds = ids;
      // if(this.niftyIds.length > 0) {
      //   this.myModal.nativeElement.click();
      //   this.char.nativeElement.click();
      // }
    })
  }

  getUnisocksBalance() {
    // Unisocks test address
    // 0xb3bD6999Bf4B87Cc9E3fEb6eF06A45B356FbfE37
    this.web3.getUnisocksBalance(this.address).then(balance => {
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

  getVitalikSkills(id) {
    // Search through vitalikSkillMap array of object matching on id and assigning traits
    var char = this.vitalikSkillMap.filter(obj => {
      return obj.vitalikId === id
    });
    char.forEach(item => {
      console.log(item['traits'])
      this.sharedService.health$.next(item['traits'][0])
      this.sharedService.wealth$.next(item['traits'][1])
      this.sharedService.power$.next(item['traits'][2])
      this.sharedService.speed$.next(item['traits'][3])
      this.sharedService.luck$.next(item['traits'][4])
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

  setCharacter(id, vitalik=true, punkster=false) {
    this.clearTraits();
    if (id === null) {
      this.sharedService.vitalikId$.next(id);
      this.sharedService.niftyDudeId$.next(id);
      this.sharedService.punksterId$.next(id);
    } else if (vitalik){
      this.sharedService.vitalikId$.next(id)
    } else if(punkster) {
      this.sharedService.punksterId$.next(id);
    } else {
      this.sharedService.niftyDudeId$.next(id)
    }
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


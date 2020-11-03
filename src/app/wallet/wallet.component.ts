import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3.service';
const Web3 = require("web3");

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  transferFrom: any;
  balance: any;
  loggedIn = false;
  account = 'test';

  constructor(private web3Service: Web3Service) { }
  ngOnInit() {
  }

  connectWallet() {
    console.log('Clicked connect wallet')
    // this.web3Service.getAccountInfo()
    this.web3Service.enableMetaMaskAccount().then(function(acctInfo: any){
      this.loggedIn = true
    }).catch(function(error){
      console.log(error);
    });

    this.web3Service.getAccountInfo().then(function(acctInfo: any){
      console.log(acctInfo)
      this.account = acctInfo.fromAccount;
      console.log(acctInfo.fromAccount)
      console.log(acctInfo.balance)
      // this.transferFrom = acctInfo.fromAccount;
      // this.balance = acctInfo.balance;
      // console.log(this.balance)
    }).catch(function(error){
      console.log(error);
    });
    // const ethEnabled = () => {  
    //   if (window.ethereum) {    
    //     window.web3 = new Web3(window.ethereum);    
    //     window.ethereum.enable();    
    //     return true;  
    //   }  
    //   return false;
    // }
  }

  showAccount(){
    console.log('Account ' + this.account)
  }

}

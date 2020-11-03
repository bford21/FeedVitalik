import { Injectable } from '@angular/core';
// import * as Web3 from 'web3';
const Web3 = require('web3');
// import * as TruffleContract from 'truffle-contract';
 
declare let require: any;
declare let window: any;
 
// let tokenAbi = require('../../../build/contracts/Payment.json');
 
@Injectable({
  providedIn: 'root'
})
 
export class Web3Service {
  private web3Provider: null;
  private contracts: {};
 
 
  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
 
    window.web3 = new Web3(this.web3Provider);
  }
 
  getAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function(err, account) {
 
        if(err === null) {
          window.web3.eth.getBalance(account, function(err, balance) {
            if(err === null) {
              return resolve({fromAccount: account, balance:balance});
            } else {
              return reject("error!");
            }
          });
        }
      });
    });
  }

  enableMetaMaskAccount(): Promise<any> {
  let enable = false;
  new Promise((resolve, reject) => {
    enable = window.ethereum.enable();
  });
  return Promise.resolve(enable);
}
 
  // transferEther(
  //   _transferFrom,
  //   _transferTo,
  //   _amount,
  //   _remarks
  // ) {
  //   let that = this;
 
  //   return new Promise((resolve, reject) => {
  //     let paymentContract = TruffleContract(tokenAbi);
  //     paymentContract.setProvider(that.web3Provider);
 
  //     paymentContract.deployed().then(function(instance) {
  //         return instance.transferFund(
  //           _transferTo,
  //           {
  //             from:_transferFrom,
  //             value:web3.toWei(_amount, "ether")
  //           });
  //       }).then(function(status) {
  //         if(status) {
  //           return resolve({status:true});
  //         }
  //       }).catch(function(error){
  //         console.log(error);
 
  //         return reject("Error in transferEther service call");
  //       });
  //   });
  // }
}
// import { Injectable } from '@angular/core';
// const Web3 = require('web3');

// @Injectable({
//   providedIn: 'root'
// })
// export class Web3Service {
// private readonly web3: any;
// private enable: any;
// private account: any = null;

// constructor() {}
//   this.web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/'));
//   if (window.ethereum === undefined) {
//     alert('Non-Ethereum browser detected. Install MetaMask');
//   } else {
//     if (typeof window.web3 !== 'undefined') {
//       this.web3 = window.web3.currentProvider;
//     } else {
//       this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
//     }
//     console.log('transfer.service :: constructor :: window.ethereum');
//     window.web3 = new Web3(window.ethereum);
//     console.log('transfer.service :: constructor :: this.web3');
//     console.log(this.web3);
//     this.enable = this.enableMetaMaskAccount();
//   }
// }

// private async enableMetaMaskAccount(): Promise<any> {
//   let enable = false;
//   await new Promise((resolve, reject) => {
//     enable = window.ethereum.enable();
//   });
//   return Promise.resolve(enable);
// }

// private async getAccount(): Promise<any> {
//   console.log('transfer.service :: getAccount :: start');
//   if (this.account == null) {
//     this.account = await new Promise((resolve, reject) => {
//       console.log('transfer.service :: getAccount :: eth');
//       console.log(window.web3.eth);
//       window.web3.eth.getAccounts((err, retAccount) => {
//         console.log('transfer.service :: getAccount: retAccount');
//         console.log(retAccount);
//         if (retAccount.length > 0) {
//           this.account = retAccount[0];
//           resolve(this.account);
//         } else {
//           alert('transfer.service :: getAccount :: no accounts found.');
//           reject('No accounts found.');
//         }
//         if (err != null) {
//           alert('transfer.service :: getAccount :: error retrieving account');
//           reject('Error retrieving account');
//         }
//       });
//     }) as Promise<any>;
//   }
//   return Promise.resolve(this.account);
// }

// public async getUserBalance(): Promise<any> {
//   const account = await this.getAccount();
//   console.log('transfer.service :: getUserBalance :: account');
//   console.log(account);
//   return new Promise((resolve, reject) => {
//     window.web3.eth.getBalance(account, function(err, balance) {
//       console.log('transfer.service :: getUserBalance :: getBalance');
//       console.log(balance);
//       if (!err) {
//         const retVal = {
//           account: account,
//           balance: balance
//         };
//         console.log('transfer.service :: getUserBalance :: getBalance :: retVal');
//         console.log(retVal);
//         resolve(retVal);
//       } else {
//         reject({account: 'error', balance: 0});
//       }
//     });
//   }) as Promise<any>;
// }

// private async getAccount(): Promise<any> {
//   console.log('transfer.service :: getAccount :: start');
//   if (this.account == null) {
//     this.account = await new Promise((resolve, reject) => {
//       console.log('transfer.service :: getAccount :: eth');
//       console.log(window.web3.eth);
//       window.web3.eth.getAccounts((err, retAccount) => {
//         console.log('transfer.service :: getAccount: retAccount');
//         console.log(retAccount);
//         if (retAccount.length > 0) {
//           this.account = retAccount[0];
//           resolve(this.account);
//         } else {
//           alert('transfer.service :: getAccount :: no accounts found.');
//           reject('No accounts found.');
//         }
//         if (err != null) {
//           alert('transfer.service :: getAccount :: error retrieving account');
//           reject('Error retrieving account');
//         }
//       });
//     }) as Promise<any>;
//   }
//   return Promise.resolve(this.account);
// }

// getNewBlockHeaders(): Observable<any> {
//   return this.web3.eth.subscribe('newBlockHeaders', (error, result) => {
//     if (!error) {
//         console.log(result.number);
//     }
//     return 'Error'
//     console.error(error);
//   }).on('connected', (subscriptionId) => {
//     console.log(subscriptionId);
//   }).on('data', (blockHeader) => {
//     console.log('Data: ' + blockHeader);
//   }).on('error', console.error);
// }

//     if (typeof window.ethereum !== 'undefined') {
//       console.log('MetaMask is installed!');
//       window.ethereum.request({ method: 'eth_requestAccounts' });
//     }


// }

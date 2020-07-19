import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Observable, interval } from 'rxjs';
import Web3 from 'web3';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'feedvitalik';
  latestBlock = 0;
  mostRecentTransactions: Array<any>;
  web3: any;

  constructor() {}

    ngOnInit() {
      // Project ID
      this.web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/'));

      const data = interval(5000).subscribe((x => {
        this.web3.eth.getBlockNumber().then(result => {
          if (result > this.latestBlock) {
            this.latestBlock = result;
            this.getBlock(result);
          }
          console.log(this.latestBlock);
        },
        msg => {
          // reject(msg);
        });
      }));

    }

    getBlock(block: any) {
      this.web3.eth.getBlock(block).then(result => {
        this.mostRecentTransactions = result.transactions;
        console.log('Transactions: ', this.mostRecentTransactions);
      });
    }

}

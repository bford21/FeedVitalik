import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Observable, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'feedvitalik';
  latestBlock: string;
  mostRecentTransactions: Array<any>;

  constructor(
    private apiService: ApiService) { }

    ngOnInit() {

      const data = interval(5000).subscribe((x => {
        this.getLatestBlock();
      }));

    }

    getLatestBlock() {
      return this.apiService.getLatestBlock().subscribe(response => {
        if (response.result && response.result !== '') {
          if (this.latestBlock !== response.result) {
            console.log('New block');
            this.latestBlock = response.result;
            this.getTransactions(this.latestBlock);
          }
        }
      });
    }

    getTransactions(block: any) {
      this.apiService.getTransactionsByBlockHex(block).subscribe(response => {
        if (response.result.transactions && response.result.transactions !== []) {
          this.mostRecentTransactions = response.result.transactions;
          console.log(this.mostRecentTransactions);
          console.log(this.mostRecentTransactions.length);
        }
      });
    }

}

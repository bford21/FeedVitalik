import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  dickButtId$ = new BehaviorSubject<string>(null);
  niftyDudeId$ = new BehaviorSubject<string>(null);
  vitalikId$ = new BehaviorSubject<string>(null);
  health$ = new BehaviorSubject<number>(null);
  wealth$ = new BehaviorSubject<number>(null);
  power$ = new BehaviorSubject<number>(null);
  speed$ = new BehaviorSubject<number>(null);
  luck$ = new BehaviorSubject<number>(null);
  unisocksHolder$ = new BehaviorSubject<boolean>(false);
  address$ = new BehaviorSubject<string>(null);
}

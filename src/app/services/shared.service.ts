import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  niftyDudeId$ = new BehaviorSubject<string>(null);
}

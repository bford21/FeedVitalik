import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class ApiService {
  private projectId = '';
  private apiUrl = 'https://mainnet.infura.io/v3/' + this.projectId;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }


  getLatestBlock(): Observable<any> {
    const body = '{"jsonrpc":"2.0","method":"eth_blockNumber","params": [],"id":1}';
    return this.http.post<any>(this.apiUrl, body, this.httpOptions).pipe(
      tap((response: any) => this.log(`Latest Block: ${response.result}`)),
      catchError(this.handleError<any>('getLatestBlock'))
    );
  }

  getTransactionsByBlockHex(block: string): Observable<any> {
    const body = '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params": ["' + block + '",true],"id":1}';
    return this.http.post<any>(this.apiUrl, body, this.httpOptions).pipe(
      tap((response: any) => this.log(`Block Transactions: ${response.result}`)),
      catchError(this.handleError<any>('getTransactionByBlock'))
    );
  }

  // /** DELETE: delete the hero from the server */
  // deleteHero (hero: Hero | number): Observable<Hero> {
  //   const id = typeof hero === 'number' ? hero : hero.id;
  //   const url = `${this.heroesUrl}/${id}`;

  //   return this.http.delete<Hero>(url, this.httpOptions).pipe(
  //     tap(_ => this.log(`deleted hero id=${id}`)),
  //     catchError(this.handleError<Hero>('deleteHero'))
  //   );
  // }

  // /** PUT: update the hero on the server */
  // updateHero (hero: Hero): Observable<any> {
  //   return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
  //     tap(_ => this.log(`updated hero id=${hero.id}`)),
  //     catchError(this.handleError<any>('updateHero'))
  //   );
  // }

  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log('custom error');
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(`ApiService: ${message}`);
  }
}

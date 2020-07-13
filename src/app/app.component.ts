import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin, of, EMPTY, from, concat } from 'rxjs';
import { bufferCount, tap, catchError, concatMap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  urls = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/posts/2',
    'https://jsonplaceholder.typicode.com/posts/3',
    'https://jsonplaceholder.typicode.com/posts/4',
    'https://jsonplaceholder.typicode.com/posts/5',
    'https://jsonplaceholder.typicode.com/posts/6',
    'https://jsonplaceholder.typicode.com/posts/7',
    'https://jsonplaceholder.typicode.com/posts/8',
    'https://jsonplaceholder.typicode.com/posts/9',
    'https://jsonplaceholder.typicode.com/posts/10',
    'https://jsonplaceholder.typicode.com/posts/11',
    'https://jsonplaceholder.typicode.com/posts/12',
    'https://jsonplaceholder.typicode.com/posts/13',
    'https://jsonplaceholder.com/posts/5',
    'https://jsonplaceholder.typicode.com/posts/4',
    'https://jsonplaceholder.com/posts/5',
    'https://jsonplaceholder.typicode.com/posts',
    'https://jsonplaceholder.typicode.com/posts',
    'https://jsonplaceholder.typicode.com/posts',
    'https://jsonplaceholder.typicode.com/posts',
    'https://jsonplaceholder.com/posts/5',
    'https://jsonplaceholder.com/posts/5',
  ];

  constructor(private http: HttpClient) { }

  parallelReq() {
    let success = 0;
    let errors = 0;

    const reqs = this.urls.map(url => 
      this.http.get(url).pipe(
        tap(_ => success++),
        catchError(err => {
          errors++;
          return of(err);
        })
      )
    );
  
    forkJoin(reqs).subscribe(
      null,
      err => console.log(err),
      () => console.log(`Success: ${success}\nErrors: ${errors}`)
    );
  }

  sequentialReq() {
    let success = 0;
    let errors = 0;

    from(this.urls).pipe(                 // <-- replate `this.urls` with your object array
      concatMap(url => {
        return this.http.get(url).pipe(   // <-- replace `url` with your own PUT request
          tap(_ => success++),            // <-- count successful responses here
          catchError(err => {        
            errors++;                     // <-- count errors here
            return of(err);               // <-- remember to return an observable from `catchError`
          })
        )
      })
    ).subscribe(
      null,                               // <-- you could change response callback to your requirement
      err => console.log(err),
      () => console.log(`Success: ${success}\nErrors: ${errors}`)
    );
  }

  bufferedReq() {
    from(this.urls.map(url => this.http.get(url))).pipe(
      bufferCount(3),
      concatMap(buffer => forkJoin(buffer))
    ).subscribe(
      res => console.log(res),
      err => console.log(err),
      () => console.log('complete')
    );
  }
}

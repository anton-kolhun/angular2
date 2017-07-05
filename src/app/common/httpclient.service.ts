import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {API_KEY_VALUE} from './common.constant';

@Injectable()
export class HttpClientService {

  requestHeaders: any;

  constructor(private http: Http) {
    const headers: Headers = new Headers();
    headers.append('API_KEY', API_KEY_VALUE);
    this.requestHeaders = {headers};

  }

  doGet(url: string): Observable<Response> {
    return this.http.get(url, this.requestHeaders);
  }

  doPost(url: string, body: any): Observable<Response> {
    return this.http.post(url, body, this.requestHeaders);
  }

  doPut(url: string, body: any): Observable<Response> {
    return this.http.put(url, body, this.requestHeaders);
  }

  doDelete(url: string): Observable<Response> {
    return this.http.delete(url, this.requestHeaders);
  }

}

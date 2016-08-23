import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, Observer } from 'rxjs/Rx';
import { SalesforceService } from '../services/salesforce.service';
let jsforce = require('jsforce');

@Injectable()
export class SalesforceResolver implements Resolve<any> {
    
    constructor(private salesforceService: SalesforceService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<SalesforceService> {
        let sf = (<any>window)._sf
        return Observable.create((observer: Observer<SalesforceService>) => {
            if (this.salesforceService.conn) {
                observer.next(this.salesforceService);
                observer.complete();
            } else if (sf.api) {
                this.salesforceService.conn = new jsforce.Connection({
                    sessionId: sf.api,
                    serverUrl: `${window.location.protocol}//${window.location.hostname}`
                });
                observer.next(this.salesforceService);
                observer.complete();
            } else if (sf.auth) {
                this.salesforceService.authenticate(sf.auth.login_url, sf.auth.username, sf.auth.password)
                    .then((res) => {
                        observer.next(this.salesforceService);
                        observer.complete();
                    }, (reason) => {
                        observer.error(reason);
                        observer.complete();
                    });
            }
        });
    }
}
import { Component, OnInit,Input, trigger, state, style, transition, animate } from '@angular/core';
import { SalesforceService, LoggerService, SOQL } from '../../services/index';
import { IContact } from '../../shared/sobjects';

interface ContactCard extends IContact {
    state: string
}

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
    animations: [
        trigger('cardState', [
            state('hovering', style({
                transform: 'scale(1.05)'
            })),
            state('normal', style({
               transform: 'scale(1)'
           })),
            transition('normal => hovering', animate('200ms ease-in')),
            transition('hovering => normal', animate('200ms ease-out'))
        ])
    ]
})
export class HomeComponent implements OnInit {
    
    private contacts: ContactCard[] = [];

    constructor(private sfdc: SalesforceService, private log: LoggerService) {}

    ngOnInit() {
        let query = 'SELECT Id, Salutation, FirstName, LastName, Email FROM Contact';
        let s = new SOQL()
                    .select('Id', 'Salutation', 'FirstName', 'LastName', 'PhotoUrl')
                    .from('Contact');
        this.sfdc.execute('executeQuery', { query: s.soql })
            .then((res) => {
                this.contacts = res;
                this.contacts.map((c) => {
                    c.state = 'normal';
                    c.PhotoUrl = this.sfdc.instanceUrl + c.PhotoUrl;
                });
            }, (err) => {
                this.log.error(err);
            });
    }

}
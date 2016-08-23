import { Component, OnInit,Input, trigger, state, style, transition, animate } from '@angular/core';
import { SalesforceService, LoggerService } from '../../services/index';
import { Contact } from '../../shared/sobjects';

interface ContactCard extends Contact {
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
            transition('normal => hovering', animate('300ms ease-in')),
            transition('hovering => normal', animate('300ms ease-out'))
        ])
    ]
})
export class HomeComponent implements OnInit {
    
    private contacts: ContactCard[] = [];

    constructor(private sfdc: SalesforceService, private log: LoggerService) {}

    ngOnInit() {
        let query = 'SELECT Id, Name, PhotoUrl FROM Contact';
        this.sfdc.execute('AngularAppController', 'executeQuery', { query: query })
            .then((res) => {
                this.contacts = res;
                this.contacts.map((c) => { c.state = 'normal'; });
            });
    }

}
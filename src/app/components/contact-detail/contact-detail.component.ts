import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Contact } from '../../shared/sobjects';
import { SalesforceService, LoggerService } from '../../services/index';

@Component({
    moduleId: module.id,
    selector: 'contact-detail',
    templateUrl: 'contact-detail.component.html'
})
export class ContactDetailComponent implements OnInit {

    private contact: Contact = {};

    constructor(private sfdc: SalesforceService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params
            .map(params => params['id'])
            .subscribe((id) => {
                let query = `SELECT Id, Name, Title, MailingAddress FROM Contact WHERE Id = '${id}'`;
                this.sfdc.execute('AngularAppController', 'executeQuery', { query: query })
                    .then((res) => {
                        this.contact = res[0];
                    });
            });
    }
}
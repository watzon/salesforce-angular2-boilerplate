import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx'
import { Router } from '@angular/router';

import { IContact } from '../../shared/sobjects';
import { SalesforceService, LoggerService } from '../../services/index';

@Component({
    moduleId: module.id,
    selector: 'create-contact',
    templateUrl: 'create-contact.component.html'
})
export class CreateContactComponent implements OnInit {

    private contact: IContact = {};
    private saving: boolean = false;
    
    constructor(private sfdc: SalesforceService, private log: LoggerService, private router: Router) {}

    private save() {
        if (!this.saving) {
            this.saving = true;
            let contact: IContact = JSON.parse(JSON.stringify(this.contact));
            contact.Birthdate = this.sfdc.convertDate(contact.Birthdate);
            this.sfdc.execute('upsertContact', { contact: contact })
                .then((res) => {
                    this.saving = false;
                    this.router.navigate(['/contact/view', res[0].Id]);
                }, (reason) => {
                    this.saving = false;
                    this.log.error(reason);
                });
        }
    }
}
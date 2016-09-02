import { Component, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
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
    private salutations: { [s: string]: string };
    private saving: boolean = false;
    private error: string;
    
    constructor(private sfdc: SalesforceService, private log: LoggerService, private router: Router) {}

    private getContactSalutations() {
        let id = this.contact.Id;
        this.sfdc.execute('getContactSalutationsPicklist')
            .then((res) => {
                this.salutations = res[0];
            });
    }

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
                    this.error = reason;
                    this.log.error(reason);
                });
        }
    }

    ngOnInit(): void {
        this.getContactSalutations();
    }
}
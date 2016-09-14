import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx'

import { IContact } from '../../shared/sobjects';
import { SalesforceService, SOQL, LoggerService } from '../../services/index';

import * as _ from 'lodash';

@Component({
    moduleId: module.id,
    selector: 'contact',
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css']
})
export class ContactComponent implements OnInit {

    private contact: IContact;
    private oldContact: IContact;
    private salutations: { [s: string]: string };
    private editLock: boolean = true;
    private editing: boolean = false;
    private saving: boolean = false;

    constructor(private sfdc: SalesforceService, private log: LoggerService, private route: ActivatedRoute) {}

    private startEdit() {
        this.editing = true;
        this.oldContact = JSON.parse(JSON.stringify(this.contact));
    }

    private cancelEdit() {
        if (this.oldContact) {
            this.contact = JSON.parse(JSON.stringify(this.oldContact));
        }
        this.editing = false;
    }

    private getContact() {
        this.route.params
            .map(params => params['id'])
            .subscribe((id) => {
                let s = new SOQL()
                    .select('Id', 'Salutation', 'FirstName', 'LastName', 'Title', 'Birthdate', 'Email')
                    .from('Contact')
                    .where(`Id = '${id}'`);
                this.sfdc.execute('executeQuery', { query: s.soql })
                    .then((res) => {
                        this.contact = res[0];
                        this.contact.PhotoUrl = this.sfdc.instanceUrl + this.contact.PhotoUrl;
                        this.editLock = false;
                        return this.getContactSalutations();
                    });
            });
    }

    private getContactSalutations() {
        let id = this.contact.Id;
        this.sfdc.execute('getContactSalutationsPicklist', {})
            .then((res) => {
                this.salutations = res[0];
            });
    }

    private saveContact() {
        if (!this.saving) {
            this.saving = true;
            let contact: IContact = JSON.parse(JSON.stringify(this.contact));
            contact.Birthdate = this.sfdc.convertDate(contact.Birthdate);
            this.sfdc.execute('upsertContact', { contact: contact })
                .then((res) => {
                    this.saving = false;
                    this.editing = false;
                }, (reason) => {
                    this.saving = false;
                    this.log.error(reason);
                });
        }
    }

    ngOnInit() {
        this.getContact();
    }
}
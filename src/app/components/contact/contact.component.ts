import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx'

import { IContact } from '../../shared/sobjects';
import { SalesforceService, SOQL, LoggerService } from '../../services/index';

import { NewlineToBreakPipe } from '../../pipes/index'
import { ContentEditableModelDirective } from '../../directives/index'

@Component({
    moduleId: module.id,
    selector: 'contact',
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css'],
    pipes: [ NewlineToBreakPipe ],
    directives: [ ContentEditableModelDirective ]
})
export class ContactComponent implements OnInit {

    private contact: IContact;
    private oldContact: IContact;
    private editLock: boolean = true;
    private editing: boolean = false;
    private saving: boolean = false;

    constructor(private sfdc: SalesforceService, private log: LoggerService, private route: ActivatedRoute) {}

    private startEdit() {
        this.editing = true;
        this.oldContact = this.contact;
    }

    private cancelEdit() {
        this.editing = false;
        if (this.oldContact) {
            this.contact = this.oldContact;
        }
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
        this.route.params
            .map(params => params['id'])
            .subscribe((id) => {
                let s = new SOQL()
                    .select('Id', 'Salutation', 'FirstName', 'LastName', 'Title', 'Birthdate', 'PhotoUrl')
                    .from('Contact')
                    .where(`Id = '${id}'`);
                this.sfdc.execute('executeQuery', { query: s.soql })
                    .then((res) => {
                        this.contact = res[0];
                        this.contact.PhotoUrl = this.sfdc.instanceUrl + this.contact.PhotoUrl;
                        this.editLock = false;
                    });
            });
    }
}
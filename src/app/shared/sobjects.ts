// import { Inject, Optional } from '@angular/core';
// import { Observable, Observer, Subscription } from 'rxjs/Rx'
// import { SalesforceService, LoggerService } from '../services/index';

// export class SObject<T> {

//     private log: LoggerService = new LoggerService();
//     public fields: string[] = Object.keys(this.sobject);

//     constructor(public type: string, public sobject: T, private sfdc: SalesforceService) {}

//     public save(): Observable<T[]> {
//         return Observable.create((obs) => {
//             this.sfdc.execute('upsertObject', { obj: [this.sobject] })
//                 .then((res) => {
//                     obs.next(res);
//                     obs.complete();
//                 }, (reason) => {
//                     obs.error(reason);
//                     obs.complete();
//                 });
//         });
//     }
//     public upsert = this.save;
//     public update = this.save;

//     public delete(): Observable<T[]> {
//         return Observable.create((obs) => {
//             this.sfdc.execute('deleteObject', { obj: this.sobject })
//                 .then((res) => {
//                     obs.next(res);
//                     obs.complete();
//                 }, (reason) => {
//                     obs.error(reason);
//                     obs.complete();
//                 });
//         });
//     }

//     public static fromQuery<G>(query: string, sfdc: SalesforceService): Observable<SObject<G>[]> {
//         let rxp = /(?:SELECT[a-zA-Z0-9_\-\,\(\)\s\n\r]+FROM[\s\n\r])([\S\-_]+)(?:[\S\s]+)/igm;
//         let match = rxp.exec(query);

//         if (match.length < 2) {
//             throw "A query must contain an SObject to query";
//         }

//         let sobject = match[1];
//         return Observable.create((obs: Observer<SObject<G>[]>) => {
//             sfdc.execute('executeQuery', { query: query })
//                 .then((res) => {
//                     let arr: SObject<G>[] = [];
//                     for (let item of res) {
//                         arr.push(new SObject(sobject, item, sfdc));
//                     }
//                     obs.next(arr);
//                     obs.complete();
//                 }, (reason) => {
//                     obs.error(reason);
//                     obs.complete();
//                 });
//         });
//     }

// }


export type Id = string;

export interface ISObject {

    Id?: Id;
    CreatedBy?: Id;
    LastModifiedBy?: Id;
    Name?: string;
    fieldsToNull?: string[];

}

export interface IRetrieveResult {
    
}

export interface IContact extends ISObject {

    Account?: Id;
    AssistantName?: string;
    AssistantPhone?: number;
    Birthdate?: number|string;
    CleanStatus?: string;
    Owner?: Id;
    Jigsaw?: string;
    Department?: string;
    Description?: string;
    DoNotCall?: boolean;
    Email?: string;
    HasOptedOutOfEmail?: boolean;
    Fax?: number;
    HasOptedOutOfFax?: boolean;
    HomePhone?: number;
    LastCURequestDate?: number|string;
    LastCUUpdateDate?: number|string;
    LeadSource?: string;
    MailingAddress?: string;
    MobilePhone?: number;
    Name?: string;
    Salutation?: string;
    FirstName?: string;
    LastName?: string;
    OtherAddress?: string;
    OtherPhone?: number;
    Phone?: number;
    PhotoUrl?: string;
    ReportsTo?: Id;
    Title?: string;

}

export interface IUser extends ISObject {

    AboutMe?: string;
    IsActive?: boolean;
    Address?: string;
    ReceivesAdminInfoEmails?: boolean;
    Alias?: string;
    ForecastEnabled?: boolean;
    CallCenter?: any; // CallCenter
    MobilePhone?: number;
    DigestFrequency?: string;
    CompanyName?: string;
    Contact?: IContact;
    JigsawImportLimitOverride?: number;
    DefaultGroupNotificationFrequency?: string;
    DelegatedApprover?: Id; // User | Group
    Department?: string;
    Division?: string;
    Email?: string;
    EmailEncodingKey?: string;
    SenderEmail?: string;
    SenderName?: string;
    Signature?: string;
    EmployeeNumber?: string;
    EndDay?: string;
    Extension?: number;
    Fax?: number;
    LoginLimit?: number;
    Workspace?: any; // Workspace
    ReceivesInfoEmails?: boolean;
    UserSubtype?: string;
    IsSystemControlled?: boolean;
    LanguageLocaleKey?: string;
    LocaleSidKey?: string;
    Manager?: any; // Hierchy
    CommunityNickname?: string;
    Phone?: number;
    Profile?: any; // Profilr
    UserRole?: any; // Role
    FederationIdentifier?: string;
    StartDay?: string;
    StayInTouchNote?: string;
    StayInTouchSignature?: string;
    StayInTouchSubject?: string;
    TimeZoneSidKey?: string;
    Title?: string;
    Username?: string;

}

export interface IAccount extends ISObject {

}
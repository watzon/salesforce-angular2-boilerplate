export interface sObject {

    Id?: Id;
    CreatedBy?: Id;
    LastModifiedBy?: Id;
    Name?: string;

}

export type Id = string;

export interface Contact extends sObject {

    Account?: Id;
    AssistantName?: string;
    AssistantPhone?: number;
    Birthdate?: number;
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
    LastCURequestDate?: string;
    LastCUUpdateDate?: string;
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

export interface User extends sObject {

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
    Contact?: Contact;
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

export interface Account extends sObject {

}
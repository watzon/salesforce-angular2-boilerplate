global class AngularAppController {
  
  @RemoteAction
  WebService static Timesheet__c createTimesheet(Timesheet__c timesheet) {
      System.debug(timesheet);
      upsert timesheet;
      System.debug(timesheet);
      return timesheet;
  }
  
  @RemoteAction
  WebService static List<Timesheet__c> getTimesheetsForUser(Id userId) {
      return [
          SELECT
              Id,
              Name,
              Approved__c,
              User__c,
              Start_Week__c,
              Submitted__c,
              (SELECT Id FROM Comments__r),
              (SELECT Id FROM Worklogs__r)
          FROM Timesheet__c
          WHERE User__c = :userId
      ];
  }
  
  @RemoteAction
  WebService static List<Timesheet__c> getTimesheets() {
      return [
          SELECT
              Id,
              Name,
              Approved__c,
              User__c,
              Start_Week__c,
              Submitted__c,
              (SELECT Id FROM Comments__r)
          FROM Timesheet__c
      ];
  }
  
  @RemoteAction
  WebService static Timesheet__c getTimesheetDetails(Id timesheet) {
      return [
          SELECT
              Id,
              Name,
              Approved__c,
              User__c,
              Submitted__c,
              Start_Week__c,
              (SELECT
                  Id,
                  Body__c,
                  User__r.Name,
                  Time_Created__c
               FROM Comments__r)
          FROM Timesheet__c
          WHERE Id = :timesheet
          LIMIT 1
      ];
  }
  
  @RemoteAction
  WebService static List<Worklog__c> getWorklogsForTimesheet(Id timesheet) {
      List<Worklog__c> worklogs =  [
          SELECT
              Id,
              Name,
              Description__c,
              Needs_Editing__c,
              Start_Time__c,
              End_Time__c,
              Timesheet__c,
              (SELECT
                Id,
                Body__c,
                User__c,
                Time_Created__c
            FROM Comments__r)
          FROM Worklog__c
          WHERE Timesheet__c = :timesheet
      ];
      
      return worklogs;
  }
  
  @RemoteAction
  WebService static List<Worklog__c> getWorklogs() {
      return [
          SELECT
              Id,
              Name,
              Description__c,
              Needs_Editing__c,
              Start_Time__c,
              End_Time__c,
              Timesheet__c
          FROM Worklog__c
      ];
  }
  
  @RemoteAction
  WebService static List<Contact> getUsers() {
      return [
          SELECT
              Id,
              Name,
              Salutation,
              FirstName,
              LastName,
              Title,
              Email
          FROM Contact
      ];
  }
  
  @RemoteAction
  WebService static List<sObject> executeQuery(String query) {
      return Database.query(query);
  }
  
  @RemoteAction
  WebService static Timesheet__c upsertTimesheet(Timesheet__c timesheet) {
      upsert timesheet;
      return timesheet;
  }
  
  @RemoteAction
  WebService static Worklog__c upsertWorklog(Worklog__c worklog) {
      upsert worklog;
      return worklog;
  }
  
  global class WorklogWrapper {
      public Worklog__c worklog { get; set; }
      public List<Comment__c> comments { get; set; }
      
      public WorklogWrapper(Worklog__c worklog, List<Comment__c> comments) {
          this.worklog  = worklog;
          this.comments = comments;
      }

  }

}
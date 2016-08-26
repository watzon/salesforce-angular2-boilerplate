global class AngularAppController {
  
  @RemoteAction
  WebService static Contact upsertContact(Contact contact) {
    upsert contact;
    return contact;
  }
  
  @RemoteAction
  WebService static List<sObject> executeQuery(String query) {
      return Database.query(query);
  }

}
global class AngularAppController {
  
  @RemoteAction
  WebService static Contact upsertContact(Contact contact) {
    upsert contact;
    return contact;
  }

  @RemoteAction
  WebService static String getContactSalutationsPicklist() {
    return AngularAppController.getValueToLabelMapOfPicklistJson(Schema.Contact.Salutation);
  }
  
  @RemoteAction
  WebService static List<sObject> executeQuery(String query) {
      return Database.query(query);
  }

  private static String getValueToLabelMapOfPicklistJson(Schema.SObjectField picklistField) {
		Map<String, String> options = new Map<String, String>();

		// Get the picklist values for the field.
		for (Schema.PicklistEntry entry : picklistField.getDescribe().getPicklistValues()) {
			// Only include ones that are active
			if (entry.isActive() == true) {
			options.put(entry.getLabel(), entry.getValue());
			}
		}

		// Create a list of labels from the key set.
		List<String> labels = new List<String>(options.keySet());

		Map<String, String> reversedOptions = new Map<String, String>();

		// We need to reverse the map since the page would normally get it in the reverse order.
		for (Integer i = labels.size() - 1; i >= 0; i--) {
			reversedOptions.put(options.get(labels[i]), labels[i]);
		}

		return JSON.serialize(reversedOptions);
	}

}
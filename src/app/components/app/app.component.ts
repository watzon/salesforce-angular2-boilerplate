import { Component } from '@angular/core';
import { SalesforceService } from '../../services/salesforce.service';

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(public sfdc: SalesforceService) {
      console.log(this.sfdc);
  }

}

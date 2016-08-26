import { Component } from '@angular/core';
import { SalesforceService, LoggerService } from '../../services/index';

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(public sfdc: SalesforceService, public log: LoggerService) {
      
  }

}

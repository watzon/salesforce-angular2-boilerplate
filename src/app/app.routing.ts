import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/index';
import { ContactComponent, CreateContactComponent } from './components/index';

import { SalesforceResolver } from './resolves/index';

const appRoutes: Routes = [
  {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
  },
  {
      path: 'home',
      component: HomeComponent,
      resolve: {
          sfdc: SalesforceResolver
      }
  },
  {
      path: 'contact/view/:id',
      component: ContactComponent,
      resolve: {
          sfdc: SalesforceResolver
      }
  },
  {
      path: 'contact/new',
      component: CreateContactComponent,
      resolve: {
          sfdc: SalesforceResolver
      }
  }
  // { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });

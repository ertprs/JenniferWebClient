import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard } from '../_guards';

// Pre master module
import { DropdownlistComponent } from '../premaster/dropdownlist/dropdownlist.component';
import { MarketplacelistComponent } from '../premaster/marketplacelist/marketplacelist.component';
import { CompanylistComponent } from '../premaster/companylist/companylist.component';
import { CompanyComponent } from '../premaster/company/company.component';
import { MenulistComponent } from '../premaster/menulist/menulist.component';

const appRoutes: Routes = [ 
      // Pre master module  
      { path: 'Companylist', component: CompanylistComponent, canActivate: [AuthGuard] },
      { path: 'Company/:id', component: CompanyComponent, canActivate: [AuthGuard] },
      { path: 'Menulist', component: MenulistComponent, canActivate: [AuthGuard] },
      { path: 'Dropdownlist', component: DropdownlistComponent, canActivate: [AuthGuard] },
      { path: 'Marketplacelist', component: MarketplacelistComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)

    ],
    exports: [RouterModule]
})
export class PremasterRoutingModule { }
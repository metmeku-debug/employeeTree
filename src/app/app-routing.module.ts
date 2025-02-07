import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
const routes: Routes = [
  { path: 'employees', component: EmployeeListComponent},
  { path: 'employee/new', component: EmployeeDetailComponent },
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

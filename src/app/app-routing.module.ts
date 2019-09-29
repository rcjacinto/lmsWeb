import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { GradesComponent } from './layout/grades/grades.component';
import { StudentsComponent } from './layout/students/students.component';
import { LibraryComponent } from './layout/library/library.component';
import { ActivitiesComponent } from './layout/activities/activities.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { MessagesComponent } from './layout/messages/messages.component';
import { SettingsComponent } from './layout/settings/settings.component';
import { LoginComponent } from './layout/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { CreateActivityComponent } from './layout/create-activity/create-activity.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'grades',
    component: GradesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'library',
    component: LibraryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'activities/:type',
    component: ActivitiesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'create-activities',
    component: CreateActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

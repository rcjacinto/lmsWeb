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
import { ManageClassComponent } from './layout/manage-class/manage-class.component';
import { ManageInstructorsComponent } from './layout/manage-instructors/manage-instructors.component';
import { ManageStudentsComponent } from './layout/manage-students/manage-students.component';
import { ViewInstructorProfileComponent } from './layout/view-instructor-profile/view-instructor-profile.component';
import { ViewStudentProfileComponent } from './layout/view-student-profile/view-student-profile.component';
import { ViewClassComponent } from './layout/view-class/view-class.component';
import { TakeExamComponent } from './layout/take-exam/take-exam.component';
import { StudentActivitiesComponent } from './layout/student-activities/student-activities.component';
import { StudentProfileComponent } from './layout/student-profile/student-profile.component';
import { StudentParentsComponent } from './layout/student-parents/student-parents.component';
import { ViewStudentActivityComponent } from './components/view-student-activity/view-student-activity.component';
import { StudentGradesComponent } from './layout/student-grades/student-grades.component';
import { MyStudentComponent } from './layout/my-student/my-student.component';
import { TeacherEvalComponent } from './components/teacher-eval/teacher-eval.component';
import { StudentEvalComponent } from './components/student-eval/student-eval.component';

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
    component: CreateActivityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-class',
    component: ManageClassComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-instructors',
    component: ManageInstructorsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-students',
    component: ManageStudentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-instructor-profile',
    component: ViewInstructorProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-student-profile',
    component: ViewStudentProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-class',
    component: ViewClassComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'take-exam',
    component: TakeExamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student-activities',
    component: StudentActivitiesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student-profile',
    component: StudentProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student-parents',
    component: StudentParentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-student-activity',
    component: ViewStudentActivityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-student-grade',
    component: StudentGradesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-my-student',
    component: MyStudentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teacher-eval',
    component: TeacherEvalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student-eval',
    component: StudentEvalComponent,
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

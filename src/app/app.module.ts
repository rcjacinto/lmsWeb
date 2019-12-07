import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./layout/dashboard/dashboard.component";
import { SideNavComponent } from "./components/side-nav/side-nav.component";
import { TopNavComponent } from "./components/top-nav/top-nav.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GradesComponent } from "./layout/grades/grades.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StudentsComponent } from "./layout/students/students.component";
import { LibraryComponent } from "./layout/library/library.component";
import { ActivitiesComponent } from "./layout/activities/activities.component";
import { ProfileComponent } from "./layout/profile/profile.component";
import { MessagesComponent } from "./layout/messages/messages.component";
import { SettingsComponent } from "./layout/settings/settings.component";
import { LoginComponent } from "./layout/login/login.component";
import { MetaReducer, StoreModule } from "@ngrx/store";
import { storageSyncReducer, reducers } from "./store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { ToastrModule } from "ngx-toastr";
import { NgxSpinnerModule } from "ngx-spinner";
import { Ng5SliderModule } from "ng5-slider";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

// Firebase Module
import { environment } from "src/environments/environment";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { ChartsModule } from "ng2-charts";

import { AuthGuard } from "./services/auth.guard";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CreateActivityComponent } from "./layout/create-activity/create-activity.component";
import { ViewActivityComponent } from "./components/view-activity/view-activity.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ManageClassComponent } from "./layout/manage-class/manage-class.component";
import { ManageInstructorsComponent } from "./layout/manage-instructors/manage-instructors.component";
import { ManageStudentsComponent } from "./layout/manage-students/manage-students.component";
import { ViewStudentProfileComponent } from "./layout/view-student-profile/view-student-profile.component";
import { ViewInstructorProfileComponent } from "./layout/view-instructor-profile/view-instructor-profile.component";
import { ViewClassComponent } from "./layout/view-class/view-class.component";
import { TakeExamComponent } from "./layout/take-exam/take-exam.component";
import { StudentActivitiesComponent } from "./layout/student-activities/student-activities.component";
import { StudentProfileComponent } from "./layout/student-profile/student-profile.component";
import { StudentParentsComponent } from "./layout/student-parents/student-parents.component";
import { UpdateActivityComponent } from "./components/update-activity/update-activity.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { ViewStudentActivityComponent } from "./components/view-student-activity/view-student-activity.component";
import { UpdatePerformanceComponent } from "./components/update-performance/update-performance.component";
import { StudentGradesComponent } from "./layout/student-grades/student-grades.component";
import { MyStudentComponent } from "./layout/my-student/my-student.component";
import { ManageParentsComponent } from "./components/manage-parents/manage-parents.component";
import { ViewInstructorClassesComponent } from "./layout/view-instructor-classes/view-instructor-classes.component";
import { ViewStudentParentListComponent } from "./layout/view-student-parent-list/view-student-parent-list.component";
import { ProgressBarModule } from "angular-progress-bar";
const metaReducers: Array<MetaReducer<any, any>> = [storageSyncReducer];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SideNavComponent,
    TopNavComponent,
    GradesComponent,
    StudentsComponent,
    LibraryComponent,
    ActivitiesComponent,
    ProfileComponent,
    MessagesComponent,
    SettingsComponent,
    LoginComponent,
    CreateActivityComponent,
    ViewActivityComponent,
    FooterComponent,
    ManageClassComponent,
    ManageInstructorsComponent,
    ManageStudentsComponent,
    ViewStudentProfileComponent,
    ViewInstructorProfileComponent,
    ViewClassComponent,
    TakeExamComponent,
    StudentActivitiesComponent,
    StudentProfileComponent,
    StudentParentsComponent,
    UpdateActivityComponent,
    ViewStudentActivityComponent,
    UpdatePerformanceComponent,
    StudentGradesComponent,
    MyStudentComponent,
    ManageParentsComponent,
    ViewInstructorClassesComponent,
    ViewStudentParentListComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgbModule,
    NgxSpinnerModule,
    Ng5SliderModule,
    NgxSkeletonLoaderModule,
    ChartsModule,
    Ng2SearchPipeModule,
    ProgressBarModule
  ],
  providers: [AuthGuard, AngularFireStorage],
  bootstrap: [AppComponent]
})
export class AppModule {}

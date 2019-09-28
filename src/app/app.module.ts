import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GradesComponent } from './layout/grades/grades.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentsComponent } from './layout/students/students.component';
import { LibraryComponent } from './layout/library/library.component';
import { ActivitiesComponent } from './layout/activities/activities.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { MessagesComponent } from './layout/messages/messages.component';
import { SettingsComponent } from './layout/settings/settings.component';
import { LoginComponent } from './layout/login/login.component';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { storageSyncReducer, reducers } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ToastrModule } from 'ngx-toastr';

// Firebase Module
import { environment } from 'src/environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AuthGuard } from './services/auth.guard';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
    LoginComponent
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
    NgbModule
  ],
  providers: [AuthGuard, AngularFireStorage],
  bootstrap: [AppComponent]
})
export class AppModule {}

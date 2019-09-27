import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GradesComponent } from './layout/grades/grades.component';
import { FormsModule } from '@angular/forms';
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
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
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
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

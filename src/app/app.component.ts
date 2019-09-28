import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from './store';
import { User } from './models/user.model';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
firebase.initializeApp(environment.firebase);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lmsWeb';
  userData$ = this.store.pipe(select(selectUser));
  user: User;
  constructor(private store: Store<RootState>) {
    this.userData$.subscribe(res => {
      console.log(res);
      this.user = res;
    });
  }
}

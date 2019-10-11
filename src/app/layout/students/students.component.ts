import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectUser, selectClass, RootState } from 'src/app/store';
import { Class } from 'src/app/models/class.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classData$ = this.store.pipe(select(selectClass));
  user: any;
  selectedClass: Class;
  loading = false;
  members = [];
  constructor(public store: Store<RootState>, public userService: UserService) {
    this.loading = true;
    this.userData$.subscribe(user => {
      this.user = user;
    });

    this.classData$.subscribe(sc => {
      this.selectedClass = sc;
      if (this.selectedClass.id !== '') {
        this.members = [];
        this.selectedClass.members.forEach(member => {
          this.userService.getUser(member).subscribe(user => {
            this.members.push(user);
            this.loading = false;
          });
        });
      }
    });
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  ngOnInit() {}
}

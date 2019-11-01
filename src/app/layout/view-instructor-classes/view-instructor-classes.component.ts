import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.model';
import { UserService } from 'src/app/services/user.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-view-instructor-classes',
  templateUrl: './view-instructor-classes.component.html',
  styleUrls: ['./view-instructor-classes.component.scss']
})
export class ViewInstructorClassesComponent implements OnInit {
  selectedClass: Class = JSON.parse(localStorage.getItem('lms-selected-class'));
  members = [];
  searchStudent = '';
  constructor(public userService: UserService) {}

  ngOnInit() {
    if (this.selectedClass.members) {
      this.selectedClass.members.forEach(member => {
        this.userService
          .getUser(member)
          .pipe(take(1))
          .subscribe(user => {
            this.members.push(user);
          });
      });
    }
  }
}

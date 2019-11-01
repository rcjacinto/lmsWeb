import { Component, OnInit } from '@angular/core';
import { Class } from 'src/app/models/class.model';
import { User } from 'src/app/models/user.model';
import { Student } from 'src/app/models/student.model';
import { ClassService } from 'src/app/services/class.service';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-instructors',
  templateUrl: './manage-instructors.component.html',
  styleUrls: ['./manage-instructors.component.scss']
})
export class ManageInstructorsComponent implements OnInit {
  classList: Class[] = [];
  instructorList: User[] = [];
  requestList: User[] = [];
  studentList: Student[] = [];
  loading = false;
  instructorFilter = '';
  constructor(
    private userService: UserService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService
  ) {
    this.loading = true;
    this.userService.getApprovedInstructor().subscribe(instructors => {
      this.instructorList = instructors;
      console.log(this.instructorList);
      this.userService.getUnapprovedInstructor().subscribe(requests => {
        this.requestList = requests;
        console.log(this.requestList);
        this.loading = false;
      });
    });
  }

  ngOnInit() {}

  setSelectedInstructor(instructor) {
    localStorage.setItem('lms-instructor', JSON.stringify(instructor));
  }

  approve(instructor) {
    this.spinner.show();
    instructor.date.modified = new Date();
    instructor.status = 1;
    this.userService.updateUser(instructor).then(() => {
      this.toastr.success('Account activated!');
      this.spinner.hide();
    });
  }
}

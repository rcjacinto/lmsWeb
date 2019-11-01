import { Component, OnInit, Input } from '@angular/core';
import { Student } from 'src/app/models/student.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SetUser } from 'src/app/store/user/user.action';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-student-profile',
  templateUrl: './view-student-profile.component.html',
  styleUrls: ['./view-student-profile.component.scss']
})
export class ViewStudentProfileComponent implements OnInit {
  @Input() member: any;
  student: Student;
  onViewStudent = false;
  onViewParents = false;
  constructor(
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.student = JSON.parse(JSON.stringify(this.member));
    console.log(this.student);
  }

  viewStudent() {
    this.student = JSON.parse(JSON.stringify(this.member));
    this.onViewStudent = !this.onViewStudent;
  }

  viewParents() {
    this.onViewParents = !this.onViewParents;
  }

  updateProfile() {
    this.spinner.show();
    this.student.date.modified = new Date();
    this.userService.updateUser(this.student).then(() => {
      this.member = this.student;
      this.toastr.success('Profile updated!');
      this.spinner.hide();
    });
  }
}

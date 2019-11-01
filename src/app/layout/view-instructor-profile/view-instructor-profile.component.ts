import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Student } from 'src/app/models/student.model';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class.model';
import { Instructor } from 'src/app/models/instructor.model';
import { on } from 'cluster';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-instructor-profile',
  templateUrl: './view-instructor-profile.component.html',
  styleUrls: ['./view-instructor-profile.component.scss']
})
export class ViewInstructorProfileComponent implements OnInit {
  instructor = JSON.parse(localStorage.getItem('lms-instructor'));
  profile = JSON.parse(localStorage.getItem('lms-instructor'));
  classList: Class[] = [];
  studentList: Student[] = [];
  loading = true;
  onClassView = false;
  constructor(
    private classService: ClassService,
    private userService: UserService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService
  ) {
    console.log(this.instructor);
    this.classService.getAllclasses(this.instructor.id).subscribe(res => {
      this.classList = res;
      this.loading = false;
      console.log(res);
    });
  }

  ngOnInit() {}

  viewClass(cl: Class) {
    this.onClassView = true;
    localStorage.setItem('lms-selected-class', JSON.stringify(cl));
  }

  updateProfile() {
    this.spinner.show();
    this.profile.date.modified = new Date();
    this.userService.updateUser(this.profile).then(() => {
      this.toastr.success('Profile updated!');
      this.spinner.hide();
    });
  }

  setStatus() {
    this.spinner.show();
    this.instructor.date.modified = new Date();
    this.instructor.status = Number(this.profile.status);
    this.userService.updateUser(this.instructor).then(() => {
      if (this.profile.status == 1) {
        this.toastr.success('Account activated!');
      } else {
        this.toastr.success('Profile deactivated!');
      }

      this.spinner.hide();
    });
  }
}

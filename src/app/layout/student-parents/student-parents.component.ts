import { Component, OnInit, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectUser, RootState } from 'src/app/store';
import { Student } from 'src/app/models/student.model';
import { ParentService } from 'src/app/services/parent.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Parent } from 'src/app/models/parent.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { SetUser } from 'src/app/store/user/user.action';

@Component({
  selector: 'app-student-parents',
  templateUrl: './student-parents.component.html',
  styleUrls: ['./student-parents.component.scss']
})
export class StudentParentsComponent implements OnInit {
  @Input() student: Student;
  first = '';
  last = '';
  email = '';
  mi = '';
  password = '';
  password2 = '';
  parentList: Parent[] = [];
  onAddParent = false;

  constructor(
    public parentService: ParentService,
    public userService: UserService,
    public authService: AuthService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService
  ) {}

  addParent() {
    this.onAddParent = !this.onAddParent;
  }

  ngOnInit() {
    if (this.student.parents) {
      this.parentList = this.student.parents;
    }
    console.log(this.parentList);
  }

  registerParent() {
    if (
      this.first.trim() == '' ||
      this.last.trim() == '' ||
      this.email.trim() == '' ||
      this.password.trim() == '' ||
      this.password2.trim() == ''
    ) {
      return this.toastr.error('All fields are required!');
    }

    if (this.password !== this.password2) {
      return this.toastr.error('Password did not match');
    }

    this.spinner.show();
    const value = {
      email: this.email,
      password: this.password
    };

    this.authService
      .doRegister(value)
      .then(data => {
        const newParent: Parent = {
          id: data.user.uid,
          name: {
            first: this.first,
            last: this.last,
            mi: this.mi
          },
          email: this.email,
          student: [this.student.id],
          role: 'parent',
          image: 'assets/images/profile.jpg',
          address: '',
          dob: '',
          gender: '',
          mobile: 0,
          date: {
            created: new Date(),
            modified: new Date()
          },
          status: 1
        };

        if (this.student.parents) {
          this.student.parents.push(newParent);
        } else {
          this.student.parents = [newParent];
        }

        this.userService.addParent(newParent).then(() => {
          this.userService
            .updateUser(this.student)
            .then(() => {
              this.toastr.success('Parent registered!');
              this.spinner.hide();
              this.clearFields();
            })
            .catch(err => {
              this.toastr.error(err);
              this.spinner.hide();
            });
        });
      })
      .catch(err => {
        this.toastr.error(err);
        this.spinner.hide();
      });
  }

  clearFields() {
    this.first = '';
    this.last = '';
    this.mi = '';
    this.email = '';
    this.password = '';
    this.password2 = '';
  }

  cancel() {
    this.addParent();
  }
}

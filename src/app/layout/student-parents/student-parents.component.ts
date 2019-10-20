import { Component, OnInit } from '@angular/core';
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
  userData$ = this.store.pipe(select(selectUser));
  user: any;
  first = '';
  last = '';
  email = '';
  mi = '';
  password = '';
  password2 = '';
  parentList: Parent[] = [];
  // parent = {
  //   id: '',
  //   name: '',
  //   email: '',
  //   password: ''
  // };
  constructor(
    public store: Store<RootState>,
    public parentService: ParentService,
    public userService: UserService,
    public authService: AuthService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService
  ) {
    this.userData$.subscribe((user: Student) => {
      this.user = user;
      if (!user.parents) {
        this.user.parents = [];
      }
    });
  }

  ngOnInit() {}

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
          student: [this.user.id],
          role: 'parent',
          image: 'assets/images/profile.jpg',
          address: '',
          dob: '',
          gender: '',
          mobile: 0,
          date: {
            created: new Date(),
            modified: new Date()
          }
        };

        if (this.user.parents) {
          this.user.parents.push(newParent);
        } else {
          this.user.parents = [newParent];
        }

        this.userService.addParent(newParent).then(() => {
          this.userService
            .updateUser(this.user)
            .then(() => {
              this.toastr.success('Parent registered!');
              this.spinner.hide();
              this.clearFields();
              this.store.dispatch(new SetUser(this.user));
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
}

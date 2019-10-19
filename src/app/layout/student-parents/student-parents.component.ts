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

@Component({
  selector: 'app-student-parents',
  templateUrl: './student-parents.component.html',
  styleUrls: ['./student-parents.component.scss']
})
export class StudentParentsComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  user: any;
  name = '';
  email = '';
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
    this.userData$.subscribe(user => {
      this.user = user;
      this.parentService.getParentsByStudent(user.id).subscribe(parents => {
        this.parentList = parents;
      });
    });
  }

  ngOnInit() {}

  registerParent() {
    if (
      this.name.trim() == '' ||
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
          name: this.name,
          email: this.email,
          student: this.user,
          role: 'parent'
        };
        this.parentService
          .addParent(newParent)
          .then(() => {
            this.toastr.success('Parent registered!');
            this.spinner.hide();
            this.clearFields();
          })
          .catch(err => {
            this.toastr.error(err);
            this.spinner.hide();
          });
        this.userService.addParent(newParent);
      })
      .catch(err => {
        this.toastr.error(err);
        this.spinner.hide();
      });
  }

  clearFields() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.password2 = '';
  }
}

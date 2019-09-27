import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  role = 'instructor';
  registerForm: FormGroup;
  loginIsClicked = false;
  submitted = false;
  loading = false;

  constructor() {}

  ngOnInit() {}

  changeRole() {
    if (this.role === 'instructor') {
      this.role = 'student';
    } else {
      this.role = 'instructor';
    }
  }
}

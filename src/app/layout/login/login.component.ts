import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  role = 'instructor';
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

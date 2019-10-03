import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store';
import { SetUser } from 'src/app/store/user/user.action';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private store: Store<RootState>,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  changeRole() {
    if (this.role === 'instructor') {
      this.role = 'student';
    } else {
      this.role = 'instructor';
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService
      .doLogin(this.registerForm.value)
      .then(res => {
        console.log(res);
        this.userService.getUser(res.user.uid).subscribe(user => {
          console.log(user);
          user.id = res.user.uid;
          this.store.dispatch(new SetUser(user));
          this.dismissModal();
          this.router.navigate(['/dashboard']);
          this.showSuccess('Login Success!', 'Welcome!');
          this.initForm();
          this.loading = false;
        });
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
        this.showError(err.message, 'Error');
      });
  }

  showSuccess(header, message) {
    this.toastr.success(header, message);
  }

  showError(header, message) {
    this.toastr.error(header, message);
  }

  openModal(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        centered: true
      })
      .result.then(
        result => {
          console.log(`Closed with: ${result}`);
        },
        reason => {
          console.log(`Dismissed ${this.getDismissReason(reason)}`);
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  dismissModal() {
    this.modalService.dismissAll();
  }
}

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
import { take, last } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Student } from 'src/app/models/student.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  role = 'student';
  studRegisterForm: FormGroup;
  loginForm: FormGroup;
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
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.studRegisterForm = this.formBuilder.group({
      studid: ['', [Validators.required]],
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]]
    });
  }

  get login() {
    return this.loginForm.controls;
  }

  get student() {
    return this.studRegisterForm.controls;
  }

  get instructor() {
    return this.studRegisterForm.controls;
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
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner.show();
    this.loading = true;
    this.authService
      .doLogin(this.loginForm.value)
      .then(res => {
        console.log(res);
        this.userService
          .getUser(res.user.uid)
          .pipe(take(1))
          .subscribe(user => {
            console.log(user);
            user.id = res.user.uid;
            this.store.dispatch(new SetUser(user));
            this.dismissModal();
            this.router.navigate(['/dashboard']);
            this.showSuccess('Login Success!', 'Welcome!');
            this.initForms();
            this.loading = false;
            this.spinner.hide();
          });
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
        this.spinner.hide();
        this.showError(err.message, 'Error');
      });
  }

  registerAccount() {
    this.submitted = true;

    if (this.role == 'student') {
      const {
        studid,
        fname,
        lname,
        email,
        password,
        password2
      } = this.studRegisterForm.value;

      if (this.studRegisterForm.invalid) {
        return;
      }

      if (password != password2) {
        return this.toastr.error('Password did not match!');
      }

      this.spinner.show();
      this.loading = true;

      this.authService
        .doRegister(this.studRegisterForm.value)
        .then(data => {
          console.log(data);

          const newStudent: Student = {
            id: data.user.uid,
            student_number: studid,
            email,
            name: {
              first: fname,
              last: lname,
              mi: ''
            },
            address: '',
            dob: new Date(),
            course: '',
            gender: '',
            image: 'assets/images/profile.jpg',
            mobile: 0,
            role: 'student',
            classes: [],
            parents: [],
            date: {
              created: new Date(),
              modified: new Date()
            }
          };

          this.userService
            .addStudent(newStudent)
            .then(() => {
              this.toastr.success('Register success!');
              this.dismissModal();

              this.loginForm.controls['email'].setValue(email);
              this.loginForm.controls['password'].setValue(password);

              const btn = document.querySelector('#loginButton');
              const evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
              });
              btn.dispatchEvent(evt);
              this.spinner.hide();
              this.loading = false;
            })
            .catch(err => {
              this.toastr.error(err);
              this.spinner.hide();
              this.loading = false;
            });
        })
        .catch(err => {
          this.toastr.error(err);
          this.spinner.hide();
          this.loading = false;
        });
    }
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

import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser, selectClass } from 'src/app/store';
import { User } from 'src/app/models/user.model';
import { Class } from 'src/app/models/class.model';
import { ClassService } from 'src/app/services/class.service';
import { SetClass } from 'src/app/store/classes/classes.action';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Question } from 'src/app/models/question.model';
import { initialState } from 'src/app/store/user/user.reducer';
import { SetUser } from 'src/app/store/user/user.action';
import { Student } from 'src/app/models/student.model';
import { UserService } from 'src/app/services/user.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classData$ = this.store.pipe(select(selectClass));
  user: any;
  selectedClass: Class;
  classList: Class[];
  newClassname = '';
  newDescription = '';
  newColor = '';
  newClassCode = '';
  colorClass = 'bg-red text-light';
  constructor(
    private store: Store<RootState>,
    private classService: ClassService,
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.userData$.subscribe(user => {
      this.user = user;
      if (user.id !== '') {
        switch (user.role) {
          case 'instructor':
            this.classService
              .getAllclasses(this.user.id)
              .subscribe(classData => {
                this.classList = classData;
              });
            break;
          case 'student':
            this.classService
              .getClassByStudentId(user.id)
              .subscribe(classData => {
                this.classList = classData;
              });
            break;
        }
      }
    });
    this.classData$.subscribe(res => {
      this.selectedClass = res;
    });
  }

  ngOnInit() {}

  setSelectedClass(newClass: Class) {
    this.store.dispatch(new SetClass(newClass));
  }

  resetClass() {
    const clear: Class = {
      id: '',
      name: '',
      description: '',
      color: '',
      date: {
        created: new Date(),
        modified: new Date()
      },
      code: '',
      instructor: {
        id: '',
        name: ''
      },
      members: []
    };
    this.store.dispatch(new SetClass(clear));
  }

  openModal(content) {
    this.modalService.open(content, {
      size: 'lg',
      centered: true
    });
  }

  openSmModal(modal) {
    this.modalService.open(modal, {
      centered: true
    });
  }

  addNewClass() {
    if (
      this.newClassname.trim() === '' ||
      this.newDescription.trim() === '' ||
      this.newColor.trim() === '' ||
      this.newColor === 'Choose...'
    ) {
      return this.toastr.error('All fields are required!');
    }

    const code = this.randomCode();

    this.spinner.show();
    const newClass: Class = {
      name: this.newClassname,
      description: this.newDescription,
      color: this.newColor,
      date: {
        created: new Date(),
        modified: new Date()
      },
      code,
      instructor: {
        name: `${this.user.name.first} ${this.user.name.last}`,
        id: this.user.id
      },
      members: []
    };
    this.classService.addClass(newClass);
    this.toastr.success('Classcode: ' + code, 'success');
    this.newClassname = '';
    this.newDescription = '';
    this.newColor = 'Choose...';
    this.spinner.hide();
    this.modalService.dismissAll();
    this.store.dispatch(new SetClass(newClass));
  }

  joinClass() {
    if (this.newClassCode.trim() == '') {
      return;
    }
    this.spinner.show();
    this.classService
      .getClassByCode(this.newClassCode)
      .pipe(take(1))
      .subscribe(snapshot => {
        if (snapshot.length > 0) {
          const newClass: Class = snapshot[0];
          if (newClass.members.includes(this.user.id)) {
            this.toastr.error('Already a member of this class');
            this.spinner.hide();
          } else {
            newClass.members.push(this.user.id);
            this.classService.updateClass(newClass).then(() => {
              this.spinner.hide();
              this.toastr.success('Class added');
            });
          }
        } else {
          this.spinner.hide();
          this.toastr.error('Please check the class code!');
        }
      });
  }

  randomCode() {
    let result = '';
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 6; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  logOut() {
    this.authService.doLogout().then(res => {
      console.log(res);

      this.store.dispatch(new SetUser(initialState));
      this.resetClass();
      this.modalService.dismissAll();
    });
  }
}

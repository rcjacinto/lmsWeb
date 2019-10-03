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

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classData$ = this.store.pipe(select(selectClass));
  user: User;
  selectedClass: Class;
  classList: Class[];
  newClassname: string = '';
  newDescription: string = '';
  newColor: string = '';
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
      console.log(user);
      this.user = user;
    });
    this.classData$.subscribe(res => {
      console.log(res);
      this.selectedClass = res;
    });
    this.classService.getAllclasses(this.user.id).subscribe(classData => {
      console.log(classData);
      this.classList = classData;
    });
  }

  ngOnInit() {}

  setSelectedClass(newClass: Class) {
    this.store.dispatch(new SetClass(newClass));
  }

  resetClass() {
    const clear: Class = {
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
      }
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
    console.log(this.newColor);

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
      }
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
    this.authService.doLogout().then(() => {
      this.store.dispatch(new SetUser(initialState));
      this.resetClass();
      this.modalService.dismissAll();
    });
  }
}

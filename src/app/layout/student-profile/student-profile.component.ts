import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { User } from 'src/app/models/user.model';
import {
  AngularFireUploadTask,
  AngularFireStorage
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SetUser } from 'src/app/store/user/user.action';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/models/student.model';

export interface FileData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  user: User;
  newUser: Student;
  dateSelected = false;

  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<FileData[]>;
  image: string;

  fileSize: number;

  constructor(
    private store: Store<RootState>,
    private storage: AngularFireStorage,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.userData$.subscribe(user => {
      console.log(user);
      this.user = user;
    });

    this.newUser = JSON.parse(JSON.stringify(this.user));
  }

  ngOnInit() {}

  uploadImage(event) {
    this.spinner.show();
    const file = event.target.files.item(0);

    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    const path = `profile_image/${Math.floor(
      Math.random() * 1000000
    )}${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(path);

    this.task = this.storage.upload(path, file);
    this.percentage = this.task.percentageChanges();

    this.task.then(async result => {
      const url = await result.ref.getDownloadURL();
      this.user.image = url;
      this.userService.updateUser(this.user).then(res => {
        this.store.dispatch(new SetUser(this.user));
        this.newUser = JSON.parse(JSON.stringify(this.user));
        this.toastr.success('Profile updated!');
        this.spinner.hide();
      });
    });
  }

  updateProfile() {
    this.spinner.show();
    this.newUser.date.modified = new Date();
    this.userService.updateUser(this.newUser).then(() => {
      this.store.dispatch(new SetUser(this.newUser));
      this.newUser = JSON.parse(JSON.stringify(this.user));
      this.toastr.success('Profile updated!');
      this.spinner.hide();
    });
  }
}

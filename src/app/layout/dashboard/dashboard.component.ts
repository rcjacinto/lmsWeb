import { Component, OnInit } from "@angular/core";
import { PostType, Post } from "src/app/models/posts.model";
import { Store, select } from "@ngrx/store";
import { RootState, selectUser, selectClass } from "src/app/store";
import { Class } from "src/app/models/class.model";
import { PostsService } from "src/app/services/posts.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import {
  AngularFireStorage,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { Observable } from "rxjs";
import { FileData } from "../profile/profile.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classData$ = this.store.pipe(select(selectClass));
  user;
  selectedClass: Class;
  message = "";
  postType = 0;
  attachments = [];
  postsList: Post[] = [];
  fileUploads = [];
  loading = false;

  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  fileData: Observable<FileData[]>;

  constructor(
    public store: Store<RootState>,
    public postService: PostsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.userData$.subscribe(user => {
      if (user.role == "parent") {
        router.navigate(["/view-my-student"]);
      } else if (user.role == "admin") {
        router.navigate(["/manage-instructors"]);
      }
      this.user = user;
    });
    this.classData$.subscribe(data => {
      this.selectedClass = data;
      this.postService.getPostsByClass(data.id).subscribe(posts => {
        this.postsList = posts;
      });
    });
  }

  ngOnInit() {}

  addFileUpload(files) {
    console.log(files.item(0));
    let url;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      if (
        files.item(0).type == "image/png" ||
        files.item(0).type == "image/jpeg" ||
        files.item(0).type == "image/gif"
      ) {
        url = reader.result;
      } else {
        if (this.getfileLink(files.item(0).type)) {
          url = this.getfileLink(files.item(0).type);
        } else {
          return this.toastr.error("File invalid");
        }
      }
      const result = {
        name: files.item(0).name,
        url,
        type: files.item(0).type,
        uploadPercent: 0,
        uploading: false
      };
      console.log(result);

      this.fileUploads.unshift(result);
    };

    this.attachments.unshift(files.item(0));
  }

  removeFile(index) {
    this.fileUploads.splice(index, 1);
    this.attachments.splice(index, 1);
  }

  async addPost() {
    if (this.message.trim() == "") {
      return;
    }

    this.loading = true;
    const attachments = await new Promise<any>(res => {
      const uploads = [];
      if (this.attachments.length == 0) {
        res([]);
        this.loading = false;
      }
      let uploadCounts = 0;
      this.attachments.forEach(async (file, index) => {
        const link = await this.fileUpload(file, index);
        const upload = {
          name: this.fileUploads[index].name,
          type: this.fileUploads[index].type,
          link
        };
        uploads.push(upload);
        uploadCounts++;
        if (this.attachments.length == uploadCounts) {
          res(uploads);
          this.loading = false;
        }
      });
    });

    const newPost: Post = {
      id: "",
      attachments,
      message: this.message,
      posted_by: this.user,
      posted_to: this.selectedClass,
      type: this.postType,
      date: {
        created: new Date(),
        modified: new Date()
      }
    };

    this.spinner.show();

    this.postService
      .addPost(newPost)
      .then(res => {
        newPost.id = res.id;
        this.postService.updatePost(newPost);
        this.toastr.success("Posted!");
        this.spinner.hide();
        this.clearMessage();
      })
      .catch(err => {
        this.toastr.success(err);
        this.spinner.hide();
      });
  }

  clearMessage() {
    this.message = "";
    this.attachments = [];
    this.fileUploads = [];
  }

  convertToDate(date) {
    return new Date(date * 1000);
  }

  async fileUpload(file, index) {
    return new Promise((resolve, reject) => {
      // if (file.type.split("/")[0] !== "image") {
      //   this.toastr.error("unsupported file type :( ");
      //   return null;
      // }

      const path = `file_uploads/${Math.floor(
        Math.random() * 1000000
      )}${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(path);

      this.task = this.storage.upload(path, file);
      this.fileUploads[index].uploading = true;
      this.fileUploads[index].uploadPercent = this.task.percentageChanges();

      this.task.then(async result => {
        const url = await result.ref.getDownloadURL();
        this.fileUploads[index].uploading = false;
        resolve(url);
      });
    });
  }

  getfileLink(type) {
    if (type == "application/pdf") {
      return "assets/images/file.png";
    } else if (
      type == "application/vnd.ms-excel" ||
      type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return "assets/images/file.png";
    } else if (
      type == "application/msword" ||
      type ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return "assets/images/file.png";
    }

    return null;
  }
}

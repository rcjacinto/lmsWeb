import { Component, OnInit } from "@angular/core";
import { PostType, Post } from "src/app/models/posts.model";
import { Store, select } from "@ngrx/store";
import { RootState, selectUser, selectClass } from "src/app/store";
import { Class } from "src/app/models/class.model";
import { PostsService } from "src/app/services/posts.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

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
  constructor(
    public store: Store<RootState>,
    public postService: PostsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
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

  addPost() {
    if (this.message.trim() == "") {
      return;
    }

    const newPost: Post = {
      id: "",
      attachments: this.attachments,
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
  }

  convertToDate(date) {
    return new Date(date * 1000);
  }
}

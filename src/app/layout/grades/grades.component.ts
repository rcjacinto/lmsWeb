import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectUser, selectClass, RootState } from 'src/app/store';
import { Class } from 'src/app/models/class.model';
import { PostsService } from 'src/app/services/posts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/models/student.model';
import { UserService } from 'src/app/services/user.service';
import { ActivityService } from 'src/app/services/activity.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classData$ = this.store.pipe(select(selectClass));
  user;
  selectedClass: Class;
  students: Student[] = [];
  loading = true;
  selectedTerm = 'prelim';
  constructor(
    public store: Store<RootState>,
    public postService: PostsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public userService: UserService,
    public activityService: ActivityService
  ) {
    this.userData$.subscribe(user => {
      this.user = user;
    });
    this.classData$.subscribe(data => {
      this.selectedClass = data;
    });

    if (this.selectedClass.members) {
      this.selectedClass.members.forEach(member => {
        this.userService.getUser(member).subscribe((user: any) => {
          this.students.push(user);
          this.loading = false;
        });
        console.log(
          this.computeGrade(this.selectedClass.id, 'quiz', this.selectedTerm)
        );
      });
    }
  }

  ngOnInit() {}

  setSelectedTerm(term) {
    this.selectedTerm = term;
  }

  async computeGrade(classId, type, term) {
    this.activityService
      .getActivityByTerm(classId, type, term)
      .pipe(take(1))
      .toPromise()
      .then(a => {
        console.log(a);
        return '1';
      });
  }
}

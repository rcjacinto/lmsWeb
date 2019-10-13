import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser, selectClass } from 'src/app/store';
import { Student } from 'src/app/models/student.model';
import { Class } from 'src/app/models/class.model';
import { ActivityService } from 'src/app/services/activity.service';
import { Submit } from 'src/app/models/submit.model';
import { Question } from 'src/app/models/question.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-activities',
  templateUrl: './student-activities.component.html',
  styleUrls: ['./student-activities.component.scss']
})
export class StudentActivitiesComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classData$ = this.store.pipe(select(selectClass));
  user: any;
  selectedClass: Class;
  loading = true;
  submitList: Submit[];
  onView = false;
  selectedSubmit: Submit;
  selectedQuestion: Question;
  constructor(
    public store: Store<RootState>,
    public activitService: ActivityService,
    private toastr: ToastrService
  ) {
    this.userData$.subscribe(user => {
      this.user = user;
      this.classData$.subscribe(sc => {
        this.selectedClass = sc;
        this.activitService.getSubmits(user.id, sc.id).subscribe(submits => {
          this.submitList = submits;
          this.loading = false;
        });
      });
    });
  }

  ngOnInit() {}

  passed(score, item): boolean {
    return score >= item / 2;
  }

  setSelectedSubmit(submit: Submit) {
    const today = new Date();
    const dl = this.convertToDate(submit.activity.deadline.seconds);

    if (today > dl) {
      this.selectedSubmit = submit;
      this.selectedQuestion = submit.activity.questions[0];
      this.onView = true;
    } else {
      this.toastr.success('Please wait after the deadline');
    }
  }

  setSelectedQuestion(question) {
    this.selectedQuestion = question;
  }

  nextQuestion() {
    const next = this.selectedQuestion.number + 1;
    this.selectedSubmit.activity.questions.forEach(question => {
      if (next == question.number) {
        this.setSelectedQuestion(question);
        return false;
      }
    });
  }

  prevQuestion() {
    const next = this.selectedQuestion.number - 1;
    this.selectedSubmit.activity.questions.forEach(question => {
      if (next == question.number) {
        this.setSelectedQuestion(question);
        return false;
      }
    });
  }

  cancelOnView() {
    this.onView = false;
  }

  convertToDate(date) {
    return new Date(date * 1000);
  }
}

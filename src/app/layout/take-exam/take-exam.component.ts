import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectExam, selectUser, selectClass } from 'src/app/store';
import { Activity } from 'src/app/models/activity.model';
import { Question } from 'src/app/models/question.model';
import { Class } from 'src/app/models/class.model';
import { Submit } from 'src/app/models/submit.model';
import { ActivityService } from 'src/app/services/activity.service';
import { take } from 'rxjs/operators';
import { actInitialState } from 'src/app/store/exam/exam.reducer';

@Component({
  selector: 'app-take-exam',
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.scss']
})
export class TakeExamComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classData$ = this.store.pipe(select(selectClass));
  activityData$ = this.store.pipe(select(selectExam));
  user: any;
  selectedClass: Class;
  activity: Activity = actInitialState;
  loading = false;
  timerStarted = false;
  selectedQuestion: Question;
  submit: Submit;
  continuing = false;

  constructor(
    public store: Store<RootState>,
    public activityService: ActivityService
  ) {
    this.loading = true;
    this.userData$.subscribe(user => {
      this.user = user;
    });

    this.classData$.subscribe(sc => {
      this.selectedClass = sc;
    });
  }

  ngOnInit() {
    this.activityData$.pipe(take(1)).subscribe(async data => {
      await this.activityService
        .getSubmit(this.user, data.id)
        .pipe(take(1))
        .subscribe(async sub => {
          if (sub.length > 0) {
            this.activity = sub[0].activity;
            this.submit = sub[0];
            this.loading = false;
            this.continuing = this.submit.status == 1;
          } else {
            console.log('start');
            this.activity = data;
            this.submit = {
              activity: data,
              date: {
                started: new Date(),
                modified: new Date(),
                submitted: null
              },
              status: 0,
              student: this.user,
              timer_left: data.time_limit * 60
            };
            await this.activityService.addSubmit(this.submit).then(res => {
              console.log(res);
              this.submit.id = res.id;
              this.loading = false;
            });
          }
          this.selectedQuestion = this.activity.questions[0];
        });
    });
  }

  computeTotalPoints(questions: Question[]) {
    let total = 0;
    questions.forEach(question => {
      total += question.points;
    });

    return total;
  }

  startActivity() {
    this.timerStarted = true;
    this.submit.status = 1;
    this.activityService.updateSubmit(this.submit);
    this.timerStart();
  }

  setSelectedQuestion(question) {
    this.selectedQuestion = question;
  }

  nextQuestion() {
    const next = this.selectedQuestion.number + 1;
    this.activity.questions.forEach(question => {
      if (next == question.number) {
        this.setSelectedQuestion(question);
        return false;
      }
    });
  }

  prevQuestion() {
    const next = this.selectedQuestion.number - 1;
    this.activity.questions.forEach(question => {
      if (next == question.number) {
        this.setSelectedQuestion(question);
        return false;
      }
    });
  }

  setMcAnswer(answer) {
    this.selectedQuestion.answer = answer;
    this.activityService.updateSubmit(this.submit);
  }

  setSaAnswer(event) {
    const value: string = event.target.value;
    const correct: string = this.selectedQuestion.options[0].value;
    const isCorrect = value.trim() == correct.trim();
    const answer = {
      key: 'answer',
      value: value.trim(),
      is_correct: isCorrect
    };
    this.selectedQuestion.answer = answer;
    this.activityService.updateSubmit(this.submit);
  }

  setTofAnswer(event) {
    const value = event.target.value;

    const isCorrect = value == this.selectedQuestion.options[0].value;
    const answer = {
      key: 'answer',
      value,
      is_correct: isCorrect
    };
    this.selectedQuestion.answer = answer;
    this.activityService.updateSubmit(this.submit);
  }

  submitActivity() {
    console.log(this.activity);
    this.submit.status = 1;
    this.activityService.updateSubmit(this.submit);
  }

  timerStart() {
    setInterval(() => {
      if (this.submit.timer_left > 0) {
        this.submit.timer_left--;
        this.activityService.updateSubmit(this.submit);
      }
    }, 1000);
  }

  trunc(num: number) {
    return Math.trunc(num);
  }
}

import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectExam, selectUser, selectClass } from 'src/app/store';
import { Activity } from 'src/app/models/activity.model';
import { Question } from 'src/app/models/question.model';
import { Class } from 'src/app/models/class.model';
import { Submit } from 'src/app/models/submit.model';

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
  activity: Activity;
  loading = false;
  timerStarted = false;
  selectedQuestion: Question;
  questionIndex = 0;
  submits: Submit;

  constructor(public store: Store<RootState>) {
    this.loading = true;
    this.userData$.subscribe(user => {
      this.user = user;
    });

    this.classData$.subscribe(sc => {
      this.selectedClass = sc;
    });
  }

  ngOnInit() {
    this.activityData$.subscribe(data => {
      this.activity = data;
      this.selectedQuestion = this.activity.questions[0];
      this.submits = this.activity;
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
  }

  setSaAnswer(event) {
    const answer = {
      key: 'answer',
      value: event.target.value,
      is_correct: false
    };
    this.selectedQuestion.answer = answer;
  }

  setTofAnswer(event) {
    const value = event.target.value;
    const answer = {
      key: 'answer',
      value: value == 'true' ? true : false,
      is_correct: false
    };
    this.selectedQuestion.answer = answer;
  }

  submit() {
    console.log(this.activity);
  }

  timerStart() {}
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from 'src/app/models/question.model';
import { Submit } from 'src/app/models/submit.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-student-activity',
  templateUrl: './view-student-activity.component.html',
  styleUrls: ['./view-student-activity.component.scss']
})
export class ViewStudentActivityComponent implements OnInit {
  submit: Submit;
  selectedQuestion: Question;
  constructor(
    private activatedRouter: ActivatedRoute,
    private _location: Location
  ) {
    this.activatedRouter.queryParams.subscribe(params => {
      if (params.submit) {
        this.submit = JSON.parse(params.submit);
        console.log(params.submit);
        this.setSelectedQuestion(this.submit.activity.questions[0]);
      }
    });
  }

  ngOnInit() {}

  passed(score, item): boolean {
    return score >= item / 2;
  }

  setSelectedQuestion(question) {
    this.selectedQuestion = question;
  }

  nextQuestion() {
    const next = this.selectedQuestion.number + 1;
    this.submit.activity.questions.forEach(question => {
      if (next == question.number) {
        this.setSelectedQuestion(question);
        return false;
      }
    });
  }

  prevQuestion() {
    const next = this.selectedQuestion.number - 1;
    this.submit.activity.questions.forEach(question => {
      if (next == question.number) {
        this.setSelectedQuestion(question);
        return false;
      }
    });
  }

  back() {
    this._location.back();
  }

  convertToDate(date) {
    return new Date(date * 1000);
  }
}

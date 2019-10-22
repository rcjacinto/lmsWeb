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
import { Activity } from 'src/app/models/activity.model';
import { Submit } from 'src/app/models/submit.model';

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
  students: any[] = [];
  grades: any[] = [];
  loading = true;
  selectedTerm = 'prelim';
  activityList: Activity[];
  quizList: Activity[];
  examList: Activity[];
  submitList: Submit[];
  studentGrades: any[];

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
      this.getAllStudentGrades(this.selectedTerm);
    });
  }

  ngOnInit() {}

  setSelectedTerm(term) {
    this.selectedTerm = term;
    this.getAllStudentGrades(term);
  }

  async getAllStudentGrades(term) {
    this.loading = true;
    this.grades = [];
    this.selectedClass.members.forEach(member => {
      this.userService.getUser(member).subscribe(async (user: any) => {
        if (term != 'total') {
          this.grades.push(await this.getStudentGrades(user, term));
          this.loading = false;
        } else {
          const prelimGrade = await this.getStudentGrades(user, 'prelim');
          const midtermGrade = await this.getStudentGrades(user, 'midterm');
          const prefinalsGrade = await this.getStudentGrades(
            user,
            'pre-finals'
          );
          const finalsGrade = await this.getStudentGrades(user, 'finals');
          const prelim = (prelimGrade.total * 30) / 100;
          const midterm = (midtermGrade.total * 70) / 100;
          const prefinals = (prefinalsGrade.total * 30) / 100;
          const finals = (finalsGrade.total * 70) / 100;
          const average =
            ((prelim + midterm) * 50) / 100 + ((finals + prefinals) * 50) / 100;

          const totalGrades = {
            student: user,
            prelim,
            midterm,
            prefinals,
            finals,
            average
          };

          this.grades.push(totalGrades);
          this.loading = false;
        }
      });
    });
  }

  getStudentGrades(user, term) {
    return new Promise<any>((res, rej) => {
      this.activityService
        .getActivityByTerm(this.selectedClass.id, term)
        .subscribe(async act => {
          let quizTotalEarnablePoints = 0;
          let examsTotalEarnablePoints = 0;

          this.quizList = act;
          this.quizList.forEach(quiz => {
            quiz.questions.findIndex(question => {
              if (quiz.type == 'quiz') {
                quizTotalEarnablePoints += question.points;
              } else {
                examsTotalEarnablePoints += question.points;
              }
            });
          });

          const quiz = await this.getSubmitGrades(
            user.id,
            'quiz',
            quizTotalEarnablePoints,
            10,
            term
          );

          const exams = await this.getSubmitGrades(
            user.id,
            'exams',
            examsTotalEarnablePoints,
            30,
            term
          );

          const performance = 60;
          const grade = performance + quiz + exams;
          const newGrade = {
            student: user,
            performance,
            quiz,
            exams,
            total: grade
          };

          res(newGrade);
        });
    });
  }

  getSubmitGrades(id, type, total, percent, term) {
    return new Promise<number>((resolve, reject) => {
      this.activityService
        .getSubmitsByType(id, this.selectedClass.id, type, term)
        .subscribe(submits => {
          let score = 0;
          let item = 0;
          submits.forEach(submit => {
            score += submit.score;
            item += submit.total_items;
          });

          const totalEarnedPoints = total != 0 ? (score / total) * 100 : 0;
          const grade = (totalEarnedPoints * percent) / 100;

          resolve(grade);
        });
    });
  }
}

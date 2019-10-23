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
  search = '';
  performanceUpdate: any;

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
    if (this.selectedClass.members.length == 0) {
      setTimeout(() => {
        return (this.loading = false);
      }, 2000);
    }
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

  getStudentGrades(student, term) {
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
            student.id,
            'quiz',
            quizTotalEarnablePoints,
            10,
            term
          );

          const exams = await this.getSubmitGrades(
            student.id,
            'exams',
            examsTotalEarnablePoints,
            30,
            term
          );
          let performance;
          const performances: any = await this.getPerformanceGrade(
            student,
            term
          );
          if (performances.length > 0) {
            performance = performances[0];
            console.log(performance);
          } else {
            const newPerformance = {
              class_id: this.selectedClass.id,
              student_id: student.id,
              grade: 0,
              term
            };
            if (this.selectedTerm != 'total') {
              this.activityService.addPerformance(newPerformance);
            }
            performance = newPerformance;
          }

          const grade = performance.grade + quiz + exams;
          const newGrade = {
            student,
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

  getPerformanceGrade(student, term) {
    return new Promise((res, rej) => {
      this.activityService
        .getPerformanceByStudent(this.selectedClass.id, student.id, term)
        .subscribe((stud: any) => {
          res(stud);
        });
    });
  }

  updatePerformance() {
    if (!this.performanceUpdate.grade) {
      this.performanceUpdate.grade = 0;
    }

    if (this.performanceUpdate.grade > 60) {
      return this.toastr.error('Maximum 60% performance only');
    }

    this.activityService.updatePerformance(this.performanceUpdate).then(() => {
      this.getAllStudentGrades(this.selectedTerm);
    });
  }

  setPerfomanceUpdate(performance) {
    this.performanceUpdate = JSON.parse(JSON.stringify(performance));
  }
}

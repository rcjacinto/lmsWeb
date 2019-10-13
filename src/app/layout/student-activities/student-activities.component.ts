import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser, selectClass } from 'src/app/store';
import { Student } from 'src/app/models/student.model';
import { Class } from 'src/app/models/class.model';
import { ActivityService } from 'src/app/services/activity.service';
import { Submit } from 'src/app/models/submit.model';

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
  constructor(
    public store: Store<RootState>,
    public activitService: ActivityService
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
}

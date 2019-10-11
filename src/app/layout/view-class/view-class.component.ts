import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser, selectClass } from 'src/app/store';
import { Class } from 'src/app/models/class.model';
import { Activity } from 'src/app/models/activity.model';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-view-class',
  templateUrl: './view-class.component.html',
  styleUrls: ['./view-class.component.scss']
})
export class ViewClassComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classData$ = this.store.pipe(select(selectClass));
  user: any;
  selectedClass: Class;
  activityList: Activity[] = [];
  loading = false;
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
      if (this.selectedClass.id !== '') {
        console.log(this.selectedClass.id);

        this.activityService.getActivityByClass(sc.id).subscribe(activities => {
          this.activityList = activities;
          this.loading = false;
        });
      }
    });
  }

  ngOnInit() {}
}

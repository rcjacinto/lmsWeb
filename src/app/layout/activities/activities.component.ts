import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { RootState, selectClass } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { Class } from 'src/app/models/class.model';
import { Activity } from 'src/app/models/activity.model';
import { Submit } from 'src/app/models/submit.model';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  selectedClass$ = this.store.pipe(select(selectClass));
  selectedClass: Class;
  allActivities: Activity[];
  activityList: Activity[];
  selectedActivity: Activity;
  activityType: string;
  submitList: Submit[];
  loading = false;
  isOnView = false;
  term = 'prelim';

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private store: Store<RootState>
  ) {
    this.route.paramMap.subscribe((map: any) => {
      this.isOnView = false;
      this.loading = true;
      this.activityType = map.params.type;
      this.selectedClass$.subscribe(data => {
        this.selectedClass = data;
        if (this.selectedClass.id !== '') {
          this.activityService
            .getActivityByType(this.selectedClass.id, this.activityType)
            .subscribe(list => {
              this.allActivities = list;
              this.activityList = this.allActivities.filter(
                li => li.term == this.term
              );
              this.loading = false;
            });
        }
      });
    });
  }

  ngOnInit() {}

  setSelectedActivity(activity) {
    this.isOnView = true;
    this.loading = true;
    this.selectedActivity = activity;
    this.activityService
      .getSubmitByActivity(this.selectedActivity.id)
      .subscribe(submits => {
        this.submitList = submits;
        this.loading = false;
      });
  }

  setSelectedTerm(term) {
    this.term = term;
    this.activityList = this.allActivities.filter(li => li.term == this.term);
  }

  clearSelectedActivity() {
    this.isOnView = false;
  }
}

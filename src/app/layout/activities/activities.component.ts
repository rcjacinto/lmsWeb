import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { RootState, selectClass } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { Class } from 'src/app/models/class.model';
import { Activity } from 'src/app/models/activity.model';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  selectedClass$ = this.store.pipe(select(selectClass));
  selectedClass: Class;
  activityList: Activity[];
  activityType: string;
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private store: Store<RootState>
  ) {
    this.route.paramMap.subscribe((map: any) => {
      console.log(map.params);
      this.loading = true;
      this.activityType = map.params.type;
      this.selectedClass$.subscribe(data => {
        this.selectedClass = data;
        this.activityService
          .getActivityByType(this.selectedClass.id, this.activityType)
          .subscribe(list => {
            console.log(list);

            this.activityList = list;
            this.loading = false;
          });
      });
    });
  }

  ngOnInit() {}
}

import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectClass, RootState } from 'src/app/store';
import { Class } from 'src/app/models/class.model';
import { Activity } from 'src/app/models/activity.model';
import { Submit } from 'src/app/models/submit.model';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
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
    private store: Store<RootState>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.route.paramMap.subscribe((map: any) => {
      this.isOnView = false;
      this.loading = true;
      this.selectedClass$.subscribe(data => {
        this.selectedClass = data;
        if (this.selectedClass.id !== '') {
          this.activityService
            .getActivityByClass(this.selectedClass.id)
            .subscribe(list => {
              this.allActivities = list;
              console.log(list,'list');
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
    console.log(activity);

    if (activity.submits && activity.submits.length > 0) {
      return this.toastr.error('Already have submits, cannot be edited');
    }
    this.isOnView = true;
    this.loading = true;
    this.selectedActivity = JSON.parse(JSON.stringify(activity));
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

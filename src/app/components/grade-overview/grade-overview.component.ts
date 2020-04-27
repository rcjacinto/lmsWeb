import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/services/class.service';
import { ActivityService } from 'src/app/services/activity.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-grade-overview',
  templateUrl: './grade-overview.component.html',
  styleUrls: ['./grade-overview.component.scss']
})
export class GradeOverviewComponent implements OnInit {
  allClass: any;
  constructor(
    private classService : ClassService,
    private activityService: ActivityService,
    private user:UserService
  ) {

  }

  ngOnInit() {
    this.classService.getClassOverview().subscribe(res=>{
      this.allClass = res;
      this.allClass.map((e,id)=>{
        let term = [{term: 'prelim',value:0},{term:'midterm',value:0},{term:'pre-finals',value:0},{term:'finals',value:0}];
        e.student_info = [];
        if(e.members) {
          e.members.map(r => {
            this.user.getUser(r).subscribe(res=>{
              let studInfo:any = res;
              if(studInfo) {
                studInfo.term = [{term: 'prelim',value:0},{term:'midterm',value:0},{term:'pre-finals',value:0},{term:'finals',value:0}];
                studInfo.term.map(em=>{
                  this.activityService.getPerformanceByStudent(e.id, r, em.term).subscribe(res=>{
                    let emp:any = res;
                    if(emp){
                      emp.map(e=>{
                        if(e.grade > 0){
                          em.value = e.grade;
                        }
                      })
                    }
                  })
                })
                e.student_info.push(studInfo);
              }
            })
          })
        }
      })
      console.log(this.allClass);
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectUser, selectClass, RootState } from 'src/app/store';
import { ClassService } from 'src/app/services/class.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { EvaluatedService } from 'src/app/services/evaluated.service';

@Component({
  selector: 'app-student-eval',
  templateUrl: './student-eval.component.html',
  styleUrls: ['./student-eval.component.scss']
})
export class StudentEvalComponent implements OnInit {

  userData$ = this.store.pipe(select(selectUser));
  classData$ = this.store.pipe(select(selectClass));
  userInfo :any=null;
  classInfo :any=null;
  evalInfo : any = null;
  questionInfo: any = null;
  dataInfo : any = [];
  constructor(private classes: ClassService,
    private store: Store<RootState>,
    private evalQuestion: EvaluationService,
    private evaluated: EvaluatedService
    ) { }

  ngOnInit() {
    this.userData$.subscribe(res=>{
      this.concatInfo(res);
        this.classData$.subscribe(async res=>{
          this.concatInfo(res);
        })
    });
  }
  concatInfo(data){
    this.dataInfo.push(data);
    if(this.dataInfo.length === 2){
      console.log(this.dataInfo);
      this.getEvalInfo(this.dataInfo[0],this.dataInfo[1]);
    }
  }
  getEvalInfo(userInfo,classInfo) {
    this.evaluated.getEvalByInfo(userInfo.id,classInfo.id).subscribe(res=>{
      if (res.length!==0) {
        this.evalInfo = res;
      } else {
        this.getEvalQuestion();
      }
    })
  }
  getEvalQuestion () {
    this.questionInfo = [];
    this.evalQuestion.getEval().subscribe(res=>{
      let quest = res;
      quest.filter(e=>{
        if(e.status==='Active'){
          this.questionInfo.push({...e, answer:0 });
        }
      });
      console.log(this.questionInfo)
    })
  }
  toggleAns(val,id){
    this.questionInfo[id].answer = val;
  }
  submitEval() {
    console.log(this.questionInfo,this.userInfo,this.classInfo);
  }

}

import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectUser, selectClass, RootState } from 'src/app/store';
import { ClassService } from 'src/app/services/class.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { EvaluatedService } from 'src/app/services/evaluated.service';
import { ToastrService } from "ngx-toastr";

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
  comments: any = [];
  constructor(private classes: ClassService,
    private store: Store<RootState>,
    private evalQuestion: EvaluationService,
    private evaluated: EvaluatedService,
    public toastr: ToastrService
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
    this.userInfo = userInfo;
    this.classInfo = classInfo;
    this.evaluated.getEvalByInfo(userInfo.id,classInfo.id).subscribe(res=>{
      console.log(res);
      if (res.length!==0) {
        this.evalInfo = res[0];
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
    let totalAns = 0;
    let validForm = 0;
    let totalQ = this.questionInfo.length;
    let totalScore = 0;
    this.questionInfo.filter(f=>{
      if(f.answer===0){
        validForm = 1;
      }
      totalAns += f.answer;
    });
    if(validForm){
      this.toastr.error('Kindly select the corresponding rating for each item!');
    }else{
      totalScore = totalAns / totalQ;
      console.log(totalScore,this.comments);
      let payload = {
        id:'',
        student_id:this.userInfo.id,
        class_id:this.classInfo.id,
        instructor_id:this.classInfo.instructor.id,
        total_rating: totalScore,
        date_rated: new Date(),
        eval_data: this.questionInfo,
        comments: this.comments
      }
      this.evaluated.addEval(payload).then(res=>{
        payload.id = res.id
        this.evaluated.updateEval(payload);
        this.toastr.success("Class Instructor Evaluated");
        this.getEvalInfo(this.userInfo,this.classInfo);
      })
    }
  }

}

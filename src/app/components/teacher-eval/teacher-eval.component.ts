import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from "ngx-toastr";
import { EvaluatedService } from 'src/app/services/evaluated.service';

@Component({
  selector: 'app-teacher-eval',
  templateUrl: './teacher-eval.component.html',
  styleUrls: ['./teacher-eval.component.scss']
})
export class TeacherEvalComponent implements OnInit {
  selectedTab:any = 1;
  question:any = null;
  questionaire: any = null;
  editQuestionaire: any = null;
  instructorList: any = null;
  constructor(
    private config: NgbModalConfig,
    private evaluate: EvaluationService,
    private evaluated: EvaluatedService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private userS: UserService,
    ) {
      this.userS.getApprovedInstructor().subscribe(instructors => {
        this.instructorList = instructors;
        this.instructorList.map(insResult=>{
          insResult.rating = 0;
          insResult.total_rating = 0;
          insResult.rating_data = [];
          this.evaluated.getEvalByInstructor(insResult.id).subscribe(res=>{
            let total = 0;
            let avg = 0
            if(res.length !==0){
            let getCount = res;
            insResult.rating_data = res;
            insResult.total_rating = res.length;
              getCount.filter(e=>{
                total += e.total_rating
                avg = total / res.length
                insResult.rating = avg;
              });
            }
          });
        });
        this.instructorList.sort((a,b)=>{
          return a.rating - b.rating;
        })
        console.log(this.instructorList);
      });
    }

  ngOnInit() {
    this.evaluate.getEval().subscribe(res=>{
     this.questionaire = res;
   });
  }
  setSelectedTab(id){
    this.selectedTab = id;
  }
  addQuestion(){
    let newEval = {
      id: '',
      question: this.question,
      status: 'Active',
    }
    this.evaluate.addQuestion(newEval).then(res=>{
      newEval.id = res.id;
      this.evaluate.updateEval(newEval);
      this.modalService.dismissAll();
      this.question = null;
      this.toastr.success("Question Added!");
    })
  }
  updateQuestion() {
    console.log(this.editQuestionaire);
    this.evaluate.updateEval(this.editQuestionaire);
    this.modalService.dismissAll();
    this.question = null;
    this.toastr.success("Question Updated!");
  }
  toggleStatus(id){
    console.log('sdfsdf');
    console.log(id);
    if(id===1){
      this.editQuestionaire.status = 'Active';
    } else{
      this.editQuestionaire.status = 'Inactive'
    }
  }
  openModal(content) {
    this.modalService.open(content, {
      size: 'lg',
      centered: true
    });
  }
  editModal(content, data) {
    this.editQuestionaire = data;
    this.modalService.open(content, {
      size: 'lg',
      centered: true
    });
  }
}

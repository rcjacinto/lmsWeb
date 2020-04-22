import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ToastrService } from "ngx-toastr";

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
  constructor(
    private config: NgbModalConfig,
    private evaluate: EvaluationService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    ) { }

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

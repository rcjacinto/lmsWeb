import { Component, OnInit, Input } from "@angular/core";
import { ChartOptions, ChartType } from "chart.js";
import { Label } from "ng2-charts";
import { Activity } from "src/app/models/activity.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Question } from "src/app/models/question.model";
import { Submit } from "src/app/models/submit.model";
import { ClassService } from "src/app/services/class.service";
import { Class } from "src/app/models/class.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-activity",
  templateUrl: "./view-activity.component.html",
  styleUrls: ["./view-activity.component.scss"]
})
export class ViewActivityComponent implements OnInit {
  @Input() activity: Activity;
  @Input() submits: Submit[];
  @Input() selectedClass: Class;
  selectedQuestion: Question;
  studentCount = 0;
  unsubmitted = 0;
  submitted = 0;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: "top"
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        }
      }
    }
  };
  public pieChartLabels: Label[] = ["Passed", "Failed", "Unsubmitted"];
  public pieChartData: number[] = [0, 0, 0];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [
        "rgb(23, 206, 23)",
        "rgb(207, 73, 73)",
        "rgb(153, 153, 153)"
      ]
    }
  ];
  constructor(private modalService: NgbModal, private router: Router) {}

  ngOnInit() {
    console.log(this.selectedClass);
    this.studentCount = this.selectedClass.members.length;
    let passed = 0;
    let failed = 0;
    this.submitted = this.submits.length;
    this.unsubmitted = this.studentCount - this.submitted;
    this.submits.forEach(submit => {
      if (submit.score > submit.total_items / 2) {
        passed++;
      } else {
        failed++;
      }
    });
    this.pieChartData = [passed, failed, this.unsubmitted];
  }

  public chartClicked({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  removeSlice() {
    this.pieChartLabels.pop();
    this.pieChartData.pop();
    this.pieChartColors[0].backgroundColor.pop();
  }

  changeLegendPosition() {
    this.pieChartOptions.legend.position =
      this.pieChartOptions.legend.position === "left" ? "top" : "left";
  }

  openModal(content, question: Question) {
    this.selectedQuestion = question;
    this.modalService.open(content, {
      centered: true
    });
  }

  getCorrectPercent(question: Question) {
    let correct = 0;
    this.submits.forEach(submit => {
      submit.activity.questions.forEach(q => {
        if (question.number == q.number) {
          if (q.answer.isCorrect) {
            correct++;
          }
        }
      });
    });
    if (this.submitted == 0) {
      return 0;
    }
    return Math.round((correct / this.submitted) * 100);
  }

  getCorrectCount(question: Question) {
    let correct = 0;
    this.submits.forEach(submit => {
      submit.activity.questions.forEach(q => {
        if (question.number == q.number) {
          if (q.answer.isCorrect) {
            correct++;
          }
        }
      });
    });
    if (this.submitted == 0) {
      return 0;
    }
    return correct;
  }

  getInCorrectPercent(question: Question) {
    let incorrect = 0;
    this.submits.forEach(submit => {
      submit.activity.questions.forEach(q => {
        if (question.number == q.number) {
          if (!q.answer.isCorrect) {
            incorrect++;
          }
        }
      });
    });
    if (this.submitted == 0) {
      return 0;
    }
    return Math.round((incorrect / this.submitted) * 100);
  }

  getInCorrectCount(question: Question) {
    let incorrect = 0;
    this.submits.forEach(submit => {
      submit.activity.questions.forEach(q => {
        if (question.number == q.number) {
          if (!q.answer.isCorrect) {
            incorrect++;
          }
        }
      });
    });
    if (this.submitted == 0) {
      return 0;
    }
    return incorrect;
  }

  viewActivity(submit) {
    this.router.navigate(["/view-student-activity"], {
      queryParams: { submit: JSON.stringify(submit) }
    });
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { Activity } from 'src/app/models/activity.model';
import { Options } from 'ng5-slider';
import { Question } from 'src/app/models/question.model';
import { User } from 'src/app/models/user.model';
import { select, Store } from '@ngrx/store';
import { selectUser, selectClass, RootState } from 'src/app/store';
import { Class } from 'src/app/models/class.model';
import { ActivityService } from 'src/app/services/activity.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/posts.model';

@Component({
  selector: 'app-update-activity',
  templateUrl: './update-activity.component.html',
  styleUrls: ['./update-activity.component.scss']
})
export class UpdateActivityComponent implements OnInit {
  @Input() activity: Activity;
  @Input() back;
  userData$ = this.store.pipe(select(selectUser));
  selectedClassData$ = this.store.pipe(select(selectClass));
  selectedClass: Class;
  user: User;
  loading = false;
  editing = false;
  index = 0;

  question: Question = {
    type: '',
    number: 1,
    options: [],
    points: 1,
    text: ''
  };

  mcOptions = [
    {
      key: 'A',
      value: '',
      isCorrect: true
    },
    {
      key: 'B',
      value: '',
      isCorrect: false
    },
    {
      key: 'C',
      value: '',
      isCorrect: false
    },
    {
      key: 'D',
      value: '',
      isCorrect: false
    }
  ];

  tofCorrectAnswer = {
    key: 'answer',
    value: 'true',
    isCorrect: true
  };

  saAnswer = {
    key: 'answer',
    value: '',
    isCorrect: true
  };

  options: Options = {
    floor: 10,
    ceil: 120,
    step: 5,
    getPointerColor: () => {
      return '#222222';
    },
    getSelectionBarColor: () => {
      return '#ffffff';
    },
    translate: (value: number): string => {
      return `<span class="text-light">${value} mins</span>`;
    },
    ticksTooltip: (value: number): string => {
      return value + ' mins';
    }
  };
  constructor(
    private activityService: ActivityService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private store: Store<RootState>,
    private postService: PostsService
  ) {
    this.userData$.subscribe(user => {
      this.user = user;
    });
    this.selectedClassData$.subscribe(sClass => {
      this.selectedClass = sClass;
    });
  }

  ngOnInit() {
    console.log(this.activity);

    this.question = {
      type: 'mc',
      number: this.activity.questions.length + 1,
      options: [],
      points: 1,
      text: ''
    };
  }

  addQuestion() {
    let error = false;
    if (
      this.question.number == null ||
      this.question.points == null ||
      this.question.text.trim() == ''
    ) {
      return this.toastr.error('Please fill all fields');
    }

    if (this.question.type == 'mc') {
      this.mcOptions.forEach(opt => {
        console.log(opt);
        if (opt.value.trim() == '') {
          error = true;
          return false;
        }
      });

      if (!error) {
        this.question.options = [...this.mcOptions];
        this.activity.questions.push(JSON.parse(JSON.stringify(this.question)));
        console.log(this.activity.questions);
        this.clearQuestionFields();
        this.toastr.success('Question added');
        this.sortQuestions();
      } else {
        this.toastr.error('Please fill all the options');
      }
    } else if (this.question.type == 'sa') {
      if (this.saAnswer.value.trim() == '') {
        error = true;
      }

      if (!error) {
        this.question.options.push(this.saAnswer);
        this.activity.questions.push(JSON.parse(JSON.stringify(this.question)));
        this.clearQuestionFields();
        this.toastr.success('Question added');
        this.sortQuestions();
      } else {
        this.toastr.error('Please fill all fields');
      }
    } else if (this.question.type == 'tof') {
      this.question.options.push(this.tofCorrectAnswer);
      this.activity.questions.push(JSON.parse(JSON.stringify(this.question)));
      this.sortQuestions();
      this.clearQuestionFields();
      this.toastr.success('Question added');
    }
  }

  saveActivity(status) {
    if (this.activity.deadline === undefined) {
      return this.toastr.error('Please select date for the deadline');
    }
    const newDeadline = `${this.activity.deadline.year}-${this.activity.deadline.month}-${this.activity.deadline.day} 11:59 PM`;
    console.log(new Date(newDeadline));

    if (
      this.activity.title.trim() == '' ||
      this.activity.instruction.trim() == '' ||
      this.activity.term.trim() == ''
    ) {
      return this.toastr.error('Please fill all fields');
    }

    if (status > 0 && this.activity.status == 0) {
      const newPost: Post = {
        id: '',
        attachments: [],
        message: '',
        posted_by: this.user,
        posted_to: this.selectedClass,
        type: 3,
        date: {
          created: new Date(),
          modified: new Date()
        },
        activity: this.activity
      };

      this.postService.addPost(newPost);
    }

    this.activity.status = status;

    if (this.activity.questions.length > 0) {
      this.spinner.show();
      this.activityService
        .updateActivity(this.activity)
        .then(res => {
          this.toastr.success('Activity added Successfully');

          this.spinner.hide();
          this.back();
        })
        .catch(err => {
          this.toastr.error(err);
          this.spinner.hide();
        });
    } else {
      this.toastr.error('No Questions added');
    }
  }

  setAsCorrectAnswer(index) {
    this.mcOptions.forEach(opts => {
      opts.isCorrect = false;
    });
    this.mcOptions[index].isCorrect = true;
  }

  clearQuestionFields() {
    this.clearQuestion();

    this.mcOptions = [
      {
        key: 'A',
        value: '',
        isCorrect: true
      },
      {
        key: 'B',
        value: '',
        isCorrect: false
      },
      {
        key: 'C',
        value: '',
        isCorrect: false
      },
      {
        key: 'D',
        value: '',
        isCorrect: false
      }
    ];

    this.tofCorrectAnswer = {
      key: 'answer',
      value: 'true',
      isCorrect: true
    };

    this.saAnswer = {
      key: 'answer',
      value: '',
      isCorrect: true
    };
  }

  sortQuestions() {
    this.activity.questions.sort((a, b) => {
      return a.number - b.number;
    });
  }

  convertToDate(date) {
    return new Date(date * 1000);
  }

  editQuestion(question, i) {
    console.log(question);

    this.editing = true;
    this.setQuestion(question);
    switch (question.type) {
      case 'mc':
        this.mcOptions = question.options;
        this.mcOptions.forEach(opt => {
          const radio = document.getElementById(opt.key) as HTMLInputElement;
          radio.checked = opt.isCorrect;
        });
        break;
      case 'sa':
        this.saAnswer = question.options[0];
        break;
      case 'tof':
        this.tofCorrectAnswer = question.options[0];
        break;
      default:
        break;
    }
    this.index = i;
  }

  deleteQuestion(i) {
    this.activity.questions.splice(i, 1);
  }

  updateQuestion() {
    this.editing = false;
    this.clearQuestion();
    this.toastr.success('Question updated');
  }

  cancelUpdate() {
    this.editing = false;
  }

  setQuestion(question) {
    this.question = question;
  }

  clearQuestion() {
    this.question = {
      type: 'mc',
      number: this.activity.questions.length + 1,
      options: [],
      points: 1,
      text: ''
    };

    this.mcOptions = [
      {
        key: 'A',
        value: '',
        isCorrect: true
      },
      {
        key: 'B',
        value: '',
        isCorrect: false
      },
      {
        key: 'C',
        value: '',
        isCorrect: false
      },
      {
        key: 'D',
        value: '',
        isCorrect: false
      }
    ];

    this.tofCorrectAnswer = {
      key: 'answer',
      value: 'true',
      isCorrect: true
    };

    this.saAnswer = {
      key: 'answer',
      value: '',
      isCorrect: true
    };
  }
}

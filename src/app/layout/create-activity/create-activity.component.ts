import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { Question } from '../../models/question.model';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { selectUser, RootState, selectClass } from 'src/app/store';
import { User } from 'src/app/models/user.model';
import { Class } from 'src/app/models/class.model';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/posts.model';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  selectedClassData$ = this.store.pipe(select(selectClass));
  selectedClass: Class;
  user: User;
  activityType = 'quiz';
  title = '';
  term = 'prelim';
  instruction = '';
  timeLimit = 10;
  deadline: any;
  questions: Question[] = [];
  question: Question = {
    type: 'mc',
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

  ngOnInit() {}

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
        this.questions.push(JSON.parse(JSON.stringify(this.question)));
        console.log(this.questions);
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
        this.questions.push(JSON.parse(JSON.stringify(this.question)));
        this.clearQuestionFields();
        this.toastr.success('Question added');
        this.sortQuestions();
      } else {
        this.toastr.error('Please fill all fields');
      }
    } else if (this.question.type == 'tof') {
      this.question.options.push(this.tofCorrectAnswer);
      this.questions.push(JSON.parse(JSON.stringify(this.question)));
      this.sortQuestions();
      this.clearQuestionFields();
      this.toastr.success('Question added');
    }
  }

  saveActivity(status) {
    if (this.deadline === undefined) {
      return this.toastr.error('Please select date for the deadline');
    }
    const newDeadline = `${this.deadline.year}-${this.deadline.month}-${this.deadline.day} 11:59 PM`;
    console.log(new Date(newDeadline));

    if (
      this.title.trim() == '' ||
      this.instruction.trim() == '' ||
      this.term.trim() == ''
    ) {
      return this.toastr.error('Please fill all fields');
    }

    if (this.questions.length > 0) {
      const newActivity: Activity = {
        type: this.activityType,
        instruction: this.instruction,
        questions: this.questions,
        term: this.term,
        time_limit: this.timeLimit,
        title: this.title,
        class: {
          name: this.selectedClass.name,
          id: this.selectedClass.id
        },
        instructor: {
          name: this.user.name.first + ' ' + this.user.name.last,
          id: this.user.id
        },
        date: {
          created: new Date(),
          modified: new Date()
        },
        deadline: new Date(newDeadline),
        status
      };

      this.spinner.show();
      this.activityService
        .addActivity(newActivity)
        .then(res => {
          this.toastr.success('Activity added Successfully');
          this.clearActivityFields();
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
            activity: newActivity
          };

          this.postService.addPost(newPost);
          this.spinner.hide();
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
    this.question = {
      type: 'mc',
      number: this.questions.length + 1,
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

  clearActivityFields() {
    this.title = '';
    this.term = 'prelim';
    this.activityType = 'quiz';
    this.instruction = '';
    this.timeLimit = 10;
    this.questions = [];
  }

  sortQuestions() {
    this.questions.sort((a, b) => {
      return a.number - b.number;
    });
  }
}

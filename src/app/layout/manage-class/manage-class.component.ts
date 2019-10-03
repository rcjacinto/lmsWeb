import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { User } from 'src/app/models/user.model';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-class',
  templateUrl: './manage-class.component.html',
  styleUrls: ['./manage-class.component.scss']
})
export class ManageClassComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  user: User;
  loading: boolean;
  classList: Class[];
  selectedClass: Class;
  constructor(
    private store: Store<RootState>,
    private classService: ClassService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.loading = true;
    this.userData$.subscribe(user => {
      this.user = user;
      this.classService.getAllclasses(this.user.id).subscribe(list => {
        this.classList = list;
        this.loading = false;
      });
    });
  }

  ngOnInit() {}

  setSelectedClass(content, classInfo) {
    this.selectedClass = JSON.parse(JSON.stringify(classInfo));
    this.modalService.open(content, {
      centered: true
    });
  }

  updateClass() {
    this.spinner.show();
    this.classService.updateClass(this.selectedClass).then(res => {
      this.spinner.hide();
      this.toastr.success('Class Updated!');
      this.modalService.dismissAll();
    });
  }
}

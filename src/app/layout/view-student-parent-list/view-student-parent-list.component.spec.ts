import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentParentListComponent } from './view-student-parent-list.component';

describe('ViewStudentParentListComponent', () => {
  let component: ViewStudentParentListComponent;
  let fixture: ComponentFixture<ViewStudentParentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStudentParentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentParentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

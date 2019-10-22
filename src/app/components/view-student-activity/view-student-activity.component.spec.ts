import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentActivityComponent } from './view-student-activity.component';

describe('ViewStudentActivityComponent', () => {
  let component: ViewStudentActivityComponent;
  let fixture: ComponentFixture<ViewStudentActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStudentActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

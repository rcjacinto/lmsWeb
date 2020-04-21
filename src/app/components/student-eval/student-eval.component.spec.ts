import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEvalComponent } from './student-eval.component';

describe('StudentEvalComponent', () => {
  let component: StudentEvalComponent;
  let fixture: ComponentFixture<StudentEvalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentEvalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

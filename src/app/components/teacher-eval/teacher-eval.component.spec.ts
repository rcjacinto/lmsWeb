import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherEvalComponent } from './teacher-eval.component';

describe('TeacherEvalComponent', () => {
  let component: TeacherEvalComponent;
  let fixture: ComponentFixture<TeacherEvalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherEvalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

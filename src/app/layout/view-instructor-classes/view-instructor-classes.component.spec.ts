import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInstructorClassesComponent } from './view-instructor-classes.component';

describe('ViewInstructorClassesComponent', () => {
  let component: ViewInstructorClassesComponent;
  let fixture: ComponentFixture<ViewInstructorClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInstructorClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInstructorClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

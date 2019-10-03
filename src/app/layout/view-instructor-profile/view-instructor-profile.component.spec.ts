import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInstructorProfileComponent } from './view-instructor-profile.component';

describe('ViewInstructorProfileComponent', () => {
  let component: ViewInstructorProfileComponent;
  let fixture: ComponentFixture<ViewInstructorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInstructorProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInstructorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

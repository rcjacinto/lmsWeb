import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageParentsComponent } from './manage-parents.component';

describe('ManageParentsComponent', () => {
  let component: ManageParentsComponent;
  let fixture: ComponentFixture<ManageParentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageParentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

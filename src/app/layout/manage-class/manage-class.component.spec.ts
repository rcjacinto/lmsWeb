import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClassComponent } from './manage-class.component';

describe('ManageClassComponent', () => {
  let component: ManageClassComponent;
  let fixture: ComponentFixture<ManageClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

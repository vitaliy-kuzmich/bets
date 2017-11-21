import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackErrorComponent } from './snack-error.component';

describe('SnackErrorComponent', () => {
  let component: SnackErrorComponent;
  let fixture: ComponentFixture<SnackErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

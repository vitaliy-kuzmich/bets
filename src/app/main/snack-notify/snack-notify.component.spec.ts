import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SnackNotifyComponent} from './snack-notify.component';

describe('SnackNotifyComponent', () => {
  let component: SnackNotifyComponent;
  let fixture: ComponentFixture<SnackNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnackNotifyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

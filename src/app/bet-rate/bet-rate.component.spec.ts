import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetRateComponent } from './bet-rate.component';

describe('BetRateComponent', () => {
  let component: BetRateComponent;
  let fixture: ComponentFixture<BetRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

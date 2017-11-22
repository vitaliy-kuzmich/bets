import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetDetailComponent } from './bet-detail.component';

describe('BetDetailComponent', () => {
  let component: BetDetailComponent;
  let fixture: ComponentFixture<BetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

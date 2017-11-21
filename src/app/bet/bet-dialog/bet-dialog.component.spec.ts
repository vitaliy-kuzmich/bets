import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetDialogComponent } from './bet-dialog.component';

describe('BetDialogComponent', () => {
  let component: BetDialogComponent;
  let fixture: ComponentFixture<BetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

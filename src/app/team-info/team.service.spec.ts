import {inject, TestBed} from '@angular/core/testing';

import {TeamService} from './team.service';

describe('TeamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamService]
    });
  });

  it('should be created', inject([TeamService], (service: TeamService) => {
    expect(service).toBeTruthy();
  }));
});

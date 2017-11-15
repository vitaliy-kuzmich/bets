import {TestBed, inject} from '@angular/core/testing';
import Web3 from 'web3';

import {Web3MetaService} from './web3.service';

import metacoin_artifacts from '../../../build/contracts/MetaCoin.json';

declare let window: any;

describe('Web3MetaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3MetaService]
    });
  });

  it('should be created', inject([Web3MetaService], (service: Web3MetaService) => {
    expect(service).toBeTruthy();
  }));

  it('should inject a default web3 on a contract', inject([Web3MetaService], (service: Web3MetaService) => {
    service.bootstrapWeb3();

    return service.artifactsToContract(metacoin_artifacts).then((abstraction) => {
      expect(abstraction.currentProvider.host).toBe('http://localhost:8545');
    });
  }));

  it('should inject a the window web3 on a contract', inject([Web3MetaService], (service: Web3MetaService) => {
    window.web3 = {
      currentProvider: new Web3.providers.HttpProvider('http://localhost:1337')
    };

    service.bootstrapWeb3();

    return service.artifactsToContract(metacoin_artifacts).then((abstraction) => {
      expect(abstraction.currentProvider.host).toBe('http://localhost:1337');
    });
  }));
});

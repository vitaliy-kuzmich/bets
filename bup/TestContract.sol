pragma solidity ^0.4.0;


contract TestContract {
  struct TT {
  uint number;
  }

  TT  [] arr;

  function setT1(uint num) public returns (uint result){
    result =  arr.push(TT({number : num}));
  }

  function getLen() public returns (uint) {
    return arr.length;

  }

  function getS(uint index) public returns (uint){
    return arr[index].number;
  }


}

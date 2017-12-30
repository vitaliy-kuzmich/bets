
The history of this project simple. There were some client that asked me to implement sports bets on ethereum (solidity)smart contracts.
But after I've implemented the last part we agreed, client told that he requested only 1/4 of all project, and did not pay for the last part. At really he asked to make 3/4 of the project.
Since I did not sign any NDA and client broke our voice agreement, I have rights for this project. Thats all.

Architecture:
- UI should be integrated with public backend(which is not implemented), and use bet function from smart contract. Bet event should be added.
- DAPP solidity smart contract
- isolated backend, that acting as a simple wrapper around smart contract. 
- public backend, which is not implemented. Should interact with UI and isolated backend.

Details:
It should create games in the blockchain on demand, to prevent losing on not pupular games. Also DAPP Game creation should be protected by captcha.


There is only 3/4 of overall project ready. This repo contains smart contract and UI code. Isolated backend : https://github.com/vitaliy-kuzmich/bets-backend


This is free software.  

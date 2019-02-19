import { keccak512 } from 'js-sha3';

// Aion Wallet Privatekey
export const privateKey = '0x336c5c68d75010d738f620fb21a04cc56234d76a7b5d9ca3088708f1c45b3161a75d1c6e59833fad80ba02cc8010c4a99787a0859941613a7ccadf9c51c15c3a';
export const password = 'kush1234';
export const token = keccak512(password);

export const encryptWallet = '���6781121e-e926-4084-8a12-eb0db5dc3d46�@a0aa6d40d962ef60d6c42da54adec24f242de46f27d2ea3d96f0ccefa5678b62�J�G�aes-128-ctr��36ece67c027a6bafc705245c0e85d9d53f857b3166322e93b3962577185389d5ab2f9e10ee0b73e9d14f8dc9beca133ce3e4d9d975d4fe55359831e87ac9f42c�scrypt�@2852e3ec5ca446533132aedbdf57ca9697c0f5d41cff7f897b7afb6a95720d56��131546a09a06dc31249e99608dc42044�K�I� � ';

export const transaction = {
  data: '0x123456',
  gas: '0x52c8',
  gasPrice: '0x2ad741300',
  nonce: '0x6',
  timestamp: 1541785051709000,
  to: '0xa0130e8bef33916c224f8b45b32bff5ffc5ccff1b875cf7606fdcb620aa9e0f0',
  type: '0x1',
  value: '0x3782dace9d90000',
};

export const mockSignData = {
  message: '0x123456',
  messageHash: '0x08d4f777dea0ff18b173740f02a89917f2d3b107bec1cbfef466f3ce8118d1e3',
  signature:
    '0xa75d1c6e59833fad80ba02cc8010c4a99787a0859941613a7ccadf9c51c15c3ad79e0726965e7c2450ece8a23814a9f29c3a1409f88bff0511263e1bb3c34b4480f4d59db559e624acafa77961c872e3464f40700dd38f648549cb17f822ef0e',
};
export const wallet = {
  privateKey:
    '0x336c5c68d75010d738f620fb21a04cc56234d76a7b5d9ca3088708f1c45b3161a75d1c6e59833fad80ba02cc8010c4a99787a0859941613a7ccadf9c51c15c3a',
  address: '0xa0aa6d40d962ef60d6c42da54adec24f242de46f27d2ea3d96f0ccefa5678b62',
};

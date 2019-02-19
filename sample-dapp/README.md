To run ether or test html 

python -m SimpleHTTPServer 8000

ether - is on ethereum use metamask 

test - use aiwa 

To launch contracts on aion 

personal.unlockAccount ('address', 'password', 'seconds')
- returns true

eth.compile.solidity('solidity code')

for abi 
eth.compile.solidity('solidity code').Counter.code.abiDefinition


eth.contract(abi).new({from: owner, data: code, gasPrice: 10000000000, gas: 5000000});

var simpleContract, simple, contractAddr;

window.onload = () => {
    simpleContract = aionweb3.eth.contract(
        [
            {
                "outputs": [],
                "constant": false,
                "payable": true,
                "inputs": [],
                "name": "pay",
                "type": "function"
            },
            {
                "outputs": [],
                "constant": false,
                "payable": false,
                "inputs": [],
                "name": "incrementCounter",
                "type": "function"
            },
            {
                "outputs": [
                    {
                        "name": "",
                        "type": "int128"
                    }
                ],
                "constant": true,
                "payable": false,
                "inputs": [],
                "name": "getCount",
                "type": "function"
            },
            {
                "outputs": [],
                "constant": false,
                "payable": false,
                "inputs": [],
                "name": "decrementCounter",
                "type": "function"
            },
            {
                "outputs": [],
                "payable": false,
                "inputs": [
                    {
                        "name": "_initCount",
                        "type": "int128"
                    }
                ],
                "name": "",
                "type": "constructor"
            },
            {
                "outputs": [],
                "inputs": [
                    {
                        "indexed": false,
                        "name": "counter",
                        "type": "bool"
                    }
                ],
                "name": "CounterIncreased",
                "anonymous": false,
                "type": "event"
            },
            {
                "outputs": [],
                "inputs": [
                    {
                        "indexed": false,
                        "name": "counter",
                        "type": "bool"
                    }
                ],
                "name": "CounterDecreased",
                "anonymous": false,
                "type": "event"
            }
        ]
    ) // getting the abi to get the contract instance
    
    simple = simpleContract.at("0xa0c2e4ea426762de0676686ca7265ddc29c406dcd50125eeff2f71d5d7089325") //sets contract instance
    contractAddr = "0xa0c2e4ea426762de0676686ca7265ddc29c406dcd50125eeff2f71d5d7089325"

    tokenContract = aionweb3.eth.contract(
        [
            {
              outputs: [{ name: '', type: 'string' }],
              constant: true,
              payable: false,
              inputs: [],
              name: 'name',
              type: 'function'
            },
            {
              outputs: [{ name: '', type: 'uint128' }],
              constant: true,
              payable: false,
              inputs: [],
              name: 'liquidSupply',
              type: 'function'
            },
            {
              outputs: [{ name: '', type: 'uint128' }],
              constant: true,
              payable: false,
              inputs: [],
              name: 'totalSupply',
              type: 'function'
            },
            {
              outputs: [{ name: '', type: 'address' }],
              constant: true,
              payable: false,
              inputs: [],
              name: 'specialAddress',
              type: 'function'
            },
            {
              outputs: [{ name: '', type: 'uint8' }],
              constant: true,
              payable: false,
              inputs: [],
              name: 'decimals',
              type: 'function'
            },
            {
              outputs: [{ name: '', type: 'uint128' }],
              constant: true,
              payable: false,
              inputs: [],
              name: 'granularity',
              type: 'function'
            },
            {
              outputs: [],
              constant: false,
              payable: false,
              inputs: [
                { name: '_foreignNetworkId', type: 'bytes32' },
                { name: '_recipient', type: 'address' },
                { name: '_amount', type: 'uint128' },
                { name: '_foreignData', type: 'bytes' }
              ],
              name: 'thaw',
              type: 'function'
            },
            {
              outputs: [],
              constant: false,
              payable: false,
              inputs: [
                { name: '_from', type: 'address' },
                { name: '_to', type: 'address' },
                { name: '_amount', type: 'uint128' },
                { name: '_userData', type: 'bytes' },
                { name: '_operatorData', type: 'bytes' }
              ],
              name: 'operatorSend',
              type: 'function'
            },
            {
              outputs: [{ name: '', type: 'uint128' }],
              constant: true,
              payable: false,
              inputs: [{ name: '_tokenHolder', type: 'address' }],
              name: 'balanceOf',
              type: 'function'
            },
            {
              outputs: [{ name: '', type: 'address' }],
              constant: true,
              payable: false,
              inputs: [],
              name: 'registry',
              type: 'function'
            },
            {
              outputs: [{ name: 'success', type: 'bool' }],
              constant: false,
              payable: false,
              inputs: [
                { name: '_from', type: 'address' },
                { name: '_to', type: 'address' },
                { name: '_amount', type: 'uint128' }
              ],
              name: 'transferFrom',
              type: 'function'
            },
            {
              outputs: [{ name: 'success', type: 'bool' }],
              constant: false,
              payable: false,
              inputs: [{ name: '_spender', type: 'address' }, { name: '_amount', type: 'uint128' }],
              name: 'approve',
              type: 'function'
            },
            {
              outputs: [],
              constant: false,
              payable: false,
              inputs: [{ name: '_operator', type: 'address' }],
              name: 'authorizeOperator',
              type: 'function'
            },
            {
              outputs: [{ name: '', type: 'string' }],
              constant: true,
              payable: false,
              inputs: [],
              name: 'symbol',
              type: 'function'
            },
            {
              outputs: [],
              constant: false,
              payable: false,
              inputs: [{ name: '_registry', type: 'address' }],
              name: 'setRegistry',
              type: 'function'
            },
            {
              outputs: [],
              constant: false,
              payable: false,
              inputs: [
                { name: '_tokenHolder', type: 'address' },
                { name: '_amount', type: 'uint128' },
                { name: '_holderData', type: 'bytes' },
                { name: '_operatorData', type: 'bytes' }
              ],
              name: 'operatorBurn',
              type: 'function'
            },
            {
              outputs: [{ name: '', type: 'bool' }],
              constant: true,
              payable: false,
              inputs: [{ name: '_operator', type: 'address' }, { name: '_tokenHolder', type: 'address' }],
              name: 'isOperatorFor',
              type: 'function'
            },
            {
              outputs: [{ name: 'remaining', type: 'uint128' }],
              constant: true,
              payable: false,
              inputs: [{ name: '_owner', type: 'address' }, { name: '_spender', type: 'address' }],
              name: 'allowance',
              type: 'function'
            },
            {
              outputs: [],
              constant: false,
              payable: false,
              inputs: [
                { name: '_to', type: 'address' },
                { name: '_amount', type: 'uint128' },
                { name: '_userData', type: 'bytes' }
              ],
              name: 'send',
              type: 'function'
            },
            {
              outputs: [],
              constant: false,
              payable: false,
              inputs: [
                { name: '_foreignNetworkId', type: 'bytes32' },
                { name: '_foreignRecipient', type: 'bytes32' },
                { name: '_amount', type: 'uint128' },
                { name: '_localData', type: 'bytes' }
              ],
              name: 'freeze',
              type: 'function'
            },
            {
              outputs: [],
              constant: false,
              payable: false,
              inputs: [{ name: '_amount', type: 'uint128' }, { name: '_holderData', type: 'bytes' }],
              name: 'burn',
              type: 'function'
            },
            {
              outputs: [],
              constant: false,
              payable: false,
              inputs: [{ name: '_operator', type: 'address' }],
              name: 'revokeOperator',
              type: 'function'
            },
            {
              outputs: [{ name: 'success', type: 'bool' }],
              constant: false,
              payable: false,
              inputs: [{ name: '_to', type: 'address' }, { name: '_amount', type: 'uint128' }],
              name: 'transfer',
              type: 'function'
            },
            {
              outputs: [],
              payable: false,
              inputs: [
                { name: '_name', type: 'string' },
                { name: '_symbol', type: 'string' },
                { name: '_granularity', type: 'uint128' },
                { name: '_totalSupply', type: 'uint128' },
                { name: '_specialAddress', type: 'address' }
              ],
              name: '',
              type: 'constructor'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: '_foreignNetworkId', type: 'bytes32' },
                { indexed: true, name: '_recipient', type: 'address' },
                { indexed: true, name: '_amount', type: 'uint128' },
                { indexed: false, name: '_foreignData', type: 'bytes' }
              ],
              name: 'Thaw',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: '_foreignNetworkId', type: 'bytes32' },
                { indexed: true, name: '_foreignRecipient', type: 'bytes32' },
                { indexed: true, name: '_amount', type: 'uint128' },
                { indexed: false, name: '_localData', type: 'bytes' }
              ],
              name: 'Freeze',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [{ indexed: true, name: '_registry', type: 'address' }],
              name: 'RegistrySet',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: 'from', type: 'address' },
                { indexed: true, name: 'to', type: 'address' },
                { indexed: false, name: 'value', type: 'uint128' }
              ],
              name: 'Transfer',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: 'owner', type: 'address' },
                { indexed: true, name: 'spender', type: 'address' },
                { indexed: false, name: 'value', type: 'uint128' }
              ],
              name: 'Approval',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: '_totalSupply', type: 'uint128' },
                { indexed: true, name: '_specialAddress', type: 'address' }
              ],
              name: 'Created',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: '_operator', type: 'address' },
                { indexed: true, name: '_from', type: 'address' },
                { indexed: true, name: '_to', type: 'address' },
                { indexed: false, name: '_amount', type: 'uint128' },
                { indexed: false, name: '_holderData', type: 'bytes' },
                { indexed: false, name: '_operatorData', type: 'bytes' }
              ],
              name: 'Sent',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: '_operator', type: 'address' },
                { indexed: true, name: '_to', type: 'address' },
                { indexed: false, name: '_amount', type: 'uint128' },
                { indexed: false, name: '_operatorData', type: 'bytes' }
              ],
              name: 'Minted',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: '_operator', type: 'address' },
                { indexed: true, name: '_from', type: 'address' },
                { indexed: false, name: '_amount', type: 'uint128' },
                { indexed: false, name: '_holderData', type: 'bytes' },
                { indexed: false, name: '_operatorData', type: 'bytes' }
              ],
              name: 'Burned',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: '_operator', type: 'address' },
                { indexed: true, name: '_tokenHolder', type: 'address' }
              ],
              name: 'AuthorizedOperator',
              anonymous: false,
              type: 'event'
            },
            {
              outputs: [],
              inputs: [
                { indexed: true, name: '_operator', type: 'address' },
                { indexed: true, name: '_tokenHolder', type: 'address' }
              ],
              name: 'RevokedOperator',
              anonymous: false,
              type: 'event'
            }
          ]
    ) // token abi for instance
    token = tokenContract.at("0xa0c7ab5b2b68ac5c32b4e2d09ca57bf487b9c7948236f2e9edea4b48862cc922"); //gets token contract instance
}



$('#getCounter').click(() => {
    count = simple.getCount(); //instance then function name
    document.getElementById('counterResult').innerHTML=count;
});



$('#increment').on('click', async () => {
    const txHash = await simple.incrementCounter(); //async function, instance then function name
    document.getElementById('incremmentResult').innerHTML=txHash
});



$('#decrement').on('click', async () => {
    const txHash = await simple.decrementCounter(); //async function, instance then function name
    document.getElementById('decrementResult').innerHTML=txHash
});


$('#pay').on('click', async () => {
    const txHash = await simple.pay({ value: (1 * 10 ** 16) }); //instance, function name then params (value)
    document.getElementById('payResult').innerHTML=txHash
});


$('#contract').on('click', async () => {
    const code = "0x605060405234156100105760006000fd5b604051601080610201833981016040528080519060100190919050505b3360016000508282909180600101839055555050508060006000508190909055505b50610055565b61019d806100646000396000f30060506040526000356c01000000000000000000000000900463ffffffff1680631b9265b8146100545780635b34b9661461005e578063a87d942c14610074578063f5c5ad831461009e5761004e565b60006000fd5b61005c6100b4565b005b341561006a5760006000fd5b6100726100b7565b005b34156100805760006000fd5b61008861010b565b6040518082815260100191505060405180910390f35b34156100aa5760006000fd5b6100b261011d565b005b5b565b6001600060008282825054019250508190909055507f6816b015b746c8c8f573c271468a9bb4b1f0cb04ff12291673f7d2320a4901f76001604051808215151515815260100191505060405180910390a15b565b6000600060005054905061011a565b90565b6001600060008282825054039250508190909055507f09a2ae7b00cae5ecb77463403c1d5d6c03cf6db222a78e22cbcafbe0a1ac9eec6001604051808215151515815260100191505060405180910390a15b5600a165627a7a72305820b3dab74470811e4252fee5953b4a99410ba278e1370fe7299a1bbcea006eaee90029"
    //compiled byte code 
    const tx = { data: code, gas: 51000 }; // bundling it into a transaction object
    const txHash = await aionweb3.eth.sendTransaction(tx); //sending object
    document.getElementById('contractResult').innerHTML=txHash;
});

$('#sign').on('click', async () => {
    const signedMsg = await aionweb3.eth.sign(aionweb3.eth.accounts[0], "0x123456"); 
    document.getElementById('signResult').innerHTML="signed message " + signedMsg.signature;
});

$('#signTransaction').on('click', async () => {
    const tx = { to: '0xa020f60b3f4aba97b0027ca81c5d20c9898d7c43a50359d209596b86e8ce3ca2', gas: 21000, value: 0, data: "0x123456" };
    const signedTx = await aionweb3.eth.signTransaction(tx)
    document.getElementById('signTxResult').innerHTML="Raw Transaction " + signedTx.rawTransaction
});


$('#sendToken').on('click', async () => {
    const txHash = await token.transfer('0xa0f717ba35f5c539c73e144dbe2cb0a1bf951a93b3dc933ccde97b0100770487', 100); //gets token contract instance, calls transfer method with params.
    document.getElementById('sendTokenResult').innerHTML=txHash
});
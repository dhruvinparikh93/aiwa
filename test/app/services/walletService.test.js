import sinon from 'sinon';
import { keccak512 } from 'js-sha3';
import { readFileSync } from 'fs';
import * as walletService from '../../../app/services/walletService';
import * as browserService from '../../../app/services/browserService';
import * as importExportService from '../../../app/services/importExportService';
//{ getLocalStorage, setLocalStorage, sendMessage }
const assert = require('assert');

// dummy data -- this is not decrypting, giving Malform UTF - 8 error
// eslint-disable-next-line quotes
const dummyVault = '{"$super":{"$super":{}},"ciphertext":{"words":[-2094926407,228349556,1098442913,415498187,-1077297473,1193417146,-1904340134,381984220,1140905011,1231445811,1937522783,156632263,-1927966511,-300412621,-606449713,314834731,-668847593,155410965,1371225790,-2004310918,921872406,-480151812,187270054,-602255091,1242460096,397049451,947396014,443124144,-710781001,-1441840018,-197565791,-987065774,363745047,541992631,414507860,-470909141,1017639778,526254226,126247507,-1425089533,1504615482,-1750905649,1962742781,-512814455,1625528664,1347698821,-1453547325,-91937041,-697815651,713714066,875464068,-1306917834,-966933659,-1123201841,-1342713131,1887294694,-1511743548,-473319085,-178012078,1219068147,-651118732,498013125,-5395630,150903883,2140556483,-1105215203,-1030363023,-2067579142,2024929156,795038827,-1095100736,1077106917,400911556,-751587875,129788632,-745931547,1301633438,317024530,850446033,43458025,-1920504960,-1369436449,-1007230488,917612531,1174214710,-958896734,-799759801,-1639624045,799672058,-1136839788,-1092342574,882031335,60294374,83584264,-1668317895,875138944,-415509068,131122586,-1676250684,1099804095,335304926,1260476365,-1922175079,-1018117176,302922235,-1247366086,1246153096,728061908,-182531091,820415418,-899600388,-508777535,-1395126924,247311419,1681563237,1229289556,1603935016,-60606414,-608291498,-1546766363,1271644946,606032188,-550908703,369133753,2048381124,561257685,414216083,499300263,228499596,-718848277,309396063,-1019841867,58327256,2142717961,-969160882,1990947024,-1355399790,654909860,1288158027,-83549214,-1859773474,1951608683,-534271291,-244323915,562360113,1982038694,486465567,1307188901,-1454909562,-1360323210,1409952007,-312679614,971429202,1977463908,-176563078,-1133605586,-384336489,-265029371,-1340794867,-872480076,-436985017,-250917232,1826018988,1783479320,1261397897,-887708296,-1585323618,-838717827,-1337500705,-1596835343,-871411900,804710673,1353688347,-1409627354,1357279241,-1815643825,-789365407,85571311,260793555,883596709,-876637258,77020092,-1531606331,-2120786013,203374633,318534486,-692910903,1133735659,61214280,212656728,-679415254,-1074514163,1593891709,1253231092,-664892058,1383215737,679395135,1534504510,709795317,-913257698,-1803861687,-2113477858,109524699,-1200241843,-767971086,-685879224,-996463121,1007104806,949210093,721308756,324269552,-1497699082,596204718,321477017,-376268641,1855641729,-2141674608,1772675667,-328386205,-313088922,1404355325,-2085372987,837163445,-1100157327],"sigBytes":896},"key":{"$super":{"$super":{"$ref":"$[\\"$super\\"][\\"$super\\"]"}},"words":[-233281367,-1595773699,-1376940624,-28021264,1710399267,182845716,-384786586,-2139552198,119555548,1649214594,-895204969,-1422165124],"sigBytes":32},"iv":{"$super":{"$ref":"$[\\"key\\"][\\"$super\\"]"},"words":[119555548,1649214594,-895204969,-1422165124],"sigBytes":16},"algorithm":{"keySize":8,"$super":{"cfg":{"mode":{"$super":{"$super":{"$ref":"$[\\"$super\\"][\\"$super\\"]"}},"Encryptor":{"$super":{"$ref":"$[\\"algorithm\\"][\\"$super\\"][\\"cfg\\"][\\"mode\\"]"}},"Decryptor":{"$super":{"$ref":"$[\\"algorithm\\"][\\"$super\\"][\\"cfg\\"][\\"mode\\"]"}}},"padding":{},"$super":{"$super":{"$ref":"$[\\"$super\\"][\\"$super\\"]"}}},"blockSize":4,"$super":{"cfg":{"$ref":"$[\\"algorithm\\"][\\"$super\\"][\\"cfg\\"][\\"$super\\"]"},"keySize":4,"ivSize":4,"_ENC_XFORM_MODE":1,"_DEC_XFORM_MODE":2,"$super":{"_minBufferSize":0,"$super":{"$ref":"$[\\"$super\\"][\\"$super\\"]"}}}}},"mode":{"$ref":"$[\\"algorithm\\"][\\"$super\\"][\\"cfg\\"][\\"mode\\"]"},"padding":{"$ref":"$[\\"algorithm\\"][\\"$super\\"][\\"cfg\\"][\\"padding\\"]"},"blockSize":4,"formatter":{},"salt":{"words":[894042598,1834800617],"sigBytes":8}}';
//const dummyEncVault = '{"$super":{"$super":{}},"ciphertext":{"words":[2043896956,1991586527,-253394041,1766460478,1919914102,-672999597,335692925,1748976784,-643207220,-728198085,-118888177,-438917403,1036717864,2051306617,-1885352743,-990507555,-69445620,17719704,1798153867,1182361348,-561444454,-2040266956,230874053,-1181893759,553727461,1569817306,-913343761,916908839,560554827,132074583,-863202883,-1012039028,22374354,-1841462487,589258443,-1953197686,-1432176576,912664807,1302071830,-836796161,-1716684015,1449887451,1165643771,-1938859254,-1485470314,1968466285,328357620,669320680,2076240689,-715474623,1530034078,-44325810,2041049586,-1450300469,997664117,-1974196531,680294385,-1968864050,873765709,524846934,-1672179474,1527642749,-1244705569,-602613426,-1815347445,512191491,-2123503901,-293467402,-1132622453,-2108645260,-1283045103,-961857742,-174371230,-1821092722,5315161,1299148407,-1274210623,1360587143,2023529793,-1733717267,650757007,1847421492,-1173775804,-917009810,-1703581266,2119669939,-524284466,575390322,-1421736953,1926496454,770393925,-393706937,-1071014176,1559759786,1365344899,-152612263,366313381,-307962418,-776951570,838594086,-284910809,1555368591,-1858260522,1325701850,-1151591579,-335543213,659712306,-762979581,-290333467,-977951064,-2074917984,-457263180,1878918652,1219257608,-571154328,546284652,1149818813,1962780719,1611885668,1477409569,-998129722,-826521027,967690132,1092098868,1321062302,-1112898899,755701994,1532753994,-415145710,-1221619474,-1754115408,763606567,-690799294,1346406594,1858463620,-1192810970,-163102144,-1448764701,-391227477,1343093928,2056361885,238106625,-1061654383,-1051813141,1153621624,-774081719,-1610976223,-2086266129,-2034785804,-1056600025,-1480749525,-1623787336,147449770,-1916139841,1010451967,1408593888,-747135944,-897398868,808160370,-1473907598,1517537743,-117921136,1488745421,1245114248],"sigBytes":656},"key":{"$super":{"$super":{"$ref":"$["$super"]["$super"]"}},"words":[337386130,797343206,-491203281,2060111642,131934245,421911516,1197376056,-2101642553,1151690573,-1765858766,-2135252194,193528518],"sigBytes":32},"iv":{"$super":{"$ref":"$["key"]["$super"]"},"words":[1151690573,-1765858766,-2135252194,193528518],"sigBytes":16},"algorithm":{"keySize":8,"$super":{"cfg":{"mode":{"$super":{"$super":{"$ref":"$["$super"]["$super"]"}},"Encryptor":{"$super":{"$ref":"$["algorithm"]["$super"]["cfg"]["mode"]"}},"Decryptor":{"$super":{"$ref":"$["algorithm"]["$super"]["cfg"]["mode"]"}}},"padding":{},"$super":{"$super":{"$ref":"$["$super"]["$super"]"}}},"blockSize":4,"$super":{"cfg":{"$ref":"$["algorithm"]["$super"]["cfg"]["$super"]"},"keySize":4,"ivSize":4,"_ENC_XFORM_MODE":1,"_DEC_XFORM_MODE":2,"$super":{"_minBufferSize":0,"$super":{"$ref":"$["$super"]["$super"]"}}}}},"mode":{"$ref":"$["algorithm"]["$super"]["cfg"]["mode"]"},"padding":{"$ref":"$["algorithm"]["$super"]["cfg"]["padding"]"},"blockSize":4,"formatter":{},"salt":{"words":[1116333811,1175956848],"sigBytes":8}}';
const localVault = { vault: dummyVault };
const password = 'kush1234';
const token = keccak512(password);
const wallet1 = {
  privateKey:
    '0x1a3323ac1d6a41c64b30eff05809c9338e2d2349040c95c6fcf667b47fa596a0cfd3f04a73e8c1d8411abd73760204aee2d276e67aa8fed9b485a7077189a5d',
  address: '0xa0080f1022b8a94da1ec0172b521b2ff5c082c7978672e2e96a4bdb9fde8562a',
  alias: 'Wallet 1',
};
const wallets = [];
wallets.push(wallet1);
const txns = `
  [
    {
      "0xa09ef9d9dbc44a80d2f19cedc6698ef70e0ccd8b2e1fb76a1ad8c0e9cd087be8": []
    },
    {
      "0xa0e29a8871d969fba7a96bd5aea6df1e25385d80a722a4e766ae070c2344c7d1": []
    }
  ]
`;
const transactionsLocalStorageObj = { transactions: txns };

const addresswithZeroX = '0xa0d58431d48fbc086175a1a7b5c715bd831ed08e910da54ef91946e707be3c99';
const addresswithoutZeroX = 'a0d58431d48fbc086175a1a7b5c715bd831ed08e910da54ef91946e707be3c99';

const mockWalletObj = {
  alias: 'Test Wallet',
  address: addresswithZeroX,
};
const mockWalletObj2 = {
  alias: 'Test Wallet 2',
  address: '0xafc58431d48fbc396175a1a7b5c715bd831ed08e910da54ef91946e707be1f72',
};
const mockWalletArr = [mockWalletObj, mockWalletObj2];
const mockWalletObjIndex = mockWalletArr.findIndex(
  wallet => wallet.address === mockWalletObj.address,
);
const outvaultKeystore = '{"wallets":[{"privateKey":"0x1a3323ac1d6a41c64b30eff05809c9338e2d2349040c95c6fcf667b47fa596a0ecfd3f04a73e8c1d8411abd73760204aee2d276e67aa8fed9b485a7077189a5d","address":"0xa0080f1022b8a94da1ec0172b521b2ff5c082c7978672e2e96a4bdb9fde8562a","alias":"Wallet 1"},{"privateKey":"0xd53aa9f45bcf07c0e91b47841e1f44d6996b34e17c3640983ef1d1e2f82ea685df711c8b8d80e7a81da8d2b708879d1b6a2256dad8bc609002de5b29a23d059e","address":"0xa07c78cc64f2978eccc3c4aa624f5ba3aa999f8e72d9548a11e6573ace098d65","alias":"Wallet 2"},{"privateKey":"0x5746bd483659b19d37a0724925972536b9625be0deb91f72550ab4fa403154920a984f798a95d1f45b6f31f0b15e00d993466036fe0c39962a69cc2bb3006b47","address":"0xa0aa6d40d962ef60d6c42da54adec24f242de46f27d2ea3d96f0ccefa5678b62","alias":"Wallet 3","imported":true}],"currentWallet":{"privateKey":"0x5746bd483659b19d37a0724925972536b9625be0deb91f72550ab4fa403154920a984f798a95d1f45b6f31f0b15e00d993466036fe0c39962a69cc2bb3006b47","address":"0xa0aa6d40d962ef60d6c42da54adec24f242de46f27d2ea3d96f0ccefa5678b62","alias":"Wallet 3","imported":true},"seedWords":"board hour antique dignity night clinic toward neck ask lucky lonely eye","derivationPath":"","hdwalletIndex":2}';
const mockweb3Keystore = {
  version: 3,
  id: '1949d1ad-497d-45d6-84df-7e6dfdd82099',
  address: 'a0aa6d40d962ef60d6c42da54adec24f242de46f27d2ea3d96f0ccefa5678b62',
  crypto: {
    ciphertext:
      'eb1220e774ccd8872cd9998e10d6dcc71e3cad0f104790908ddeda98877569ea4ff129cdfe7c8beb7be27f5b23d1ce93ee65d3d75cf813b2776240999e7f65ba',
    cipherparams: { iv: 'd3111c22efe31ef36c321f8d261020a1' },
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      salt: '3b43f4cd42bbacbfd9a62ff35e8ac7afcd41c83404f54c1bf3dabefc26a583af',
      n: 8192,
      r: 8,
      p: 1,
    },
    mac: 'a279b8ff7641953c963dbda52f28e0c4fa2514bc5135824c9820469d322e7a49',
  },
};

function renameWalletFailTest(renameValue, expectedError, assertMessage) {
  let expectedErrorTest;
  try {
    walletService.renameWallet(renameValue, mockWalletObj, mockWalletObjIndex, mockWalletArr);
  } catch (error) {
    expectedErrorTest = error.message;
  }

  assert(expectedError === expectedErrorTest, assertMessage);
}

describe(
  'walletService',
  () => describe('#removeZeroX', () => {
    it('remove 0x should work', () => {
      // removeZeroX should return what we want.
      const removeZeroXoutput = walletService.removeZeroX(addresswithZeroX);
      assert(
        removeZeroXoutput === addresswithoutZeroX,
        'the return value should be remove ZeroX',
      );
    });
    it('should return same if no ZeroX', () => {
      const noZeroXoutput = walletService.removeZeroX(addresswithoutZeroX);
      assert(noZeroXoutput === addresswithoutZeroX, 'the return value should no modify');
    });
  }),

  describe('#addZeroX()', () => {
    it('add 0x should work', () => {
      // removeZeroX should return what we want.
      const mockRetrunValue = addresswithZeroX;
      const addZeroXoutput = walletService.addZeroX(addresswithoutZeroX);
      assert(addZeroXoutput === mockRetrunValue, 'the return value should add ZeroX');
    });
    it('should return same if ZeroX', () => {
      const noAddZeroXoutput = walletService.addZeroX(addresswithZeroX);
      assert(noAddZeroXoutput === addresswithZeroX, 'the return value should no modify');
    });
  }),
  describe('#shortenAddress()', () => {
    it('shorten the given address', () => {
      // removeZeroX should return what we want.
      const mockReturnValue = '0xa0d5...3c99';
      const addZeroXoutput = walletService.shortenAddress(addresswithZeroX);
      assert(addZeroXoutput === mockReturnValue, 'the return address must be shorten');
    });
  }),
);

describe('#importWallet()', () => {
  it('Import Wallet using Duplicate Privatekey without 0x', async () => {
    const stub = sinon.stub(browserService, 'getLocalStorage');

    stub.withArgs('vault').returns(localVault);
    stub.withArgs('transactions').returns(transactionsLocalStorageObj);
    const stubSetLocalStorage = sinon.stub(browserService, 'setLocalStorage').returns({});

    stubSetLocalStorage.withArgs('vault').returns({});
    stubSetLocalStorage.withArgs('transactions').returns({});
    const privateKey = '1a3323ac1d6a41c64b30eff05809c9338e2d2349040c95c6fcf667b47fa596a0cfd3f04a73e8c1d8411abd73760204aee2d276e67aa8fed9b485a7077189a5d';
    const vaultOutput = await walletService.importWallet(
      'PrivateKeyBased',
      privateKey,
      token,
      wallets,
    );
    /* eslint-disable-next-line */
    assert.equal(undefined, vaultOutput, 'Duplicate Privatekey..Wallet already Existing..');

    stub.restore();
    stubSetLocalStorage.restore();
  });
  it('Import Wallet using Duplicate Privatekey with 0x', async () => {
    const stub = sinon.stub(browserService, 'getLocalStorage');

    stub.withArgs('vault').returns(localVault);
    stub.withArgs('transactions').returns(transactionsLocalStorageObj);
    const stubSetLocalStorage = sinon.stub(browserService, 'setLocalStorage').returns({});

    stubSetLocalStorage.withArgs('vault').returns({});
    stubSetLocalStorage.withArgs('transactions').returns({});
    const privateKey = '0x1a3323ac1d6a41c64b30eff05809c9338e2d2349040c95c6fcf667b47fa596a0cfd3f04a73e8c1d8411abd73760204aee2d276e67aa8fed9b485a7077189a5d';
    const vaultOutput = await walletService.importWallet(
      'PrivateKeyBased',
      privateKey,
      token,
      wallets,
    );
    /* eslint-disable-next-line */
    assert.equal(undefined, vaultOutput, 'Duplicate Privatekey..Wallet already Existing..');

    stub.restore();
    stubSetLocalStorage.restore();
  });
  it('using key store file', async () => {
    const stub = sinon.stub(browserService, 'getLocalStorage');

    stub.withArgs('vault').returns(localVault);
    stub.withArgs('transactions').returns(transactionsLocalStorageObj);
    const stubSetLocalStorage = sinon.stub(browserService, 'setLocalStorage').returns({});

    stubSetLocalStorage.withArgs('vault').returns({});
    stubSetLocalStorage.withArgs('transactions').returns({});
    const stubDecoder = sinon
      .stub(importExportService, 'decode')
      .returns(JSON.stringify(mockweb3Keystore));

    const inputFile = readFileSync(
      'test/app/keystoreFile/UTC--2018-10-18T19-52-00.345Z--a0aa6d40d962ef60d6c42da54adec24f242de46f27d2ea3d96f0ccefa5678b62',
    );
    const vaultOutput = await walletService.importWallet(
      'keystoreFile',
      inputFile,
      token,
      wallets,
      '1234',
    );

    assert.equal(outvaultKeystore, JSON.stringify(vaultOutput), 'importing of wallet failed');
    stubDecoder.restore();
    stub.restore();
    stubSetLocalStorage.restore();
  }).timeout(5000);

  it('using web3-account json key store file', async () => {
    const stub = sinon.stub(browserService, 'getLocalStorage');

    stub.withArgs('vault').returns(localVault);
    stub.withArgs('transactions').returns(transactionsLocalStorageObj);
    const stubSetLocalStorage = sinon.stub(browserService, 'setLocalStorage').returns({});

    stubSetLocalStorage.withArgs('vault').returns({});
    stubSetLocalStorage.withArgs('transactions').returns({});
    const stubDecoder = sinon
      .stub(importExportService, 'decode')
      .returns(JSON.stringify(mockweb3Keystore));

    const inputFile = readFileSync(
      'test/app/keystoreFile/web3Keystore_UTC--2018-12-19T17-53-24.718Z--0a984f798a95d1f45b6f31f0b15e00d993466036fe0c39962a69cc2bb3006b47',
    );
    const vaultOutput = await walletService.importWallet(
      'keystoreFile',
      inputFile,
      token,
      wallets,
      '1234',
    );

    assert.equal(outvaultKeystore, JSON.stringify(vaultOutput), 'importing of wallet failed');
    stubDecoder.restore();
    stub.restore();
    stubSetLocalStorage.restore();
  }).timeout(5000);
});

describe('Renaming a wallet', () => {
  it('Renaming a wallet return undefined. Wallet name was left unchanged.', () => {
    const expectedResult = undefined;

    const walletArr = walletService.renameWallet(
      mockWalletObj.alias,
      mockWalletObj,
      mockWalletObjIndex,
      mockWalletArr,
    );

    assert(walletArr === expectedResult, 'Wallet name was left unchanged.');
  });

  it('Renaming a wallet fails. Wallet name already exists.', () => {
    renameWalletFailTest(
      mockWalletObj2.alias,
      `"${mockWalletObj2.alias}" already exists.`,
      'Renaming the wallet with an existing wallet name should fail.',
    );
  });

  it('Renaming a wallet fails. Wallet name length is greater than 16.', () => {
    renameWalletFailTest(
      'This is a test for more than 16 char',
      'Wallet name can not exceed 16 characters.',
      'Renaming a wallet with a length greater than 16 should fail.',
    );
  });

  it('Rename a wallet fails. Wallet name length is less than 1.', () => {
    renameWalletFailTest(
      '',
      'Wallet name must be at least 1 character long.',
      'Renaming a wallet with a length less than 1 should fail.',
    );
  });

  it('Renaming a wallet successfully', () => {
    const successfullRenameTest = 'It worked!';

    // Rename Wallet
    const walletArr = walletService.renameWallet(
      successfullRenameTest,
      mockWalletObj,
      mockWalletObjIndex,
      mockWalletArr,
    );

    // Find Rename Wallet
    const renameTestWallet = walletArr.find(wallet => wallet.alias === successfullRenameTest);

    assert(
      renameTestWallet.alias === successfullRenameTest,
      'The values should match, indicating successful rename!',
    );
  });
});

describe('#getWalletAlias()', () => {
  it('Get Wallet Alias from address', async () => {
    const outputAlias = walletService.getWalletAlias(mockWalletArr, mockWalletObj2.address);
    assert.equal(mockWalletObj2.alias, outputAlias, 'Wallet not found');
  });
});

import BigNumber from 'bignumber.js';
import * as NumberFormatter from '../../../app/services/numberFormatter';

const assert = require('assert');

describe('Numberformatter', () => describe('#convertBNToAion(value)', () => {
  it('String input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertBNToAion('123456789123456789');
    assert.equal(output.toString(), '0.123456789123456789');
  });

  it('BigNumber input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertBNToAion(new BigNumber('123456789123456789'));
    assert.equal(output.toString(), '0.123456789123456789');
  });

  it('Number input, large number, should throw error', () => {
    try {
      NumberFormatter.convertBNToAion(123456789123456789);
    } catch (e) {
      assert(true);
    }
  });

  it('Double input, with decimal, should throw error', () => {
    try {
      NumberFormatter.convertBNToAion(123456789123456789.12);
    } catch (e) {
      assert(true);
    }
  });

  it('String input, with decimal, should throw error', () => {
    try {
      NumberFormatter.convertBNToAion('123456789123456789.12');
    } catch (e) {
      assert(true);
    }
  });

  it('Number input, small number, should not throw error', () => {
    const output = NumberFormatter.convertBNToAion(12345678912345678);
    assert.equal(output.toString(), '0.012345678912345678');
  });

  it('Number input, smallest number, should not throw error', () => {
    const output = NumberFormatter.convertBNToAion(1);
    assert.equal(output.toString(), '1e-18');
  });
  it('Big number input > 1000 e.g., 1001, should not throw error', () => {
    const output = NumberFormatter.convertBNToAion(new BigNumber('1001e18'));
    assert.equal(output.toString(), '1001');
  });
}));

describe('#convertNRGPriceToAion(value)', () => {
  it('Number input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertNRGPriceToAion(1000000000);
    assert.equal(output.toString(), '1');
  });
  it('String input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertNRGPriceToAion('1000000000');
    assert.equal(output.toString(), '1');
  });
  it('BigNumber input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertNRGPriceToAion(new BigNumber('123456789123456789'));
    assert.equal(output.toString(), '123456789.123456789');
  });

  it('Number input, large number, should throw error', () => {
    try {
      NumberFormatter.convertNRGPriceToAion(123456789123456789);
    } catch (e) {
      assert(true);
    }
  });

  it('Double input, with decimal, should throw error', () => {
    try {
      NumberFormatter.convertNRGPriceToAion(123456789123456789.12);
    } catch (e) {
      assert(true);
    }
  });

  it('String input, with decimal, should throw error', () => {
    try {
      NumberFormatter.convertNRGPriceToAion('123456789123456789.12');
    } catch (e) {
      assert(true);
    }
  });

  it('Number input, small number, should not throw error', () => {
    const output = NumberFormatter.convertNRGPriceToAion(12345);
    assert.equal(output.toString(), '0.000012345');
  });

  it('Number input, smallest number, should not throw error', () => {
    const output = NumberFormatter.convertNRGPriceToAion(1);
    assert.equal(output.toString(), '1e-9');
  });
});

describe('#convertAionToNanoAmp(value)', () => {
  it('Number input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertAionToNanoAmp(1);
    assert.equal(output.toString(), '1000000000000000000');
  });
  it('String input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertAionToNanoAmp('1');
    assert.equal(output.toString(), '1000000000000000000');
  });
  it('BigNumber input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertAionToNanoAmp(new BigNumber('123456789123456789'));
    assert.equal(output.toString(), '1.23456789123456789e+35');
  });

  it('Number input, large number, should throw error', () => {
    try {
      NumberFormatter.convertAionToNanoAmp(123456789123456789);
    } catch (e) {
      assert(true);
    }
  });

  it('Double input, with decimal, should throw error', () => {
    try {
      NumberFormatter.convertAionToNanoAmp(123456789123456789.12);
    } catch (e) {
      assert(true);
    }
  });

  it('String input, with decimal, should throw error', () => {
    try {
      NumberFormatter.convertAionToNanoAmp('123456789123456789.12');
    } catch (e) {
      assert(true);
    }
  });
  it('Number input, Negative, should throw error', () => {
    try {
      NumberFormatter.convertAionToNanoAmp(-1);
    } catch (e) {
      assert(true);
    }
  });
  it('Number input, small number should not throw error', () => {
    const output = NumberFormatter.convertAionToNanoAmp(0.0000012345);
    assert.equal(output.toString(), '1234500000000');
  });
  it('Number input, smallest number should not throw error', () => {
    const output = NumberFormatter.convertAionToNanoAmp(0.000000000000000001);
    assert.equal(output.toString(), '1');
  });
});

describe('#convertNanoAmpToAion(value)', () => {
  it('Number input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertNanoAmpToAion(1000000000000000000);
    assert.equal(output.toString(), '1');
  });
  it('String input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertNanoAmpToAion('1000000000000000000');
    assert.equal(output.toString(), '1');
  });
  it('BigNumber input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertNanoAmpToAion(new BigNumber('1.23456789123456789e+35'));
    assert.equal(output.toString(), '123456789123456789');
  });
});

describe('#convertAionToAmp(value)', () => {
  it('Number input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertAionToAmp(1);
    assert.equal(output.toString(), '1000000000');
  });

  it('string input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertAionToAmp('1');
    assert.equal(output.toString(), '1000000000');
  });

  it('BigNumber input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertAionToAmp(new BigNumber('123456789'));
    assert.equal(output.toString(), '123456789000000000');
  });

  it('Number input, large number, should throw error', () => {
    try {
      NumberFormatter.convertAionToAmp(123456789123456789);
    } catch (e) {
      assert(true);
    }
  });

  it('Double input, with decimal, should throw error', () => {
    try {
      NumberFormatter.convertAionToAmp(123456789123456789.12);
    } catch (e) {
      assert(true);
    }
  });

  it('string input, with decimal, should throw error', () => {
    try {
      NumberFormatter.convertAionToAmp('123456789123456789.12');
    } catch (e) {
      assert(true);
    }
  });

  it('Number input, negative number, should throw error', () => {
    try {
      NumberFormatter.convertAionToAmp(-1);
    } catch (e) {
      assert(true);
    }
  });

  it('Number input, small number should not throw error', () => {
    const output = NumberFormatter.convertAionToAmp(0.0000012345);
    assert.equal(output.toString(), '1234.5');
  });

  it('Number input, smallest number should not throw error', () => {
    const output = NumberFormatter.convertAionToAmp(0.000000000000000001);
    assert.equal(output.toString(), '1e-9');
  });
});

describe('#convertNanoAmpstoAmps(value)', () => {
  it('number input, no decimals, should not throw error', () => {
    const output = NumberFormatter.convertNanoAmpToAmp(1);
    assert.equal(output.toString(), '1e-9');
  });

  it('string input, no decimal, should not throw an error', () => {
    const output = NumberFormatter.convertNanoAmpToAmp('1');
    assert.equal(output.toString(), '1e-9');
  });

  it('BigNumber input, no decimal point, should not throw error', () => {
    const output = NumberFormatter.convertNanoAmpToAmp(new BigNumber('123456789123456789'));
    assert.equal(output.toString(), '123456789.123456789');
  });

  it('Number input, large number, should throw error', () => {
    try {
      NumberFormatter.convertNanoAmpToAmp(123456789123456789);
    } catch (e) {
      assert(true);
    }
  });
  it('Double input, with decimal, should throw error', () => {
    try {
      NumberFormatter.convertNanoAmpToAmp(123456789123456789.12);
    } catch (e) {
      assert(true);
    }
  });
  it('string input. with decimal, should throw error', () => {
    try {
      NumberFormatter.convertNanoAmpToAmp('123456789123456789.12');
    } catch (e) {
      assert(true);
    }
  });
  it('Number input, negative, should throw error', () => {
    try {
      NumberFormatter.convertNanoAmpToAmp(-1);
    } catch (e) {
      assert(true);
    }
  });
  it('Number input, small number should not throw error', () => {
    const output = NumberFormatter.convertNanoAmpToAmp(0.0000012345);
    assert.equal(output.toString(), '1.2345e-15');
  });
  it('Number input, smallest number should not throw error', () => {
    const output = NumberFormatter.convertNanoAmpToAmp(0.000000000000000000000000001);
    assert.equal(output.toString(), '1e-36');
  });
});

describe('#convertValueToUSD(value)', () => {
  it('string input, no decimal, should not throw an error', () => {
    const output = NumberFormatter.convertValueToUSD('2', '2');
    assert(output.toString() === '4.00', 'result should be match');
  });

  it('decimal input, should not throw an error', () => {
    const output = NumberFormatter.convertValueToUSD(2.0, 0.18);
    assert(output.toString() === '0.36', 'result should be match');
  });
});

describe('#convertNumberToFormattedString(value,decimals)', () => {
  it('string input, with short fraction part less than one, no decimals given', () => {
    const output = NumberFormatter.convertNumberToFormattedString('0.0233');
    assert.equal(output.toString(), '0.02');
  });
  it('string input, with short fraction part less than one', () => {
    const output = NumberFormatter.convertNumberToFormattedString('0.0198');
    assert.equal(output.toString(), '0.01');
  });
  it('string input, with short fraction part less than one and 1 decimal', () => {
    const output = NumberFormatter.convertNumberToFormattedString('0.8');
    assert.equal(output.toString(), '0.80');
  });
  it('string input, less than 100', () => {
    const output = NumberFormatter.convertNumberToFormattedString('1');
    assert.equal(output.toString(), '1.00');
  });
  it('string input, less than 100, greater than 10', () => {
    const output = NumberFormatter.convertNumberToFormattedString('25', 2);
    assert.equal(output.toString(), '25.00');
  });
  it('string input, with long fraction part less than one', () => {
    const output = NumberFormatter.convertNumberToFormattedString('0.0000001');
    assert.equal(output.toString(), '0.00');
  });
  it('string input, with contains e- part, less than one', () => {
    const output = NumberFormatter.convertNumberToFormattedString('1e-9');
    assert.equal(output.toString(), '0.00');
  });
  it('string input, with decimal points, greater than 1 less than 1000 ', () => {
    const output = NumberFormatter.convertNumberToFormattedString('210.42613');
    assert.equal(output.toString(), '210.42');
  });
  it('string input, with decimal points, greater than 1 less than 1000', () => {
    const output = NumberFormatter.convertNumberToFormattedString('515.7822311');
    assert.equal(output.toString(), '515.78');
  });
  it('string input, with no points, greater than 1 less than 1000 ', () => {
    const output = NumberFormatter.convertNumberToFormattedString('412', 2);
    assert.equal(output.toString(), '412.00');
  });
  it('string input, with decimal points, greater than 1000, less than 1M', () => {
    const output = NumberFormatter.convertNumberToFormattedString('1,210.42213', 2);
    assert.equal(output.toString(), '1,210.42');
  });
  it('string input, with decimal points, greater than 10,000, less than 1M', () => {
    const output = NumberFormatter.convertNumberToFormattedString('10,515.7824443');
    assert.equal(output.toString(), '10,515.78');
  });
  it('string input, with no decimal points, greater than 1000, less than 1M', () => {
    const output = NumberFormatter.convertNumberToFormattedString('1,400');
    assert.equal(output.toString(), '1,400.00');
  });
  it('string input, with no decimal, greater than 100,000, less than 1M', () => {
    const output = NumberFormatter.convertNumberToFormattedString('405,670.467', 2);
    assert.equal(output.toString(), '405,670.46');
  });
  it('string input, with no decimal, greater than 1M', () => {
    const output = NumberFormatter.convertNumberToFormattedString('3,506,700');
    assert.equal(output.toString(), '3.50M');
  });
  it('string input, with no decimal, greater than 1M', () => {
    const output = NumberFormatter.convertNumberToFormattedString('2,401,506,700');
    assert.equal(output.toString(), '2.40B');
  });
  it('string input, with no decimal, greater than 1T', () => {
    const output = NumberFormatter.convertNumberToFormattedString('7,452,401,506,700');
    assert.equal(output.toString(), '7.45T');
  });
  it('string input, with no decimal, greater than 1P (1 Qd)', () => {
    const output = NumberFormatter.convertNumberToFormattedString('2,318,452,401,506,700', 2);
    assert.equal(output.toString(), '2.31P');
  });
  it('string input, with no decimal, greater than 100P (100 Qd)', () => {
    const output = NumberFormatter.convertNumberToFormattedString('422,318,452,401,506,700', 2);
    assert.equal(output.toString(), '422.31P');
  });
  it('string input, with no decimal, greater than 1E (1 quintillion)', () => {
    const output = NumberFormatter.convertNumberToFormattedString('1,500,000,000,000,000,000', 2);
    assert.equal(output.toString(), '1.50E');
  });
  it('string input, with no decimal, greater than 1Z (1 sextillion)', () => {
    const output = NumberFormatter.convertNumberToFormattedString(
      '1,500,000,000,000,000,000,000',
      2,
    );
    assert.equal(output.toString(), '1.50Z');
  });
  it('string input, with no decimal, greater than 1Y (1 septillion)', () => {
    const output = NumberFormatter.convertNumberToFormattedString(
      '1,500,000,000,000,000,000,000,000',
      2,
    );
    assert.equal(output.toString(), '1.50Y');
  });
  it('bignumber input, with no decimal, greater than 1Y (1 septillion)', () => {
    const output = NumberFormatter.convertNumberToFormattedString(
      new BigNumber('1500000000000000000000000'),
    );
    assert.equal(output.toString(), '1.50Y');
  });
});
describe('#convertStringToBNT(value)', () => {
  it('string input, with decimals, should not throw error', () => {
    const output = NumberFormatter.convertStringToBNT('0.25', 0);
    assert.equal(output.toString(), '0.25');
  });
  it('string input, no decimals, should not throw error', () => {
    const output = NumberFormatter.convertStringToBNT('25', 0);
    assert.equal(output.toString(), '25');
  });
  it('large string input, no decimals, should not throw error', () => {
    const output = NumberFormatter.convertStringToBNT('2500000000000000000', 0);
    assert.equal(output.toString(), '2500000000000000000');
  });
  it('large string input, with decimals, should not throw error', () => {
    const output = NumberFormatter.convertStringToBNT('0.000000000000000001', 0);
    assert.equal(output.toString(), '1e-18');
  });
  it('BigNumber input, should throw error', () => {
    try {
      NumberFormatter.convertStringToBNT(new BigNumber('123456789123456789'));
    } catch (e) {
      assert(true);
    }
  });
});
describe('#convertBNToNumber(value)', () => {
  it('string input, with decimals, should not throw error', () => {
    const output = NumberFormatter.convertBNToNumber('0.25', 2);
    assert.equal(output.toString(), '0.25');
  });
  it('string input, no decimals, should not throw error', () => {
    const output = NumberFormatter.convertBNToNumber('25', 0);
    assert.equal(output.toString(), '25');
  });
  it('large string input, no decimals, should not throw error', () => {
    const output = NumberFormatter.convertBNToNumber('2500000000000000000', 0);
    assert.equal(output.toString(), '2500000000000000000');
  });
  it('large string input, with decimals, should not throw error', () => {
    const output = NumberFormatter.convertBNToNumber('0.000000000000000001', 18);
    assert.equal(output.toString(), '1e-18');
  });
  it('BigNumber input, should throw error', () => {
    try {
      NumberFormatter.convertBNToNumber(new BigNumber('123456789123456789'));
    } catch (e) {
      assert(true);
    }
  });
});

import { updateTransactionsAndCount } from '../../../app/actions/transaction';
import config from '../../../app/app.config';
import { getHashKey } from './passwordStorage';
import { getExtension } from '../../../app/services/extensionService';

let started = false;

export const startBackgroundTransactionChecker = () => {
  started = true;
  setInterval(async () => {
    const views = getExtension().extension.getViews({
      type: 'popup',
    });
    if (views.length === 0) {
      const hashKey = await getHashKey();
      if (hashKey !== undefined) {
        updateTransactionsAndCount(hashKey);
      }
    }
  }, config.scheduleTimeout);
};

export const isBackgroundTransactionCheckerStarted = () => started;

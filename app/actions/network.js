import { changeCurrentNetwork, showNetworks } from '../constants/networks';
import { verifyConnection } from '../services/watcherService';
import { updateNetworkConnection, updateLoading } from '../constants/common';
import { getVaultBalance, getCurrentWalletBalance } from './wallet';
import { fetchTransactionList } from './transaction';

export default function changeNetworkSettings(network, address) {
  return async dispatch => {
    try {
      dispatch(updateLoading(true));
      dispatch(showNetworks(false));
      dispatch(changeCurrentNetwork(network));
      const connection = await verifyConnection(network.networkFullUrl, address);
      dispatch(updateNetworkConnection(connection));
      await Promise.all([
        dispatch(getVaultBalance()),
        dispatch(getCurrentWalletBalance()),
        dispatch(fetchTransactionList()),
      ]);
      dispatch(updateLoading(false));
    } catch (err) {
      dispatch(updateLoading(false));
      throw err;
    }
  };
}

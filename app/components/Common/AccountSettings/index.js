import React, { Component } from 'react';

// Import Components
import Divider from '../Divider/DarkDivider';
import ExportPrivateKey from '../../ExportPrivateKey';
import ImportWallet from '../../ImportWalletDropdown';

// Import Styles
import './styles.css';

class AccountSettings extends Component {
  render() {
    return (
      <div className="account-settings-grid-container">
        <ImportWallet className="account-settings-import-wallet" />
        <Divider className="account-settings-import-wallet-divider" />
        <ExportPrivateKey className="account-settings-export-private-key" />
      </div>
    );
  }
}

export default AccountSettings;

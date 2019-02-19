import React, { Component } from 'react';

// Import Components

import Divider from '../Divider/DarkDivider';
import ImportVault from '../../ImportVault';
import ExportVault from '../../ExportVault';
import SessionTimeout from '../../SessionTimeout';
import ExportSeedWords from '../../ExportSeedWords';
import PrivacyMode from '../../PrivacyMode';

// Import Styles
import './styles.css';

class Settings extends Component {
  render() {
    return (
      <div className="settings-grid-container">
        <ImportVault className="settings-import-vault" />
        <Divider className="settings-import-vault-divider" />
        <ExportVault className="settings-export-vault" />
        <Divider className="settings-export-vault-divider" />
        <ExportSeedWords className="settings-export-seed-words" />
        <Divider className="settings-export-seed-words-divider" />
        <SessionTimeout className="settings-session-timeout" />
        <Divider className="settings-session-timeout-divider" />
        <PrivacyMode className="settings-privacy-mode" />
      </div>
    );
  }
}

export default Settings;

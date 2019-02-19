import React, { Component } from 'react';
import { connect } from 'react-redux';

import BlockUi from 'react-block-ui';
import { Loader } from 'react-loaders';
import { changePageStatus } from '../../constants/common';
import { handleDAppRequest } from '../../actions/dApp';
import { initializeWallet } from '../../actions/home';
import { SIGN_IN_PAGE } from '../../constants/navigation';
import 'loaders.css/loaders.min.css';

import './styles.css';

function mapStateToProps(state) {
  return {
    currentWallet: state.wallets.currentWallet,
  };
}

class LoaderOverlay extends Component {
  constructor(props) {
    super(props);
    // Declare Variables
    const { currentWallet } = this.props;

    if (currentWallet === undefined) {
      this.props.changePageStatus(SIGN_IN_PAGE);
    }
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.initializeWallet();
    this.props.handleDAppRequest();
  }

  render() {
    const {
      state: { isLoading },
    } = this;

    return (
      <div>
        <BlockUi
          tag="div"
          blocking={isLoading}
          loader={<Loader active type="semi-circle-spin" color="#1f5771" />}
        >
          <div className="aiwa-loader-page" />
        </BlockUi>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changePageStatus: newPage => dispatch(changePageStatus(newPage)),
    initializeWallet: () => dispatch(initializeWallet()),
    handleDAppRequest: () => dispatch(handleDAppRequest()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoaderOverlay);

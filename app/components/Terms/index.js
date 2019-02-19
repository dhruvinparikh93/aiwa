import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import './styles.css';
import { changePageStatus, updateTerms } from '../../constants/common';
import ButtonMD from '../Common/Buttons/ButtonMD';
import Footer from '../Common/Footer';
import { setLocalStorage, getLocalStorage } from '../../services/browserService';
import config from '../../app.config';
import { verifyAcceptedTouVersion } from '../../actions/home';
import TermsText from './TermsText';

function mapStateToProps(state) {
  return {
    pageStatus: state.appState.pageStatus,
  };
}

class Terms extends Component {
  static defaultProps = {
    changePageStatus: undefined,
    updateTerms: undefined,
    verifyAcceptedTouVersion: undefined,
  };

  static propTypes = {
    changePageStatus: PropTypes.func,
    updateTerms: PropTypes.func,
    verifyAcceptedTouVersion: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: true,
      titleText: 'Read and agree to the following items',
    };
  }

  async componentDidMount() {
    const vaultIsCreated = await getLocalStorage('vault');
    if (Object.keys(vaultIsCreated).length !== 0) {
      this.setState({
        titleText: 'The Terms of Use have been updated. Please review and agree to continue.',
      });
    }
  }

  handleScroll = e => {
    const bottom = e.target.offsetHeight + e.target.scrollTop + 100 >= e.target.scrollHeight;
    if (bottom) {
      this.setState({ disabled: false });
    }
  };

  handleClick = async () => {
    const {
      props: { updateTerms, changePageStatus },
    } = this;
    updateTerms(true);
    setLocalStorage('touVersion', config.touVersion);
    this.props.verifyAcceptedTouVersion();
    const vaultIsCreated = await getLocalStorage('vault');
    if (Object.keys(vaultIsCreated).length === 0) {
      changePageStatus('createvault');
    } else {
      changePageStatus('signin');
    }
  };

  render() {
    return (
      <div className="tou-grid-container">
        <div className="tou-header">
          <p className="tou-title">Terms of use</p>
          <p className="tou-subtitle">{this.state.titleText}</p>
        </div>

        <div className="tou-main" onScroll={this.handleScroll}>
          <TermsText />
        </div>
        <div className="tou-footer">
          <Footer>
            <ButtonMD color="secondary" disabled={this.state.disabled} onClick={this.handleClick}>
              Agree
            </ButtonMD>
          </Footer>
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    changePageStatus: newPage => dispatch(changePageStatus(newPage)),
    updateTerms: isAgree => dispatch(updateTerms(isAgree)),
    verifyAcceptedTouVersion: () => dispatch(verifyAcceptedTouVersion()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Terms);

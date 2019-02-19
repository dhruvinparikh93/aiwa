import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
// Import Components
import Input from '../Common/Inputs/Input';
import FontError from '../Common/Fonts/FontError';
import ButtonMD from '../Common/Buttons/ButtonMD';

// Import Animation
import { shrinkAllApplicationSetting } from '../../services/animationService';
import toggleApplicationAnimationOff from '../../actions/animation';

// Import Navigation Constants
import { HOME_PAGE, SIGN_IN_PAGE } from '../../constants/navigation';

import './styles.css';

import { changePageStatus } from '../../constants/common';
import { signIn } from '../../actions/vault';

function mapStateToProps(state) {
  return {
    pageStatus: state.appState.pageStatus,
    wallets: state.wallets.wallets,
    currentWallet: state.wallets.currentWallet,
  };
}

class SignIn extends Component {
  static defaultProps = {
    changePageStatus: undefined,
  };

  static propTypes = {
    changePageStatus: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      password: undefined,
      passwordError: false,
      passwordErrorMsg: '',
    };
  }

  componentDidMount() {
    // Turn off all other animations within Reducer State
    this.props.toggleApplicationAnimationOff();
    shrinkAllApplicationSetting();

    this.props.changePageStatus(SIGN_IN_PAGE);
  }

  handleOnChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleInputKeyPress = event => {
    const { key } = event;

    if (key === 'Enter') {
      this.handleClick();
    }
  };

  handleClick = async () => {
    const {
      state: { password },
      props: { changePageStatus, signIn },
    } = this;
    if (password === undefined || password === '') {
      this.setState({
        passwordError: true,
        passwordErrorMsg: 'Password is required.',
      });
      return null;
    }
    const isValid = await signIn(password);
    if (isValid) changePageStatus(HOME_PAGE);
    else {
      this.setState({
        passwordError: true,
        passwordErrorMsg: 'Invalid Password.',
      });
    }
  };

  render() {
    const { password, passwordError, passwordErrorMsg } = this.state;

    return (
      <div className="sign-in-grid-container">
        <div className="sign-in-grid-items">
          <div className="sign-in-title">
            <p>Enter the vault password to unlock</p>
          </div>
          <div className="sign-in-input-password">
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onChange={this.handleOnChange}
              onKeyPress={this.handleInputKeyPress}
              error={passwordError}
            />
            <FontError>{passwordError ? passwordErrorMsg : ' '}</FontError>
          </div>
          <div className="sign-in-button">
            <ButtonMD onClick={() => this.handleClick()} color="secondary">
              Sign In
            </ButtonMD>
          </div>
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    changePageStatus: newPage => dispatch(changePageStatus(newPage)),
    signIn: val => dispatch(signIn(val)),
    toggleApplicationAnimationOff: () => dispatch(toggleApplicationAnimationOff()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);

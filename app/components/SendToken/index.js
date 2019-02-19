import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Other Components
import validatorJs from 'validator';
import BigNumber from 'bignumber.js';
import DropdownInput from '../Common/Inputs/DropdownInput';
import SubHeader from '../Common/SubHeader';
import CardDropdown from '../Common/CardDropdown';
import FontRegular from '../Common/Fonts/FontRegular';
import FontError from '../Common/Fonts/FontError';
import DarkDivider from '../Common/Divider/DarkDivider';
import Input from '../Common/Inputs/Input';
import ButtonSM from '../Common/Buttons/ButtonSM';
import ButtonLG from '../Common/Buttons/ButtonLG';
import { createToast } from '../../constants/toast';

// Import Actions
import { fetchNrgLimit } from '../../actions/transaction';
import toggleApplicationAnimationOff from '../../actions/animation';

//Import Constants
import { HOME_PAGE, CONFIRM_PAGE } from '../../constants/navigation';
import { inputTransactionDetails } from '../../constants/transactions';
import { changePageStatus, saveSendTokenState } from '../../constants/common';
import { getVaultBalance } from '../../actions/wallet';
import NRG_MULTIPLIER from '../../constants/nrg';

import { convertAionToNanoAmp } from '../../services/numberFormatter';
import { createTransactionObj } from '../../services/transactionService';

// Import Validation Object and rules
import AiwaValidator from '../../utils/AiwaValidator';
import validator from '../../utils/AiwaValidator/validator';
import { shrinkAllApplicationSetting } from '../../services/animationService';
import config from '../../app.config';

// Import Styles
import './styles.css';

const mapStateToProps = state => ({
  transactionDetails: state.transactions.transactionDetails,
  nrgPrice: state.transactions.nrgPrice,
  nrgLimit: state.transactions.nrgLimit,
  wallets: state.wallets.wallets,
  currentWallet: state.wallets.currentWallet,
  currentNetwork: state.networks.currentNetwork,
  walletBalanceArr: state.wallets.walletBalanceArr,
  currentWalletBalance: state.wallets.currentWalletBalance,
  selectedToken: state.tokens.selectedToken,
  tokenList: state.tokens.tokenList,
  marketData: state.appState.marketData,
  addressBook: state.vaults.addressBook,
});

class SendToken extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    // Declare Validator as well as Wallet variables
    this.validator = new AiwaValidator(validator.sendTokenValidation);

    const aionCoin = this.props.tokenList[this.props.currentWallet.address][
      this.props.currentNetwork.value
    ][config.aionCoinIndex];

    const { selectedToken } = this.props;

    this.state = {
      from: '',
      to: '',
      amount: '',
      hexData: '',
      nrg: {},
      nrgInUsd: {},
      nrgLimit: '',
      gasPrice: '',
      selectedNrgType: 'normal',
      selectedWallet: undefined,
      selectedToken,
      validation: undefined,
      walletBalanceArr: [],
      aionCoin,
      amountExceedValidate: true,
    };
  }

  async componentDidMount() {
    this.props.toggleApplicationAnimationOff();
    shrinkAllApplicationSetting();
    this.setState({
      balanceAmount: this.state.selectedWallet.selectedToken.balance.amount,
    });
  }

  static getDerivedStateFromProps(props, state) {
    let newState = null;

    if (props.walletBalanceArr && props.walletBalanceArr.length > 0) {
      newState = {
        walletBalanceArr: props.walletBalanceArr,
        ...newState,
      };
    }

    if (props.currentWalletBalance && state.from === '' && state.selectedWallet === undefined) {
      newState = {
        from: props.currentWallet.address,
        selectedWallet: props.currentWalletBalance,
        ...newState,
      };
    }

    return newState;
  }

  handleSubheaderBackBtn = () => {
    this.props.changePageStatus(HOME_PAGE);
  };

  handleOnChange = event => {
    const { name, value } = event.target;

    const state = {
      [name]: value,
    };

    this.setState(state);
  };

  handleCardDropdownSelection = selectedWallet => {
    this.setState({ selectedWallet });
  };

  handleNrgSelection = event => {
    const { name } = event.target;

    this.setState({
      selectedNrgType: name,
    });
  };

  handleSubmission = async () => {
    if (this.props.gasLimit === 0) {
      this.props.createToast({
        message: 'Node Smith server is down...please come back after sometimes.',
        type: 'error',
      });
      this.props.changePageStatus(HOME_PAGE);
    }
    const { selectedToken } = this.props;
    // Declare Variable
    const {
      to, amount, hexData, selectedNrgType
    } = this.state;
    let value;
    value = amount;
    // Validate Fields
    const validation = this.validator.validate(this.state);
    this.setState({ validation });

    // Return if Validation is incorrect
    if (!validation.isValid) return;

    if (selectedToken.name === 'Aion') {
      value = convertAionToNanoAmp(amount);
    }
    const sendTransactionObj = await createTransactionObj({
      to,
      value,
      data: hexData,
      selectedNrgType,
    });

    // Pass on Reducer State
    this.props.inputTransactionDetails(sendTransactionObj);
    this.props.changePageStatus(CONFIRM_PAGE);
  };

  handlePollingNrgLimit = async () => {
    const { to, amount, hexData } = this.state;
    const validatedTo = to === '' ? this.props.currentWallet.address : to;

    this.props.fetchNrgLimit(validatedTo, amount, hexData);
    this.amountExceedValidation();
  };

  amountExceedValidation = () => {
    this.setState({
      amountExceedValidate: true,
    });
    const { selectedNrgType, amount } = this.state;

    if (amount !== undefined) {
      const calculatedGasPrice = BigNumber(this.props.nrgPrice.value).multipliedBy(
        new BigNumber(NRG_MULTIPLIER[selectedNrgType.toUpperCase()]),
      );
      const totalNrg = new BigNumber(this.props.nrgLimit).multipliedBy(calculatedGasPrice);
      this.setState({ totalNrg });
      const validation = this.validator.validate(this.state);
      if (!validation.isValid) {
        this.setState({
          amountExceedValidate: false,
        });
        return false;
      }
      return true;
    }
  };

  render() {
    // Declare Variabkes
    const {
      wallets, currentWalletBalance, addressBook, nrgLimit
    } = this.props;
    const {
      to,
      amount,
      hexData,
      walletBalanceArr,
      selectedNrgType,
      selectedToken,
      amountExceedValidate,
    } = this.state;

    const { nrgInAmp, nrgInUsd } = this.props.nrgPrice;

    // Validate Everytime User Enters
    const validation = this.validator.validate(this.state);
    return (
      <div>
        <SubHeader
          title={`Send ${selectedToken.name}`}
          backBtnOnClick={this.handleSubheaderBackBtn}
        />
        <div className="send-token-container" onScroll={this.handleScroll}>
          <div className="send-token-from">
            <div className="send-token-from-label">
              <FontRegular className="send-token-label">From</FontRegular>
            </div>
            <div className="send-token-from-main">
              <CardDropdown
                zIndex={2}
                name="from"
                onChange={this.handleOnChange}
                onSelect={this.handleCardDropdownSelection}
                items={walletBalanceArr}
                defaultItem={currentWalletBalance}
              />
            </div>
            <DarkDivider className="send-token-from-divider" />
          </div>

          <div className="send-token-to">
            <div className="send-token-to-label">
              <FontRegular className="send-token-label">To</FontRegular>
            </div>
            <div className="send-token-to-main">
              <DropdownInput
                name="to"
                value={to}
                onChange={this.handleOnChange}
                placeholder="Enter or select an address"
                zIndex={1}
                items={wallets}
                error={validation.to.isInvalid}
                addressBook={addressBook}
              />
              <FontError>
                {validation.to.message}
                {' '}
              </FontError>
            </div>
            <DarkDivider className="send-token-to-divider" />
          </div>

          <div className="send-token-amount">
            <div className="send-token-amount-info">
              <div className="send-token-amount-label">
                <FontRegular
                  style={{
                    fontSize: 14,
                    color: '#ACACAC',
                    textAlign: 'left',
                    marginBottom: 0,
                  }}
                >
                  Amount
                </FontRegular>
              </div>
              <div className="send-token-amount-convert" />
            </div>

            <div className="send-token-amount-main">
              <Input
                style={{ width: 316.34 }}
                name="amount"
                value={amount}
                placeholder={`Enter how much ${selectedToken.name} to send`}
                onChange={this.handleOnChange}
                onBlur={this.amountExceedValidation}
                error={validation.amount.isInvalid || !amountExceedValidate}
              />
              <FontError>
                {validation.amount.message.match(/granularity/)
                  ? `${validation.amount.message} (${selectedToken.granularity})`
                  : validation.amount.message}
                {validation.amount.message === '' ? validation.nrgLimit.message : ''}
              </FontError>
            </div>
            <DarkDivider className="send-token-amount-divider" />
          </div>

          <div className="send-token-nrg-price">
            <div className="send-token-nrg-top-info">
              <div className="send-token-nrg-label">
                <FontRegular
                  style={{
                    fontSize: 14,
                    color: '#ACACAC',
                    textAlign: 'left',
                    marginBottom: 0,
                  }}
                >
                  NRG Price
                </FontRegular>
              </div>
              <div className="send-token-nrg-custom" />
            </div>

            <div className="send-token-nrg-slow">
              <ButtonSM
                color={selectedNrgType === 'slow' ? 'secondary' : 'primary'}
                name="slow"
                onClick={this.handleNrgSelection}
              >
                Slow
              </ButtonSM>
              <FontRegular
                style={{
                  fontSize: 11,
                  textAlign: 'center',
                  marginBottom: 0,
                  marginTop: 5,
                }}
              >
                {nrgInAmp.slow}
                {' '}
Amp
              </FontRegular>
              <FontRegular
                style={{
                  fontSize: 10,
                  opacity: 0.33,
                  textAlign: 'center',
                }}
              >
                {nrgInUsd.slow}
                {' '}
USD
              </FontRegular>
            </div>
            <div className="send-token-nrg-normal">
              <ButtonSM
                color={selectedNrgType === 'normal' ? 'secondary' : 'primary'}
                name="normal"
                onClick={this.handleNrgSelection}
              >
                Normal
              </ButtonSM>
              <FontRegular
                style={{
                  fontSize: 11,
                  textAlign: 'center',
                  marginBottom: 0,
                  marginTop: 5,
                }}
              >
                {nrgInAmp.normal}
                {' '}
Amp
              </FontRegular>
              <FontRegular
                style={{
                  fontSize: 10,
                  opacity: 0.33,
                  textAlign: 'center',
                }}
              >
                {nrgInUsd.normal}
                {' '}
USD
              </FontRegular>
            </div>
            <div className="send-token-nrg-fast">
              <ButtonSM
                color={selectedNrgType === 'fast' ? 'secondary' : 'primary'}
                name="fast"
                onClick={this.handleNrgSelection}
              >
                Fast
              </ButtonSM>
              <FontRegular
                style={{
                  fontSize: 11,
                  textAlign: 'center',
                  marginBottom: 0,
                  marginTop: 5,
                }}
              >
                {nrgInAmp.fast}
                {' '}
Amp
              </FontRegular>
              <FontRegular
                style={{
                  fontSize: 10,
                  opacity: 0.33,
                  textAlign: 'center',
                }}
              >
                {nrgInUsd.fast}
                {' '}
USD
              </FontRegular>
            </div>

            <div className="send-token-nrg-info">
              <FontRegular
                style={{ fontSize: 15, textAlign: 'center' }}
              >
                {`NRG Limit ${nrgLimit}`}
              </FontRegular>
            </div>
          </div>
          {selectedToken.id === 'aion' && (
            <div className="send-token-hex-data">
              <div className="send-token-hex-data-label">
                <FontRegular className="send-token-label">Hex Data</FontRegular>
              </div>
              <div className="send-token-hex-data-main">
                <Input
                  style={{ width: 316.34 }}
                  name="hexData"
                  value={hexData}
                  onChange={this.handleOnChange}
                  onBlur={this.handlePollingNrgLimit}
                  placeholder="Enter Hex Data"
                  error={validation.hexData.isInvalid}
                />
                <FontError>{validation.hexData.message}</FontError>
              </div>
            </div>
          )}

          <div className="send-token-next-btn">
            <ButtonLG
              color="secondary"
              disabled={!validation.isValid || validatorJs.isEmpty(amount)}
              onClick={this.handleSubmission}
            >
              Next
            </ButtonLG>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  inputTransactionDetails: txnDetails => dispatch(inputTransactionDetails(txnDetails)),
  changePageStatus: page => dispatch(changePageStatus(page)),
  saveSendTokenState: state => dispatch(saveSendTokenState(state)),
  toggleApplicationAnimationOff: () => dispatch(toggleApplicationAnimationOff()),
  getVaultBalance: () => dispatch(getVaultBalance()),
  createToast: toastOptions => dispatch(createToast(toastOptions)),
  fetchNrgLimit: (to, amount, validatedHexData) => dispatch(fetchNrgLimit(to, amount, validatedHexData)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SendToken);

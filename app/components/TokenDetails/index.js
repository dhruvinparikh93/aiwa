import React, { Component } from 'react';
import { connect } from 'react-redux';
import Animated from 'animated/lib/targets/react-dom';

// Import Components
import CountUp from 'react-countup';
import ButtonMD from '../Common/Buttons/ButtonMD';
import FontBold from '../Common/Fonts/FontBold';
import { IconListToken, IconInfo } from '../Common/Icon';
import FontLight from '../Common/Fonts/FontLight';
import FontRegular from '../Common/Fonts/FontRegular';
import LightDivider from '../Common/Divider/LightDivider';

// Import actions
import { changePageStatus } from '../../constants/common';
import { fetchMarketData } from '../../actions/home';
import { fetchNrgPrice, fetchNrgLimit } from '../../actions/transaction';
import { convertNumberToFormattedString } from '../../services/numberFormatter';
import toggleApplicationAnimationOff from '../../actions/animation';

// Import constants
import { SEND_TRANSACTION_PAGE, DEPOSIT_PAGE } from '../../constants/navigation';
import {
  TOKEN_MARKET_DATA,
  applicationSettingsAnimatedMap,
  toggleTokenMarketDetails,
} from '../../constants/animation';
import { animateApplicationSetting } from '../../services/animationService';

// Import styles
import {
  detailAttribute, detailAttributeValue, buttonSeeMore, tokenName
} from './styles';
import './styles.css';

const mapStateToProps = state => ({
  pageStatus: state.appState.pageStatus,
  marketData: state.appState.marketData,
  wallets: state.wallets.wallets,
  currentWallet: state.wallets.currentWallet,
  currentWalletBalance: state.wallets.currentWalletBalance,
  selectedToken: state.tokens.selectedToken,
  tokenList: state.tokens.tokenList,
  showTokenMarketData: state.animationReducer.showTokenMarketData,
});

const marketDataAnimatedHeight = applicationSettingsAnimatedMap.get(TOKEN_MARKET_DATA);

class TokenDetails extends Component {
  constructor(props) {
    super(props);

    // Get Data from Selected Token

    this.state = {
      buttonText: 'See token details',
      selectedTokenName: '',
      selectedTokenId: undefined,

      newBalance: 0,
      oldBalance: 0,
      usdBalance: 0,
      // selectedTokenCurrentPrice: '-',
      selectedTokenMarketData: {},
    };
  }

  static getDerivedStateFromProps(props, state) {
    let newState = null;
    let error = null;

    if (
      props.currentWalletBalance
      && props.selectedToken
      && props.currentWalletBalance.selectedToken
    ) {
      const {
        balance: { amount, usd },
      } = props.currentWalletBalance.selectedToken;
      const { id, symbol } = props.selectedToken;
      const { marketData } = props;
      error = marketData.error
        ? marketData.error
        : marketData[id].marketData.error
          ? marketData[id].marketData.error
          : null;
      const tokenMarketData = props.marketData[id].marketData;
      const newBalance = amount;
      const oldBalance = state.newBalance;

      newState = {
        selectedTokenCurrentPrice: !error ? tokenMarketData.currentPrice : '',
        selectedTokenMarketData: tokenMarketData,
        selectedTokenName: symbol.toUpperCase(),
        selectedTokenId: id,
        oldBalance,
        newBalance,
        usdBalance: usd || '',
        ...newState,
      };
    }

    if (props.showTokenMarketData) {
      newState = {
        buttonText: 'See less',
        ...newState,
      };
    }

    if (!props.showTokenMarketData) {
      newState = {
        buttonText: 'See token details',
        ...newState,
      };
    }

    return newState;
  }

  toggle = () => {
    const toValue = this.state.selectedTokenCurrentPrice === '' ? 60 : 240;

    this.props.toggleApplicationAnimationOff();

    this.props.toggleTokenMarketDetails(!this.props.showTokenMarketData);

    animateApplicationSetting(TOKEN_MARKET_DATA, toValue);
  };

  handelSend = () => {
    this.props.fetchNrgPrice();
    this.props.fetchNrgLimit();
    this.props.changePageStatusFunc(SEND_TRANSACTION_PAGE);
  };

  handelDeposit = () => {
    const {
      props: { changePageStatusFunc },
    } = this;
    changePageStatusFunc(DEPOSIT_PAGE);
  };

  showListOfTokens = () => {
    this.props.showListOfTokens();
  };

  render() {
    const { selectedTokenMarketData } = this.state;
    const { marketData } = this.props;

    let error = true;
    if (marketData && marketData.error) {
      ({ error } = marketData);
    } else if (this.state.selectedTokenId && marketData) {
      ({ error } = marketData[this.state.selectedTokenId].marketData);
    }

    return (
      <div>
        <div className="token-details-grid-containers">
          <div className="token-details-grid-token-name">
            <p style={tokenName}>{this.state.selectedTokenName}</p>
          </div>

          <div className="token-details-grid-token-balance">
            <div className="token-balance-grid-amount">
              <CountUp
                start={Number(this.state.oldBalance)}
                end={Number(this.state.newBalance)}
                formattingFn={convertNumberToFormattedString}
                duration={1.4}
                decimals={2}
                decimal="."
                useEasing
              />
            </div>

            {this.state.usdBalance ? (
              <p className="token-balance-grid-usd">
                $
                {convertNumberToFormattedString(this.state.usdBalance)}
                {' '}
USD
              </p>
            ) : null}
            <div className="token-details-grid-arrow-icon" onClick={this.showListOfTokens}>
              <IconListToken size={31} />
            </div>
          </div>

          <div className="token-details-grid-deposit-button">
            <ButtonMD color="primary" onClick={this.handelDeposit}>
              Receive
            </ButtonMD>
          </div>

          <div className="token-details-grid-send-button">
            <ButtonMD color="primary" onClick={this.handelSend}>
              Send
            </ButtonMD>
          </div>

          <Animated.div
            className="token-details-grid-token-market-details"
            style={{
              height: marketDataAnimatedHeight,
              overflow: 'hidden',
            }}
          >
            <LightDivider />

            {marketData && this.state.selectedTokenId !== '' ? (
              error ? (
                <div className="token-details-market-data-error">
                  <FontRegular style={detailAttributeValue}>
                    <IconInfo />
                    Pricing information could not be retrieved or is not available for this token.
                  </FontRegular>
                </div>
              ) : (
                <div className="token-details-market-data-grid-containers">
                  <div className="token-details-market-data-market-cap">
                    <FontBold style={detailAttribute}>Market Cap</FontBold>
                    <FontLight style={detailAttributeValue}>
                      {`$ ${selectedTokenMarketData.marketCap}`}
                    </FontLight>
                  </div>
                  <div className="token-details-market-data-current-price">
                    <FontBold style={detailAttribute}>Current Price</FontBold>
                    <FontLight style={detailAttributeValue}>
                      {`$ ${selectedTokenMarketData.currentPrice}`}
                    </FontLight>
                  </div>
                  <div className="token-details-market-data-price-movement">
                    <FontBold style={detailAttribute}>Change (24h)</FontBold>

                    <FontLight style={detailAttributeValue}>
                      {`${selectedTokenMarketData.priceChangePercentage24h > 0 ? '+' : ''}${`${
                        selectedTokenMarketData.priceChangePercentage24h
                      }%`}`}
                    </FontLight>
                  </div>
                  <div className="token-details-market-data-volume">
                    <FontBold style={detailAttribute}>Volume</FontBold>
                    <FontLight style={detailAttributeValue}>
                      {`$ ${selectedTokenMarketData.totalVolume}`}
                    </FontLight>
                  </div>
                  <div className="token-details-market-data-circulating-supply">
                    <FontBold style={detailAttribute}>Circulating Supply</FontBold>
                    <FontLight style={detailAttributeValue}>
                      {selectedTokenMarketData.circulatingSupply}
                    </FontLight>
                  </div>
                  <div className="token-details-market-data-max-supply">
                    <FontBold style={detailAttribute}>Max Supply</FontBold>
                    <FontLight style={detailAttributeValue}>-</FontLight>
                  </div>
                </div>
              )
            ) : null}
          </Animated.div>
        </div>
        <div className="token-details-market-data-button">
          <FontBold>
            <a style={buttonSeeMore} onClick={this.toggle}>
              {this.state.buttonText}
            </a>
          </FontBold>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatusFunc: newPage => dispatch(changePageStatus(newPage)),
  fetchMarketData: tokenID => dispatch(fetchMarketData(tokenID)),
  toggleApplicationAnimationOff: () => dispatch(toggleApplicationAnimationOff()),
  toggleTokenMarketDetails: bool => dispatch(toggleTokenMarketDetails(bool)),
  fetchNrgPrice: () => dispatch(fetchNrgPrice()),
  fetchNrgLimit: () => dispatch(fetchNrgLimit()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TokenDetails);

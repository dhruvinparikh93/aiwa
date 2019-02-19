import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changePageStatus } from '../../constants/common';

// Import Components
import ButtonLG from '../Common/Buttons/ButtonLG';
import TokenList from './TokenList';

// Import Styles
import './styles.css';
import { ADD_TOKEN_PAGE } from '../../constants/navigation';

class Tokens extends Component {
  handleAddToken = () => {
    this.props.changePageStatus(ADD_TOKEN_PAGE);
  };

  render() {
    return (
      <div className="token-container">
        <div className="token-container-content">
          <TokenList {...this.props} hideListOfTokens={this.props.hideListOfTokens} />
        </div>

        <div className="token-container-add-token-button">
          <ButtonLG color="secondary" onClick={this.handleAddToken}>
            Add Token
          </ButtonLG>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatus: newPage => dispatch(changePageStatus(newPage)),
});

export default connect(
  null,
  mapDispatchToProps,
)(Tokens);

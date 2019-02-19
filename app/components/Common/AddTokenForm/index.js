import React, { Component } from 'react';

//Import common components
import FontRegular from '../Fonts/FontRegular';
import Input from '../Inputs/Input';
import FontError from '../Fonts/FontError';

//Import styles
import './styles.css';

export default class AddTokenForm extends Component {
  render() {
    const {
      title,
      address,
      onChange,
      error,
      canEditContractAddress,
      validationAddressMessage,
      name,
      symbol,
      decimals,
      pageErrorMessage,
    } = this.props;
    const fontLabelStyle = {
      fontSize: 14,
      color: '#ACACAC',
      textAlign: 'left',
      marginBottom: 5,
    };
    const fontTitleStyle = {
      fontSize: 17,
    };
    return (
      <div className="add-token-form-container">
        <div className="add-token-form-title">
          <FontRegular style={fontTitleStyle}>{title}</FontRegular>
        </div>
        <div className="add-token-form-contract-address">
          <FontRegular style={fontLabelStyle}>Contract Address</FontRegular>
          <Input
            name="address"
            value={address}
            readOnly={!canEditContractAddress}
            onChange={onChange}
            error={error}
          />
          <FontError>{validationAddressMessage}</FontError>
        </div>
        <div className="add-token-form-name">
          <FontRegular style={fontLabelStyle}>Name</FontRegular>
          <Input name="name" value={name} readOnly />
        </div>
        <div className="add-token-form-symbol">
          <FontRegular style={fontLabelStyle}>Symbol</FontRegular>
          <Input name="symbol" value={symbol} style={{ width: 260.34 / 2.5 }} readOnly />
        </div>
        <div className="add-token-form-decimals">
          <FontRegular style={fontLabelStyle}>Decimals</FontRegular>
          <Input name="decimals" value={decimals} style={{ width: 260.34 / 2.5 }} readOnly />
        </div>
        <div className="add-token-form-button">
          <FontError>{pageErrorMessage}</FontError>
          {this.props.children}
        </div>
      </div>
    );
  }
}

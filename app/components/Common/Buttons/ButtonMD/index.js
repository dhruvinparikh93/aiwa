import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import '../styles.css';

class ButtonMD extends Component {
  static defaultProps = {
    color: 'primary',
    disabled: false,
  };

  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    color: PropTypes.oneOf(['primary', 'secondary']),
  };

  render() {
    const buttonMDClassNames = classNames({
      [`button-md-${this.props.color}`]: true,
      'aiwa-button-disabled': this.props.disabled,
    });
    return (
      <div>
        <button
          type="button"
          disabled={this.props.disabled}
          onClick={this.props.onClick}
          className={buttonMDClassNames}
        >
          {this.props.children}
        </button>
      </div>
    );
  }
}

export default ButtonMD;

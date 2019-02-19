import React, { Component } from 'react';

import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import './styles.css';
import '../styles.css';

class ButtonXS extends Component {
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
    const { color, ...otherProps } = this.props;

    const buttonSMClassNames = classNames({
      [`button-xs-${this.props.color}`]: true,
      'aiwa-button-color-transition ': true,
      'aiwa-button-disabled': this.props.disabled,
    });
    return (
      <div>
        <button type="button" className={buttonSMClassNames} {...otherProps}>
          {this.props.children}
        </button>
      </div>
    );
  }
}

export default ButtonXS;

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import '../commonStyles.css';

export default class InputArea extends PureComponent {
  render() {
    const {
      error, errorText, value, onChange, ...otherProps
    } = this.props;

    const aiwaInputClassName = classNames({
      'aiwa-input-area': true,
      'aiwa-input-area-error': error,
    });

    return (
      <textarea className={aiwaInputClassName} value={value} onChange={onChange} {...otherProps} />
    );
  }
}

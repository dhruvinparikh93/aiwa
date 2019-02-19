import React, { PureComponent } from 'react';
import classNames from 'classnames';
import '../commonStyles.css';

export default class Input extends PureComponent {
  render() {
    const {
      error, errorText, value, onChange, ...otherProps
    } = this.props;

    const aiwaInputClassName = classNames({
      'aiwa-input': true,
      'aiwa-input-error': error,
      'aiwa-input-readonly': this.props.readOnly,
    });

    return (
      <input className={aiwaInputClassName} value={value} onChange={onChange} {...otherProps} />
    );
  }
}

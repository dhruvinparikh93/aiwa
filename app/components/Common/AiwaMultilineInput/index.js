import React, { PureComponent } from 'react';
import './styles.css';
import classNames from 'classnames';

export default class AiwaMultilineInput extends PureComponent {
  render() {
    const {
      width, height, error, errorText, value, onChange, ...otherProps
    } = this.props;

    const aiwaInputClassNames = classNames({
      'aiwa-multiline-input': true,
      'aiwa-multiline-error': error,
    });

    return (
      <div
        style={{ height, width }}
        className={aiwaInputClassNames}
        value={value}
        onChange={onChange}
        {...otherProps}
      />
    );
  }
}

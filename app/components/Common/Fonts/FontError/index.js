import React, { PureComponent } from 'react';
import './styles.css';

export default class FontError extends PureComponent {
  render() {
    const { children, ...otherProps } = this.props;
    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <p className="aiwa-font-error" {...otherProps}>
          {children}
        </p>
      </div>
    );
  }
}

import React, { Component } from 'react';
import classnames from 'classnames';
import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';

//Import styles
import './styles.css';

class ToggleSwitch extends Component {
  state = { enabled: this.enabledFromProps() };

  isEnabled = () => this.state.enabled;

  toggleSwitch = evt => {
    evt.persist();
    evt.preventDefault();

    const { onClick, onStateChanged } = this.props;

    this.setState({ enabled: !this.state.enabled }, () => {
      const { state } = this;

      // Augment the event object with SWITCH_STATE
      const switchEvent = Object.assign(evt, { SWITCH_STATE: state });

      // Execute the callback functions
      if (isFunction(onClick)) {
        onClick(switchEvent);
      }
      if (isFunction(onStateChanged)) {
        onStateChanged(state);
      }
    });
  };

  enabledFromProps() {
    let { enabled } = this.props;

    // If enabled is a function, invoke the function
    enabled = isFunction(enabled) ? enabled() : enabled;

    // Return enabled if it is a boolean, otherwise false
    return isBoolean(enabled) && enabled;
  }

  render() {
    const { enabled } = this.state;

    // Isolate special props and store the remaining as otherProps
    const {
      enabled: _enabled,
      theme,
      onClick,
      className,
      onStateChanged,
      ...otherProps
    } = this.props;

    // Use default as a fallback theme if valid theme is not passed
    const switchTheme = theme && isString(theme) ? theme : 'default';

    const switchClasses = classnames(`switch switch--${switchTheme}`, className);

    const togglerClasses = classnames('switch-toggle', `switch-toggle--${enabled ? 'on' : 'off'}`);

    return (
      <div className={switchClasses} onClick={this.toggleSwitch} {...otherProps}>
        <div className={togglerClasses} />
      </div>
    );
  }
}

export default ToggleSwitch;

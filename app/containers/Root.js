import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import getEnvironmentType from '../components/Utils/environment';

export default class Root extends Component {
  constructor(props) {
    super(props);
    window.AIWA_UI_TYPE = getEnvironmentType(window.location.href);
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

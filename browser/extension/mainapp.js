import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import { getStore, getHashKeyFromProcess } from '../../app/utils/storage';
import { updateApplicationState } from '../../app/services/watcherService';

async function updateDom() {
  await getHashKeyFromProcess();
  const storeObj = await getStore();
  updateApplicationState(storeObj);
  ReactDOM.render(<Root store={storeObj} />, document.querySelector('#root'));
}

updateDom();

import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth';
import files from './files';

export default combineReducers({
  auth,
  files,
})
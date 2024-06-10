import React from 'react';
import { State } from './type';
import reduce from './reduce';
import initialState from './state';

const stateContext = React.createContext<any>([initialState, reduce]);

export default stateContext;
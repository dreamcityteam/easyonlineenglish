import React from 'react';
import { State } from './type';
import reduce from './reduce';
import initialState from './state';

const stateContext = React.createContext<[State, any]>([initialState, reduce]);

export default stateContext;
import _ from 'lodash';
import * as types from '../actions/bidTypes';

const initialState = {
  bidding: false,
  cycles: 0,
  tradepile: [],
  watchlist: [],
  unassigned: [],
};

export function bid(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case types.START_BIDDING:
      nextState = _.merge({}, state, { bidding: true });
      return nextState;
    case types.STOP_BIDDING:
      nextState = _.merge({}, state, { bidding: false });
      return nextState;
    case types.SET_CYCLES:
      nextState = _.merge({}, state, { cycles: action.count });
      return nextState;
    case types.SET_WATCHLIST:
      nextState = _.merge({}, state, { watchlist: action.watchlist });
      return nextState;
    case types.SET_TRADEPILE:
      nextState = _.merge({}, state, { tradepile: action.tradepile });
      return nextState;
    case types.SET_UNASSIGNED:
      nextState = _.merge({}, state, { unassigned: action.unassigned });
      return nextState;
    default:
      return state;
  }
}

export { bid as default };
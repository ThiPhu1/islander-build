import random from 'lodash.random';

import { constants, mocks } from '../utils/constants';

export const initialState = {
    row: random(0, constants.MAX_ROW - 1),
    col: random(0, constants.MAX_COLUMN - 1),
    currentPlayer: mocks.CURRENT_PLAYER,
};

export function reducer(state, action) {
    switch (action.type) {
        case 'MOVE':
            return {
                ...state,
                row: action.payload.row,
                col: action.payload.col,
            };
        default:
            return state;
    }
}

import { createAction } from 'redux-actions'

import * as types from './types'

export const saveMemo = createAction(types.SAVE_MEMO)
export const getMemo = createAction(types.GET_MEMO)

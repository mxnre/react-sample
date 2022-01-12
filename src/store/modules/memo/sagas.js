import { takeEvery } from 'redux-saga/effects'

import { apiCallSaga } from '../api'
import { SAVE_MEMO, GET_MEMO } from './types'

const saveMemo = apiCallSaga({
  type: SAVE_MEMO,
  method: 'post',
  path: '/api/memo/',
  selectorKey: 'memoSave'
})

const getMemo = apiCallSaga({
  type: GET_MEMO,
  method: 'get',
  path: '/api/memo/',
  selectorKey: 'memoGet'
})

export default function* rootSaga() {
  yield takeEvery(SAVE_MEMO, saveMemo)
  yield takeEvery(GET_MEMO, getMemo)
}

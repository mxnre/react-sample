import { takeLatest } from 'redux-saga/effects'
import { apiCallSaga } from '../api'
import {
  GET_MONTHLY_REPORT_LIST,
  GET_MONTHLY_REPORT_FILE,
  GET_WEEKLY_REPORT,
  GET_PUMP_REPORT_LIST,
  GET_PUMP_REPORT_DETAIL,
  UPLOAD_PUMP_REPORT
} from './types'

const getMonthlyReportList = apiCallSaga({
  type: GET_MONTHLY_REPORT_LIST,
  method: 'get',
  allowedParamKeys: [],
  path: '/api/reports/monthly-reports/',
  selectorKey: 'monthlyReportList'
})

const getMonthlyReportFile = apiCallSaga({
  type: GET_MONTHLY_REPORT_FILE,
  method: 'get',
  allowedParamKeys: ['view'],
  path: ({ payload }) => `/download/monthly-report/${payload.id}/`
})

const getWeeklyReport = apiCallSaga({
  type: GET_WEEKLY_REPORT,
  method: 'get',
  allowedParamKeys: ['sensor_id', 'chemical'],
  path: '/api/reports/weekly-reports/',
  selectorKey: 'weeklyReport'
})

const getPumpReportList = apiCallSaga({
  type: GET_PUMP_REPORT_LIST,
  method: 'get',
  allowedParamKeys: [],
  path: '/api/pumps/compare-reports/',
  selectorKey: 'pumpReportList'
})

const getPumpReportDetail = apiCallSaga({
  type: GET_PUMP_REPORT_DETAIL,
  method: 'get',
  allowedParamKeys: ['last-hours'],
  path: ({ payload }) => `/api/pumps/compare-reports/${payload.id}/`,
  selectorKey: 'pumpReportDetail'
})

const uploadPumpReport = apiCallSaga({
  type: UPLOAD_PUMP_REPORT,
  method: 'post',
  path: '/api/pumps/compare-reports/',
  selectorKey: 'uploadPumpReport'
})

export default function* rootSaga() {
  yield takeLatest(GET_MONTHLY_REPORT_LIST, getMonthlyReportList)
  yield takeLatest(GET_MONTHLY_REPORT_FILE, getMonthlyReportFile)
  yield takeLatest(GET_WEEKLY_REPORT, getWeeklyReport)

  yield takeLatest(GET_PUMP_REPORT_LIST, getPumpReportList)
  yield takeLatest(GET_PUMP_REPORT_DETAIL, getPumpReportDetail)
  yield takeLatest(UPLOAD_PUMP_REPORT, uploadPumpReport)
}

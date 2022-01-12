import { createAction } from 'redux-actions'

import * as types from './types'

export const getMonthlyReportList = createAction(types.GET_MONTHLY_REPORT_LIST)
export const getMonthlyReportFile = createAction(types.GET_MONTHLY_REPORT_FILE)
export const getWeeklyReport = createAction(types.GET_WEEKLY_REPORT)

export const getPumpReportDetail = createAction(types.GET_PUMP_REPORT_DETAIL)
export const uploadPumpReport = createAction(types.UPLOAD_PUMP_REPORT)
export const getPumpReportList = createAction(types.GET_PUMP_REPORT_LIST)

import React, { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import MonthlyReport from '../MonthlyReport'
import WeeklyReport from '../WeeklyReport'
import { getMonthlyReportList, getWeeklyReport } from 'store/modules/report'

const Report = ({ getMonthlyReportList, getWeeklyReport }) => {
  const location = useLocation()

  const [monthlyReportList, setMonthlyReportList] = useState(null)

  const [weeklyReport, setWeeklyReport] = useState(null)

  useEffect(() => {
    getMonthlyReportList({
      success: setMonthlyReportList
    })
    getWeeklyReport({
      params: {
        sensor_id: Number(new URLSearchParams(location.search).get('sensor')),
        chemical: 'chlorine'
      },
      success: setWeeklyReport
    })
  }, [getMonthlyReportList, getWeeklyReport, location.search])

  const handleChemicalChange = useCallback(
    chemical => {
      getWeeklyReport({
        params: {
          sensor_id: Number(new URLSearchParams(location.search).get('sensor')),
          chemical
        },
        success: setWeeklyReport
      })
    },
    [getWeeklyReport, location.search]
  )

  return (
    <Tabs defaultActiveKey="weekly" className="Report">
      <Tab eventKey="weekly" title="Weekly CL2">
        <WeeklyReport data={weeklyReport} onChemicalChange={handleChemicalChange} />
      </Tab>
      <Tab eventKey="other" title="Other">
        <MonthlyReport data={monthlyReportList} />
      </Tab>
    </Tabs>
  )
}

const actions = {
  getMonthlyReportList,
  getWeeklyReport
}

export default connect(null, actions)(Report)

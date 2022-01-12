import React, { useEffect, useCallback, useState } from 'react'
import { createStructuredSelector } from 'reselect'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Field, Formik } from 'formik'
import * as Yup from 'yup'
import { connect } from 'react-redux'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FormInput from 'components/FormInput'
import Loader from 'components/Loader'
import Typography from 'components/Typography'
import { formSubmit } from 'utils/form'
import PumpReportDetail from './PumpReportDetail'
import { pumpReportSelector, getPumpReportDetail, uploadPumpReport } from 'store/modules/report'
import { isRequestPending } from 'store/modules/api'

const prepareReportData = (data, startFrom, lastHours = 24) => {
  let channelARunTime = 0
  let channelBRunTime = 0
  let channelAStartNumber = 0
  let channelBStartNumber = 0
  const channel_a_values = []
  const channel_b_values = []

  const start = Math.max(data.length - 3600 * lastHours, 0)

  data.slice(start).forEach(item => {
    if (Number(item[1]) === 1) {
      channelARunTime += 1
    }
    if (Number(item[5]) === 1) {
      channelBRunTime += 1
    }

    channelAStartNumber += Number(item[3])
    channelBStartNumber += Number(item[7])

    channel_a_values.push(item[0])
    channel_b_values.push(item[4])
  })

  return {
    pump_a: {
      total_runtime_sec: channelARunTime,
      num_starts: channelAStartNumber,
      values: channel_a_values
    },
    pump_b: {
      total_runtime_sec: channelBRunTime,
      num_starts: channelBStartNumber,
      values: channel_b_values
    },
    avg_fill_time_min: 0,
    total_gallons_pumped_day: 0,
    start_from: startFrom + start * 1000
  }
}

const ReportForm = ({ handleSubmit, isSubmitting }) => (
  <form className="PumpCompareReportForm" onSubmit={handleSubmit}>
    <Typography variant="subtitle" gutterBottom>
      Save your report
    </Typography>
    <Field name="name" label="Name" component={FormInput} autoFocus />
    <Field name="description" label="Description" component={FormInput} multiline />
    <div className="text-right">
      <Button disabled={isSubmitting} type="submit">
        Save Report
      </Button>
    </div>
    {isSubmitting && <Loader size={10} top={5} className="Login__loader" />}
  </form>
)

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required')
})

const initValues = {
  name: '',
  description: ''
}

const PumpReportDetailPage = ({ data: apiData, pending, getPumpReportDetail, uploadPumpReport }) => {
  const { id } = useParams()
  const location = useLocation()
  const history = useHistory()
  const [localData, setLocalData] = useState(null)
  const data = id === 'view' ? localData : apiData && apiData.report
  const rawData = location.state && location.state.rawData
  const startFrom = location.state && location.state.startFrom

  useEffect(() => {
    if (id === 'view' && !rawData) {
      history.push('/pump-reports')
    }
  }, [history, rawData, id])

  useEffect(() => {
    if (id === 'view') {
      if (rawData) {
        setLocalData(prepareReportData(rawData, startFrom))
      }
    } else {
      getPumpReportDetail({ id })
    }
  }, [getPumpReportDetail, id, rawData, startFrom])

  const handleLastHourChange = useCallback(
    value => {
      if (id === 'view') {
        setLocalData(prepareReportData(rawData, startFrom, value))
      } else {
        getPumpReportDetail({ id, params: { 'last-hours': value } })
      }
    },
    [getPumpReportDetail, id, rawData, startFrom]
  )

  const handleSubmit = useCallback(
    (values, formActions) =>
      formSubmit(
        uploadPumpReport,
        {
          data: {
            ...values,
            data: rawData.map(row => row.join('\t')).join('\n'),
            started_from: new Date(startFrom).toISOString()
          },
          success: () => history.push('/pump-reports')
        },
        formActions
      ),
    [rawData, startFrom, uploadPumpReport, history]
  )

  return (
    <div className="PumpReportDetailPage position-relative">
      <div className="d-flex justify-content-between mb-3">
        <Button to="/pump-reports" as={Link}>
          Back
        </Button>
        <Button to="/pump-reports/new" as={Link}>
          New Report
        </Button>
      </div>
      {id === 'view' && (
        <Card className="my-3">
          <Card.Body>
            <Formik
              component={ReportForm}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
              initialValues={initValues}
            />
          </Card.Body>
        </Card>
      )}
      {data && <PumpReportDetail data={data} onLastHourChange={handleLastHourChange} />}
      {pending && (
        <div className="absolute-full-parent">
          <Loader size={10} className="m-auto" />
        </div>
      )}
    </div>
  )
}

const selectors = createStructuredSelector({
  data: pumpReportSelector,
  pending: isRequestPending('pumpReportDetail')
})

const actions = {
  getPumpReportDetail,
  uploadPumpReport
}

export default connect(selectors, actions)(PumpReportDetailPage)

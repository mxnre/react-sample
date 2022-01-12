import React, { useCallback, useState } from 'react'
import { FormattedNumber } from 'react-intl'
import { Line as LineChart } from 'react-chartjs-2'
import moment from 'moment'
import find from 'lodash/find'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Typography from 'components/Typography'
import DropdownButton, { DropdownItem } from 'components/Dropdown'

import './PumpReportDetail.scss'

const PumpCard = ({ data, title }) => (
  <Card>
    <Card.Body>
      <Typography variant="title" gutterBottom>
        {title}
      </Typography>
      <div className="d-flex justify-content-between mb-1">
        <Typography className="PumpReportDetail__field">Total Runtime / sec</Typography>
        <Typography className="PumpReportDetail__value">{data.total_runtime_sec}</Typography>
      </div>
      <div className="d-flex justify-content-between mb-1">
        <Typography className="PumpReportDetail__field">Total Runtime / min</Typography>
        <Typography className="PumpReportDetail__value">
          <FormattedNumber value={data.total_runtime_sec / 60} format="decimal" />
        </Typography>
      </div>
      <div className="d-flex justify-content-between mb-1">
        <Typography className="PumpReportDetail__field">Total Runtime / hr</Typography>
        <Typography className="PumpReportDetail__value">
          <FormattedNumber value={data.total_runtime_sec / 3600} format="decimal" />
        </Typography>
      </div>
      <div className="d-flex justify-content-between mb-1">
        <Typography as="strong" className="PumpReportDetail__field">
          Avg Runtime / min
        </Typography>
        <Typography as="strong" className="PumpReportDetail__value">
          <FormattedNumber value={data.total_runtime_sec / 60 / data.num_starts} format="decimal" />
        </Typography>
      </div>
      <div className="d-flex justify-content-between mb-1">
        <Typography as="strong" className="PumpReportDetail__field">
          # of Starts
        </Typography>
        <Typography as="strong" className="PumpReportDetail__value">
          {data.num_starts}
        </Typography>
      </div>
    </Card.Body>
  </Card>
)

const OverallCard = ({ data }) => (
  <Card>
    <Card.Body>
      <Row>
        <Col sm={6} className="d-flex justify-content-between">
          <Typography as="strong" className="PumpReportDetail__field">
            Average Fill Time / min
          </Typography>
          <Typography as="strong" className="PumpReportDetail__value">
            {data.avg_fill_time_min}
          </Typography>
        </Col>
        <Col sm={6}>
          <div className="d-flex justify-content-between">
            <Typography as="strong" className="PumpReportDetail__field">
              Total Runtime Hours
            </Typography>
            <Typography as="strong" className="PumpReportDetail__value">
              <FormattedNumber
                value={(data.pump_a.total_runtime_sec + data.pump_b.total_runtime_sec) / 3600}
                format="decimal"
              />
            </Typography>
          </div>
          <div className="d-flex justify-content-between">
            <Typography as="strong" className="PumpReportDetail__field">
              Total Gallons Pumped / Day
            </Typography>
            <Typography as="strong" className="PumpReportDetail__value">
              <FormattedNumber value={data.total_gallons_pumped_day} format="decimal" />
            </Typography>
          </div>
        </Col>
      </Row>
    </Card.Body>
  </Card>
)

const graphs = [
  { label: 'Pump A', data: 'pump_a', color: '#6dc2ff' },
  { label: 'Pump B', data: 'pump_b', color: '#c793ff' }
]

const lastHoursOptions = [
  { label: 'Last 24 hours', value: 24 },
  { label: 'Last 7 days', value: 24 * 7 }
]

const PumpGraph = ({ data, everySecond }) => {
  const graphData = useCallback(
    canvas => {
      const cts = canvas.getContext('2d')
      const init = Array(Math.round(data.pump_a.values.length / everySecond)).fill(0)
      return {
        labels: init.map((i, k) => moment(data.start_from + k * everySecond * 1000).format('hh:mm:ss')),
        datasets: graphs.map(graph => {
          const gradient = cts.createLinearGradient(0, 0, 0, 200)
          gradient.addColorStop(0, graph.color)
          gradient.addColorStop(1, `${graph.color}00`)

          return {
            label: graph.label,
            data: init.map((i, k) => data[graph.data].values[k * everySecond]),
            borderColor: graph.color,
            backgroundColor: gradient,
            borderWidth: 1.5,
            pointRadius: 2
          }
        })
      }
    },
    [data, everySecond]
  )

  return (
    <Card>
      <Card.Body className="PumpReportDetail__Chart">
        <LineChart data={graphData} options={{ maintainAspectRatio: false }} />
      </Card.Body>
    </Card>
  )
}

export default ({ data, onLastHourChange }) => {
  const [lastHours, setLastHours] = useState(lastHoursOptions[0].value)

  const handleLastHoursChange = useCallback(
    value => () => {
      setLastHours(value)
      onLastHourChange(value)
    },
    [onLastHourChange]
  )

  return (
    <Row className="PumpReportDetail card-row">
      <Col sm={6}>
        <PumpCard data={data.pump_a} title="Pump A" />
      </Col>
      <Col sm={6}>
        <PumpCard data={data.pump_b} title="Pump B" />
      </Col>
      <Col xs={12}>
        <OverallCard data={data} />
      </Col>
      <Col xs={12}>
        <DropdownButton
          className="PumpReportDetail__Last-hours position-absolute"
          title={find(lastHoursOptions, o => o.value === lastHours).label}>
          {lastHoursOptions.map(i => (
            <DropdownItem key={i.value} onClick={handleLastHoursChange(i.value)}>
              {i.label}
            </DropdownItem>
          ))}
        </DropdownButton>
        <PumpGraph data={data} everySecond={60 * 15} />
      </Col>
    </Row>
  )
}

import React, { useState, useCallback } from 'react'
import cn from 'classnames'
import moment from 'moment'
import { FormattedDate, FormattedNumber } from 'react-intl'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Typography from 'components/Typography'
import DropdownButton, { DropdownItem } from 'components/Dropdown'
import IconLogoV from 'icons/IconLogoV'
import IconPrinter from 'icons/IconPrinter'
import { CHEMICALS } from 'config/constants'
import { getChemicalType } from 'utils/chemical'

import './WeeklyReport.scss'

const today = moment()
const weekStart = moment()
  .subtract(1, 'weeks')
  .startOf('isoWeek')
const weekEnd = moment()
  .subtract(1, 'weeks')
  .endOf('isoWeek')

const WeeklyReport = ({ className, data, onChemicalChange }) => {
  const [chemical, setChemical] = useState(CHEMICALS[0].id)

  const selectedChemical = getChemicalType(chemical)

  const handleChemicalChange = useCallback(
    value => () => {
      onChemicalChange(value)
      setChemical(value)
    },
    [onChemicalChange]
  )

  const handlePrintClick = () => window.print()

  return (
    <Card className={cn(className, 'WeeklyReport', 'align-items-center')}>
      <Card.Body className="p-5 WeeklyReport__body">
        <DropdownButton title={selectedChemical.name} className="WeeklyReport__chemical-picker">
          {CHEMICALS.map(ch => (
            <DropdownItem key={ch.id} onClick={handleChemicalChange(ch.id)}>
              {ch.name}
            </DropdownItem>
          ))}
        </DropdownButton>
        <Typography className="WeeklyReport__title text-center mb-3">
          Weekly {selectedChemical.name} Residual Report
          <br />
          <FormattedDate format="dayMonthAndYear" value={today} />
        </Typography>
        <Typography className="WeeklyReport__last-week text-center mb-3">
          <FormattedDate format="twoDigit" value={weekStart} />
          &nbsp;-&nbsp;
          <FormattedDate format="twoDigit" value={weekEnd} />
        </Typography>

        <Row className="mx-n1 mx-sm-n3">
          <Col className="p-1 p-sm-3 col-6 col-sm-4 col-md-6 col-lg-4 WeeklyReport__tile">
            <Card className="rounded h-100 text-center">
              <Card.Body>
                <Typography>{data && data.sensor_address}</Typography>
                <Typography as="strong">Chlorine Residual</Typography>
                <Typography className="WeeklyReport__value">
                  <FormattedNumber value={data && data.latest_data} format="sensorValue" />
                </Typography>
                <Typography className="WeeklyReport__unit">mg/l</Typography>
              </Card.Body>
            </Card>
          </Col>

          <Col className="p-1 p-sm-3 col-6 col-sm-4 col-md-6 col-lg-4 WeeklyReport__tile">
            <Card className="rounded h-100 text-center">
              <Card.Body>
                <Typography>
                  Count of Readings
                  <br />
                  Below 0.5 mg/L
                </Typography>
                <Typography className="WeeklyReport__value">{data && data.below_05_count}</Typography>
              </Card.Body>
            </Card>
          </Col>

          <Col className="p-1 p-sm-3 col-6 col-sm-4 col-md-6 col-lg-4 WeeklyReport__tile">
            <Card className="rounded h-100 text-center">
              <Card.Body>
                <Typography>
                  Count of Readings
                  <br />
                  above 2.5 mg/L
                </Typography>
                <Typography className="WeeklyReport__value">{data && data.above_25_count}</Typography>
              </Card.Body>
            </Card>
          </Col>

          <Col className="p-1 p-sm-3 col-6 col-sm-4 col-md-6 col-lg-4 WeeklyReport__tile">
            <Card className="rounded h-100 text-center">
              <Card.Body>
                <Typography>
                  Average CL2 reading
                  <br />
                  over the last week
                </Typography>
                <Typography className="WeeklyReport__value">
                  <FormattedNumber value={data && data.avg} format="sensorValue" />
                </Typography>
                <Typography className="WeeklyReport__unit">mg/L</Typography>
              </Card.Body>
            </Card>
          </Col>

          <Col className="p-1 p-sm-3 col-6 col-sm-4 col-md-6 col-lg-4 WeeklyReport__tile">
            <Card className="rounded h-100 text-center">
              <Card.Body>
                <Typography>
                  Max CL2 reading
                  <br />
                  over the last week
                </Typography>
                <Typography className="WeeklyReport__value">
                  <FormattedNumber value={data && data.max} format="sensorValue" />
                </Typography>
                <Typography className="WeeklyReport__unit">mg/L</Typography>
              </Card.Body>
            </Card>
          </Col>

          <Col className="p-1 p-sm-3 col-6 col-sm-4 col-md-6 col-lg-4 WeeklyReport__tile">
            <Card className="rounded h-100 text-center">
              <Card.Body>
                <Typography>
                  Min CL2 reading
                  <br />
                  over the last week
                </Typography>
                <Typography className="WeeklyReport__value">
                  <FormattedNumber value={data && data.min} format="sensorValue" />
                </Typography>
                <Typography className="WeeklyReport__unit">mg/L</Typography>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex justify-content-between">
          <div className="mt-auto">
            <Button onClick={handlePrintClick} className="WeeklyReport__print-button">
              <IconPrinter className="mr-2" />
              PRINT
            </Button>
          </div>
          <Typography className="text-right mt-5">
            Powered by Varuna
            <IconLogoV className="WeeklyReport__logo ml-3" />
          </Typography>
        </div>
      </Card.Body>
    </Card>
  )
}

export default WeeklyReport

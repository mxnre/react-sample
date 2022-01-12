import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import ChemicalChoice from 'routes/Quality/routes/QualityReport/components/ChemicalChoice'

import AlertInfo from 'routes/Alerts/components/AlertInfo'
import Measurements from 'routes/Alerts/components/Measurements'
import Typography from 'components/Typography'
import OverallWaterQuality from '../../../Iccr/components/OverallWaterQuality'
import SensorMap from './SensorMapX'

import { getReport } from 'store/modules/legacy-report'

import './QualityReportX.scss'

const QualityReport = ({ history, getReport }) => {
  return (
    <div id="report" className="QualityReport">
      <Row>
        <Col xs={12} className="mb-3">
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <ChemicalChoice defaultValue={1} className="mx-auto ml-sm-0" />
              <Typography uppercase variant="subtitle" className="SensorStatus__chemical-name d-none d-sm-block">
                CHLORINE & PUMP RERFORMANCE
              </Typography>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Row>
            <Col xs={12}>
              <OverallWaterQuality quality={0.76} className="h-100" />
            </Col>
            <Col xs={12}>
              <Card className="my-3">
                <Card.Body>
                  <AlertInfo
                    title="San Marcos, TX"
                    measurements={40}
                    startDate="2010-04-28T00:00:00"
                    endDate="2019-03-19T00:00:00"
                  />
                  <Measurements chemical={1} className="overflow-auto border p-2 mt-3" mock />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <SensorMap />
                </Col>
                <Col>
                  <div className="border p-3">
                    <div className="text-center mb-2">
                      <Typography as="strong" style={{ color: '#4dbcf1' }}>
                        CHLORINE RESIDUAL
                      </Typography>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Typography as="strong" className="d-flex" style={{ color: '#4dbcf1' }}>
                        <span
                          style={{
                            width: '1.2em',
                            height: '1.2em',
                            display: 'inline-block',
                            borderRadius: '100%',
                            border: '5px solid #4dbcf1'
                          }}></span>
                        &nbsp;Sensor #462
                      </Typography>
                      <Typography as="strong">1.13mg/l</Typography>
                    </div>
                  </div>

                  <div className="border p-3 mt-3">
                    <div className="text-center mb-2">
                      <Typography as="strong" style={{ color: '#196386' }}>
                        PUMP PERFORMANCE
                      </Typography>
                    </div>
                    <Typography as="strong" className="d-flex mb-2" style={{ color: '#196386' }}>
                      <span
                        style={{
                          width: '1.2em',
                          height: '1.2em',
                          display: 'inline-block',
                          borderRadius: '100%',
                          border: '5px solid #196386'
                        }}></span>
                      &nbsp;Pump #36
                    </Typography>
                    <div className="d-flex justify-content-between">
                      <Typography className="d-flex">Frequency</Typography>
                      <Typography as="strong">159Hz</Typography>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Typography className="d-flex">Current</Typography>
                      <Typography as="strong">40amps</Typography>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Typography className="d-flex">Temperature</Typography>
                      <Typography as="strong">88F</Typography>
                    </div>
                  </div>

                  <div className="border p-3 mt-3">
                    <Typography className="d-flex">Insights</Typography>
                    <div className="AlertLog">
                      <div className="mb-2">
                        <Typography as="span" style={{ color: 'orange' }}>
                          Warning:{' '}
                        </Typography>
                        <Typography as="span">
                          <strong>Pump #36</strong>
                        </Typography>
                        <Typography>Temperature at 88</Typography>
                        <Typography>Action Required: Replace bearing</Typography>
                      </div>
                      <div>
                        <Typography as="span" style={{ color: 'darkgreen' }}>
                          Maintenance:{' '}
                        </Typography>
                        <Typography as="span">
                          <strong>Sensor #462</strong>
                        </Typography>
                        <Typography>Sharp storage level drop</Typography>
                        <Typography>Possible leakage in tank</Typography>
                        <Typography>Action Required: Technician physical inspection</Typography>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

const actions = {
  getReport
}

export default compose(withRouter, connect(null, actions))(QualityReport)

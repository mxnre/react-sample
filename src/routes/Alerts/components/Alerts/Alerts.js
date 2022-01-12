import React, { useState, useCallback, useEffect } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import OverviewMap from 'routes/Overview/routes/Overview/components/OverviewMap'
import AlertInfo from '../AlertInfo'
import AlertLog from '../AlertLog'
import Measurements from '../Measurements'
import Status from '../Status'
import ContaminantLevel from '../ContaminantLevel'
import { dataSelector } from 'store/modules/api'
import { searchSensors, getSensorDataRecordsList } from 'store/modules/sensor'
import { searchAlerts } from 'store/modules/alert'
import { CHEMICAL_TYPE } from 'config/constants'
import useSensorRecords, { transformRecords } from 'hooks/useSensorRecords'
import './Alerts.scss'

function Alerts({ sensorList, searchAlerts, searchSensors, getSensorDataRecordsList }) {
  const history = useHistory()

  const [searchedSensors, setSearchedSensors] = useState(null)

  const [alerts, setAlerts] = useState(null)

  const [recordsPerChemical, setRecordsPerChemical] = useState(null)

  const sensorQueryParam = new URLSearchParams(history.location.search).get('sensor')

  const sensor = sensorQueryParam ? Number(sensorQueryParam) : null

  const { page, count, next, records, startDate, endDate, getRecords, resetPage } = useSensorRecords(
    getSensorDataRecordsList
  )

  const getChemicalRecords = useCallback(
    () =>
      Object.keys(CHEMICAL_TYPE).forEach(chemical =>
        getSensorDataRecordsList({
          id: sensor,
          chemical,
          success: res =>
            setRecordsPerChemical(prev => ({
              ...prev,
              [chemical]: transformRecords(chemical, res.results.records)
            }))
        })
      ),
    [sensor, getSensorDataRecordsList]
  )

  useEffect(() => {
    if (sensor) {
      resetPage()
      getChemicalRecords()
      searchAlerts({ sensorId: sensor, success: setAlerts })
      getRecords({ id: sensor, chemical: 'chlorine' })
    }
  }, [searchAlerts, sensor, resetPage, getRecords, getChemicalRecords])

  useEffect(() => {
    if (sensorList !== null) {
      setSearchedSensors(sensorList)

      if (sensorList.length && sensor === null) {
        history.push({ search: `?sensor=${sensorList[0].id}` })
      }
    }
  }, [sensorList, sensor, history])

  const handleSensorChange = useCallback(
    sensor => {
      history.push({ search: `?sensor=${sensor.id}` })
      setSearchedSensors(prev => {
        if (prev.find(s => s.id === sensor.id)) {
          return prev
        } else {
          return sensorList.find(s => s.id === sensor.id)
        }
      })
    },
    [sensorList, history]
  )

  const handleSearchChange = useCallback(
    q =>
      searchSensors({
        params: { q },
        success: setSearchedSensors
      }),
    [searchSensors]
  )

  const handleNextPageRecord = useCallback(() => {
    if (next) {
      getRecords({ id: sensor, chemical: 'chlorine', params: { page } })
    }
  }, [getRecords, next, page, sensor])

  return (
    <div className="Alerts">
      <Row className="h-100">
        <Col xl={4} className="Alerts__left-pane">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column h-100">
              <div className="Alerts__map">
                <OverviewMap
                  onMarkerChange={handleSensorChange}
                  onSearchChange={handleSearchChange}
                  markerList={searchedSensors === null ? [] : searchedSensors}
                  activeMarker={sensor}
                  mode="alert"
                />
              </div>
              <div className="Alerts__log border overflow-auto mt-3">
                <AlertLog alerts={alerts} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8} className="mt-3 mt-xl-0">
          <div className="Alerts__right-pane">
            <Row className="h-100">
              <Col xs={12} lg={7} className="h-100">
                <Card className="h-100">
                  <Card.Body className="Alerts__measurement">
                    <AlertInfo count={count} startDate={startDate} endDate={endDate} />
                    <div>
                      <hr />
                    </div>
                    <Measurements className="overflow-auto" records={records} onNextPage={handleNextPageRecord} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} lg={5} className="mt-3 mt-lg-0">
                <Row>
                  <Col xs={12} sm={6} lg={12}>
                    <ContaminantLevel data={recordsPerChemical} />
                  </Col>
                  <Col xs={12} sm={6} lg={12} className="mt-3 mt-sm-0 mt-lg-3">
                    <Status />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const selectors = createStructuredSelector({
  sensorList: dataSelector('sensorsList')
})

const actions = {
  searchSensors,
  searchAlerts,
  getSensorDataRecordsList
}

export default connect(selectors, actions)(Alerts)

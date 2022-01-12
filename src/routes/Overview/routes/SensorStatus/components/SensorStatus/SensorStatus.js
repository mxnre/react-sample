import React, { useState, useCallback, useEffect } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import AlertInfo from 'routes/Alerts/components/AlertInfo'
import Measurements from 'routes/Alerts/components/Measurements'
import OverviewMap from 'routes/Overview/routes/Overview/components/OverviewMap'
import Typography from 'components/Typography'
import SensorPicker from '../SensorPicker'
import CurrentContaminant from '../CurrentContaminant'
import SensorDataChart from '../SensorDataChart'
import useSensorRecords, { transformRecords } from 'hooks/useSensorRecords'
import { CHEMICALS, CHEMICAL_TYPE } from 'config/constants'
import { dataSelector } from 'store/modules/api'
import { searchSensors, getSensorDataRecordsList } from 'store/modules/sensor'
import { saveMemo, getMemo } from 'store/modules/memo'
import { fillToNow } from 'utils/record'
import './SensorStatus.scss'

const SensorStatus = ({ sensorList, searchSensors, getSensorDataRecordsList, saveMemo, getMemo }) => {
  const history = useHistory()

  const [memoValue, setMemoValue] = useState('')

  const [chemical, setChemical] = useState(CHEMICALS[0].id)

  const [searchedSensors, setSearchedSensors] = useState(null)

  const [graphData, setGraphData] = useState(null)

  const [graphSample, setGraphSample] = useState({ interval: '1H', count: 24 })

  const [recordsPerChemical, setRecordsPerChemical] = useState(null)

  const { page, count, next, records, startDate, endDate, getRecords, resetPage } = useSensorRecords(
    getSensorDataRecordsList
  )

  const sensorQueryParam = new URLSearchParams(history.location.search).get('sensor')

  const sensor = sensorQueryParam ? Number(sensorQueryParam) : null

  useEffect(() => {
    getMemo({ success: res => setMemoValue(res.value ?? '') })
  }, [getMemo])

  useEffect(() => {
    if (sensorList !== null) {
      setSearchedSensors(sensorList)

      if (sensorList.length && sensor === null) {
        history.push({ search: `?sensor=${sensorList[0].id}` })
      }
    }
  }, [sensorList, sensor, history])

  const getChemicalRecords = useCallback(
    () =>
      Object.keys(CHEMICAL_TYPE).forEach(chemical =>
        getSensorDataRecordsList({
          id: sensor,
          chemical,
          interval: '1H',
          success: res =>
            setRecordsPerChemical(prev => ({
              ...prev,
              [chemical]: transformRecords(chemical, res.results.records)
            }))
        })
      ),
    [sensor, getSensorDataRecordsList]
  )

  const getGraphData = useCallback(
    (interval, count) =>
      Object.keys(CHEMICAL_TYPE).forEach(chemical =>
        getSensorDataRecordsList({
          id: sensor,
          chemical,
          interval,
          success: res =>
            setGraphData(prev => ({
              ...prev,
              [chemical]: fillToNow(res.results.records, interval, count)
            }))
        })
      ),
    [sensor, getSensorDataRecordsList]
  )

  useEffect(() => {
    if (sensor) {
      getChemicalRecords()
    }
  }, [sensor, getChemicalRecords])

  useEffect(() => {
    if (sensor) {
      getGraphData(graphSample.interval, graphSample.count)
    }
  }, [sensor, getGraphData, graphSample])

  useEffect(() => {
    if (sensor) {
      resetPage()
      getRecords({ id: sensor, chemical })
    }
  }, [sensor, chemical, resetPage, getRecords])

  const handleSensorSearchChange = useCallback(
    q =>
      searchSensors({
        params: { q },
        success: setSearchedSensors
      }),
    [searchSensors]
  )

  const handleSensorChange = useCallback(
    value => {
      history.push({ search: `?sensor=${value}` })
      setSearchedSensors(prev => {
        if (prev.find(s => s.id === value)) {
          return prev
        } else {
          return sensorList.find(s => s.id === value)
        }
      })
    },
    [sensorList, history]
  )

  const handleNextPageRecord = useCallback(() => {
    if (next) {
      getRecords({ id: sensor, chemical, params: { page } })
    }
  }, [next, getRecords, sensor, chemical, page])

  const handleMemoSaveClick = useCallback(() => saveMemo({ data: { value: memoValue } }), [memoValue, saveMemo])

  const handleMemoChange = useCallback(e => setMemoValue(e.target.value), [])

  return (
    <div className="SensorStatus">
      <Row className="row-spacer">
        <Col className="col-spacer" xs={12}>
          <SensorPicker
            className="mx-auto ml-sm-0"
            sensorList={sensorList}
            sensor={sensor}
            chemical={chemical}
            onSensorChange={handleSensorChange}
            onChemicalChange={setChemical}
          />
        </Col>

        <Col className="col-spacer" xs={12} xl={4}>
          <Row className="row-spacer">
            <Col className="col-spacer" xs={12}>
              <Card className="SensorStatus__map">
                <Card.Body>
                  <OverviewMap
                    markerList={searchedSensors === null ? [] : searchedSensors}
                    activeMarker={sensor}
                    onMarkerChange={sensor => history.push({ search: `?sensor=${sensor.id}` })}
                    onSearchChange={handleSensorSearchChange}
                    mode="sensor"
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col className="col-spacer" xs={12}>
              <Card>
                <Card.Body>
                  <Typography variant="subtitle" gutterBottom>
                    Memo
                  </Typography>
                  <Form.Control as="textarea" onChange={handleMemoChange} value={memoValue}></Form.Control>
                  <div className="mt-2 text-right">
                    <Button onClick={handleMemoSaveClick}>Save</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col className="col-spacer" xl={8}>
          <Row className="row-spacer">
            <Col className="col-spacer" lg={6}>
              <CurrentContaminant data={recordsPerChemical} />
            </Col>

            <Col className="col-spacer" lg={6}>
              <Card>
                <Card.Body className="SensorStatus__alert">
                  <AlertInfo count={count} startDate={startDate} endDate={endDate} />
                  <Measurements
                    records={records}
                    onNextPage={handleNextPageRecord}
                    className="overflow-auto border p-2 mt-3"
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col className="col-spacer">
              <SensorDataChart onOptionChange={setGraphSample} records={graphData} />
            </Col>
          </Row>
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
  getSensorDataRecordsList,
  saveMemo,
  getMemo
}

export default connect(selectors, actions)(SensorStatus)

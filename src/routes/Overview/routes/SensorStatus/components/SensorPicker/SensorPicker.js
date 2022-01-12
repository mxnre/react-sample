import React from 'react'
import cn from 'classnames'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import kebabCase from 'lodash/kebabCase'
import DropdownButton, { DropdownItem } from 'components/Dropdown'
import Typography from 'components/Typography'
import Loader from 'components/Loader'
import { CHEMICALS } from 'config/constants'
import { getChemicalType } from 'utils/chemical'
import './SensorPicker.scss'

const SensorPicker = ({ sensorList, sensor, chemical, onSensorChange, onChemicalChange, className }) => {
  const selectedSensor = sensorList && sensorList.find(s => s.id === sensor)

  const selectedChemical = getChemicalType(chemical)

  return (
    <Card className={cn('SensorPicker', className)}>
      <Card.Body>
        {(sensorList === null || sensor === null || chemical === null) && <Loader />}
        <Row className="align-items-center">
          <Col>
            <DropdownButton title={selectedSensor ? selectedSensor.location.formatted_address : 'Select Sensor'}>
              {sensorList &&
                sensorList.map((sensor, key) => (
                  <DropdownItem key={key} onClick={() => onSensorChange(sensor.id)}>
                    {sensor.location.formatted_address}
                  </DropdownItem>
                ))}
            </DropdownButton>
          </Col>
          <Col>
            {selectedSensor && <Typography variant="subtitle">{selectedSensor.location.formatted_address}</Typography>}
          </Col>
          <Col>
            <DropdownButton title={selectedChemical.name}>
              {CHEMICALS.map(ch => (
                <DropdownItem key={ch.id} onClick={() => onChemicalChange(ch.id)}>
                  {ch.name}
                </DropdownItem>
              ))}
            </DropdownButton>
          </Col>
          <Col className="d-flex col-auto">
            {CHEMICALS.map(ch => (
              <div
                key={ch.id}
                title={ch.name}
                onClick={() => onChemicalChange(ch.id)}
                className={cn('SensorPicker__chemical', `SensorPicker__${kebabCase(ch.id)}`, {
                  active: chemical === ch.id
                })}>
                <ch.icon />
              </div>
            ))}
          </Col>
          <Col>
            <Typography uppercase variant="subtitle">
              {selectedChemical.name}
            </Typography>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default SensorPicker

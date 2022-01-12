import React, { useState, useCallback } from 'react'
import cn from 'classnames'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import SearchInput from 'components/SearchInput'
import UtilityMap from 'components/UtilityMap'
import withLoader from 'hocs/withLoader'
import { isRequestPending } from 'store/modules/api'
import './OverviewMap.scss'

const convertAlertsToMarkers = (sensors, selected) => {
  return sensors.map(sensor => ({
    id: sensor.id,
    longitude: sensor.location.longitude,
    latitude: sensor.location.latitude,
    selected: sensor.id === selected,
    type: 'alert'
  }))
}

const convertSensorsToMarkers = (sensors, selected) =>
  sensors.map(sensor => ({
    id: sensor.id,
    longitude: sensor.location.longitude,
    latitude: sensor.location.latitude,
    selected: sensor.id === selected,
    type: `sensor${sensor.has_issue ? 'Abnormal' : 'Normal'}`
  }))

const convertTechniciansToMarkers = (technicians, selected) =>
  technicians.map(technician => ({
    id: technician.id,
    longitude: technician.location.longitude,
    latitude: technician.location.latitude,
    selected: selected.includes(technician.id),
    type: 'technician'
  }))

const mapTypes = [
  {
    value: 'sensor',
    label: 'Sensors'
  },
  {
    value: 'alert',
    label: 'Alerts'
  },
  {
    value: 'technician',
    label: 'Technicians'
  }
]

const MapTypeOptions = ({ onChange, value }) => (
  <Form.Group
    as={Col}
    className={cn('MapTypeOptions', 'col-12 col-sm', 'text-sm-right text-center', 'mb-0 mt-2 mt-sm-0')}>
    {mapTypes.map(option => (
      <Form.Check
        key={option.value}
        inline
        label={option.label}
        type="radio"
        onChange={() => onChange(option.value)}
        value={value}
        className="MapTypeOptions__option"
        name="overview-map-option"
        checked={value === option.value}
        id={`overview-map-option-${option.value}`}
      />
    ))}
  </Form.Group>
)

const getMarkers = (markers, active, mapType) => {
  switch (mapType) {
    case 'alert':
      const alerts = markers.filter(s => s.has_issue)
      return convertAlertsToMarkers(alerts, active)
    case 'sensor':
      return convertSensorsToMarkers(markers, active)
    case 'technician':
      return convertTechniciansToMarkers(markers, active)
    default:
      return []
  }
}

const getDefaultMapType = mode => {
  switch (mode) {
    case 'sensor':
      return mapTypes[0].value
    case 'alert':
      return mapTypes[1].value
    case 'technician':
      return mapTypes[2].value
    case 'multiple':
    default:
      return mapTypes[1].value
  }
}

function OverviewMap({ className, onMarkerChange, onSearchChange, markerList, activeMarker, mode = 'multiple' }) {
  const [query, setQuery] = useState('')
  const [mapType, setMapType] = useState(getDefaultMapType(mode))
  const markers = getMarkers(markerList, activeMarker, mapType)

  const handleSearchChange = useCallback(
    e => {
      setQuery(e.target.value)
      e.target.value.length === 0 && onSearchChange('', mapType)
    },
    [mapType, onSearchChange]
  )

  const handleSubmit = useCallback(
    e => {
      onSearchChange(query, mapType)
      e.preventDefault()
    },
    [query, mapType, onSearchChange]
  )

  const handleMapTypeChange = useCallback(
    mapType => {
      onSearchChange('', mapType)
      setMapType(mapType)
    },
    [onSearchChange]
  )

  return (
    <div className={cn('OverviewMap', className)}>
      <Form className="OverviewMap__header" onSubmit={handleSubmit}>
        <Form.Row className="align-items-center">
          <Form.Group as={Col} controlId="location" className={cn('d-flex align-items-center', 'mb-0 col-12 col-sm')}>
            <SearchInput
              type="text"
              placeholder="Search"
              autoComplete="off"
              className="OverviewMap__search"
              value={query}
              onChange={handleSearchChange}
            />
          </Form.Group>

          {mode === 'multiple' && <MapTypeOptions onChange={handleMapTypeChange} value={mapType} />}
        </Form.Row>
      </Form>

      <UtilityMap className="OverviewMap__body" markers={markers} onMarkerClick={onMarkerChange} />
    </div>
  )
}

export default withLoader((props, state) => isRequestPending('sensorsSearchResults')(state))(OverviewMap)

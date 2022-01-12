import React, { useMemo } from 'react'
import { FormattedNumber } from 'react-intl'
import Card from 'react-bootstrap/Card'
import Typography from 'components/Typography'
import IconUpArrow from 'icons/IconUpArrow'
import IconDownArrow from 'icons/IconDownArrow'
import { getChemicalType } from 'utils/chemical'
import { CHEMICAL_TYPE } from 'config/constants'
import './CurrentContaminant.scss'

const recent_n_for_trend = 10

function TrendArrow({ trend }) {
  if (trend > 0) {
    return <IconUpArrow className="CurrentContaminant__up-arrow" size={2} />
  } else if (trend < 0) {
    return <IconDownArrow className="CurrentContaminant__down-arrow" size={2} />
  } else {
    return <></>
  }
}

function CurrentContaminant({ data }) {
  const dataWithTrend = useMemo(
    () =>
      Object.keys(CHEMICAL_TYPE).reduce((acc, chemical) => {
        const none = {
          ...acc,
          [chemical]: {
            value: null,
            trend: null,
            unit: null
          }
        }

        if (data === null) {
          return none
        }

        const records = data[chemical]

        if (records === undefined || records.length === 0) {
          return none
        }

        const i = Math.min(recent_n_for_trend, records.length) - 1
        const gap = Number(records[0].value) - Number(records[i].value)

        return {
          ...acc,
          [chemical]: {
            value: records[0].value,
            trend: Math.round(gap * 100) / 100,
            unit: records[0].unit
          }
        }
      }, {}),
    [data]
  )

  return (
    <Card className="CurrentContaminant">
      <Card.Body className="d-flex flex-column">
        <table className="w-100 mt-2">
          <thead className="CurrentContaminant__header">
            <tr>
              <th>Parameter</th>
              <th className="text-center">Value</th>
              <th className="text-center">Trend</th>
              <th className="text-center">Unit</th>
            </tr>
          </thead>
          <tbody className="CurrentContaminant__body">
            {Object.keys(CHEMICAL_TYPE).map(chemical => (
              <tr key={chemical}>
                <td>
                  <Typography variant="body-large">{getChemicalType(chemical).name}</Typography>
                </td>
                <td className="text-center">
                  {dataWithTrend[chemical].value !== null && (
                    <Typography variant="body-large" className="CurrentContaminant__field-black">
                      <strong>
                        <FormattedNumber value={dataWithTrend[chemical].value} format="sensorValue" />
                      </strong>
                    </Typography>
                  )}
                </td>
                <td className="d-flex align-items-center justify-content-center">
                  {dataWithTrend[chemical].trend !== null && (
                    <>
                      <TrendArrow trend={dataWithTrend[chemical].trend} />
                      <Typography variant="body-large" className="CurrentContaminant__field-black">
                        {Math.abs(dataWithTrend[chemical].trend)}
                      </Typography>
                    </>
                  )}
                </td>
                <td className="text-center">
                  <Typography>{dataWithTrend[chemical].unit}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  )
}

export default CurrentContaminant

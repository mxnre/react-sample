import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { FormattedNumber } from 'react-intl'
import Typography from 'components/Typography'
import IconUpArrow from 'icons/IconUpArrow'
import IconDownArrow from 'icons/IconDownArrow'
import { CHEMICAL_TYPE } from 'config/constants'
import { getChemicalType } from 'utils/chemical'
import './ContaminantLevel.scss'

const recent_n_for_trend = 10

function TrendArrow({ trend }) {
  if (trend > 0) {
    return <IconUpArrow className="ContaminantLevel__up-arrow" />
  } else if (trend < 0) {
    return <IconDownArrow className="ContaminantLevel__down-arrow" />
  } else {
    return <></>
  }
}

const ContaminantLevel = ({ waterQualityLink, detailLink, data }) => {
  const dataWithTrend = useMemo(
    () =>
      Object.keys(CHEMICAL_TYPE).reduce((acc, chemical) => {
        const none = {
          ...acc,
          [chemical]: {
            epa: null,
            trend: null,
            unit: null
          }
        }

        if (data === null) {
          return none
        }

        const records = data[chemical]
        const epa = 0.5

        if (records === undefined || records.length === 0) {
          return none
        }

        let i = Math.min(recent_n_for_trend, records.length) - 1
        const gap = Number(records[0].value) - Number(records[i].value)

        for (; i > 0 && records[i].value === null; i--) {
          if (records[0].value === null || records[i].value === null) {
            return none
          }
        }

        return {
          ...acc,
          [chemical]: {
            epa,
            trend: Math.round(gap * 100) / 100,
            unit: records[0].unit
          }
        }
      }, {}),
    [data]
  )

  return (
    <Card className="ContaminantLevel">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center">
          <Typography variant="subtitle" uppercase>
            Contaminant Levels
          </Typography>
          {detailLink && (
            <>
              <Typography className="mx-2">|</Typography>
              <Link to="/quality">
                <Typography>
                  <strong>Details</strong>
                </Typography>
              </Link>
            </>
          )}
        </div>

        <div className="d-flex justify-content-between flex-column flex-grow-1">
          <div className="overflow-auto">
            <table className="w-100 mt-3">
              <thead className="ContaminantLevel__header">
                <tr>
                  <th>Contaminants</th>
                  <th className="text-center">of EPA max</th>
                  <th className="text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="ContaminantLevel__body">
                {Object.keys(dataWithTrend).map((chemical, key) => (
                  <tr key={key}>
                    <td>
                      <Typography variant="body-large">{getChemicalType(chemical).name}</Typography>
                    </td>
                    <td className="text-center">
                      {dataWithTrend[chemical].epa !== null && (
                        <Typography variant="body-xlarge" className="ContaminantLevel__field-black">
                          <strong>
                            <FormattedNumber value={dataWithTrend[chemical].epa} format="percentRounded" />
                          </strong>
                        </Typography>
                      )}
                    </td>
                    <td className="d-flex align-items-center justify-content-end">
                      {dataWithTrend[chemical].trend !== null && (
                        <>
                          <TrendArrow trend={dataWithTrend[chemical].trend} />
                          <Typography variant="body-large" className="ContaminantLevel__field-black">
                            <strong>
                              {Math.abs(dataWithTrend[chemical].trend)}&nbsp;{dataWithTrend[chemical].unit}
                            </strong>
                          </Typography>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {waterQualityLink && (
            <div>
              <Button as={Link} to={waterQualityLink} className="mt-2">
                WATER QUALITY
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default ContaminantLevel

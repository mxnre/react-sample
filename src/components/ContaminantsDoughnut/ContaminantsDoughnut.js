import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { FormattedNumber } from 'react-intl'
import Typography from 'components/Typography'
import './ContaminantsDoughnut.scss'

const ContaminantsDoughnut = ({ foreColor, backColor, value }) => {
  const percent = Math.round(value * 10000) / 100
  const data = {
    datasets: [
      {
        weight: 3,
        data: percent === undefined || isNaN(percent) ? [0, 100] : [percent, 100 - percent],
        backgroundColor: [foreColor, backColor]
      }
    ]
  }
  return (
    <div className="ContaminantsDoughnut">
      <div className="ContaminantsDoughnut__text">
        <h5>
          <strong>
            <FormattedNumber value={percent / 100} format="percent" />
          </strong>
        </h5>
        <Typography variant="body-xxs">OF THE MAXIMUM ALLOWABLE CONTAMINANTS</Typography>
      </div>
      <div className="ContaminantsDoughnut__chart">
        <Doughnut
          data={data}
          options={{
            tooltips: { enabled: false },
            hover: { mode: null },
            cutoutPercentage: 70,
            elements: {
              arc: {
                borderWidth: 0
              }
            },
            legend: {
              display: false
            },
            maintainAspectRatio: false
          }}
        />
      </div>
    </div>
  )
}

export default ContaminantsDoughnut

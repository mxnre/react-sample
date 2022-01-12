import React, { useState, useCallback, useMemo } from 'react'
import cn from 'classnames'
import moment from 'moment'
import Card from 'react-bootstrap/Card'
import { Line as LineChart } from 'react-chartjs-2'
import DropdownButton, { DropdownItem } from 'components/Dropdown'
import { CHEMICALS, CHART_LEGEND_COLORS } from 'config/constants'
import './SensorDataChart.scss'
import Typography from 'components/Typography'
import { getChemicalType } from 'utils/chemical'

const chartOptions = {
  legend: {
    display: true,
    position: 'left'
  },
  scales: {
    yAxes: [
      {
        display: true,
        ticks: { suggestedMin: 0 }
      }
    ]
  }
}

const options = [
  { label: 'Last 12 months', value: '12m', interval: '1M', count: 12 },
  { label: 'Last 3 months', value: '3m', interval: '7d', count: 13 },
  { label: 'Last 30 days', value: '30d', interval: '1d', count: 30 },
  { label: 'Last 7 days', value: '7d', interval: '1d', count: 7 },
  { label: 'Last 24 hours', value: '24h', interval: '1h', count: 24 }
]

const defaultOptionIndex = 4

function SensorDataChart({ className, onOptionChange, records }) {
  const [option, setOption] = useState(defaultOptionIndex)

  const chartData = useMemo(() => {
    const chemicals = records ? Object.keys(records) : []
    if (chemicals.length) {
      return {
        /* todo: will use time itself when the server receives correct gmt-0 based data */
        labels: records[chemicals[0]].map(({ time }) => moment(time.substring(0, 19) + '-00:00').format('Do HH:mm')),
        datasets: chemicals.map((chemical, key) => ({
          label: getChemicalType(chemical).name,
          borderColor: CHART_LEGEND_COLORS[key % CHEMICALS.length],
          data: records[chemical].map(({ value }) => Math.round(value * 1000) / 1000),
          pointHoverBackgroundColor: CHART_LEGEND_COLORS[key % CHEMICALS.length],
          pointBackgroundColor: 'white',
          pointRadius: 1,
          lineTension: 0.35,
          borderWidth: 2
        }))
      }
    } else {
      return { labels: [] }
    }
  }, [records])

  const handleOptionChange = useCallback(
    key => () => {
      const { interval, count } = options[key]
      setOption(key)
      onOptionChange({ interval, count })
    },
    [onOptionChange]
  )

  return (
    <Card className={cn('SensorDataChart', className)}>
      <Card.Body>
        <Typography variant="subtitle" gutterBottom>
          Compare
        </Typography>
        <DropdownButton title={options[option].label} className="SensorDataChart__option mb-2">
          {options.map(({ label, value }, key) => (
            <DropdownItem onClick={handleOptionChange(key)} key={value}>
              {label}
            </DropdownItem>
          ))}
        </DropdownButton>
        <LineChart data={chartData} options={chartOptions} />
      </Card.Body>
    </Card>
  )
}

export default SensorDataChart

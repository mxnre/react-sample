import React from 'react'
import { FormattedDate } from 'react-intl'
import Typography from 'components/Typography'
import './AlertInfo.scss'

const AlertInfo = ({ location, dataScore, count, startDate, endDate }) => (
  <div className="AlertInfo">
    {location && (
      <Typography variant="title" gutterBottom className="AlertInfo__title">
        {location}
      </Typography>
    )}

    {dataScore && (
      <div className="AlertInfo__field mt-0">
        <Typography>Data Score</Typography>
        <Typography variant="body-xlarge" className="AlertInfo__field-value">
          <strong>{dataScore}</strong>
        </Typography>
      </div>
    )}

    <div className="AlertInfo__field">
      <Typography>Measurements</Typography>
      <Typography variant="body-xlarge" className="AlertInfo__field-value">
        {count}
      </Typography>
    </div>

    <div className="AlertInfo__field">
      <Typography>Start Date</Typography>
      <Typography variant="body-xlarge" className="AlertInfo__field-value">
        {startDate && <FormattedDate value={startDate} format="twoDigit" />}
      </Typography>
    </div>

    <div className="AlertInfo__field">
      <Typography>End Date</Typography>
      <Typography variant="body-xlarge" className="AlertInfo__field-value">
        {endDate && <FormattedDate value={endDate} format="twoDigit" />}
      </Typography>
    </div>
  </div>
)

export default AlertInfo

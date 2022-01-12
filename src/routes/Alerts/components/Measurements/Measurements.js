import React, { useCallback } from 'react'
import cn from 'classnames'
import Typography from 'components/Typography'
import { FormattedDate, FormattedTime, FormattedNumber } from 'react-intl'
import './Measurements.scss'
import { isRequestPending } from 'store/modules/api'
import withLoader from 'hocs/withLoader'

function Measurements({ className, onNextPage, records }) {
  const handleScroll = useCallback(
    ({ target }) => {
      const scrollBottom = target.scrollHeight - target.scrollTop === target.clientHeight
      if (scrollBottom && onNextPage) {
        onNextPage()
      }
    },
    [onNextPage]
  )

  return (
    <div className={cn('Measurements', className)} onScroll={handleScroll}>
      <table className="Measurements__table" cellPadding="3">
        <thead>
          <tr>
            <th>Measurement</th>
            <th className="text-right">Value</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && (
            <tr className="text-center">
              <td colSpan={3} className="pt-5">
                No data
              </td>
            </tr>
          )}
          {records.map(({ value, unit, time }, key) => (
            <tr key={key}>
              <td>
                {/* todo: will use time itself when the server receives correct gmt-0 based data */}
                <FormattedDate value={time.substring(0, 19) + '-00:00'} format="twoDigit" />
                &nbsp;
                <FormattedTime value={time.substring(0, 19) + '-00:00'} format="long" />
              </td>
              <td className="text-right">
                {value !== null && (
                  <>
                    <FormattedNumber value={value} format="sensorValue" />
                    &nbsp;{unit}
                  </>
                )}
              </td>
              <td>
                <Typography
                  className={cn(
                    'text-center',
                    value !== null ? 'Measurements__status--received' : 'Measurements__status--not-received'
                  )}>
                  <strong>{value !== null ? 'Received' : 'Not received'}</strong>
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default withLoader(
  (props, state) => isRequestPending('sensorDataRecords')(state) || isRequestPending('sensorDataRecordsWithPage')(state)
)(Measurements)

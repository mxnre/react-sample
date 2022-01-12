import React from 'react'
import cn from 'classnames'
import { FormattedDate, FormattedTime } from 'react-intl'
import Typography from 'components/Typography'
import IconAlert from 'icons/IconErrorTriangle'
import IconCog from 'icons/IconCog'
import { ALERT_LEVEL, ALERT_LEVELS } from 'config/constants'
import { isRequestPending } from 'store/modules/api'
import withLoader from 'hocs/withLoader'
import './AlertLog.scss'

const AlertLog = ({ className, alerts }) => (
  <div className={cn('AlertLog', className)}>
    {alerts && alerts.length === 0 && <Typography className="text-center">No Alerts</Typography>}
    {alerts &&
      alerts.map(({ alert_type, city, reported_at, message }, key) => {
        const Icon = alert_type >= ALERT_LEVEL.Warning ? IconAlert : IconCog

        return (
          <div
            key={key}
            className={cn('AlertLog__item', `alert--${ALERT_LEVELS[alert_type]}`, 'AlertLog__item--active')}>
            <Icon className="mr-1" />

            <Typography uppercase as="span" className="mr-1 AlertLog__item-title">
              <strong>{ALERT_LEVELS[alert_type]}: </strong>
            </Typography>

            <Typography as="span">
              <strong>{city}</strong>
            </Typography>

            <br />

            <Typography as="span">
              <strong>
                <FormattedDate value={reported_at} format="twoDigit" />
                &nbsp;|&nbsp;
                <FormattedTime value={reported_at} format="short" />
              </strong>
            </Typography>

            <Typography>{message}</Typography>
          </div>
        )
      })}
  </div>
)

export default withLoader((props, state) => props.alerts === null || isRequestPending('alertsSearchResults')(state))(
  AlertLog
)

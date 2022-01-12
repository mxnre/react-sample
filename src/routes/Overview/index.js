import React from 'react'
import { Route, Switch } from 'react-router-dom'

import SensorStatus from './routes/SensorStatus'
import Report from './routes/Report'

const Overview = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/reports`} component={Report} />
    <Route path={`${match.path}/`} component={SensorStatus} />
  </Switch>
)

export default Overview

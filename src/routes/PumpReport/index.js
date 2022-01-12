import React from 'react'
import { Switch, Route } from 'react-router-dom'

import PumpReport from './routes/PumpReport'
import PumpReportNew from './routes/PumpReportNew'
import { PumpReportDetailPage } from './routes/PumpReportDetail'

export default ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.path}/new`} component={PumpReportNew} />
      <Route path={`${match.path}/:id`} component={PumpReportDetailPage} />
      <Route path={`${match.path}`} component={PumpReport} />
    </Switch>
  )
}

import React, { useCallback } from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withUserRole } from 'hocs/withAuth'
import Loader from 'components/Loader'
import { isRequestPending, isRequestSuccess } from 'store/modules/api'
import { isAuthenticatedSelector, approvedSelector, waterUtilitySelector } from 'store/modules/auth'
import { USER_ROLE } from 'config/constants'
import './PrivateRoute.scss'

const PrivateRoute = props => {
  const {
    component: Component,
    auth,
    userRole,
    approved,
    waterUtility,
    profileSuccess,
    initRequestPending,
    ...rest
  } = props
  const location = useLocation()

  const redirectLanding = useCallback(() => {
    if (userRole === USER_ROLE.Admin) {
      return false
    }
    if (waterUtility && approved) {
      return false
    }
    return profileSuccess
  }, [waterUtility, approved, userRole, profileSuccess])

  const getRenderComponent = () => props => {
    if (auth) {
      // Make sure we redirect to landing when current route is not landing and account is not approved
      if (
        location.pathname !== '/pump-reports' && // todo: comment if you don' want pump report page
        rest.path !== '/landing' &&
        redirectLanding()
      ) {
        return <Redirect to="/landing" />
      } else if (initRequestPending) {
        return <Loader className="PrivateRoute__Loader" size={10} />
      } else {
        return <Component {...props} />
      }
    } else {
      return <Redirect to="/login" />
    }
  }

  return <Route {...rest} render={getRenderComponent()} />
}

PrivateRoute.propTypes = {
  auth: PropTypes.bool.isRequired
}

const selector = createStructuredSelector({
  auth: isAuthenticatedSelector,
  approved: approvedSelector,
  waterUtility: waterUtilitySelector,
  profileSuccess: isRequestSuccess('profile'),
  initRequestPending: isRequestPending('profile') || isRequestPending('sensorsList')
})

export default compose(withUserRole, connect(selector))(PrivateRoute)

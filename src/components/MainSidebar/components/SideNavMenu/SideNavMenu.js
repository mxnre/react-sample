import React from 'react'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { connect } from 'react-redux'
import IconHouse from 'icons/IconHouse'
import IconAlert from 'icons/IconErrorTriangle'
import IconData from 'icons/IconData'
import SideNavItem from '../SideNavItem'
import { withUserRole } from 'hocs/withAuth'
import { waterUtilitySelector } from 'store/modules/auth'
import './SideNavMenu.scss'

const overview = [
  {
    text: 'Reports',
    path: '/reports'
  }
]

// const resources = [
//   {
//     text: 'Assets',
//     path: '/assets'
//   },
//   {
//     text: 'Personnel',
//     path: '/personnel'
//   },
//   {
//     text: 'Finances',
//     path: '/finances'
//   }
// ]

// const insights = [
//   {
//     text: 'Prognosis',
//     path: '/prognosis'
//   },
//   {
//     text: 'Recommendations',
//     path: '/recommendations'
//   }
// ]

// const quality = [
//   {
//     text: 'iCCR',
//     path: '/iccr'
//   }
// ]

function SideNavMenu({ userRole, waterUtility }) {
  const canAccessCore = waterUtility

  return (
    <div className="SideNavMenu">
      {canAccessCore && (
        <>
          <SideNavItem text="OVERVIEW" path="/overview" icon={IconHouse} subMenuItems={overview} selfNav />

          <SideNavItem text="ALERTS" path="/alerts" icon={IconAlert} />

          {/* {userRole === USER_ROLE.Admin && (
            <>
              <SideNavItem text="QUALITY" path="/quality" icon={IconData} subMenuItems={quality} selfNav />
              <SideNavItem text="RESOURCES" path="/resources" icon={IconDesktop} subMenuItems={resources} />
              <SideNavItem text="INSIGHTS" path="/insights" icon={IconQuestion} subMenuItems={insights} />
            </>
          )} */}
        </>
      )}
      <SideNavItem text="PUMP REPORT" path="/pump-reports" icon={IconData} />
    </div>
  )
}
const selectors = createStructuredSelector({
  waterUtility: waterUtilitySelector
})

export default compose(withUserRole, connect(selectors))(SideNavMenu)

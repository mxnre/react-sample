import React, { useState, useCallback } from 'react'
import cn from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Typography from 'components/Typography'
import IconHouse from 'icons/IconHouse'
import IconAlert from 'icons/IconErrorTriangle'
import { withUserRole } from 'hocs/withAuth'

import './MobileNavMenu.scss'

const overview = [
  {
    text: 'Reports',
    link: '/reports'
  }
]

// const quality = [
//   {
//     text: 'iCCR',
//     link: '/iccr'
//   }
// ]

// const resources = [
//   {
//     text: 'Assets',
//     link: '/assets'
//   },
//   {
//     text: 'Personnel',
//     link: '/personnel'
//   },
//   {
//     text: 'Finances',
//     link: '/finances'
//   }
// ]

// const insights = [
//   {
//     text: 'Prognosis',
//     link: '/prognosis'
//   },
//   {
//     text: 'Recommendations',
//     link: '/recommendations'
//   }
// ]

function NavMenuItem({ path, icon: Icon, text, subMenuItems, selfNav }) {
  const [expand, setExpand] = useState(false)

  const location = useLocation()
  const sensor = Number(new URLSearchParams(location.search).get('sensor'))

  const handleMenuClick = useCallback(
    e => {
      if (!selfNav) {
        e.preventDefault()
      }
      setExpand(expand => !expand)
    },
    [selfNav]
  )

  return (
    <div className="MobileNavMenu__tab">
      {subMenuItems && <input type="checkbox" id={text} checked={expand} className="d-none" readOnly />}

      <Link to={path} onClick={handleMenuClick}>
        <div className="MobileNavMenu__tab-highlight">
          <Icon className="MobileNavMenu__icon" />
          <div className="MobileNavMenu__text">
            <Typography variant="subtitle">{text}</Typography>
          </div>
        </div>
      </Link>

      {subMenuItems && (
        <div className="submenu">
          {subMenuItems.map(({ text, link }, key) => (
            <Link to={{ pathname: path + link, search: sensor ? `sensor=${sensor}` : null }} key={key}>
              <div className="submenu__item">
                <Typography variant="caption">{text}</Typography>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileNavMenu({ className, userRole }) {
  return (
    <Nav className={cn('MobileNavMenu', className)}>
      <NavMenuItem path="/overview" text="OVERVIEW" icon={IconHouse} subMenuItems={overview} selfNav />

      <NavMenuItem path="/alerts" text="ALERTS" icon={IconAlert} />

      {/* <NavMenuItem path="/quality" icon={IconData} subMenuItems={quality} text="QUALITY" selfNav />

      {userRole === USER_ROLE.Admin && (
        <>
          <NavMenuItem path="/resources" icon={IconDesktop} subMenuItems={resources} text="RESOURCES" />

          <NavMenuItem path="/insights" icon={IconQuestion} subMenuItems={insights} text="INSIGHTS" />
        </>
      )} */}
    </Nav>
  )
}

export default withUserRole(MobileNavMenu)

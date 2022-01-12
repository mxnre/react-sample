import React, { useState, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import cn from 'classnames'

import './SideNavItem.scss'

const SideNavItem = ({ icon, text, path, selfNav, subMenuItems }) => {
  const location = useLocation()
  const Icon = icon
  const [open, setOpen] = useState(false)

  const sensor = Number(new URLSearchParams(location.search).get('sensor'))

  const handleClick = useCallback(
    event => {
      if (!selfNav && subMenuItems) {
        event.preventDefault()
        event.stopPropagation()
      }
      setOpen(!open)
    },
    [selfNav, open, subMenuItems]
  )

  return (
    <div className="SideNavItem">
      <NavLink
        to={{ pathname: path, search: sensor ? `sensor=${sensor}` : null }}
        className="SideNavItem__link"
        activeClassName="selected"
        onClick={handleClick}>
        <Icon className="SideNavItem__icon" />
        <div className="SideNavItem__text">{text}</div>
      </NavLink>
      {subMenuItems && subMenuItems.length > 0 && (
        <div className={cn('SideNavItem__sub-menu', { open })}>
          {subMenuItems.map((item, index) => (
            <NavLink
              key={index}
              to={{ pathname: `${path}${item.path}`, search: sensor ? `sensor=${sensor}` : null }}
              activeClassName="SideNavMenu__active">
              <div className="SideNavItem__sub-menu-item">{item.text}</div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default SideNavItem

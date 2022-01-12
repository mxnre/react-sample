import React from 'react'
import { connect } from 'react-redux'
import Loader from 'components/Loader'
import { css } from 'emotion'

const loaderStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  z-index: 1;
`

export default cond => Component =>
  connect(state => ({ state }))(({ state, ...props }) => (
    <>
      {cond(props, state) && <Loader className={loaderStyle} />}
      <Component {...props} />
    </>
  ))

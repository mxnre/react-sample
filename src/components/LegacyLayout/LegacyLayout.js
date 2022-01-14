import React from 'react'
import Navbar from 'components/Navbar'

const LegacyLayout = ({ children }) => (
  <div className="App">
    <Navbar />
    <p>LegacyLayout</p>
    {children}
  </div>
)

export default LegacyLayout

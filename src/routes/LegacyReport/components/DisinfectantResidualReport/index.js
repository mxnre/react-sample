import React from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ChlorineResidualReport from 'components/ChlorineResidualReport'

const DisinfectantResidualReport = ({ disinfectantResidualReport, highest }) => (
  <div className="DisinfectantResidualReport">
    <Row>
      <Col>
        <ChlorineResidualReport disinfectantResidualReport={disinfectantResidualReport} highest={highest} />
      </Col>
    </Row>
  </div>
)

DisinfectantResidualReport.propTypes = {
  disinfectantResidualReport: PropTypes.object
}

export default DisinfectantResidualReport

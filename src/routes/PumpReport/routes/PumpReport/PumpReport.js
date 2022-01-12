import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { FormattedTime, FormattedDate } from 'react-intl'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import ReactPaginate from 'react-paginate'
import ArrowLeftIcon from 'icons/IconArrowLeft'
import ArrowRightIcon from 'icons/IconArrowRight'
import { createStructuredSelector } from 'reselect'
import { pumpReportListSelector, getPumpReportList } from 'store/modules/report'
import './PumpReport.scss'
import Typography from 'components/Typography'

const pageSize = 10

const PumpReport = ({ data, getPumpReportList }) => {
  const [page, setPage] = useState(0)

  const location = useLocation()

  const handlePageChange = useCallback(data => setPage(data.selected), [])

  useEffect(() => {
    getPumpReportList()
  }, [getPumpReportList])

  if (!data) {
    return null
  }

  return (
    <Card className="PumpReport">
      <Card.Body>
        <div className="d-flex justify-content-between mb-3">
          <Typography variant="subtitle">Account: Pump Monitoring Saved Files</Typography>
          <Button to="/pump-reports/new" as={Link}>
            New Report
          </Button>
        </div>
        <Table>
          <thead>
            <tr>
              <th>FILE NAME</th>
              <th>DATE SAVED</th>
              <th>DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr className="text-center">
                <td colSpan={3}>No Pump Reports</td>
              </tr>
            ) : (
              data
                .filter((_, i) => i >= pageSize * page && i < pageSize * (page + 1))
                .map((x, key) => (
                  <tr key={key}>
                    <td>
                      <Link to={`${location.pathname}/${x.id}`}>{x.name}</Link>
                    </td>
                    <td>
                      <FormattedDate value={x.date_saved} format="twoDigit" />
                      &nbsp;
                      <FormattedTime value={x.date_saved} format="short" />
                    </td>
                    <td>{x.description}</td>
                  </tr>
                ))
            )}
          </tbody>
        </Table>

        {data.length > 5 && (
          <div className="d-flex justify-content-center">
            <ReactPaginate
              previousLabel={<ArrowLeftIcon />}
              nextLabel={<ArrowRightIcon />}
              breakLabel="..."
              breakClassName="page-link"
              pageCount={Math.ceil(data.length / 10)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              nextLinkClassName="page-link"
              previousLinkClassName="page-link"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              containerClassName="pagination"
              subContainerClassName="pages pagination"
              activeClassName="active"
            />
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

const selectors = createStructuredSelector({
  data: pumpReportListSelector
})

const actions = {
  getPumpReportList
}

export default connect(selectors, actions)(PumpReport)

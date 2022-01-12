import React from 'react'
import { FormattedDate } from 'react-intl'
import cn from 'classnames'
import Card from 'react-bootstrap/Card'

import IconPdf from 'icons/IconPdf'
import IconDownload from 'icons/IconDownload'
import Typography from 'components/Typography'
import { formatCurrencyShorthand } from 'utils/formatters'

import './MonthlyReport.scss'

function MonthlyReport({ className, data }) {
  const getReportViewUrl = url => {
    const view_url = new URL(url)
    view_url.searchParams.set('view', 1)
    return view_url.toString()
  }

  if (!data) {
    return <></>
  }

  return (
    <Card className={cn('MonthlyReport', className)}>
      <Card.Body>
        <div className="MonthlyReport__container">
          {data.map(({ date, size, url, title }, key) => (
            <div className="MonthlyReport__report" key={key}>
              <div className="MonthlyReport__report-body">
                <a
                  className="MonthlyReport__report-content"
                  href={getReportViewUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer">
                  <IconPdf className="MonthlyReport__file-icon" />
                  <div className="ml-2">
                    <Typography>
                      <strong>{title}</strong>
                    </Typography>
                    <Typography as="span">
                      <FormattedDate format="monthAndYear" value={date} />
                    </Typography>
                    <span className="mx-2">|</span>
                    <Typography as="span">
                      {formatCurrencyShorthand(size, { levels: [' B', ' KB', ' MB', ' GB'] })}
                    </Typography>
                  </div>
                </a>
                <a title="Download" href={url} className="MonthlyReport__download d-flex p-2 rounded-circle">
                  <IconDownload />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

export default MonthlyReport

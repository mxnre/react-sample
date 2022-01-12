import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { VariableSizeGrid as Grid } from 'react-window'
import fp from 'lodash/fp'
import flatten from 'lodash/flatten'
import chunk from 'lodash/chunk'
import { FormattedTime } from 'react-intl'
import Typography from 'components/Typography'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import DatePicker from 'components/DatePicker'
import './PumpReportNew.scss'

const headers = [
  'Time (hh:mm:ss)',
  'Channel A Value',
  'Run Time',
  'Starts',
  'Starts #',
  'Channel B Value',
  'Run Time',
  'Starts',
  'Start #',
  '',
  'Off Time'
]

const cell = (onPasteCapture, updateValue) => ({ columnIndex: column, rowIndex: row, data, style }) => {
  const [value, setValue] = useState(data[row][column])

  const handlePasteCapture = useCallback(
    e => {
      const value = e.clipboardData.getData('text/plain')
      e.preventDefault()
      onPasteCapture({ value, column, row })
    },
    [column, row]
  )

  const handleChange = useCallback(e => setValue(e.target.value), [])

  const handleBlur = useCallback(() => updateValue({ value, column, row }), [value, column, row])

  if (row === 0) {
    return (
      <div style={style} className="PumpReportNew__Header">
        {headers[column]}
      </div>
    )
  }

  if (column === 0) {
    return (
      <div style={style} className="PumpReportNew__Time">
        <FormattedTime value={value} format="long" />
      </div>
    )
  }

  return (
    <input
      style={style}
      onPasteCapture={handlePasteCapture}
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
      className="PumpReportNew__Cell"
    />
  )
}

const rowHeight = i => (i === 0 ? 40 : 25)

const columnWidth = i => (i === 0 ? 100 : 75)

const columnCount = 10

const initRowCount = 10

const initData = Array(initRowCount)
  .fill(0)
  .map(() => Array(columnCount).fill(''))

const gridDataWithHeaders = (data, startFrom) =>
  [headers].concat(data.map((row, key) => [startFrom + key * 1000].concat(row)))

const PumpReportNew = () => {
  const [rowCount, setRowCount] = useState(initRowCount)

  const [data, setData] = useState(initData)

  const [startFrom, setStartFrom] = useState(new Date())

  const updateValue = useCallback(({ value, row, column }) => {
    setData(fp.set(`[${row - 1}][${column}]`, value))
  }, [])

  const handleClearClick = useCallback(() => {
    setRowCount(initRowCount)
    setData(initData)
  }, [])

  const handlePaste = useCallback(
    ({ value, column, row }) => {
      const pasted = flatten(value.split('\n').map(line => line.split('\t')))
      let newData = flatten(data)
        .slice(0, (row - 1) * columnCount + column - 1)
        .concat(pasted)
      const rest = newData.length % columnCount
      if (rest) {
        newData = newData.concat(
          Array(columnCount - rest)
            .fill(0)
            .map(() => '')
        )
      }
      setData(chunk(newData, columnCount))
      setRowCount(Math.ceil(newData.length / columnCount))
    },
    [data]
  )

  return (
    <Card className="PumpReportNew">
      <Card.Body>
        <Typography variant="subtitle" className="text-center">
          Copy and past your pump data files into the fields below
        </Typography>
        <div className="my-3 d-flex align-items-center">
          <Typography className="mr-2">Pump Report record starts from:</Typography>
          <DatePicker
            dateFormat="MM/dd/yyyy: hh:mm:ss"
            selected={startFrom}
            onChange={setStartFrom}
            emptyText="Start Date"
            showTimeInput
          />
        </div>

        <div className="overflow-auto my-3">
          <Grid
            className="border mx-auto"
            columnCount={columnCount + 1}
            rowCount={rowCount + 1}
            columnWidth={columnWidth}
            rowHeight={rowHeight}
            width={800}
            height={400}
            itemData={gridDataWithHeaders(data, startFrom.getTime())}>
            {cell(handlePaste, updateValue)}
          </Grid>
        </div>

        <div className="d-flex justify-content-between">
          <Button to="/pump-reports" as={Link}>
            Back
          </Button>
          <div>
            <Button onClick={handleClearClick} className="mr-1">
              Clear
            </Button>
            <Button
              as={Link}
              to={{
                pathname: '/pump-reports/view',
                state: {
                  rawData: data,
                  startFrom: startFrom.getTime()
                }
              }}>
              Submit
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default PumpReportNew

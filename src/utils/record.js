import moment from 'moment'

export const fillToNow = (records, interval, count) => {
  const now = Math.round(Date.now() / 1000)
  const intervalValue = Number(interval[0])
  const intervalUnit = interval[1]
  const intervalInSec = moment.duration(intervalValue, intervalUnit) / 1000
  const formatStr = 'YYYY-MM-DDTHH:mm:ss'

  if (records.length) {
    const firstRecord = moment(records[0].time.substring(0, 19) + '-00:00').unix()
    const newRecordCount = Math.round((now - firstRecord) / intervalInSec)

    return new Array(newRecordCount)
      .fill(0)
      .map((x, i) => ({
        value: 0,
        time: moment.unix(firstRecord + (newRecordCount - i) * intervalValue).format(formatStr)
      }))
      .concat(records)
      .slice(0, count)
  } else {
    return new Array(count).fill(0).map((x, i) => ({
      value: 0,
      time: moment.unix(now - i * intervalInSec).format(formatStr)
    }))
  }
}

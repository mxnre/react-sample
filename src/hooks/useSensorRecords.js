import { useState, useCallback } from 'react'

const init = { page: 1, results: { records: [] } }

export const transformRecords = (chemical, records) =>
  chemical === 'water temperature'
    ? records.map(x => ({
        time: x.time,
        value: (x.value * 9) / 5 + 32,
        unit: '°F'
      }))
    : records

export default getDataApi => {
  const [data, setData] = useState(init)

  const resetPage = useCallback(() => setData(init), [])

  const getRecords = useCallback(
    ({ success, params, chemical, ...args }) => {
      const page = params?.page ?? 1
      getDataApi({
        ...args,
        chemical,
        params: {
          ...params,
          page
        },
        success: res => {
          success && success(res)
          setData(prev => {
            const records = transformRecords(chemical, res.results.records)
            return {
              ...prev,
              ...res,
              page: page + 1,
              results: {
                ...prev.results,
                ...res.results,
                records: page > 1 ? prev.results.records.concat(records) : records
              }
            }
          })
        }
      })
    },
    [getDataApi]
  )

  return {
    page: data.page,
    count: data?.count,
    next: data?.links?.next,
    records: data.results.records,
    startDate: data?.results?.start_date,
    endDate: data?.results?.end_date,
    getRecords,
    resetPage
  }
}

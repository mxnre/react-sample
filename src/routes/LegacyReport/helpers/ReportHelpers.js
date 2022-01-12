import get from 'lodash/get'
import mapValues from 'lodash/mapValues'

export function calculateHighestLevelDetected(qualityTable) {
  const percents = {}

  const inorganicContaminants = ({ levelDetected, mcl }) => {
    return (100 * parseFloat(levelDetected)) / parseFloat(mcl)
  }

  const leadAndCopper = ({ ninetiethPercentileResult, mclg }) => {
    return (100 * parseFloat(ninetiethPercentileResult)) / parseFloat(mclg)
  }

  const disinfectantsAndDisinfectionByProducts = ({ mclOrMrdl, mclgOrMrdlg }) => {
    return (100 * parseFloat(mclOrMrdl)) / parseFloat(mclgOrMrdlg)
  }

  const disinfectantResidualReport = ({ mRDL, mRDLG }) => {
    return (100 * parseFloat(mRDL)) / parseFloat(mRDLG)
  }

  const percentFunc = {
    disinfectantsAndDisinfectionByProducts,
    disinfectantResidualReport,
    inorganicContaminants,
    leadAndCopper
  }

  for (let reportKey in qualityTable) {
    const report = qualityTable[reportKey]
    for (let key in report) {
      if (key !== '_id') {
        const getPercent = percentFunc[reportKey]
        const percent = getPercent && getPercent(report[key])

        if (!isNaN(percent) && isFinite(percent)) {
          if (percents[reportKey] === undefined) {
            percents[reportKey] = [percent]
          } else {
            percents[reportKey].push(percent)
          }
        }
      }
    }
  }

  return mapValues(percents, v => (v.length > 1 ? Math.max(...v) : v[0]))
}

export function checkWaterSource(report) {
  if (report.sourcesOfWater === undefined || report.sourcesOfWater.length === 0) {
    return false
  } else {
    const sources = report.sourcesOfWater
    const wellOne =
      get(sources, 'wellOne.activity') === '' &&
      get(sources, 'wellOne.sourceType') === '' &&
      get(sources, 'wellOne.sourceWaterName') === '' &&
      get(sources, 'wellOne.status') === ''
    const wellTwo =
      get(sources, 'wellTwo.activity') === '' &&
      get(sources, 'wellTwo.sourceType') === '' &&
      get(sources, 'wellTwo.sourceWaterName') === '' &&
      get(sources, 'wellTwo.status') === ''
    if (wellOne && wellTwo) {
      return false
    } else {
      return true
    }
  }
}

export function checkInorganicContaminants(report) {
  const inorganicContaminants = get(report, 'qualityTable.inorganicContaminants')
  let count = 0
  for (var k in inorganicContaminants) {
    if (k !== '_id') {
      let countEmpty = 0
      let contaminant = inorganicContaminants[k]

      for (var o in contaminant) {
        if (o !== '_id') {
          if (contaminant[o] === '') {
            countEmpty++
          }
        }
      }
      if (countEmpty === 7) {
        count++
      }
    }
  }
  if (count === 4) {
    return false
  } else {
    return true
  }
}

export function checkDisinfectantResidualReport(report) {
  const disinfectantResidualReport = get(report, 'qualityTable.disinfectantResidualReport')
  if (disinfectantResidualReport && disinfectantResidualReport.chlorine) {
    return true
  } else {
    return false
  }
}

export function checkDisinfectants(report) {
  const disinfectants = get(report, 'qualityTable.disinfectantsAndDisinfectionByProducts')

  let count = 0
  for (var k in disinfectants) {
    if (k !== '_id') {
      let countEmpty = 0
      let contaminant = disinfectants[k]

      for (var o in contaminant) {
        if (o !== '_id') {
          if (contaminant[o] === '') {
            countEmpty++
          }
        }
      }
      if (countEmpty === 7) {
        count++
      }
    }
  }
  if (count === 3) {
    return false
  } else {
    return true
  }
}

export function checkLeadAndCopper(report) {
  const leadAndCopper = get(report, 'qualityTable.leadAndCopper')

  let count = 0
  for (var k in leadAndCopper) {
    if (k !== '_id') {
      let countEmpty = 0
      let contaminant = leadAndCopper[k]

      for (var o in contaminant) {
        if (o !== '_id') {
          if (contaminant[o] === '') {
            countEmpty++
          }
        }
      }
      if (countEmpty === 7) {
        count++
      }
    }
  }
  if (count === 2) {
    return false
  } else {
    return true
  }
}

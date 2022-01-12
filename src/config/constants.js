import IconDisinfectant from 'icons/IconDisinfectant'
import IconMicrobial from 'icons/IconMicrobial'
import IconPesticide from 'icons/IconPesticide'
import IconTemp from 'icons/IconTemp'

export const DEFAULT_PAGE_SIZE = 10

export const GOOGLE_MAP_KEY = process.env.REACT_APP_GOOGLE_MAP_KEY

export const EMPTY_PAGINATED_LIST = {
  results: [],
  count: 0,
  prev: null,
  next: null
}

export const ALERT_TYPE = {
  CRITICAL: 0,
  INFO: 1,
  WARNING: 2
}

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'Septempber',
  'October',
  'November',
  'December'
]

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const YEARS = Array(2050 - 2015)
  .fill(0)
  .map((_, key) => 2015 + key)

export const CHART_LEGEND_COLORS = [
  '#1d638e',
  '#0088b2',
  '#00a8d7',
  '#009395',
  '#74a343',
  '#f5a335',
  '#da693d',
  '#c73a5c'
].reverse()

export const langs = [
  { value: 'en', caption: 'English' },
  { value: 'es', caption: 'Spanish' },
  { value: 'fr', caption: 'French' },
  { value: 'cn', caption: 'Chinese' }
]

export const CHEMICALS = [
  { id: 'chlorine', name: 'Chlorine', icon: IconMicrobial },
  { id: 'water temperature', name: 'Temp', icon: IconTemp },
  { id: 'ph', name: 'pH', icon: IconDisinfectant },
  { id: 'turbidity', name: 'Turbidity', icon: IconPesticide },
  { id: 'conductivity', name: 'Conductivity', icon: IconPesticide }
]

export const CHEMICAL_TYPE = {
  chlorine: 0,
  'water temperature': 1,
  ph: 2,
  turbidity: 3,
  conductivity: 4
}

export const USER_ROLE = {
  Admin: 1,
  GeneralManager: 2,
  OperationManager: 3,
  Customer: 4,
  Technician: 5
}

export const ALERT_LEVEL = {
  Info: 0,
  Warning: 1,
  Serious: 2,
  Critical: 3
}

export const ALERT_LEVELS = ['info', 'warning', 'serious', 'critical']

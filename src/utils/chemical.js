import { CHEMICALS, CHEMICAL_TYPE } from 'config/constants'

export const getChemicalType = chemical => CHEMICALS[CHEMICAL_TYPE[chemical]]

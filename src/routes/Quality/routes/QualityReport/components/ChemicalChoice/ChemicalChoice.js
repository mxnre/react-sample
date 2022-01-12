import React, { useState } from 'react'
import cn from 'classnames'

import IconCopper from 'icons/IconCopper'
import IconDisinfectant from 'icons/IconDisinfectant'
import IconInorganic from 'icons/IconInorganic'
import IconMicrobial from 'icons/IconMicrobial'
import IconOrganic from 'icons/IconOrganic'
import IconPesticide from 'icons/IconPesticide'
import IconRadioActive from 'icons/IconRadioActive'
import { CHEMICAL_NAMES } from 'config/constants'

import './ChemicalChoice.scss'

const icons = [
  [IconInorganic, 'temp'],
  [IconDisinfectant, 'cl2'],
  [IconCopper, 'conductivity'],
  [IconOrganic, 'ph'],
  [IconPesticide, 'turbidity'],
  [IconRadioActive, 'radioactive'],
  [IconMicrobial, 'microbial']
]

function ChemicalChoice(props) {
  const { defaultValue, className, onChemicalSelect } = props
  const [chemical, setChemical] = useState(defaultValue || 0)

  const handleChemicalClick = ch => () => {
    setChemical(ch)
    onChemicalSelect(ch)
  }

  return (
    <div className={cn('ChemicalChoice', className)}>
      {icons.map(([Icon, name], key) => (
        <div
          key={key}
          title={CHEMICAL_NAMES[key]}
          onClick={handleChemicalClick(key)}
          className={cn('ChemicalChoice__chemical', `ChemicalChoice__${name}`, { active: chemical === key })}>
          <Icon />
        </div>
      ))}
    </div>
  )
}

export default ChemicalChoice

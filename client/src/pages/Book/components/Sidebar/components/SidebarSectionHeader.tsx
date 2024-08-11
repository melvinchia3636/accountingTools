import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function SidebarSectionHeader({
  name,
  icon,
  expanded,
  setExpanded
}: {
  name: string
  icon: string
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  function toggleExpanded(): void {
    setExpanded(!expanded)
  }

  return (
    <header className="flex items-center justify-between mt-8">
      <h1 className="text-lg font-medium text-zinc-500 gap-2 flex items-center">
        <Icon icon={icon} className="w-6 h-6" />
        {name}
      </h1>
      <button
        onClick={toggleExpanded}
        className="w-8 h-8 text-zinc-500 rounded-md flex items-center justify-center"
      >
        <Icon
          icon="uil:angle-up"
          className={`w-6 h-6 transition-all ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
    </header>
  )
}

export default SidebarSectionHeader

import React from 'react'

function SidebarDocumentItem({
  isActive,
  onClick,
  name,
  nature
}: {
  isActive: boolean
  onClick: () => void
  name: string
  nature?: string
}): React.ReactElement {
  return (
    <li
      className={`w-full py-4 rounded-md cursor-pointer hover:bg-zinc-100/10 hover:text-zinc-100 transition-all ${
        isActive
          ? 'relative after:absolute after:left-[-2px] font-semibold after:top-1/2 after:-translate-y-1/2 after:h-full after:w-[2px] after:bg-zinc-200 after:rounded-full hover:bg-zinc-100/10'
          : 'text-zinc-500'
      } flex items-center justify-between gap-2 px-4`}
      onClick={onClick}
    >
      {name}
      {nature !== undefined && (
        <span className="text-zinc-500 font-medium text-sm">{nature}</span>
      )}
    </li>
  )
}

export default SidebarDocumentItem

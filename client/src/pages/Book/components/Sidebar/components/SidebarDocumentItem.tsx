import React from 'react'

function SidebarDocumentItem({
  isActive,
  onClick,
  name,
  nature,
  pageNumber,
  isInGL
}: {
  isActive: boolean
  onClick: () => void
  name: string
  nature: string
  pageNumber: number
  isInGL: boolean
}): React.ReactElement {
  return (
    <li
      className={`w-full py-4 rounded-md cursor-pointer hover:bg-zinc-100/10 hover:text-zinc-100 transition-all ${
        isActive
          ? 'relative after:absolute after:left-[-2px] font-semibold after:top-1/2 after:-translate-y-1/2 after:h-full after:w-[2px] after:bg-zinc-200 after:rounded-full hover:bg-zinc-100/10'
          : 'text-zinc-500'
      } flex items-center justify-between gap-4 px-4`}
      onClick={onClick}
    >
      <span className="w-full truncate">{name}</span>
      <span className="whitespace-nowrap flex items-center gap-1">
        {pageNumber !== 0 && (
          <span className="text-zinc-500 font-medium text-sm">
            {isInGL && 'GL.'}P. {pageNumber}
          </span>
        )}
        {pageNumber !== 0 && nature !== '' && (
          <span className="text-zinc-500 font-medium text-sm">|</span>
        )}
        {nature !== '' && (
          <span className="text-zinc-500 font-medium text-sm">{nature}</span>
        )}
      </span>
    </li>
  )
}

export default SidebarDocumentItem

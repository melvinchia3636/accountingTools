import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'

function SidebarWrapper({
  children,
  saved
}: {
  children: React.ReactNode
  saved: boolean
}): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    document.onkeydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault()
        setIsExpanded(!isExpanded)
      }
    }

    return () => {
      document.onkeyup = null
    }
  }, [isExpanded])

  return (
    <div
      className={`fixed top-0 left-0 bg-zinc-950 z-50 lg:relative transition-all shrink-0 ${
        isExpanded ? 'w-96' : 'w-0'
      } h-full`}
    >
      {!saved && (
        <span className="absolute top-2 right-2 rounded-md w-2 h-2 bg-zinc-500"></span>
      )}
      <aside
        className={`h-full transition-all border-zinc-700 py-8 ${
          isExpanded ? 'px-8 border-r-2' : 'px-0'
        } overflow-hidden flex flex-col`}
      >
        {children}
      </aside>
      <button
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
        className={`absolute z-50 transition-all ${
          !isExpanded ? 'rotate-180' : ''
        } -right-8 bottom-0 w-8 h-8 text-zinc-500 bg-zinc-950 rounded-md flex items-center justify-center`}
      >
        <Icon icon="uil:angle-left" className="w-6 h-6" />
      </button>
    </div>
  )
}

export default SidebarWrapper

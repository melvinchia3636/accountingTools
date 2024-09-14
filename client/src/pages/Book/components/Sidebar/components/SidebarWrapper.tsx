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
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        console.log('sus')
        setIsExpanded(!isExpanded)
      }
    }

    return () => {
      document.onkeyup = null
    }
  }, [isExpanded])

  return (
    <div
      className={`relative transition-all shrink-0 ${
        isExpanded ? 'w-96' : 'w-0'
      } h-full`}
    >
      {!saved && (
        <span className="absolute top-2 right-2 rounded-md w-2 h-2 bg-zinc-500"></span>
      )}
      <aside
        className={`h-full transition-all border-r border-zinc-700 py-8 ${
          isExpanded ? 'px-8' : 'px-0'
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
        } -right-8 bottom-0 w-8 h-8 text-zinc-500 rounded-md flex items-center justify-center`}
      >
        <Icon icon="uil:angle-left" className="w-6 h-6" />
      </button>
    </div>
  )
}

export default SidebarWrapper

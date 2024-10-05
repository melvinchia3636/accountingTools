import { Button } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

function HomeHeader({
  setModifyBookModalOpenType,
  setSidebarCollapsed
}: {
  setModifyBookModalOpenType: (type: 'create' | 'update' | null) => void
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const [searchParams] = useSearchParams()

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold flex items-center gap-2">
        <button
          onClick={() => {
            setSidebarCollapsed((prev) => !prev)
          }}
          className="lg:hidden p-2 rounded-md hover:bg-zinc-900/50 transition-all text-zinc-500 hover:text-zinc-100"
        >
          <Icon icon="tabler:menu" className="w-6 h-6" />
        </button>
        <Icon icon="uil:book" className="w-9 h-9" />
        {Array.from(searchParams.keys()).length > 0 ? 'Filtered' : 'All'} Books
      </h1>
      <Button
        onClick={() => {
          setModifyBookModalOpenType('create')
        }}
        className="px-6 py-3 bg-zinc-200 hover:bg-zinc-300 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center"
      >
        <Icon icon="uil:plus" className="w-5 h-5" />
        Create
      </Button>
    </header>
  )
}

export default HomeHeader

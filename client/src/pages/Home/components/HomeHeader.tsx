import { Button } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function HomeHeader({
  setModifyBookModalOpenType
}: {
  setModifyBookModalOpenType: (type: 'create' | 'update' | null) => void
}): React.ReactElement {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold flex items-center gap-2">
        <Icon icon="uil:book" className="w-9 h-9" />
        All Books
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

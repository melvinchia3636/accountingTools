/* eslint-disable @typescript-eslint/indent */
import { Button } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import ModifyBookModal from '../../components/Modals/ModifyBookModal'
import { type IListEntry } from '../../typescript/home.interface'
import HomeListItem from './components/HomeListItem'

function Home(): React.ReactElement {
  const [data, setData] = useState<IListEntry[] | null>(null)
  const [modifyBookModalOpenType, setModifyBookModalOpenType] = useState<
    'create' | 'update' | null
  >(null)

  function fetchData(): void {
    setData(null)
    fetch('http://localhost:3000/books')
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          setData(data.data as IListEntry[])
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (data === null) {
    return (
      <div className="w-full flex flex-col flex-1 p-24 items-center justify-center">
        Loading
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col overflow-y-auto flex-1 p-24">
      <div className="flex items-center justify-between">
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
      </div>
      <ul className="mt-8 flex flex-col gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <HomeListItem key={item.id} item={item} />
        ))}
      </ul>
      <ModifyBookModal
        openType={modifyBookModalOpenType !== null ? 'create' : null}
        onClose={() => {
          setModifyBookModalOpenType(null)
        }}
        reloadBooks={fetchData}
        existingBook={null}
      />
    </div>
  )
}

export default Home

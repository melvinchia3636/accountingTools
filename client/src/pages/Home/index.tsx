/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import ModifyBookModal from './components/ModifyBookModal'
import { type IListEntry } from '../../typescript/home.interface'
import HomeListItem from './components/HomeListItem'
import HomeHeader from './components/HomeHeader'

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
      <HomeHeader setModifyBookModalOpenType={setModifyBookModalOpenType} />
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

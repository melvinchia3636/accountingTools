/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import ModifyBookModal from '../Book/modals/ModifyBookModal'
import { type IListEntry } from '../../typescript/home.interface'
import HomeListItem from './components/HomeListItem'
import HomeHeader from './components/HomeHeader'
import Sidebar from './components/Sidebar'
import { useSearchParams } from 'react-router-dom'

function Home(): React.ReactElement {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [data, setData] = useState<IListEntry[] | null>(null)
  const [modifyBookModalOpenType, setModifyBookModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [searchParams] = useSearchParams()
  const [filteredData, setFilteredData] = useState<IListEntry[] | null>(null)

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

  useEffect(() => {
    if (data === null) {
      return
    }

    const source = searchParams.get('source') ?? ''
    const topic = searchParams.get('topic') ?? ''
    const year = searchParams.get('year') ?? ''

    setFilteredData(
      data.filter((item) => {
        return (
          (source === '' || item.code.split('-')[0] === source) &&
          (topic === '' || item.topic === topic) &&
          (year === '' || item.code.split('-')[1] === year)
        )
      })
    )
  }, [data, searchParams])

  if (data === null) {
    return (
      <div className="w-full flex flex-col flex-1 p-24 items-center justify-center">
        Loading
      </div>
    )
  }

  return (
    <div className="w-full flex-1 flex">
      <Sidebar
        data={data}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <div className="w-full flex flex-col overflow-y-auto flex-1 p-8">
        <HomeHeader
          setSidebarCollapsed={setSidebarCollapsed}
          setModifyBookModalOpenType={setModifyBookModalOpenType}
          itemCount={filteredData !== null ? filteredData.length : 0}
        />
        <ul className="mt-8 flex flex-col flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData !== null && filteredData.length > 0 ? (
            filteredData.map((item) => (
              <HomeListItem key={item.id} item={item} />
            ))
          ) : (
            <div className="w-full flex flex-col text-xl text-zinc-500 flex-1 items-center justify-center">
              No books found
            </div>
          )}
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
    </div>
  )
}

export default Home

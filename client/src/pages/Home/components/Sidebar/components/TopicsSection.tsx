/* eslint-disable multiline-ternary */
import React, { useMemo, useState } from 'react'
import { type IListEntry } from '../../../../../typescript/home.interface'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useSearchParams } from 'react-router-dom'

function TopicSection({
  data,
  setIsCollapsed
}: {
  data: IListEntry[]
  setIsCollapsed: (isCollapsed: boolean) => void
}): React.ReactElement {
  const [isCollapsed, setCollapsed] = useState(false)
  const topics = useMemo(
    () => [...new Set(data.map((e) => e.topic))].sort(),
    [data]
  )
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <section className="space-y-2 mb-4">
      <button
        onClick={() => {
          setCollapsed(!isCollapsed)
        }}
        className="flex w-full items-center justify-between gap-6 pl-8 pr-6 pb-2"
      >
        <h2 className="uppercase flex items-center gap-2 tracking-widest font-semibold text-sm text-zinc-500">
          <Icon
            icon="material-symbols:topic-outline-rounded"
            className="size-6"
          />
          Topics
        </h2>
        <Icon
          icon="tabler:chevron-down"
          className={`text-zinc-500 size-4 transition-all ${
            isCollapsed ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      <ul
        className="px-4 transition-all overflow-hidden duration-500"
        style={{
          maxHeight: isCollapsed ? '0' : `${topics.length * 4}rem`
        }}
      >
        {topics.map((topic) => (
          <li
            key={topic}
            onClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                topic
              })
              setIsCollapsed(true)
            }}
            className={`pr-4 h-14 pl-12 cursor-pointer flex items-center justify-between gap-6 transition-all rounded-md ${
              decodeURIComponent(searchParams.get('topic') ?? '') === topic
                ? 'bg-zinc-900 text-zinc-100 font-semibold'
                : 'hover:bg-zinc-900/50 text-zinc-500'
            }`}
          >
            <span className="w-full truncate">{topic}</span>
            {searchParams.get('topic') === topic ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const newSearchParams = { ...searchParams }
                  searchParams.delete('topic')
                  setSearchParams(newSearchParams)
                  setIsCollapsed(true)
                }}
                className="p-1 rounded-md hover:bg-zinc-100/10 text-zinc-500 transition-all hover:text-zinc-100"
              >
                <Icon icon="tabler:x" className="size-5" />
              </button>
            ) : (
              <span className="w-6 text-center text-zinc-500">
                {data.filter((entry) => entry.topic === topic).length}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TopicSection

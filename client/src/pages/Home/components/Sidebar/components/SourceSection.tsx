/* eslint-disable multiline-ternary */
import React, { useMemo, useState } from 'react'
import { type IListEntry } from '../../../../../typescript/home.interface'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useSearchParams } from 'react-router-dom'

function SourceSection({
  data,
  setIsCollapsed
}: {
  data: IListEntry[]
  setIsCollapsed: (isCollapsed: boolean) => void
}): React.ReactElement {
  const [isCollapsed, setCollapsed] = useState(false)
  const sources = useMemo(
    () => [...new Set(data.map((e) => e.code.split('-')[0]))].sort(),
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
          <Icon icon="mingcute:location-line" className="size-6" />
          Sources
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
          maxHeight: isCollapsed ? '0' : `${sources.length * 4}rem`
        }}
      >
        {sources.map((source) => (
          <li
            key={source}
            onClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                source
              })
              setIsCollapsed(true)
            }}
            className={`pr-4 h-14 pl-12 cursor-pointer flex items-center justify-between gap-6 transition-all rounded-md ${
              searchParams.get('source') === source
                ? 'bg-zinc-900 text-zinc-100 font-semibold'
                : 'hover:bg-zinc-900/50 text-zinc-500'
            }`}
          >
            <span className="w-full truncate">{source}</span>
            {searchParams.get('source') === source ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const newSearchParams = { ...searchParams }
                  searchParams.delete('source')
                  setSearchParams(newSearchParams)
                  setIsCollapsed(true)
                }}
                className="p-1 rounded-md hover:bg-zinc-100/10 text-zinc-500 transition-all hover:text-zinc-100"
              >
                <Icon icon="tabler:x" className="size-5" />
              </button>
            ) : (
              <span className="w-6 text-center text-zinc-500">
                {
                  data.filter((entry) => entry.code.split('-')[0] === source)
                    .length
                }
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SourceSection

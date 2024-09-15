import React, { useMemo, useState } from 'react'
import { type IListEntry } from '../../../../../typescript/home.interface'
import { Icon } from '@iconify/react/dist/iconify.js'

function YearSection({ data }: { data: IListEntry[] }): React.ReactElement {
  const [isCollapsed, setCollapsed] = useState(false)
  const years = useMemo(
    () => [...new Set(data.map((e) => e.code.split('-')[1]))].sort(),
    [data]
  )

  return (
    <section className="space-y-2 mb-4">
      <button
        onClick={() => {
          setCollapsed(!isCollapsed)
        }}
        className="flex w-full items-center justify-between gap-6 pl-8 pr-6 pb-2"
      >
        <h2 className="uppercase flex items-center gap-2 tracking-widest font-semibold text-sm text-zinc-500">
          <Icon icon="tabler:calendar" className="size-6" />
          Years
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
          maxHeight: isCollapsed ? '0' : `${years.length * 4}rem`
        }}
      >
        {years.map((year) => (
          <li
            key={year}
            className="p-4 pl-12 flex items-center justify-between gap-6 hover:bg-zinc-800 transition-all rounded-md"
          >
            <span className="w-full truncate">{year}</span>
            <span className="font-medium text-zinc-500">
              {data.filter((entry) => entry.code.split('-')[1] === year).length}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default YearSection

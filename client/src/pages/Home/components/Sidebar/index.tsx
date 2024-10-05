import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { type IListEntry } from '../../../../typescript/home.interface'
import TopicSection from './components/TopicsSection'
import YearSection from './components/YearSection'
import SourceSection from './components/SourceSection'

function Sidebar({
  data,
  isCollapsed,
  setIsCollapsed
}: {
  data: IListEntry[]
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
}): React.ReactElement {
  return (
    <aside
      className={`fixed transition-all duration-300 top-0 left-0 w-full h-full bg-zinc-950 lg:static lg:w-1/3 xl:w-2/7 2xl:w-1/5 shrink-0 overflow-y-auto border-r-2 border-zinc-800 ${
        isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      }`}
    >
      <header className="flex justify-between mb-4 items-center gap-4 p-8">
        <div className="flex items-center gap-4">
          <Icon icon="fluent:money-calculator-24-regular" className="size-8" />
          <h1 className="font-semibold text-2xl">AccEditor.</h1>
        </div>
        <div className="flex items-center gap-4 text-zinc-500">
          <a
            href="https://github.com/melvinchia3636/accountingTools"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon="uil:github" className="size-6" />
          </a>
          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed)
            }}
            className="lg:hidden p-2 rounded-md hover:text-zinc-100 hover:bg-zinc-900/50 transition-all"
          >
            <Icon icon="tabler:x" className="size-6" />
          </button>
        </div>
      </header>
      <TopicSection setIsCollapsed={setIsCollapsed} data={data} />
      <YearSection setIsCollapsed={setIsCollapsed} data={data} />
      <SourceSection setIsCollapsed={setIsCollapsed} data={data} />
    </aside>
  )
}

export default Sidebar

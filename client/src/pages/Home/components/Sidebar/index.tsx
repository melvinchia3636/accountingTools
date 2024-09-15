import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { type IListEntry } from '../../../../typescript/home.interface'
import TopicSection from './components/TopicsSection'
import YearSection from './components/YearSection'
import SourceSection from './components/SourceSection'

function Sidebar({ data }: { data: IListEntry[] }): React.ReactElement {
  return (
    <aside className="w-1/5 shrink-0 overflow-y-auto border-r-2 border-zinc-800">
      <header className="flex justify-between mb-4 items-center gap-4 p-8">
        <div className="flex items-center gap-4">
          <Icon icon="fluent:money-calculator-24-regular" className="size-8" />
          <h1 className="font-semibold text-2xl">AccEditor.</h1>
        </div>
        <a
          href="https://github.com/melvinchia3636/accountingTools"
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon="uil:github" className="size-6" />
        </a>
      </header>
      <TopicSection data={data} />
      <YearSection data={data} />
      <SourceSection data={data} />
    </aside>
  )
}

export default Sidebar

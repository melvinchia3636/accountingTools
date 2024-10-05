import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { type IListEntry } from '../../../typescript/home.interface'
import { Link } from 'react-router-dom'

function HomeListItem({ item }: { item: IListEntry }): React.ReactElement {
  return (
    <li
      key={item.id}
      className="border-2 border-zinc-800 shadow-md hover:bg-zinc-900/50 transition-all rounded-md"
    >
      <Link
        to={`/book/${item.id}`}
        className="p-4 flex items-center w-full justify-between"
      >
        <div>
          <code className="text-xl font-medium">{item.code}</code>
          <p className="text-zinc-500">{item.topic}</p>
        </div>
        <div className="flex items-end flex-col text-zinc-500 gap-1">
          <p className="text-zinc-500">{item.name}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Icon icon="uil:file-alt" className="w-5 h-5" />
              <span className="text-zinc-500">{item.docAmount.journal}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="tabler:square-letter-t" className="w-5 h-5" />
              <span className="text-zinc-500">{item.docAmount.ledger}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="tabler:chart-line" className="w-5 h-5" />
              <span className="text-zinc-500">{item.docAmount.statement}</span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default HomeListItem

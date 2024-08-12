import React from 'react'
import {
  LedgerSide,
  type ILedgerEntry
} from '../../../../../typescript/ledger.interface'

function LedgerTotalColumn({
  i,
  index,
  entries,
  side,
  columnCount
}: {
  i: number
  index: number
  entries: ILedgerEntry[]
  side: LedgerSide
  columnCount: number
}): React.ReactElement {
  return (
    <td
      className={`${
        side === LedgerSide.Debit && i === columnCount - 1
          ? 'border-r-[6px] border-double'
          : 'border-r-2'
      } border-zinc-700`}
    >
      <div className="border-b-4  border-zinc-500 border-double">
        <div className="border-t text-right border-zinc-500 p-4 py-2">
          {(() => {
            const allEntries = entries.slice(0, index)

            const splitByTotal = allEntries.reduce<ILedgerEntry[][]>(
              (acc, item) => {
                if (item.particular === 'TOTAL') {
                  acc.push([])
                } else {
                  acc[acc.length - 1].push(item)
                }
                return acc
              },
              [[]]
            )

            return splitByTotal
              .pop()
              ?.filter((item) => item.amount[i])
              .reduce((acc, item) => acc + item.amount[i], 0)
              .toLocaleString()
          })()}
        </div>
      </div>
    </td>
  )
}

export default LedgerTotalColumn

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import {
  type ILedgerEntry,
  LedgerSide
} from '../../../../../typescript/ledger.interface'

function LedgerAmountColumn({
  i,
  index,
  side,
  columnCount,
  entries,
  setEntries,
  otherEntries,
  setData,
  updateEntry,
  checkAndClearEmptyRow
}: {
  i: number
  index: number
  side: LedgerSide
  columnCount: number
  entries: ILedgerEntry[]
  setEntries: (data: ILedgerEntry[]) => void
  otherEntries: ILedgerEntry[]
  setData: (data: ILedgerEntry[]) => void
  updateEntry: (data: ILedgerEntry[], index: number, side: LedgerSide) => void
  checkAndClearEmptyRow: () => void
}): React.ReactElement {
  return (
    <td
      className={`py-2 print:py-0.5 p-4 ${
        side === LedgerSide.Debit && i === columnCount - 1
          ? 'border-r-[6px] border-double'
          : 'border-r-2'
      } border-zinc-700 text-right`}
    >
      <input
        type="text"
        value={
          entries[index]?.dashed?.[i]
            ? '-'
            : entries[index]?.amount[i]
            ? entries[index]?.amount[i].toLocaleString()
            : ''
        }
        onBlur={checkAndClearEmptyRow}
        onChange={(e) => {
          const newData = [...entries]

          const dashed = newData[index].dashed || Array(columnCount).fill(false)
          dashed[i] = false

          newData[index].amount[i] =
            parseInt(e.target.value.replace(/,/g, '')) || 0

          updateEntry(newData, index, side)
        }}
        onKeyDown={(e) => {
          if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            const newData = [...entries]
            const dashed =
              newData[index].dashed || Array(columnCount).fill(false)
            dashed[i] = !dashed[i]
            newData[index].dashed = dashed
            setEntries(newData)
            setData([...newData, ...otherEntries])
          }
        }}
        className={`w-20 h-full bg-transparent ${
          entries[index]?.dashed?.[i] ? 'text-center' : 'text-right'
        }`}
      />
    </td>
  )
}

export default LedgerAmountColumn

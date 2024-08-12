/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react'
import {
  type LedgerSide,
  type ILedgerEntry
} from '../../../../../typescript/ledger.interface'

function LedgerDateColumn({
  index,
  side,
  entries,
  updateEntry,
  checkAndClearEmptyRow
}: {
  index: number
  side: LedgerSide
  entries: ILedgerEntry[]
  updateEntry: (data: ILedgerEntry[], index: number, side: LedgerSide) => void
  checkAndClearEmptyRow: () => void
}): React.ReactElement {
  return (
    <td className="py-2 border-r-2 p-4 border-zinc-700 text-right">
      <input
        type="text"
        value={entries[index]?.date}
        onChange={(e) => {
          const newData = [...entries]
          newData[index].date = e.target.value
          updateEntry(newData, index, side)
        }}
        onBlur={checkAndClearEmptyRow}
        className={`w-14 h-full bg-transparent ${
          entries[index]?.date?.match(/^\d{4}$/) ? 'text-center' : 'text-right'
        }  ${
          entries[index]?.particular === 'TOTAL'
            ? 'text-transparent'
            : 'text-zinc-200'
        }`}
      />
    </td>
  )
}

export default LedgerDateColumn

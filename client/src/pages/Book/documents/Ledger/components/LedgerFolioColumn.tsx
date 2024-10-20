/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import {
  type ILedgerEntry,
  type LedgerSide
} from '../../../../../typescript/ledger.interface'

function LedgerFolioColumn({
  entries,
  index,
  updateEntry,
  side,
  checkAndClearEmptyRow
}: {
  index: number
  side: LedgerSide
  entries: ILedgerEntry[]
  updateEntry: (data: ILedgerEntry[], index: number, side: LedgerSide) => void
  checkAndClearEmptyRow: () => void
}): React.ReactElement {
  return (
    <td className="py-2 print:py-0.5 border-r-2 p-4 border-zinc-700 text-right">
      <input
        type="text"
        value={entries[index]?.folio}
        onBlur={checkAndClearEmptyRow}
        onChange={(e) => {
          const newData = [...entries]
          newData[index].folio = e.target.value || ''
          updateEntry(newData, index, side)
        }}
        className="min-w-16 text-center w-full h-full bg-transparent"
      />
    </td>
  )
}

export default LedgerFolioColumn

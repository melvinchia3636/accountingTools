import React from 'react'
import HeaderInput from '../../HeaderInput'
import { type ILedgerHeader } from '../../../typescript/ledger.interface'

function LedgerHeader({
  columnCount,
  topTextColumnCount,
  headers,
  setHeaders
}: {
  columnCount: number
  topTextColumnCount: number
  headers: ILedgerHeader[]
  setHeaders: (headers: ILedgerHeader[]) => void
}): React.ReactElement {
  return (
    <thead>
      {Array.from({ length: topTextColumnCount }).map((_, i) => (
        <tr key={i} className="text-zinc-500 border-2 border-zinc-700">
          <td className="py-2 border-r-2 w-24 border-zinc-700"></td>
          <td className="py-2 border-r-2 border-zinc-700"></td>
          {Array(columnCount)
            .fill(0)
            .map((_, j) => (
              <th
                key={j}
                className={`py-2 w-28 ${
                  j === columnCount - 1
                    ? 'border-r-[6px] border-double'
                    : 'border-r-2'
                } border-zinc-700`}
              >
                <HeaderInput
                  headers={headers}
                  setHeaders={setHeaders}
                  i={i}
                  j={j}
                  side="debit"
                />
              </th>
            ))}
          <td className="py-2 border-r-2 w-24 border-zinc-700"></td>
          <td className="py-2 border-r-2 border-zinc-700"></td>
          {Array(columnCount)
            .fill(0)
            .map((_, j) => (
              <th key={j} className="py-2 w-28 border-r-2 border-zinc-700">
                <HeaderInput
                  headers={headers}
                  setHeaders={setHeaders}
                  i={i}
                  j={j}
                  side="credit"
                />
              </th>
            ))}
        </tr>
      ))}
    </thead>
  )
}

export default LedgerHeader

import React from 'react'
import HeaderInput from '../../../components/HeaderInput'
import { type ILedgerHeader } from '../../../../../typescript/ledger.interface'

function LedgerHeader({
  columnCount,
  topTextColumnCount,
  headers,
  setHeaders,
  hasFolio
}: {
  columnCount: number
  topTextColumnCount: number
  headers: ILedgerHeader[]
  setHeaders: (headers: ILedgerHeader[]) => void
  hasFolio: boolean
}): React.ReactElement {
  console.log(topTextColumnCount, columnCount)
  return (
    <thead>
      {Array.from({ length: topTextColumnCount }).map((_, i) => (
        <tr key={i} className="text-zinc-500 border-2 border-zinc-700">
          <th className="py-2 print:py-0.5 border-r-2 w-24 border-zinc-700"></th>
          <th className="py-2 print:py-0.5 border-r-2 border-zinc-700"></th>
          {hasFolio && (
            <th className="py-2 print:py-0.5 border-r-2 w-12 border-zinc-700">
              {i === 0 ? 'Fol.' : ''}
            </th>
          )}
          {Array(columnCount)
            .fill(0)
            .map((_, j) => (
              <th
                key={j}
                className={`py-2 print:py-0.5 w-28 ${
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
          <th className="py-2 print:py-0.5 border-r-2 w-24 border-zinc-700"></th>
          <th className="py-2 print:py-0.5 border-r-2 border-zinc-700"></th>
          {hasFolio && (
            <th className="py-2 print:py-0.5 border-r-2 w-12 border-zinc-700">
              {i === 0 ? 'Fol.' : ''}
            </th>
          )}
          {Array(columnCount)
            .fill(0)
            .map((_, j) => (
              <th
                key={j}
                className="py-2 print:py-0.5 w-28 border-r-2 border-zinc-700"
              >
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

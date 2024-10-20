/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useRef } from 'react'
import { type ILedgerHeader } from '../../../typescript/ledger.interface'

interface IHeaderPropsWithSide {
  side: 'debit' | 'credit'
  headers: ILedgerHeader[]
  setHeaders: (headers: ILedgerHeader[]) => void
  i: number
  j: number
}

interface IHeaderPropsWithoutSideWithJ {
  side?: never
  headers: string[][]
  setHeaders: (headers: string[][]) => void
  i: number
  j: number
}

interface IHeaderPropsWithoutSideWithoutJ {
  side?: never
  headers: string[]
  setHeaders: (headers: string[]) => void
  i: number
  j?: never
}

type HeaderProps =
  | IHeaderPropsWithSide
  | IHeaderPropsWithoutSideWithoutJ
  | IHeaderPropsWithoutSideWithJ

function HeaderInput({
  headers,
  setHeaders,
  i,
  j,
  side
}: HeaderProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = side
        ? headers[i][side][j]
        : j === undefined
        ? headers[i]
        : headers[i][j]
    }
  }, [headers, i, j, side])

  return (
    <div
      ref={ref}
      contentEditable
      onBlur={(e) => {
        const target = e.target as HTMLDivElement
        if (side !== undefined) {
          const newHeaders = [...headers]
          headers[i][side][j] = target.textContent ?? ''
          setHeaders(newHeaders)
        } else if (side === undefined) {
          if (j !== undefined) {
            const newHeaders = [...headers]
            newHeaders[i][j] = target.textContent ?? ''
            setHeaders(newHeaders)
          } else if (j === undefined) {
            const newHeaders = [...headers]
            newHeaders[i] = target.textContent ?? ''
            setHeaders(newHeaders)
          }
        }
        target.style.height = 'auto'
      }}
      id={`doc-header-${i}-${j}`}
      className="w-full h-max px-2 whitespace-pre-wrap"
    ></div>
  )
}

export default HeaderInput

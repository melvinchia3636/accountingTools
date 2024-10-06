/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useRef } from 'react'
import { type ILedgerHeader } from '../../../typescript/ledger.interface'

interface IBaseHeaderProps {
  i: number
  j: number
}

interface IHeaderPropsWithSide {
  side: 'debit' | 'credit'
  headers: ILedgerHeader[]
  setHeaders: (headers: ILedgerHeader[]) => void
}

interface IHeaderPropsWithoutSide {
  side?: never
  headers: string[][]
  setHeaders: (headers: string[][]) => void
}

type HeaderProps = (IHeaderPropsWithSide | IHeaderPropsWithoutSide) &
  IBaseHeaderProps

function HeaderInput({
  headers,
  setHeaders,
  i,
  j,
  side
}: HeaderProps): React.ReactElement {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = '1px'
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [ref.current])

  return (
    <textarea
      ref={ref}
      onChange={(e) => {
        if (side !== undefined) {
          const newHeaders = [...headers]
          headers[i][side][j] = e.target.value
          setHeaders(newHeaders)
        } else if (side === undefined) {
          const newHeaders = [...headers]
          newHeaders[i][j] = e.target.value
          setHeaders(newHeaders)
        }
      }}
      onKeyUp={(e) => {
        ;(e.target as HTMLTextAreaElement).style.height = '1px'
        ;(e.target as HTMLTextAreaElement).style.height = `${
          (e.target as HTMLTextAreaElement).scrollHeight
        }px`
      }}
      id={`doc-header-${i}-${j}`}
      value={side ? headers[i][side][j] : headers[i][j]}
      className="w-full bg-transparent resize-none text-center"
    />
  )
}

export default HeaderInput

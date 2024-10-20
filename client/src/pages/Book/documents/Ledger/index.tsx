/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import LedgerHeader from './components/LedgerHeader'
import { useParams } from 'react-router-dom'
import {
  type ILedgerHeader,
  LedgerSide,
  type ILedger
} from '../../../../typescript/ledger.interface'
import LedgerDateColumn from './components/LedgerDateColumn'
import LedgerParticularColumn from './components/LedgerParticularColumn'
import LedgerTotalColumn from './components/LedgerTotalColumn'
import LedgerAmountColumn from './components/LedgerAmountColumn'
import LedgerFolioColumn from './components/LedgerFolioColumn'

function Ledger({
  docRef,
  data,
  headers,
  name,
  hasFolio,
  isInGL,
  companyName,
  pageNumber,
  setData,
  columnCount,
  setHeaders,
  topTextColumnCount
}: {
  docRef: React.MutableRefObject<HTMLDivElement | null>
  data: ILedger['entries']
  headers: ILedgerHeader[]
  companyName: string
  name: string
  hasFolio: boolean
  isInGL: boolean
  pageNumber: number
  setData: (data: ILedger['entries']) => void
  setHeaders: (headers: ILedgerHeader[]) => void
  columnCount: number
  topTextColumnCount: number
}): React.ReactElement {
  const { id } = useParams()
  const [autofillData, setAutofillData] = useState<string[]>([])
  const [debitEntries, setDebitEntries] = useState<ILedger['entries']>(
    data.filter((item) => item.side === 'debit')
  )
  const [creditEntries, setCreditEntries] = useState<ILedger['entries']>(
    data.filter((item) => item.side === 'credit')
  )
  const maxEntries = Math.max(debitEntries.length, creditEntries.length)
  const [query, setQuery] = useState('')
  const filteredItems = [
    ...new Set([
      ...autofillData,
      ...data
        .map((item) => item.particular.replace(/\(.*\)|\[.*\]/g, '').trim())
        .filter((item) => item && item !== 'TOTAL')
    ])
  ]
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase())
    })
    .sort(
      (a, b) =>
        a.toLowerCase().indexOf(query.toLowerCase()) -
        b.toLowerCase().indexOf(query.toLowerCase())
    )

  useEffect(() => {
    fetch(`http://localhost:3000/autofill/ledger-particulars/${id}`)
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          setAutofillData(data.data as string[])
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  function updateEntry(
    newData: ILedger['entries'],
    index: number,
    side: LedgerSide
  ): void {
    const sides: Record<
      string,
      [
        ILedger['entries'],
        React.Dispatch<React.SetStateAction<ILedger['entries']>>
      ]
    > = {
      debit: [debitEntries, setDebitEntries],
      credit: [creditEntries, setCreditEntries]
    }

    if (index === sides[side][0].length - 1) {
      newData.push({
        date: '',
        particular: '',
        side: { debit: LedgerSide.Debit, credit: LedgerSide.Credit }[side],
        ...(hasFolio && { folio: '' }),
        amount: Array(columnCount).fill(0)
      })

      sides[side][1](newData)
    }

    balanceEntries()

    setData(
      side === 'debit'
        ? [...newData, ...creditEntries]
        : [...debitEntries, ...newData]
    )
  }

  function checkAndClearEmptyRow(): void {
    const jointData = debitEntries
      .map((item, i) => [item, creditEntries[i]])
      .filter(
        ([debit, credit], index) =>
          debit.date ||
          credit.date ||
          debit.particular ||
          credit.particular ||
          debit.folio ||
          credit.folio ||
          debit.amount.some((amount) => amount) ||
          credit.amount.some((amount) => amount) ||
          index === debitEntries.length - 1
      )

    const _debitEntries = jointData.map(([debit]) => debit)
    const _creditEntries = jointData.map(([, credit]) => credit)

    setDebitEntries(_debitEntries)
    setCreditEntries(_creditEntries)
    setData([..._debitEntries, ..._creditEntries])
  }

  function balanceEntries(): void {
    if (debitEntries.length > creditEntries.length) {
      setCreditEntries([
        ...creditEntries,
        ...Array.from({
          length: debitEntries.length - creditEntries.length
        }).map(() => ({
          date: '',
          particular: '',
          side: LedgerSide.Credit,
          amount: Array(columnCount).fill(0),
          ...(hasFolio && { folio: '' })
        }))
      ])
    }

    if (creditEntries.length > debitEntries.length) {
      setDebitEntries([
        ...debitEntries,
        ...Array.from({
          length: creditEntries.length - debitEntries.length
        }).map(() => ({
          date: '',
          particular: '',
          side: LedgerSide.Debit,
          amount: Array(columnCount).fill(0),
          ...(hasFolio && { folio: '' })
        }))
      ])
    }
  }

  useEffect(() => {
    balanceEntries()
  }, [debitEntries, creditEntries])

  return (
    <div ref={docRef} className="w-full flex-1 py-8 print:px-8 overflow-y-auto">
      <h2 className="text-lg print:text-sm text-zinc-500 underline decoration-zinc-500 underline-offset-4 decoration-2">
        In the books of{'  '}
        <span className="font-semibold text-zinc-100 print:text-zinc-900">
          {companyName}
        </span>
      </h2>
      {isInGL ? (
        <>
          <h3 className="text-2xl print:text-base text-center font-semibold mt-4 underline decoration-zinc-200 underline-offset-4 decoration-2">
            General Ledger
          </h3>
          <h4 className="text-lg w-full relative print:text-base text-center mt-8 print:mt-4 font-medium">
            {name}
            {pageNumber !== 0 && (
              <span className="absolute top-0 right-0 text-zinc-500 print:text-zinc-900">
                Page {pageNumber.toString().padStart(2, '0')}
              </span>
            )}
          </h4>
        </>
      ) : (
        <h3 className="text-2xl relative print:text-base text-center font-semibold mt-8 print:mt-4">
          {name}
          {pageNumber !== 0 && (
            <span className="absolute text-lg top-1/2 -translate-y-1/2 right-0 text-zinc-500 print:text-zinc-900">
              Page {pageNumber.toString().padStart(2, '0')}
            </span>
          )}
        </h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-2 print:text-xs border-zinc-700 mt-2">
          <LedgerHeader
            columnCount={columnCount}
            topTextColumnCount={topTextColumnCount}
            headers={headers}
            setHeaders={setHeaders}
            hasFolio={hasFolio}
          />
          <tbody>
            {Array.from({ length: maxEntries }).map(
              (_, index) =>
                (Boolean(
                  debitEntries[index]?.date ||
                    creditEntries[index]?.date ||
                    debitEntries[index]?.particular ||
                    creditEntries[index]?.particular ||
                    debitEntries[index]?.amount ||
                    creditEntries[index]?.amount
                ) ||
                  index === maxEntries - 1) && (
                  <tr key={index}>
                    {debitEntries[index] && (
                      <>
                        <LedgerDateColumn
                          index={index}
                          side={LedgerSide.Debit}
                          entries={debitEntries}
                          updateEntry={updateEntry}
                          checkAndClearEmptyRow={checkAndClearEmptyRow}
                        />
                        <LedgerParticularColumn
                          index={index}
                          side={LedgerSide.Debit}
                          entries={debitEntries}
                          updateEntry={updateEntry}
                          checkAndClearEmptyRow={checkAndClearEmptyRow}
                          filteredItems={filteredItems}
                          query={query}
                          setQuery={setQuery}
                        />
                        {hasFolio && (
                          <LedgerFolioColumn
                            index={index}
                            side={LedgerSide.Debit}
                            entries={debitEntries}
                            updateEntry={updateEntry}
                            checkAndClearEmptyRow={checkAndClearEmptyRow}
                          />
                        )}
                        {debitEntries[index]?.particular === 'TOTAL'
                          ? Array(columnCount)
                              .fill(0)
                              .map((_, i) => (
                                <LedgerTotalColumn
                                  key={i}
                                  i={i}
                                  side={LedgerSide.Debit}
                                  columnCount={columnCount}
                                  index={index}
                                  entries={debitEntries}
                                />
                              ))
                          : Array(columnCount)
                              .fill(0)
                              .map((_, i) => (
                                <LedgerAmountColumn
                                  key={i}
                                  i={i}
                                  index={index}
                                  side={LedgerSide.Debit}
                                  columnCount={columnCount}
                                  entries={debitEntries}
                                  setEntries={setDebitEntries}
                                  otherEntries={creditEntries}
                                  setData={setData}
                                  updateEntry={updateEntry}
                                  checkAndClearEmptyRow={checkAndClearEmptyRow}
                                />
                              ))}
                      </>
                    )}
                    {creditEntries[index] && (
                      <>
                        <LedgerDateColumn
                          index={index}
                          side={LedgerSide.Credit}
                          entries={creditEntries}
                          updateEntry={updateEntry}
                          checkAndClearEmptyRow={checkAndClearEmptyRow}
                        />
                        <LedgerParticularColumn
                          index={index}
                          side={LedgerSide.Credit}
                          entries={creditEntries}
                          updateEntry={updateEntry}
                          checkAndClearEmptyRow={checkAndClearEmptyRow}
                          filteredItems={filteredItems}
                          query={query}
                          setQuery={setQuery}
                        />
                        {hasFolio && (
                          <LedgerFolioColumn
                            index={index}
                            side={LedgerSide.Credit}
                            entries={creditEntries}
                            updateEntry={updateEntry}
                            checkAndClearEmptyRow={checkAndClearEmptyRow}
                          />
                        )}
                        {creditEntries[index]?.particular === 'TOTAL'
                          ? Array(columnCount)
                              .fill(0)
                              .map((_, i) => (
                                <LedgerTotalColumn
                                  key={i}
                                  i={i}
                                  side={LedgerSide.Credit}
                                  columnCount={columnCount}
                                  index={index}
                                  entries={creditEntries}
                                />
                              ))
                          : Array(columnCount)
                              .fill(0)
                              .map((_, i) => (
                                <LedgerAmountColumn
                                  key={i}
                                  i={i}
                                  index={index}
                                  side={LedgerSide.Credit}
                                  columnCount={columnCount}
                                  entries={creditEntries}
                                  setEntries={setCreditEntries}
                                  otherEntries={debitEntries}
                                  setData={setData}
                                  updateEntry={updateEntry}
                                  checkAndClearEmptyRow={checkAndClearEmptyRow}
                                />
                              ))}
                      </>
                    )}
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Ledger

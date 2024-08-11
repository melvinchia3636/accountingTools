/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import LedgerHeader from './components/LedgerHeader'
import { useParams } from 'react-router-dom'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field
} from '@headlessui/react'
import {
  type ILedgerHeader,
  LedgerSide,
  type ILedger
} from '../../../../typescript/ledger.interface'

function Ledger({
  data,
  headers,
  name,
  companyName,
  setData,
  columnCount,
  setHeaders,
  topTextColumnCount
}: {
  data: ILedger['entries']
  headers: ILedgerHeader[]
  companyName: string
  name: string
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
    side: 'debit' | 'credit'
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
          amount: Array(columnCount).fill(0)
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
          amount: Array(columnCount).fill(0)
        }))
      ])
    }
  }

  useEffect(() => {
    balanceEntries()
  }, [debitEntries, creditEntries])

  return (
    <>
      <h2 className="text-lg text-zinc-500 underline decoration-zinc-500 underline-offset-4 decoration-2">
        In the books of{'  '}
        <span className="font-semibold text-zinc-100">{companyName}</span>
      </h2>
      <h3 className="text-2xl text-center font-semibold mt-4 underline decoration-zinc-200 underline-offset-4 decoration-2">
        General Ledger
      </h3>
      <h4 className="text-lg text-center mt-8 font-medium">{name}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-zinc-700 mt-2">
          <LedgerHeader
            columnCount={columnCount}
            topTextColumnCount={topTextColumnCount}
            headers={headers}
            setHeaders={setHeaders}
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
                  <tr key={index} className="text-zinc-200">
                    {debitEntries[index] && (
                      <>
                        <td className="py-2 border-r-2 p-4 border-zinc-700 text-right">
                          <input
                            type="text"
                            value={debitEntries[index]?.date}
                            onChange={(e) => {
                              const newData = [...debitEntries]
                              newData[index].date = e.target.value
                              updateEntry(newData, index, 'debit')
                            }}
                            onBlur={checkAndClearEmptyRow}
                            className={`w-14 h-full bg-transparent ${
                              debitEntries[index]?.date?.match(/^\d{4}$/)
                                ? 'text-center'
                                : 'text-right'
                            } ${
                              debitEntries[index]?.particular === 'TOTAL'
                                ? 'text-transparent'
                                : 'text-zinc-200'
                            }`}
                          />
                        </td>
                        <td className="py-2 border-r-2 p-4 border-zinc-700">
                          <Field>
                            <Combobox
                              value={debitEntries[index]?.particular}
                              onChange={(e) => {
                                const newData = [...debitEntries]
                                newData[index].particular = e || ''
                                updateEntry(newData, index, 'debit')
                              }}
                              onClose={() => {
                                setQuery('')
                                updateEntry(debitEntries, index, 'debit')
                              }}
                            >
                              <ComboboxInput
                                displayValue={(item: string) => item}
                                onChange={(e) => {
                                  setQuery(e.target.value)
                                  updateEntry(debitEntries, index, 'debit')
                                }}
                                onBlur={checkAndClearEmptyRow}
                                className={`min-w-96 w-full h-full bg-transparent ${
                                  debitEntries[index]?.particular === 'TOTAL'
                                    ? 'text-transparent'
                                    : 'text-zinc-200'
                                }`}
                              />
                              <ComboboxOptions
                                anchor="bottom"
                                className="z-10 w-[var(--input-width)] !max-h-96 mt-2 bg-zinc-800 rounded-md shadow-lg"
                              >
                                {filteredItems.map((item) => (
                                  <ComboboxOption
                                    key={item}
                                    value={item}
                                    className="px-4 py-4 text-zinc-200 data-[focus]:bg-zinc-700 transition-all"
                                  >
                                    {item}
                                  </ComboboxOption>
                                ))}
                                {query.length > 0 &&
                                  !filteredItems.includes(query) && (
                                    <ComboboxOption
                                      value={query}
                                      className="px-4 py-4 text-zinc-200 data-[focus]:bg-zinc-700 transition-all"
                                    >
                                      Create{' '}
                                      <span className="font-bold">
                                        &quot;{query}&quot;
                                      </span>
                                    </ComboboxOption>
                                  )}
                              </ComboboxOptions>
                            </Combobox>
                          </Field>
                        </td>
                        {debitEntries[index]?.particular === 'TOTAL'
                          ? Array(columnCount)
                              .fill(0)
                              .map((_, i) => (
                                <td
                                  key={i}
                                  className={`${
                                    i === columnCount - 1
                                      ? 'border-r-[6px] border-double'
                                      : 'border-r-2'
                                  } border-zinc-700`}
                                >
                                  <div className="border-b-4 border-zinc-500 border-double">
                                    <div className="border-t text-right border-zinc-500 p-4 py-2">
                                      {(() => {
                                        const allEntries = debitEntries.slice(
                                          0,
                                          index
                                        )
                                        const splitByTotal = allEntries.reduce<
                                          Array<ILedger['entries']>
                                        >(
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
                                          .reduce(
                                            (acc, item) => acc + item.amount[i],
                                            0
                                          )
                                          .toLocaleString()
                                      })()}
                                    </div>
                                  </div>
                                </td>
                              ))
                          : Array(columnCount)
                              .fill(0)
                              .map((_, i) => (
                                <td
                                  key={i}
                                  className={`py-2 p-4 ${
                                    i === columnCount - 1
                                      ? 'border-r-[6px] border-double'
                                      : 'border-r-2'
                                  } border-zinc-700 text-right`}
                                >
                                  <input
                                    type="text"
                                    value={
                                      debitEntries[index]?.dashed?.[i]
                                        ? '-'
                                        : debitEntries[index]?.amount[i]
                                        ? debitEntries[index]?.amount[
                                            i
                                          ].toLocaleString()
                                        : ''
                                    }
                                    onBlur={checkAndClearEmptyRow}
                                    onChange={(e) => {
                                      const newData = [...debitEntries]

                                      const dashed =
                                        newData[index].dashed ||
                                        Array(columnCount).fill(false)
                                      dashed[i] = false

                                      newData[index].amount[i] =
                                        parseInt(
                                          e.target.value.replace(/,/g, '')
                                        ) || 0

                                      updateEntry(newData, index, 'debit')
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === 'd' &&
                                        (e.ctrlKey || e.metaKey)
                                      ) {
                                        e.preventDefault()
                                        const newData = [...debitEntries]
                                        const dashed =
                                          newData[index].dashed ||
                                          Array(columnCount).fill(false)
                                        dashed[i] = !dashed[i]
                                        newData[index].dashed = dashed
                                        setDebitEntries(newData)
                                        setData([...newData, ...creditEntries])
                                      }
                                    }}
                                    className={`w-20 h-full bg-transparent ${
                                      debitEntries[index]?.dashed?.[i]
                                        ? 'text-center'
                                        : 'text-right'
                                    } text-zinc-200`}
                                  />
                                </td>
                              ))}
                      </>
                    )}
                    {creditEntries[index] && (
                      <>
                        <td className="py-2 border-r-2 p-4 border-zinc-700 text-right">
                          <input
                            type="text"
                            value={creditEntries[index]?.date}
                            onChange={(e) => {
                              const newData = [...creditEntries]
                              newData[index].date = e.target.value
                              updateEntry(newData, index, 'credit')
                            }}
                            onBlur={checkAndClearEmptyRow}
                            className={`w-14 h-full bg-transparent ${
                              creditEntries[index]?.date?.match(/^\d{4}$/)
                                ? 'text-center'
                                : 'text-right'
                            }  ${
                              creditEntries[index]?.particular === 'TOTAL'
                                ? 'text-transparent'
                                : 'text-zinc-200'
                            }`}
                          />
                        </td>
                        <td className="py-2 border-r-2 p-4 border-zinc-700">
                          <Field>
                            <Combobox
                              value={creditEntries[index]?.particular}
                              onChange={(e) => {
                                const newData = [...creditEntries]
                                newData[index].particular = e || ''
                                updateEntry(newData, index, 'credit')
                              }}
                              onClose={() => {
                                setQuery('')
                                updateEntry(creditEntries, index, 'credit')
                              }}
                            >
                              <ComboboxInput
                                displayValue={(item: string) => item}
                                onChange={(e) => {
                                  updateEntry(creditEntries, index, 'credit')
                                  setQuery(e.target.value)
                                }}
                                onBlur={checkAndClearEmptyRow}
                                className={`min-w-96 w-full h-full bg-transparent ${
                                  creditEntries[index]?.particular === 'TOTAL'
                                    ? 'text-transparent'
                                    : 'text-zinc-200'
                                }`}
                              />
                              <ComboboxOptions
                                anchor="bottom"
                                className="z-10 w-[var(--input-width)] !max-h-96 mt-2 bg-zinc-800 rounded-md shadow-lg"
                              >
                                {filteredItems.map((item) => (
                                  <ComboboxOption
                                    key={item}
                                    value={item}
                                    className="px-4 py-4 text-zinc-200 data-[focus]:bg-zinc-700 transition-all"
                                  >
                                    {item}
                                  </ComboboxOption>
                                ))}
                                {query.length > 0 &&
                                  !filteredItems.includes(query) && (
                                    <ComboboxOption
                                      value={query}
                                      className="px-4 py-4 text-zinc-200 data-[focus]:bg-zinc-700 transition-all"
                                    >
                                      Create{' '}
                                      <span className="font-bold">
                                        &quot;{query}&quot;
                                      </span>
                                    </ComboboxOption>
                                  )}
                              </ComboboxOptions>
                            </Combobox>
                          </Field>
                        </td>
                        {creditEntries[index]?.particular === 'TOTAL'
                          ? Array(columnCount)
                              .fill(0)
                              .map((_, i) => (
                                <td
                                  key={i}
                                  className="border-r-2 border-zinc-700"
                                >
                                  <div className="border-b-4  border-zinc-500 border-double">
                                    <div className="border-t text-right border-zinc-500 p-4 py-2">
                                      {(() => {
                                        const allEntries = creditEntries.slice(
                                          0,
                                          index
                                        )

                                        const splitByTotal = allEntries.reduce<
                                          Array<ILedger['entries']>
                                        >(
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
                                          .reduce(
                                            (acc, item) => acc + item.amount[i],
                                            0
                                          )
                                          .toLocaleString()
                                      })()}
                                    </div>
                                  </div>
                                </td>
                              ))
                          : Array(columnCount)
                              .fill(0)
                              .map((_, i) => (
                                <td
                                  key={i}
                                  className="py-2 p-4 border-r-2 border-zinc-700 text-right"
                                >
                                  <input
                                    type="text"
                                    value={
                                      creditEntries[index]?.dashed?.[i]
                                        ? '-'
                                        : creditEntries[index]?.amount[i]
                                        ? creditEntries[index]?.amount[
                                            i
                                          ].toLocaleString()
                                        : ''
                                    }
                                    onBlur={checkAndClearEmptyRow}
                                    onChange={(e) => {
                                      const newData = [...creditEntries]

                                      const dashed =
                                        newData[index].dashed ||
                                        Array(columnCount).fill(false)
                                      dashed[i] = false

                                      newData[index].amount[i] =
                                        parseInt(
                                          e.target.value
                                            .replace(/,/g, '')
                                            .replace(/-/g, '')
                                        ) || 0
                                      updateEntry(newData, index, 'credit')
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === 'd' &&
                                        (e.ctrlKey || e.metaKey)
                                      ) {
                                        e.preventDefault()
                                        const newData = [...creditEntries]
                                        const dashed =
                                          newData[index].dashed ||
                                          Array(columnCount).fill(false)
                                        dashed[i] = !dashed[i]
                                        newData[index].dashed = dashed
                                        setCreditEntries(newData)
                                        setData([...debitEntries, ...newData])
                                      }
                                    }}
                                    className={`w-20 h-full bg-transparent ${
                                      creditEntries[index]?.dashed?.[i]
                                        ? 'text-center'
                                        : 'text-right'
                                    } text-zinc-200`}
                                  />
                                </td>
                              ))}
                      </>
                    )}
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Ledger

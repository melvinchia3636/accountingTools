/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import HeaderInput from '../../components/HeaderInput'
import PCBTextColumn from './components/PCBTextColumn'
import { type IPCBEntry } from '../../../../typescript/pcb.interface'
import PCBAmountColumn from './components/PCBAmountColumn'
import PCBDateColumn from './components/PCBDateColumn'

function PettyCashBook({
  docRef,
  companyName,
  name,
  pageNumber,
  analysisColumnCount,
  headers,
  setHeaders,
  data,
  setData
}: {
  docRef: React.RefObject<HTMLDivElement>
  companyName: string
  name: string
  pageNumber: number
  analysisColumnCount: number
  headers: string[]
  setHeaders: (headers: string[]) => void
  data: IPCBEntry[]
  setData: (data: IPCBEntry[]) => void
}): React.ReactElement {
  const DEFAULT_ROW = {
    receipts: 0,
    folio: '',
    date: '',
    particular: '',
    voucher: '',
    payments: 0,
    analysis: Array(analysisColumnCount).fill(0),
    analysisIsText: Array(analysisColumnCount).fill(false),
    ledgerAccounts: 0,
    ledgerFolio: ''
  }

  function checkAndClearEmptyRow(rowIndex: number, item: IPCBEntry): void {
    if (rowIndex === data.length - 1) {
      return
    }

    if (
      item.receipts === 0 &&
      item.folio === '' &&
      item.date === '' &&
      item.particular === '' &&
      item.voucher === '' &&
      item.payments === 0 &&
      item.analysis.every((e) => e === 0) &&
      item.ledgerAccounts === 0 &&
      item.ledgerFolio === ''
    ) {
      const newData = data.filter((_, i) => i !== rowIndex)
      setData(newData)
    }
  }

  return (
    <div
      ref={docRef}
      className="min-w-full flex-1 py-8 print:px-8 overflow-y-auto"
    >
      <h2 className="text-lg print:text-sm text-zinc-500 underline decoration-zinc-500 underline-offset-4 decoration-2">
        In the books of{'  '}
        <span className="font-semibold text-zinc-100 print:text-zinc-900">
          {companyName}
        </span>
      </h2>
      <h3 className="text-2xl relative print:text-base text-center font-semibold mt-8 print:mt-4">
        {name}
        {pageNumber !== 0 && (
          <span className="absolute print:text-base text-lg top-1/2 -translate-y-1/2 right-0 text-zinc-500 print:text-zinc-900">
            Page {pageNumber.toString().padStart(2, '0')}
          </span>
        )}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-2 mt-4 border-zinc-700">
          <thead>
            <tr className="text-zinc-500 border-2 border-zinc-700">
              <th className="py-2 print:py-0.5 text-center font-bold border-r-2 w-24 border-zinc-700">
                Receipts
              </th>
              <th className="py-2 print:py-0.5 text-center font-bold w-16 border-r-2 border-zinc-700">
                Folio
              </th>
              <th className="py-2 print:py-0.5 text-center font-bold w-14 border-r-2 border-zinc-700">
                Date
              </th>
              <th className="py-2 print:py-0.5 text-center font-bold  border-r-2 border-zinc-700">
                Particulars
              </th>
              <th className="py-2 print:py-0.5 text-center font-bold w-20 border-r-2 border-zinc-700">
                Voucher No.
              </th>
              <th className="py-2 print:py-0.5 text-center font-bold w-24 border-r-2 border-zinc-700">
                Payments
              </th>
              {Array(analysisColumnCount)
                .fill(0)
                .map((_, i) => (
                  <th
                    key={i}
                    className={`py-2 print:py-0.5 w-28 border-r-2 ${
                      i === 0 ? 'border-l-4' : ''
                    } border-zinc-700`}
                  >
                    <HeaderInput
                      headers={headers}
                      setHeaders={setHeaders}
                      i={i}
                    />
                  </th>
                ))}
              <th className="py-2 print:py-0.5 text-center font-bold w-24 border-r-2 border-zinc-700">
                Sundries
              </th>
              <th className="py-2 print:py-0.5 text-center font-bold w-24 border-r-2 border-zinc-700">
                Folio
              </th>
            </tr>
            <tr className="py-2 print:py-0.5 w-28 border-r-2 border-b-2 border-zinc-700 text-zinc-500">
              {[
                true,
                false,
                false,
                false,
                false,
                true,
                ...Array(analysisColumnCount).fill(true),
                true
              ].map((e: boolean, i) => (
                <th
                  key={i}
                  className={`border-r-2 py-2 ${
                    i === 6 ? 'border-l-4' : ''
                  } border-zinc-700`}
                >
                  {e && 'RM'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <PCBAmountColumn
                  disabled={item.particular === 'TOTAL_RP'}
                  value={
                    item.particular === 'TOTAL_RP'
                      ? (() => {
                          const grouped = data.reduce<number[][]>(
                            (acc, curr) => {
                              if (curr.particular === 'TOTAL_RP') {
                                acc.push([])
                              }

                              acc[acc.length - 1].push(curr.receipts)

                              return acc
                            },
                            [[]]
                          )

                          const totalRPsIndex = data
                            .map((e) => e.particular)
                            .map((e, i) => e === 'TOTAL_RP' && i)
                            .filter((e) => e !== false)

                          const nthTotalRP = totalRPsIndex.indexOf(rowIndex)

                          return grouped[nthTotalRP].reduce(
                            (acc, curr) => acc + curr,
                            0
                          )
                        })()
                      : item.receipts
                  }
                  setValue={(amount) => {
                    const newData = [...data]
                    newData[rowIndex].receipts = amount

                    if (rowIndex === data.length - 1) {
                      newData.push(DEFAULT_ROW)
                    }

                    setData(newData)
                  }}
                  checkAndClearEmptyRow={() => {
                    checkAndClearEmptyRow(rowIndex, item)
                  }}
                  topBorder={item.particular === 'TOTAL_RP'}
                  doubleBottomBorder={item.particular === 'TOTAL_RP'}
                />
                <PCBTextColumn
                  value={item.folio}
                  setValue={(folio) => {
                    const newData = [...data]
                    newData[rowIndex].folio = folio

                    if (rowIndex === data.length - 1) {
                      newData.push(DEFAULT_ROW)
                    }

                    setData(newData)
                  }}
                  checkAndClearEmptyRow={() => {
                    checkAndClearEmptyRow(rowIndex, item)
                  }}
                  className="min-w-12 text-center"
                />
                <PCBDateColumn
                  value={item.date}
                  setValue={(date) => {
                    const newData = [...data]
                    newData[rowIndex].date = date

                    if (rowIndex === data.length - 1) {
                      newData.push(DEFAULT_ROW)
                    }

                    setData(newData)
                  }}
                  checkAndClearEmptyRow={() => {
                    checkAndClearEmptyRow(rowIndex, item)
                  }}
                />
                <PCBTextColumn
                  value={item.particular}
                  setValue={(particular) => {
                    const newData = [...data]
                    newData[rowIndex].particular = particular

                    if (rowIndex === data.length - 1) {
                      newData.push(DEFAULT_ROW)
                    }

                    setData(newData)
                  }}
                  checkAndClearEmptyRow={() => {
                    checkAndClearEmptyRow(rowIndex, item)
                  }}
                  className={`min-w-96 ${
                    ['TOTAL_RP', 'TOTAL_PCB'].includes(item.particular)
                      ? 'text-transparent'
                      : ''
                  }`}
                />
                <PCBTextColumn
                  value={item.voucher}
                  setValue={(voucher) => {
                    const newData = [...data]
                    newData[rowIndex].voucher = voucher

                    if (rowIndex === data.length - 1) {
                      newData.push(DEFAULT_ROW)
                    }

                    setData(newData)
                  }}
                  checkAndClearEmptyRow={() => {
                    checkAndClearEmptyRow(rowIndex, item)
                  }}
                  className="min-w-12 text-center"
                />
                <PCBAmountColumn
                  disabled={['TOTAL_RP', 'TOTAL_PCB'].includes(item.particular)}
                  value={
                    item.particular === 'TOTAL_PCB'
                      ? (() => {
                          const grouped = data.reduce<number[][]>(
                            (acc, curr) => {
                              if (
                                ['TOTAL_PCB', 'TOTAL_RP'].includes(
                                  curr.particular
                                )
                              ) {
                                acc.push([])
                              }

                              acc[acc.length - 1].push(curr.payments)

                              return acc
                            },
                            [[]]
                          )

                          const totalPCBsIndex = data
                            .map((e) => e.particular)
                            .map(
                              (e, i) =>
                                ['TOTAL_PCB', 'TOTAL_RP'].includes(e) && i
                            )
                            .filter((e) => e !== false)

                          const nthTotalPCB = totalPCBsIndex.indexOf(rowIndex)

                          return grouped[nthTotalPCB].reduce(
                            (acc, curr) => acc + curr,
                            0
                          )
                        })()
                      : item.particular === 'TOTAL_RP'
                      ? (() => {
                          const grouped = data.reduce<number[][]>(
                            (acc, curr) => {
                              if (curr.particular === 'TOTAL_RP') {
                                acc.push([])
                              }

                              acc[acc.length - 1].push(curr.payments)

                              return acc
                            },
                            [[]]
                          )

                          const totalRPsIndex = data
                            .map((e) => e.particular)
                            .map((e, i) => e === 'TOTAL_RP' && i)
                            .filter((e) => e !== false)

                          const nthTotalRP = totalRPsIndex.indexOf(rowIndex)

                          return grouped[nthTotalRP].reduce(
                            (acc, curr) => acc + curr,
                            0
                          )
                        })()
                      : item.payments
                  }
                  setValue={(amount) => {
                    const newData = [...data]
                    newData[rowIndex].payments = amount

                    if (rowIndex === data.length - 1) {
                      newData.push(DEFAULT_ROW)
                    }

                    setData(newData)
                  }}
                  checkAndClearEmptyRow={() => {
                    checkAndClearEmptyRow(rowIndex, item)
                  }}
                  topBorder={['TOTAL_RP', 'TOTAL_PCB'].includes(
                    item.particular
                  )}
                  doubleBottomBorder={item.particular === 'TOTAL_RP'}
                />
                {item.analysis.map((analysis, i) =>
                  item.analysisIsText[i] ? (
                    <PCBAmountColumn
                      disabled={item.particular === 'TOTAL_PCB'}
                      key={i}
                      value={
                        (item.particular === 'TOTAL_PCB'
                          ? (() => {
                              const grouped = data.reduce<number[][]>(
                                (acc, curr) => {
                                  if (curr.particular === 'TOTAL_PCB') {
                                    acc.push([])
                                  }

                                  acc[acc.length - 1].push(
                                    curr.analysisIsText[i]
                                      ? 0
                                      : +curr.analysis[i]
                                  )

                                  return acc
                                },
                                [[]]
                              )

                              const totalPCBsIndex = data
                                .map((e) => e.particular)
                                .map((e, i) => e === 'TOTAL_PCB' && i)
                                .filter((e) => e !== false)

                              const nthTotalPCB =
                                totalPCBsIndex.indexOf(rowIndex)

                              return grouped[nthTotalPCB].reduce(
                                (acc, curr) => acc + curr,
                                0
                              )
                            })()
                          : analysis) as string
                      }
                      setValue={(value: string | number) => {
                        const newData = [...data]
                        newData[rowIndex].analysis[i] = value

                        if (rowIndex === data.length - 1) {
                          newData.push({
                            receipts: 0,
                            folio: '',
                            date: '',
                            particular: '',
                            voucher: '',
                            payments: 0,
                            analysis: Array(analysisColumnCount).fill(0),
                            analysisIsText:
                              Array(analysisColumnCount).fill(false),
                            ledgerAccounts: 0,
                            ledgerFolio: ''
                          })
                        }

                        setData(newData)
                      }}
                      checkAndClearEmptyRow={() => {
                        checkAndClearEmptyRow(rowIndex, item)
                      }}
                      thickBorder={i === 0}
                      topBorder={item.particular === 'TOTAL_PCB'}
                      doubleBottomBorder={item.particular === 'TOTAL_PCB'}
                      isText={true}
                      toggleIsText={() => {
                        const newData = [...data]
                        newData[rowIndex].analysis[i] = ''
                        newData[rowIndex].analysisIsText[i] =
                          !item.analysisIsText[i]

                        setData(newData)
                      }}
                    />
                  ) : (
                    <PCBAmountColumn
                      disabled={item.particular === 'TOTAL_PCB'}
                      key={i}
                      value={
                        (item.particular === 'TOTAL_PCB'
                          ? (() => {
                              const grouped = data.reduce<number[][]>(
                                (acc, curr) => {
                                  if (curr.particular === 'TOTAL_PCB') {
                                    acc.push([])
                                  }

                                  acc[acc.length - 1].push(
                                    curr.analysisIsText[i]
                                      ? 0
                                      : +curr.analysis[i]
                                  )

                                  return acc
                                },
                                [[]]
                              )

                              const totalPCBsIndex = data
                                .map((e) => e.particular)
                                .map((e, i) => e === 'TOTAL_PCB' && i)
                                .filter((e) => e !== false)

                              const nthTotalPCB =
                                totalPCBsIndex.indexOf(rowIndex)

                              return grouped[nthTotalPCB].reduce(
                                (acc, curr) => acc + curr,
                                0
                              )
                            })()
                          : analysis) as number
                      }
                      setValue={(value: string | number) => {
                        const newData = [...data]
                        newData[rowIndex].analysis[i] = value

                        if (rowIndex === data.length - 1) {
                          newData.push({
                            receipts: 0,
                            folio: '',
                            date: '',
                            particular: '',
                            voucher: '',
                            payments: 0,
                            analysis: Array(analysisColumnCount).fill(0),
                            analysisIsText:
                              Array(analysisColumnCount).fill(false),
                            ledgerAccounts: 0,
                            ledgerFolio: ''
                          })
                        }

                        setData(newData)
                      }}
                      checkAndClearEmptyRow={() => {
                        checkAndClearEmptyRow(rowIndex, item)
                      }}
                      thickBorder={i === 0}
                      topBorder={item.particular === 'TOTAL_PCB'}
                      doubleBottomBorder={item.particular === 'TOTAL_PCB'}
                      toggleIsText={() => {
                        const newData = [...data]
                        newData[rowIndex].analysis[i] = 0
                        newData[rowIndex].analysisIsText[i] =
                          !item.analysisIsText[i]

                        setData(newData)
                      }}
                    />
                  )
                )}
                <PCBAmountColumn
                  value={
                    item.particular === 'TOTAL_PCB'
                      ? (() => {
                          const grouped = data.reduce<number[][]>(
                            (acc, curr) => {
                              if (curr.particular === 'TOTAL_PCB') {
                                acc.push([])
                              }

                              acc[acc.length - 1].push(curr.ledgerAccounts)

                              return acc
                            },
                            [[]]
                          )

                          const totalPCBsIndex = data
                            .map((e) => e.particular)
                            .map((e, i) => e === 'TOTAL_PCB' && i)
                            .filter((e) => e !== false)

                          const nthTotalPCB = totalPCBsIndex.indexOf(rowIndex)

                          return grouped[nthTotalPCB].reduce(
                            (acc, curr) => acc + curr,
                            0
                          )
                        })()
                      : item.ledgerAccounts
                  }
                  setValue={(amount) => {
                    const newData = [...data]
                    newData[rowIndex].ledgerAccounts = amount

                    if (rowIndex === data.length - 1) {
                      newData.push(DEFAULT_ROW)
                    }

                    setData(newData)
                  }}
                  checkAndClearEmptyRow={() => {
                    checkAndClearEmptyRow(rowIndex, item)
                  }}
                  topBorder={item.particular === 'TOTAL_PCB'}
                  doubleBottomBorder={item.particular === 'TOTAL_PCB'}
                />
                <PCBTextColumn
                  value={item.ledgerFolio}
                  setValue={(ledgerFolio) => {
                    const newData = [...data]
                    newData[rowIndex].ledgerFolio = ledgerFolio

                    if (rowIndex === data.length - 1) {
                      newData.push(DEFAULT_ROW)
                    }

                    setData(newData)
                  }}
                  checkAndClearEmptyRow={() => {
                    checkAndClearEmptyRow(rowIndex, item)
                  }}
                  className="min-w-12 text-center"
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PettyCashBook

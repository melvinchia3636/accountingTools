/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { type IJournal } from '../../../../typescript/journal.interface'

function Journal({
  docRef,
  data,
  companyName,
  setData
}: {
  docRef: React.RefObject<HTMLDivElement>
  data: IJournal['entries']
  companyName: string
  setData: (data: IJournal['entries']) => void
}): React.ReactElement {
  return (
    <div ref={docRef} className="w-full flex-1 py-8 print:px-8 overflow-y-auto">
      <h2 className="text-lg print:text-sm text-zinc-500 underline decoration-zinc-500 underline-offset-4 decoration-2">
        In the books of{'  '}
        <span className="font-semibold text-zinc-100 print:text-zinc-900">
          {companyName}
        </span>
      </h2>
      <h3 className="text-2xl print:text-base text-center font-semibold mt-4 underline decoration-zinc-200 underline-offset-4 decoration-2">
        General Journal
      </h3>
      <div className="w-full flex-1 mt-8 print:mt-4 overflow-y-auto print:text-xs">
        <table className="w-full border-2 border-zinc-700">
          <thead className="border-2 border-zinc-700">
            <tr className="text-zinc-500">
              <th className="py-2 border-r-2 w-24 border-zinc-700">Date</th>
              <th className="py-2 border-r-2 border-zinc-700">Particulars</th>
              <th className="py-2 w-28 border-r-2 border-zinc-700">Debit</th>
              <th className="py-2 w-28  border-r-2 border-zinc-700">Credit</th>
            </tr>
            <tr className="text-zinc-500 border-2 border-zinc-700">
              <th className="py-2 border-r-2 w-24 border-zinc-700"></th>
              <th className="py-2 border-r-2 border-zinc-700"></th>
              <th className="py-2 w-28 border-r-2 border-zinc-700">RM</th>
              <th className="py-2 w-28  border-r-2 border-zinc-700">RM</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="py-2 print:py-0.5 border-r-2 p-4 border-zinc-700">
                  <input
                    type="text"
                    value={item.date}
                    onChange={(e) => {
                      const newData = [...data]
                      newData[index].date = e.target.value
                      if (newData[index].isNew) {
                        newData.push({
                          isNew: true,
                          date: '',
                          particular: '',
                          debit: 0,
                          credit: 0
                        })
                        newData[index].isNew = false
                      }
                      setData(newData)
                    }}
                    onBlur={() => {
                      if (
                        !item.isNew &&
                        !item.date &&
                        !item.particular &&
                        !item.debit &&
                        !item.credit
                      ) {
                        const newData = [...data]
                        newData.splice(index, 1)
                        setData(newData)
                      }
                    }}
                    className={`w-full h-full bg-transparent ${
                      item.date.match(/(^\d{4}$)|(^Year \d+$)/)
                        ? 'text-center'
                        : 'text-right'
                    }`}
                  />
                </td>
                <td
                  className={`py-2 print:py-0.5 border-r-2 p-4 border-zinc-700 ${
                    item.credit ? 'pl-12' : ''
                  } ${
                    data[index + 1]?.date &&
                    !item.date?.match(/(^\d{4}$)|(^Year \d+$)/)
                      ? 'border-b-2 border-zinc-700 pb-10 print:pb-10'
                      : ''
                  }`}
                >
                  <input
                    type="text"
                    value={item.particular}
                    onChange={(e) => {
                      const newData = [...data]
                      newData[index].particular = e.target.value
                      if (newData[index].isNew) {
                        newData.push({
                          isNew: true,
                          date: '',
                          particular: '',
                          debit: 0,
                          credit: 0
                        })
                        newData[index].isNew = false
                      }
                      setData(newData)
                    }}
                    onBlur={() => {
                      if (
                        !item.isNew &&
                        !item.date &&
                        !item.particular &&
                        !item.debit &&
                        !item.credit
                      ) {
                        const newData = [...data]
                        newData.splice(index, 1)
                        setData(newData)
                      }
                    }}
                    className={`w-full h-full bg-transparent ${
                      item.particular === 'TOTAL' ? 'text-transparent' : ''
                    }`}
                  />
                </td>
                {item.particular === 'TOTAL' ? (
                  <td
                    className={`border-r-2 border-zinc-700 ${
                      data[index + 1]?.date &&
                      !item.date?.match(/(^\d{4}$)|(^Year \d+$)/)
                        ? ''
                        : ''
                    }`}
                  >
                    <div className="border-b-4  border-zinc-500 border-double">
                      <div className="border-t text-right border-zinc-500 p-4 py-2 print:py-0.5">
                        {(() => {
                          const allEntries = data
                            .map((e) => ({
                              particular: e.particular,
                              amount: e.debit
                            }))
                            .slice(0, index)

                          const splitByTotal = allEntries.reduce<
                            Array<Array<{ particular: string; amount: number }>>
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
                            ?.reduce((acc, item) => acc + item.amount, 0)
                            .toLocaleString()
                        })()}
                      </div>
                    </div>
                  </td>
                ) : (
                  <td
                    className={`py-2 print:py-0.5 border-r-2 p-4 border-zinc-700 text-right ${
                      data[index + 1]?.date &&
                      !item.date?.match(/(^\d{4}$)|(^Year \d+$)/)
                        ? ''
                        : ''
                    }`}
                  >
                    <input
                      type="text"
                      value={item.debit ? item.debit?.toLocaleString() : ''}
                      onChange={(e) => {
                        const newData = [...data]
                        newData[index].debit =
                          parseInt(e.target.value.replace(/,/g, '')) || 0
                        if (newData[index].isNew) {
                          newData.push({
                            isNew: true,
                            date: '',
                            particular: '',
                            debit: 0,
                            credit: 0
                          })
                          newData[index].isNew = false
                        }
                        setData(newData)
                      }}
                      onBlur={() => {
                        if (
                          !item.isNew &&
                          !item.date &&
                          !item.particular &&
                          !item.debit &&
                          !item.credit
                        ) {
                          const newData = [...data]
                          newData.splice(index, 1)
                          setData(newData)
                        }
                      }}
                      className="w-full h-full bg-transparent text-right"
                    />
                  </td>
                )}
                {item.particular === 'TOTAL' ? (
                  <td
                    className={`border-r-2 border-zinc-700 ${
                      data[index + 1]?.date &&
                      !item.date?.match(/(^\d{4}$)|(^Year \d+$)/)
                        ? ''
                        : ''
                    }`}
                  >
                    <div className="border-b-4 border-zinc-500 border-double">
                      <div className="border-t text-right border-zinc-500 p-4 py-2 print:py-0.5">
                        {(() => {
                          const allEntries = data
                            .map((e) => ({
                              particular: e.particular,
                              amount: e.credit
                            }))
                            .slice(0, index)

                          const splitByTotal = allEntries.reduce<
                            Array<Array<{ particular: string; amount: number }>>
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
                            ?.reduce((acc, item) => acc + item.amount, 0)
                            .toLocaleString()
                        })()}
                      </div>
                    </div>
                  </td>
                ) : (
                  <td
                    className={`py-2 p-4 text-right ${
                      data[index + 1]?.date &&
                      !item.date?.match(/(^\d{4}$)|(^Year \d+$)/)
                        ? ''
                        : ''
                    }`}
                  >
                    <input
                      type="text"
                      value={item.credit ? item.credit?.toLocaleString() : ''}
                      onChange={(e) => {
                        const newData = [...data]
                        newData[index].credit =
                          parseInt(e.target.value.replace(/,/g, '')) || 0
                        if (newData[index].isNew) {
                          newData.push({
                            isNew: true,
                            date: '',
                            particular: '',
                            debit: 0,
                            credit: 0
                          })
                          newData[index].isNew = false
                        }
                        setData(newData)
                      }}
                      onBlur={() => {
                        if (
                          !item.isNew &&
                          !item.date &&
                          !item.particular &&
                          !item.debit &&
                          !item.credit
                        ) {
                          const newData = [...data]
                          newData.splice(index, 1)
                          setData(newData)
                        }
                      }}
                      className="w-full h-full bg-transparent text-right"
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Journal

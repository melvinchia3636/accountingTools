/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { type IJournal } from '../../../../typescript/journal.interface'

function Journal({
  data,
  setData
}: {
  data: IJournal['entries']
  setData: (data: IJournal['entries']) => void
}): React.ReactElement {
  return (
    <>
      <h2 className="text-lg text-zinc-500 underline decoration-zinc-500 underline-offset-4 decoration-2">
        In the books of{'  '}
        <span className="font-semibold text-zinc-100">S Bhd and P Bhd</span>
      </h2>
      <h3 className="text-2xl text-center font-semibold mt-4 underline decoration-zinc-200 underline-offset-4 decoration-2">
        General Journal
      </h3>
      <div className="w-full flex-1 py-8 overflow-y-auto">
        <table className="w-full border-2 border-zinc-700">
          <thead className="border-2 border-zinc-700">
            <tr className="text-zinc-500">
              <th className="py-2 border-r-2 w-24 border-zinc-700">Date</th>
              <th className="py-2 border-r-2 border-zinc-700">Particulars</th>
              <th className="py-2 w-28 border-r-2 border-zinc-700">Debit</th>
              <th className="py-2 w-28  border-r-2 border-zinc-700">Credit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-zinc-200">
                <td
                  className={`py-2 border-r-2 p-4 border-zinc-700 ${
                    data[index + 1]?.date && !item.date?.match(/^\d{4}$/)
                      ? 'pb-10'
                      : ''
                  }`}
                >
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
                      item.date.match(/^\d{4}$/) ? 'text-center' : 'text-right'
                    } text-zinc-200`}
                  />
                </td>
                <td
                  className={`py-2 border-r-2 p-4 border-zinc-700 ${
                    item.credit ? 'pl-12' : ''
                  } ${
                    data[index + 1]?.date && !item.date?.match(/^\d{4}$/)
                      ? 'border-b-2 border-zinc-700 pb-10'
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
                      item.particular === 'TOTAL'
                        ? 'text-transparent'
                        : 'text-zinc-200'
                    }`}
                  />
                </td>
                {item.particular === 'TOTAL' ? (
                  <td
                    className={`border-r-2 border-zinc-700 ${
                      data[index + 1]?.date && !item.date?.match(/^\d{4}$/)
                        ? 'pb-10'
                        : ''
                    }`}
                  >
                    <div className="border-b-4  border-zinc-500 border-double">
                      <div className="border-t text-right border-zinc-500 p-4 py-2">
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
                    className={`py-2 border-r-2 p-4 border-zinc-700 text-right ${
                      data[index + 1]?.date && !item.date?.match(/^\d{4}$/)
                        ? 'pb-10'
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
                      className="w-full h-full bg-transparent text-right text-zinc-200"
                    />
                  </td>
                )}
                {item.particular === 'TOTAL' ? (
                  <td
                    className={`border-r-2 border-zinc-700 ${
                      data[index + 1]?.date && !item.date?.match(/^\d{4}$/)
                        ? 'pb-10'
                        : ''
                    }`}
                  >
                    <div className="border-b-4 border-zinc-500 border-double">
                      <div className="border-t text-right border-zinc-500 p-4 py-2">
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
                      data[index + 1]?.date && !item.date?.match(/^\d{4}$/)
                        ? 'pb-10'
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
                      className="w-full h-full bg-transparent text-right text-zinc-200"
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Journal

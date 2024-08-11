/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import HeaderInput from '../HeaderInput'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field
} from '@headlessui/react'
import { useParams } from 'react-router-dom'
import { type IStatementEntry } from '../../typescript/statement.interface'

function Statement({
  data,
  headers,
  companyName,
  name,
  columnCount,
  topTextColumnCount,
  subtitle,
  setData,
  setHeaders,
  addColumn
}: {
  data: IStatementEntry[]
  headers: string[][]
  companyName: string
  name: string
  columnCount: number
  topTextColumnCount: number
  subtitle: string
  setData: (data: IStatementEntry[]) => void
  setHeaders: (headers: string[][]) => void
  addColumn: (side: 'left' | 'right', colIndex: number) => void
}): React.ReactElement {
  const { id } = useParams()
  const [autofillData, setAutofillData] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const filteredItems = [
    ...new Set([
      ...autofillData,
      ...data
        .map((item) => item.particular.replace(/\(.*\)|\[.*\]/g, '').trim())
        .filter((item) => item)
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

  function fetchAutoFillData(): void {
    fetch(
      `http://localhost:3000/autofill/statement-particulars/${id}/${encodeURIComponent(
        name
      )}`
    )
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          setAutofillData(data.data as string[])
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    fetchAutoFillData()
  }, [])

  return (
    <div className="w-full flex-1 mt-8 overflow-y-auto">
      <h2 className="text-xl text-zinc-500 text-center">
        <span className="font-medium">{companyName}</span>
      </h2>
      <h3 className="text-2xl text-center font-semibold mt-2">{name}</h3>
      <p className="text-xl text-center text-zinc-500 mt-2">{subtitle}</p>
      <table className="w-full border-2 mt-8 border-zinc-700 table-fixed">
        <thead className="font-semibold text-center">
          {Array.from({ length: topTextColumnCount }).map((_, i) => (
            <tr key={i} className="text-zinc-500">
              <td className="py-2 border-r-2 w-full border-zinc-700"></td>
              {Array.from({ length: columnCount }).map((_, j) => (
                <td
                  key={j}
                  className={'p-2 border-r-2 border-b-2 w-32 border-zinc-700'}
                >
                  <HeaderInput
                    headers={headers}
                    setHeaders={setHeaders}
                    i={i}
                    j={j}
                  />
                </td>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="text-zinc-200">
              <td className={'py-2 border-r-2 p-4 border-zinc-700 '}>
                <Field>
                  <Combobox
                    value={item.particular}
                    onChange={(e) => {
                      const newData = [...data]
                      newData[rowIndex].particular = e ?? ''

                      if (rowIndex === data.length - 1) {
                        const newEntry = {
                          particular: '',
                          amount: Array.from({ length: columnCount }).map(
                            () => 0
                          ),
                          underline: false as const
                        }

                        newData.push(newEntry)
                      }

                      setData(newData)
                    }}
                    onClose={() => {
                      setQuery('')

                      if (rowIndex === data.length - 1) {
                        return
                      }

                      if (
                        item.amount.every((item) => item === 0) &&
                        item.particular === ''
                      ) {
                        const newData = data.filter((_, i) => i !== rowIndex)
                        setData(newData)
                      }
                    }}
                  >
                    <ComboboxInput
                      displayValue={(item: string) => item}
                      onChange={(e) => {
                        setQuery(e.target.value)
                      }}
                      onBlur={() => {
                        if (rowIndex === data.length - 1) {
                          return
                        }

                        if (
                          item.amount.every((item) => item === 0) &&
                          item.particular === ''
                        ) {
                          const newData = data.filter((_, i) => i !== rowIndex)
                          setData(newData)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault()
                          const newData = data.map((item, i) =>
                            rowIndex === i
                              ? {
                                  ...item,
                                  bold: !item.bold,
                                  particularUnderline: false
                                }
                              : item
                          )
                          setData(newData)
                        }

                        if (e.key === 'u' && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault()
                          const newData = data.map((item, i) =>
                            rowIndex === i
                              ? {
                                  ...item,
                                  bold: false,
                                  particularUnderline: !item.particularUnderline
                                }
                              : item
                          )
                          setData(newData)
                        }

                        if (e.key === ' ' && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault()
                          const newData = data.map((item, i) =>
                            rowIndex === i
                              ? {
                                  ...item,
                                  underline: item.underline,
                                  tabIn: !item.tabIn
                                }
                              : item
                          )
                          setData(newData)
                        }
                      }}
                      className={`bg-transparent w-full ${
                        item.bold ? 'font-bold' : ''
                      } ${
                        item.particularUnderline
                          ? 'underline decoration-2 underline-offset-4 font-semibold'
                          : ''
                      } ${item.tabIn ? 'pl-8' : ''}`}
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
                      {query.length > 0 && !filteredItems.includes(query) && (
                        <ComboboxOption
                          value={query}
                          className="px-4 py-4 text-zinc-200 data-[focus]:bg-zinc-700 transition-all"
                        >
                          Create{' '}
                          <span className="font-bold">&quot;{query}&quot;</span>
                        </ComboboxOption>
                      )}
                    </ComboboxOptions>
                  </Combobox>
                </Field>
              </td>
              {item.amount.map((amount, columnIndex) => (
                <td
                  key={columnIndex}
                  className={`py-2 border-r-2 p-4 border-zinc-700 text-right ${
                    item.underline && item.underline?.[columnIndex]
                      ? item.underline?.[columnIndex] === 'double'
                        ? 'border-b-[6px] border-double border-b-zinc-500'
                        : 'border-b-2 border-b-zinc-500'
                      : ''
                  }`}
                >
                  <input
                    type="text"
                    value={
                      item.text && item.text?.[columnIndex]
                        ? amount
                        : item.dashed && item.dashed?.[columnIndex]
                        ? '-'
                        : amount === 0
                        ? ''
                        : (amount as number) > 0
                        ? amount.toLocaleString()
                        : `(${(-amount).toLocaleString()})`
                    }
                    onBlur={() => {
                      if (rowIndex === data.length - 1) {
                        return
                      }

                      if (
                        item.amount.every((item) => item === 0) &&
                        item.particular === ''
                      ) {
                        const newData = data.filter((_, i) => i !== rowIndex)
                        setData(newData)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'u' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        const underline = (
                          item.underline || Array(columnCount).fill(false)
                        ).map((item, i) =>
                          columnIndex === i
                            ? item === true
                              ? 'double'
                              : item !== 'double'
                            : item
                        )

                        const newData = data.map((item, i) =>
                          rowIndex === i
                            ? {
                                ...item,
                                underline
                              }
                            : item
                        )

                        setData(newData)
                      }

                      if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        const newData = [...data]
                        newData[rowIndex].amount = newData[rowIndex].amount.map(
                          (item, i) => (i === columnIndex ? -item : item)
                        )

                        setData(newData)
                      }

                      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        const dashed = (
                          item.dashed || Array(columnCount).fill(false)
                        ).map((item, i) => (columnIndex === i ? !item : item))

                        const newData = data.map((item, i) =>
                          rowIndex === i
                            ? {
                                ...item,
                                dashed
                              }
                            : item
                        )

                        setData(newData)
                      }

                      if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        const text = (
                          item.text || Array(columnCount).fill(false)
                        ).map((item, i) => (columnIndex === i ? !item : item))

                        const newData = data.map((item, i) =>
                          rowIndex === i
                            ? {
                                ...item,
                                text
                              }
                            : item
                        )

                        setData(newData)
                      }

                      if (
                        e.key === 'l' &&
                        e.shiftKey &&
                        (e.metaKey || e.ctrlKey)
                      ) {
                        e.preventDefault()
                        addColumn('left', columnIndex)
                      }

                      if (
                        e.key === 'r' &&
                        e.shiftKey &&
                        (e.metaKey || e.ctrlKey)
                      ) {
                        e.preventDefault()
                        addColumn('right', columnIndex)
                      }
                    }}
                    onChange={(e) => {
                      const newData = [...data]
                      newData[rowIndex].amount = newData[rowIndex].amount.map(
                        (item, i) =>
                          i === columnIndex
                            ? newData[rowIndex].text &&
                              newData[rowIndex].text?.[columnIndex]
                              ? e.target.value
                              : parseInt(e.target.value.replace(/,/g, '')) || 0
                            : item
                      )

                      newData[rowIndex].dashed = newData[rowIndex].dashed
                        ? newData[rowIndex].dashed.map((item, i) =>
                            i === columnIndex ? false : item
                          )
                        : Array(columnCount).fill(false)

                      if (rowIndex === data.length - 1) {
                        const newEntry = {
                          particular: '',
                          amount: Array.from({ length: columnCount }).map(
                            () => 0
                          ),
                          underline: false as const
                        }

                        newData.push(newEntry)
                      }

                      setData(newData)
                    }}
                    className={`w-24 h-full bg-transparent ${
                      item.dashed && item.dashed?.[columnIndex]
                        ? 'text-center'
                        : 'text-right'
                    } text-zinc-200`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Statement

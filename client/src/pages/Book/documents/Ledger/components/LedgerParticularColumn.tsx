/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  Field,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption
} from '@headlessui/react'
import React from 'react'
import {
  type ILedgerEntry,
  type LedgerSide
} from '../../../../../typescript/ledger.interface'

function LedgerParticularColumn({
  index,
  side,
  entries,
  filteredItems,
  query,
  setQuery,
  updateEntry,
  checkAndClearEmptyRow
}: {
  index: number
  side: LedgerSide
  entries: ILedgerEntry[]
  filteredItems: string[]
  query: string
  setQuery: (query: string) => void
  updateEntry: (data: ILedgerEntry[], index: number, side: LedgerSide) => void
  checkAndClearEmptyRow: () => void
}): React.ReactElement {
  return (
    <td className="py-2 print:py-0.5 border-r-2 p-4 border-zinc-700">
      <Field>
        <Combobox
          value={entries[index]?.particular}
          onChange={(e) => {
            const newData = [...entries]
            newData[index].particular = e || ''
            updateEntry(newData, index, side)
          }}
          onClose={() => {
            setQuery('')
            updateEntry(entries, index, side)
          }}
        >
          <ComboboxInput
            displayValue={(item: string) => item}
            onChange={(e) => {
              setQuery(e.target.value)
              updateEntry(entries, index, side)
            }}
            onBlur={checkAndClearEmptyRow}
            className={`min-w-96 print:min-w-64 w-full h-full bg-transparent ${
              entries[index]?.particular === 'TOTAL' ? 'text-transparent' : ''
            }`}
          />
          <ComboboxOptions
            anchor="bottom"
            className="z-10 w-[var(--input-width)] !max-h-96 mt-2 text-zinc-100 bg-zinc-800 rounded-md shadow-lg"
          >
            {filteredItems.map((item) => (
              <ComboboxOption
                key={item}
                value={item}
                className="px-4 py-4 data-[focus]:bg-zinc-700 transition-all"
              >
                {item}
              </ComboboxOption>
            ))}
            {query.length > 0 && !filteredItems.includes(query) && (
              <ComboboxOption
                value={query}
                className="px-4 py-4 data-[focus]:bg-zinc-700 transition-all"
              >
                Create <span className="font-bold">&quot;{query}&quot;</span>
              </ComboboxOption>
            )}
          </ComboboxOptions>
        </Combobox>
      </Field>
    </td>
  )
}

export default LedgerParticularColumn

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react'

function PCBDateColumn({
  value,
  setValue,
  checkAndClearEmptyRow
}: {
  value: string
  setValue: (amount: string) => void
  checkAndClearEmptyRow: () => void
}): React.ReactElement {
  return (
    <td className="py-2 print:py-0.5 border-r-2 p-4 border-zinc-700 text-right">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        onBlur={checkAndClearEmptyRow}
        className={`w-14 h-full bg-transparent ${
          value?.match(/(^\d{4}$)|(^Year \d+$)/) ? 'text-center' : 'text-right'
        }
        `}
      />
    </td>
  )
}

export default PCBDateColumn

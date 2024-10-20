/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'

function PCBTextColumn({
  value,
  setValue,
  checkAndClearEmptyRow,
  className
}: {
  value: string
  setValue: (amount: string) => void
  checkAndClearEmptyRow: () => void
  className?: string
}): React.ReactElement {
  return (
    <td className="py-2 print:py-0.5 border-r-2 p-4 border-zinc-700 text-right">
      <input
        type="text"
        value={value}
        onBlur={checkAndClearEmptyRow}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        className={`${className} w-full h-full bg-transparent`}
      />
    </td>
  )
}

export default PCBTextColumn

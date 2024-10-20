/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'

interface IIsTextProps {
  isText: true
  value: string
  setValue: (value: string) => void
}

interface IIsNotTextProps {
  isText?: never
  value: number
  setValue: (value: number) => void
}

type IProps = (IIsTextProps | IIsNotTextProps) & {
  disabled?: boolean
  checkAndClearEmptyRow: () => void
  thickBorder?: boolean
  topBorder?: boolean
  doubleBottomBorder?: boolean
  toggleIsText?: () => void
}

function PCBAmountColumn({
  disabled = false,
  value,
  setValue,
  checkAndClearEmptyRow,
  thickBorder,
  topBorder,
  doubleBottomBorder,
  isText,
  toggleIsText
}: IProps): React.ReactElement {
  return (
    <td
      className={`border-r-2 border-zinc-700 text-right ${
        topBorder && 'border-t-2'
      } ${thickBorder && 'border-l-4'}`}
    >
      <div
        className={`py-2 print:py-0.5 p-4 ${
          doubleBottomBorder && 'border-b-[6px] border-double border-zinc-700'
        }`}
      >
        <input
          disabled={disabled}
          type="text"
          value={value ? value.toLocaleString() : disabled ? value : ''}
          onBlur={checkAndClearEmptyRow}
          onChange={(e) => {
            if (!isText) {
              setValue(parseInt(e.target.value.replace(/,/g, '')) || 0)
            } else {
              setValue(e.target.value)
            }
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 't') {
              e.preventDefault()
              toggleIsText?.()
            }
          }}
          className={`min-w-12 w-full h-full ${
            isText ? 'text-center' : 'text-right'
          } bg-transparent`}
        />
      </div>
    </td>
  )
}

export default PCBAmountColumn

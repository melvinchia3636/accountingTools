export interface ILedger {
  id: number
  type: string
  name: string
  nature?: string
  column?: number
  topTextColumnCount: number
  headers: Array<string[] | ILedgerHeader>
  entries: ILedgerEntry[]
  subtitle?: string
  columnCount?: number
}

export interface ILedgerEntry {
  date?: string
  particular: string
  side?: LedgerSide
  amount: number[]
  dashed?: boolean[]
  underline?: Array<boolean | string> | boolean
}

export enum LedgerSide {
  Credit = 'credit',
  Debit = 'debit'
}

export interface ILedgerHeader {
  debit: string[]
  credit: string[]
}

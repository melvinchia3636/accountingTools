export interface ILedger {
  id: number
  type: 'ledger'
  name: string
  pageNumber: number
  hasFolio: boolean
  isInGL: boolean
  topTextColumnCount: number
  nature?: string
  column?: number
  headers: ILedgerHeader[]
  entries: ILedgerEntry[]
  subtitle?: string
  columnCount: number
}

export interface ILedgerEntry {
  date?: string
  particular: string
  side?: LedgerSide
  folio?: string
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

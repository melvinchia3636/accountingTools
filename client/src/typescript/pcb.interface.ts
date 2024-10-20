export interface IPCB {
  id: number
  type: 'petty-cash-book'
  analysisColumnCount: number
  headers: string[]
  name: 'Petty Cash Book'
  pageNumber: number
  entries: IPCBEntry[]
}

export interface IPCBEntry {
  receipts: number
  folio: string
  date: string
  particular: string
  voucher: string
  payments: number
  analysis: Array<string | number>
  analysisIsText: boolean[]
  ledgerAccounts: number
  ledgerFolio: string
}

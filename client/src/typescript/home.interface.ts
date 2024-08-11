export interface IListEntry {
  id: string
  code: string
  name: string
  topic: string
  docAmount: {
    journal: number
    ledger: number
    statement: number
  }
}

export interface IJournal {
  id: number
  type: string
  name: string
  entries: IJournalEntry[]
}

export interface IJournalEntry {
  isNew: boolean
  date: string
  particular: string
  debit: number
  credit: number
}

export interface IJournal {
  id: number
  type: 'journal'
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

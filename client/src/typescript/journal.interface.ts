export interface IJournal {
  id: number
  type: string
  name: string
  entries: Entry[]
}

export interface Entry {
  isNew: boolean
  date: string
  particular: string
  debit: number
  credit: number
}

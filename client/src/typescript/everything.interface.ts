import { type IJournal } from './journal.interface'
import { type ILedger } from './ledger.interface'
import { type IPCB } from './pcb.interface'
import { type IStatement } from './statement.interface'

export interface IEverything {
  code: string
  entityName: string
  topic: string
  data: Document[]
  questionName?: string
}

export type Document = IJournal | ILedger | IStatement | IPCB

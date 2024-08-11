export interface IStatement {
  id: number
  type: string
  name: string
  subtitle: string
  columnCount: number
  topTextColumnCount: number
  headers: string[][]
  entries: IStatementEntry[]
}

export interface IStatementEntry {
  particular: string
  amount: Array<number | string>
  underline?: Array<boolean | 'double'> | false
  bold?: boolean
  particularUnderline?: boolean
  tabIn?: boolean
  text?: boolean[] | false
  dashed?: boolean[] | false
}

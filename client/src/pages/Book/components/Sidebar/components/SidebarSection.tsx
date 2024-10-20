/* eslint-disable multiline-ternary */
import React, { useMemo, useState } from 'react'
import SidebarDocumentItem from './SidebarDocumentItem'
import SidebarSectionHeader from './SidebarSectionHeader'
import {
  type Document,
  type IEverything
} from '../../../../../typescript/everything.interface'

const ICONS = {
  ledger: 'tabler:columns-2',
  'petty-cash-book': 'tabler:cash',
  journal: 'tabler:book-2',
  statement: 'tabler:report'
}

function SidebarSection({
  docType,
  everything,
  currentDocument,
  setCurrentDocument
}: {
  docType: 'ledger' | 'journal' | 'statement' | 'petty-cash-book'
  everything: IEverything
  currentDocument: Document | null
  setCurrentDocument: React.Dispatch<React.SetStateAction<Document | null>>
}): React.ReactElement {
  const [expanded, setExpanded] = useState(true)
  const docs = useMemo(
    () => everything.data.filter((item) => item.type === docType),
    [everything, docType]
  )

  return (
    <>
      <SidebarSectionHeader
        name={
          docType
            .split('-')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ') + 's'
        }
        icon={ICONS[docType]}
        expanded={expanded}
        setExpanded={setExpanded}
      />
      {docs.length !== 0 ? (
        <div className="pl-[10px]">
          <ul className="w-full mt-4 border-l-2 border-zinc-700">
            {docs.map((item) => (
              <SidebarDocumentItem
                key={item.id}
                isActive={currentDocument?.id === item.id}
                name={item.name}
                nature={
                  'nature' in item && item.nature !== undefined
                    ? item.nature
                    : ''
                }
                pageNumber={
                  'pageNumber' in item && item.pageNumber !== undefined
                    ? item.pageNumber
                    : 0
                }
                isInGL={
                  'isInGL' in item && item.isInGL !== undefined
                    ? item.isInGL
                    : false
                }
                onClick={() => {
                  setCurrentDocument(item)
                }}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-zinc-500 text-center mt-6">
          No{' '}
          {docType
            .split('-')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ')}
          s found
        </p>
      )}
    </>
  )
}

export default SidebarSection

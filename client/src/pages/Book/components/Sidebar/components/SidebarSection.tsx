import React, { useMemo, useState } from 'react'
import SidebarDocumentItem from './SidebarDocumentItem'
import SidebarSectionHeader from './SidebarSectionHeader'
import { type Document, type IEverything } from '../../../../../typescript/everything.interface'

const ICONS = {
  ledger: 'tabler:square-letter-j',
  journal: 'tabler:square-letter-t',
  statement: 'tabler:square-letter-s'
}

function SidebarSection({
  docType,
  everything,
  currentDocument,
  setCurrentDocument
}: {
  docType: 'ledger' | 'journal' | 'statement'
  everything: IEverything
  currentDocument: Document
  setCurrentDocument: React.Dispatch<React.SetStateAction<Document>>
}): React.ReactElement {
  const [expanded, setExpanded] = useState(true)
  const docs = useMemo(
    () => everything.data.filter((item) => item.type === docType),
    [everything, docType]
  )

  return (
    <>
      <SidebarSectionHeader
        name={docType.charAt(0).toUpperCase() + docType.slice(1) + 's'}
        icon={ICONS[docType]}
        expanded={expanded}
        setExpanded={setExpanded}
      />
      {docs.length !== 0
        ? (
        <div className="pl-[10px]">
          <ul className="w-full mt-4 border-l-2 border-zinc-700">
            {docs.map((item) => (
              <SidebarDocumentItem
                key={item.id}
                isActive={currentDocument.id === item.id}
                name={item.name}
                nature={'nature' in item ? item.nature : ''}
                onClick={() => {
                  setCurrentDocument(item)
                }}
              />
            ))}
          </ul>
        </div>
          )
        : (
        <p className="text-zinc-500 text-center mt-6">No {docType}s found</p>
          )}
    </>
  )
}

export default SidebarSection

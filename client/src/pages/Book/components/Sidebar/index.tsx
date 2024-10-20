import React, { useState } from 'react'
import CreateJournalModal from '../../documents/Journal/CreateJournalModal'
import CreateLedgerModal from '../../documents/Ledger/CreateLedgerModal'
import CreateStatementModal from '../../documents/Statement/CreateStatementModal'
import CreatePettyCashBookModal from '../../documents/PettyCashBook/CreatePettyCashBookModal'
import DeleteBookConfirmationModal from '../../modals/DeleteBookConfirmationModal'
import SidebarSection from './components/SidebarSection'
import CreateDocumentMenu from './components/CreateDocumentMenu'
import SidebarHeader from './components/SidebarHeader'
import SidebarWrapper from './components/SidebarWrapper'
import {
  type Document,
  type IEverything
} from '../../../../typescript/everything.interface'

function Sidebar({
  everything,
  currentDocument,
  setCurrentDocument,
  reloadEverything,
  openModifyBookModal,
  saved
}: {
  everything: IEverything
  currentDocument: Document | null
  setCurrentDocument: React.Dispatch<React.SetStateAction<Document | null>>
  reloadEverything: () => void
  openModifyBookModal: () => void
  saved: boolean
}): React.ReactElement {
  const [modalsState, setModalsState] = useState({
    createJournal: false,
    createLedger: false,
    createStatement: false,
    createPettyCashBook: false,
    deleteBook: false
  })

  return (
    <>
      <SidebarWrapper saved={saved}>
        <SidebarHeader
          everything={everything}
          openModifyBookModal={openModifyBookModal}
          toggleDeleteBookConfirmationModal={(value: boolean) => {
            setModalsState((prev) => ({ ...prev, deleteBook: value }))
          }}
        />
        <div className="w-full flex-1 overflow-y-auto flex flex-col">
          {(['journal', 'petty-cash-book', 'ledger', 'statement'] as const).map(
            (docType) => (
              <SidebarSection
                key={docType}
                docType={docType}
                everything={everything}
                currentDocument={currentDocument}
                setCurrentDocument={setCurrentDocument}
              />
            )
          )}
        </div>
        <CreateDocumentMenu
          openModal={(type: keyof typeof modalsState) => {
            setModalsState((prev) => ({ ...prev, [type]: true }))
          }}
        />
      </SidebarWrapper>
      {Object.entries({
        createJournal: CreateJournalModal,
        createLedger: CreateLedgerModal,
        createStatement: CreateStatementModal,
        createPettyCashBook: CreatePettyCashBookModal
      } as const).map(([key, Modal]) => (
        <Modal
          key={key}
          isOpen={modalsState[key as keyof typeof modalsState]}
          onClose={() => {
            setModalsState((prev) => ({ ...prev, [key]: false }))
          }}
          reloadBook={reloadEverything}
        />
      ))}
      <DeleteBookConfirmationModal
        isOpen={modalsState.deleteBook}
        onClose={() => {
          setModalsState((prev) => ({ ...prev, deleteBook: false }))
        }}
        bookName={everything.entityName}
      />
    </>
  )
}

export default Sidebar

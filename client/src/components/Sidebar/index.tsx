import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CreateJournalModal from "../Modals/CreateJournalModal";
import CreateLedgerModal from "../Modals/CreateLedgerModal";
import CreateStatementModal from "../Modals/CreateStatementModal";
import DeleteBookConfirmationModal from "../Modals/DeleteBookConfirmationModal";

function Sidebar({
  everything,
  currentDocument,
  setCurrentDocument,
  reloadEverything,
  openModifyBookModal,
  saved,
}: {
  everything: any;
  currentDocument: any;
  setCurrentDocument: React.Dispatch<React.SetStateAction<any>>;
  reloadEverything: () => void;
  openModifyBookModal: () => void;
  saved: boolean;
}) {
  const [createJournalModalOpen, toggleCreateJournalModal] = useState(false);
  const [createLedgerModalOpen, toggleCreateLedgerModal] = useState(false);
  const [createStatementModalOpen, toggleCreateStatementModal] =
    useState(false);
  const [deleteBookConfirmationModalOpen, toggleDeleteBookConfirmationModal] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <div
        className={`relative transition-all shrink-0 ${
          isExpanded ? "w-1/5" : "w-0"
        } h-full`}
      >
        {!saved && (
          <span className="absolute top-2 right-2 rounded-md w-2 h-2 bg-zinc-500"></span>
        )}
        <aside
          className={`h-full transition-all border-r border-zinc-700 py-8 ${
            isExpanded ? "px-8" : "px-0"
          } overflow-hidden flex flex-col`}
        >
          <header className="flex items-center justify-between gap-2 mb-8">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="w-8 h-8 shrink-0 transition-all rounded-md hover:bg-zinc-100/10 hover:text-zinc-200 text-zinc-500 flex items-center justify-center"
              >
                <Icon icon="uil:arrow-left" className="w-6 h-6 shrink-0" />
              </Link>
              <div>
                <h1 className="text-lg font-medium text-zinc-200 flex items-center">
                  {everything.entityName}
                </h1>
                <p className="text-sm text-zinc-500">{everything.topic}</p>
              </div>
            </div>
            <div className="relative">
              <Menu>
                <MenuButton className="w-8 h-8 text-zinc-500 hover:bg-zinc-100/10 hover:text-zinc-200 transition-all rounded-md flex items-center justify-center">
                  <Icon icon="tabler:dots-vertical" className="w-5 h-5" />
                </MenuButton>
                <MenuItems
                  transition
                  anchor="bottom end"
                  className="rounded-lg border bg-zinc-900 border-zinc-800 text-zinc-500 p-1 transition duration-100 ease-out [--anchor-gap:12px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <MenuItem>
                    <button
                      onClick={openModifyBookModal}
                      className="group flex w-full items-center gap-2 rounded-lg py-4 px-5 data-[focus]:text-zinc-200 data-[focus]:bg-white/10"
                    >
                      <Icon icon="uil:edit" className="w-5 h-5" />
                      Edit
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => {
                        toggleDeleteBookConfirmationModal(true);
                      }}
                      className="group flex w-full items-center text-red-500 gap-2 rounded-lg py-4 px-5 data-[focus]:text-red-400 data-[focus]:bg-white/10"
                    >
                      <Icon icon="uil:trash" className="w-5 h-5" />
                      Delete
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </header>
          <div className="w-full flex-1 overflow-y-auto flex flex-col">
            <header className="flex items-center justify-between">
              <h1 className="text-lg font-medium text-zinc-500 gap-2 flex items-center">
                <Icon icon="uil:file-alt" className="w-6 h-6" />
                Journals
              </h1>
              <button className="w-8 h-8 text-zinc-500 rounded-md flex items-center justify-center">
                <Icon icon="uil:angle-up" className="w-6 h-6" />
              </button>
            </header>
            {everything.data.filter((item) => item.type === "journal")
              .length ? (
              <div className="pl-[10px]">
                <ul className="w-full mt-4 border-l-2 border-zinc-700">
                  {everything.data
                    .filter((item) => item.type === "journal")
                    .map((item) => (
                      <li
                        key={item.id}
                        className={`w-full py-4 rounded-md cursor-pointer hover:bg-zinc-100/10 hover:text-zinc-100 transition-all ${
                          currentDocument.id === item.id
                            ? "relative after:absolute after:left-[-2px] font-semibold after:top-1/2 after:-translate-y-1/2 after:h-full after:w-[2px] after:bg-zinc-200 after:rounded-full hover:bg-zinc-100/10"
                            : "text-zinc-500"
                        } flex items-center justify-between gap-2 px-4`}
                        onClick={() => {
                          setCurrentDocument(item);
                        }}
                      >
                        {item.name}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <p className="text-zinc-500 text-center mt-6">
                No journals found
              </p>
            )}
            <header className="flex items-center justify-between mt-8">
              <h1 className="text-lg font-medium text-zinc-500 flex items-center gap-2">
                <Icon icon="tabler:square-letter-t" className="w-6 h-6" />
                Ledgers
              </h1>
              <button className="w-8 h-8 text-zinc-500 rounded-md flex items-center justify-center">
                <Icon icon="uil:angle-up" className="w-6 h-6" />
              </button>
            </header>
            {everything.data.filter((item) => item.type === "ledger").length ? (
              <div className="pl-[10px]">
                <ul className="w-full mt-4 border-l-2 border-zinc-700">
                  {everything.data
                    .filter((item) => item.type === "ledger")
                    .map((item) => (
                      <li
                        key={item.id}
                        className={`w-full py-4 rounded-md cursor-pointer hover:bg-zinc-100/10 hover:text-zinc-100 transition-all ${
                          currentDocument.id === item.id
                            ? "relative after:absolute after:left-[-2px] font-semibold after:top-1/2 after:-translate-y-1/2 after:h-full after:w-[2px] after:bg-zinc-200 after:rounded-full hover:bg-zinc-100/10"
                            : "text-zinc-500"
                        } flex items-center justify-between gap-2 px-4`}
                        onClick={() => {
                          setCurrentDocument(item);
                        }}
                      >
                        {item.name}
                        <span className="text-zinc-500 font-medium text-sm">
                          {item.nature}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <p className="text-zinc-500 text-center mt-6">No ledgers found</p>
            )}
            <header className="flex items-center justify-between mt-8">
              <h1 className="text-lg font-medium text-zinc-500 flex items-center gap-2">
                <Icon icon="uil:chart-line" className="w-6 h-6" />
                Statements
              </h1>
              <button className="w-8 h-8 text-zinc-500 rounded-md flex items-center justify-center">
                <Icon icon="uil:angle-up" className="w-6 h-6" />
              </button>
            </header>
            {everything.data.filter((item) => item.type === "statement")
              .length ? (
              <div className="pl-[10px]">
                <ul className="w-full mt-4 border-l-2 border-zinc-700">
                  {everything.data
                    .filter((item) => item.type === "statement")
                    .map((item) => (
                      <li
                        key={item.id}
                        className={`w-full py-4 rounded-md cursor-pointer hover:bg-zinc-100/10 hover:text-zinc-100 transition-all ${
                          currentDocument.id === item.id
                            ? "relative after:absolute after:left-[-2px] font-semibold after:top-1/2 after:-translate-y-1/2 after:h-full after:w-[2px] after:bg-zinc-200 after:rounded-full hover:bg-zinc-100/10"
                            : "text-zinc-500"
                        } flex items-center justify-between gap-2 px-4`}
                        onClick={() => {
                          setCurrentDocument(item);
                        }}
                      >
                        {item.name}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <p className="text-zinc-500 text-center mt-6">
                No statements found
              </p>
            )}
          </div>
          <div className="relative w-full">
            <Menu>
              <MenuButton className="w-full py-3 bg-zinc-200 hover:bg-zinc-300 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center">
                <Icon icon="uil:plus" className="w-5 h-5" />
                Add
              </MenuButton>
              <MenuItems
                transition
                anchor="top start"
                className="w-[var(--button-width)] rounded-lg border bg-zinc-900 border-zinc-800 text-zinc-500 p-1 transition duration-100 ease-out [--anchor-gap:16px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                {[
                  { name: "Journal", icon: "uil:file-alt" },
                  { name: "Ledger", icon: "tabler:square-letter-t" },
                  { name: "Statement", icon: "uil:chart-line" },
                ].map((item, index) => (
                  <MenuItem>
                    <button
                      onClick={() => {
                        switch (index) {
                          case 0:
                            toggleCreateJournalModal(true);
                            break;
                          case 1:
                            toggleCreateLedgerModal(true);
                            break;
                          case 2:
                            toggleCreateStatementModal(true);
                            break;
                        }
                      }}
                      className="group flex w-full items-center gap-2 rounded-lg py-4 px-5 data-[focus]:text-zinc-200 data-[focus]:bg-white/10"
                    >
                      <Icon icon={item.icon} className="w-5 h-5" />
                      {item.name}
                    </button>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </aside>
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          className={`absolute z-50 transition-all ${
            !isExpanded ? "rotate-180" : ""
          } -right-8 bottom-0 w-8 h-8 text-zinc-500 rounded-md flex items-center justify-center`}
        >
          <Icon icon="uil:angle-left" className="w-6 h-6" />
        </button>
      </div>
      <CreateJournalModal
        isOpen={createJournalModalOpen}
        onClose={() => {
          toggleCreateJournalModal(false);
        }}
        reloadBook={reloadEverything}
      />
      <CreateLedgerModal
        isOpen={createLedgerModalOpen}
        onClose={() => {
          toggleCreateLedgerModal(false);
        }}
        reloadBook={reloadEverything}
      />
      <CreateStatementModal
        isOpen={createStatementModalOpen}
        onClose={() => {
          toggleCreateStatementModal(false);
        }}
        reloadBook={reloadEverything}
      />
      <DeleteBookConfirmationModal
        isOpen={deleteBookConfirmationModalOpen}
        onClose={() => {
          toggleDeleteBookConfirmationModal(false);
        }}
        bookName={everything.entityName}
      />
    </>
  );
}

export default Sidebar;

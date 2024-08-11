/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-extend-native */
import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Journal from './documents/Journal'
import Ledger from './documents/Ledger'
import Statement from './documents/Statement'
import { useBlocker, useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import UnsaveChangeLeaveConfirmationModal from './modals/UnsaveChangeLeaveConfirmationModal'
import { type IEverything } from '../../typescript/everything.interface'
import { type IStatement } from '../../typescript/statement.interface'
import { type ILedger } from '../../typescript/ledger.interface'
import ModifyBookModal from '../Home/components/ModifyBookModal'
import DeleteDocumentConfirmationModal from './modals/DeleteDocumentConfirmationModal'

declare global {
  interface Array<T> {
    insert: (index: number, ...items: T[]) => void
  }
}

Array.prototype.insert = function (index: number, ...items: any[]): void {
  this.splice(index, 0, ...items)
}

function Book(): React.ReactElement {
  const [everything, setEverything] = useState<IEverything | 'loading'>(
    'loading'
  )
  const [data, setData] = useState<any>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const [modifyBookModalOpenType, setModifyBookModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteDocumentModalOpen, setDeleteDocumentModalOpen] = useState(false)
  const [saved, setSaved] = useState(true)
  const [firstFetch, setFirstFetch] = useState(true)

  function fetchData(): void {
    fetch(`http://localhost:3000/books/${id}`)
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          setEverything(data.data)
          setData(data.data.data[0] ?? null)
          setTimeout(() => {
            setFirstFetch(false)
          }, 100)
        }
      })
      .catch(() => {
        navigate('/')
      })
  }

  async function saveData(): Promise<void> {
    await fetch(`http://localhost:3000/books/save/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: everything
      })
    })
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          setSaved(true)
          toast.success('Saved successfully')
        }
      })
  }

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        saveData().catch(() => {
          toast.error('Failed to save')
        })
      }
    }

    return () => {
      document.onkeydown = null
    }
  }, [everything, id])

  useEffect(() => {
    if (
      id?.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      ) === null
    ) {
      navigate('/')
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!firstFetch) {
      setSaved(false)
    }
  }, [everything])

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !saved && currentLocation.pathname !== nextLocation.pathname
  )

  if (everything === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <>
      <Sidebar
        everything={everything}
        currentDocument={data}
        setCurrentDocument={setData}
        reloadEverything={fetchData}
        openModifyBookModal={() => {
          setModifyBookModalOpenType('update')
        }}
        saved={saved}
      />
      <div className="w-full h-full overflow-y-auto p-8 py-0 flex flex-col relative">
        <div className="absolute right-8 top-8 flex items-center gap-2">
          <a
            href={`http://localhost:3000/questions/${id}`}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 text-zinc-500 hover:bg-zinc-100/10 hover:text-zinc-200 transition-all rounded-md flex items-center justify-center"
          >
            <Icon icon="tabler:question-circle" className="w-5 h-5" />
          </a>
          {data !== null && (
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
                    onClick={() => {}}
                    className="group flex w-full items-center gap-2 rounded-lg py-4 px-5 data-[focus]:text-zinc-200 data-[focus]:bg-white/10"
                  >
                    <Icon icon="uil:edit" className="w-5 h-5" />
                    Edit
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => {
                      setDeleteDocumentModalOpen(true)
                    }}
                    className="group flex w-full items-center text-red-500 gap-2 rounded-lg py-4 px-5 data-[focus]:text-red-400 data-[focus]:bg-white/10"
                  >
                    <Icon icon="uil:trash" className="w-5 h-5" />
                    Delete
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          )}
        </div>
        {data !== null ? (
          (() => {
            switch (data.type) {
              case 'journal':
                return (
                  <Journal
                    key={`doc-${data.id}`}
                    data={data.entries}
                    setData={(newData) => {
                      const newEverything = { ...everything }
                      const target = newEverything.data.find(
                        (item) => item.id === data.id
                      )
                      if (target !== undefined) {
                        target.entries = newData
                      }
                      setEverything(newEverything)
                    }}
                  />
                )
              case 'ledger':
                return (
                  <Ledger
                    key={`doc-${data.id}`}
                    data={data.entries}
                    headers={data.headers}
                    name={data.name}
                    companyName={everything.entityName}
                    columnCount={data.column}
                    topTextColumnCount={data.topTextColumnCount}
                    setData={(newData) => {
                      const newEverything = { ...everything }
                      const target = newEverything.data.find(
                        (item) => item.id === data.id
                      )
                      if (target !== undefined) {
                        target.entries = newData
                      }
                      setEverything(newEverything)
                    }}
                    setHeaders={(newHeaders) => {
                      const newEverything = { ...everything }
                      const target = newEverything.data.find(
                        (item) => item.id === data.id
                      ) as ILedger
                      if (target !== undefined) {
                        target.headers = newHeaders
                      }
                      setEverything(newEverything)
                    }}
                  />
                )
              case 'statement':
                return (
                  <Statement
                    key={`doc-${data.id}`}
                    data={data.entries}
                    headers={data.headers}
                    companyName={everything.entityName}
                    name={data.name}
                    subtitle={data.subtitle}
                    columnCount={data.columnCount}
                    topTextColumnCount={data.topTextColumnCount}
                    setData={(newData) => {
                      const newEverything = { ...everything }

                      const target = newEverything.data.find(
                        (item) => item.id === data.id
                      )
                      if (target !== undefined) {
                        target.entries = newData
                      }
                      setEverything(newEverything)
                    }}
                    setHeaders={(newHeaders) => {
                      const newEverything = { ...everything }
                      const target = newEverything.data.find(
                        (item) => item.id === data.id
                      ) as IStatement
                      if (target !== undefined) {
                        target.headers = newHeaders
                      }
                      setEverything(newEverything)
                    }}
                    addColumn={(side: 'left' | 'right', colIndex: number) => {
                      const newEverything = { ...everything }
                      const target = newEverything.data.find(
                        (item) => item.id === data.id
                      ) as IStatement
                      target.columnCount += 1
                      if (side === 'left') {
                        target.headers.forEach((header) => {
                          header.insert(colIndex, '')
                        })
                        target.entries.forEach((entry) => {
                          entry.amount.insert(colIndex, 0)
                          if (entry.dashed) {
                            entry.dashed.insert(colIndex, false)
                          }
                          if (entry.underline) {
                            entry.underline.insert(colIndex, false)
                          }
                        })
                      } else {
                        target.headers.forEach((header) => {
                          header.insert(colIndex + 1, '')
                        })
                        target.entries.forEach((entry) => {
                          entry.amount.insert(colIndex + 1, 0)
                          if (entry.dashed) {
                            entry.dashed.insert(colIndex + 1, false)
                          }
                          if (entry.underline) {
                            entry.underline.insert(colIndex + 1, false)
                          }
                        })
                      }

                      setEverything(newEverything)
                    }}
                  />
                )
              default:
                return <h1>Default</h1>
            }
          })()
        ) : (
          <div className="w-full flex items-center justify-center h-full flex-col gap-12">
            <Icon icon="tabler:file-off" className="w-44 h-44 text-zinc-700" />
            <h1 className="text-3xl text-zinc-700 font-medium">
              No Document Selected
            </h1>
          </div>
        )}
      </div>
      <ModifyBookModal
        openType={modifyBookModalOpenType}
        onClose={() => {
          setModifyBookModalOpenType(null)
        }}
        reloadBooks={fetchData}
        existingBook={{
          id: id!,
          name: everything.entityName,
          code: everything.code,
          topic: everything.topic
        }}
      />
      <DeleteDocumentConfirmationModal
        isOpen={deleteDocumentModalOpen}
        onClose={() => {
          setDeleteDocumentModalOpen(false)
        }}
        documentID={data?.id}
        refreshData={fetchData}
      />
      <UnsaveChangeLeaveConfirmationModal
        isOpen={blocker.state === 'blocked'}
        proceed={() => {
          if (blocker.state === 'blocked') {
            blocker.proceed()
          }
        }}
        saveData={saveData}
        cancel={() => {
          if (blocker.state === 'blocked') {
            blocker.reset()
          }
        }}
      />
    </>
  )
}

export default Book

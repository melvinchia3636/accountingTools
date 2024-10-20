/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Label,
  Switch
} from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import Input from '../../../../components/Input'
import CreateButton from '../../../../components/CreateButton'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import AutofillInput from '../../../../AutofillInput'

const NATURES = [
  { id: 'A', name: 'Asset' },
  { id: 'A-', name: 'Asset (Contra)' },
  { id: 'L', name: 'Liability' },
  { id: 'L-', name: 'Liability (Contra)' },
  { id: 'E', name: 'Equity' },
  { id: 'E-', name: 'Equity (Contra)' },
  { id: 'IN', name: 'Income' },
  { id: 'IN-', name: 'Income (Contra)' },
  { id: 'EX', name: 'Expenses' },
  { id: 'EX-', name: 'Expenses (Contra)' },
  { id: 'TEMP', name: 'Temporary' },
  { id: 'TRADE', name: 'Trading Account' },
  { id: 'PL', name: 'Profit and Loss' }
]

function CreateLedgerModal({
  isOpen,
  onClose,
  reloadBook
}: {
  isOpen: boolean
  onClose: () => void
  reloadBook: () => void
}): React.ReactElement {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [selectedNature, setSelectedNature] = useState<{
    id: string
    name: string
  } | null>(null)
  const [columnCount, setColumnCount] = useState(1)
  const [topTextColumnCount, setTopTextColumnCount] = useState(1)
  const [pageNumber, setPageNumber] = useState(0)
  const [hasFolio, setHasFolio] = useState(false)
  const [isInGL, setIsInGL] = useState(false)
  const [query, setQuery] = useState('')
  const [nameAutofillData, setNameAutofillData] = useState<string[]>([])

  const filteredNatures =
    query === ''
      ? NATURES
      : NATURES.filter((type) => {
          return type.name.toLowerCase().includes(query.toLowerCase())
        })

  function fetchAutoFillData(): void {
    fetch(`http://localhost:3000/autofill/ledger-names/${id}`)
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          setNameAutofillData(data.data as string[])
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function onSubmit(): void {
    if (
      name.trim() === '' ||
      !selectedNature ||
      ![...NATURES.map((type) => type.id)].includes(selectedNature?.id) ||
      columnCount === 0 ||
      topTextColumnCount === 0
    ) {
      toast.error('Please fill all the fields')
      return
    }

    fetch(`http://localhost:3000/ledgers/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        nature: selectedNature.id,
        columnCount,
        topTextColumnCount,
        pageNumber,
        hasFolio,
        isInGL
      })
    })
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          onClose()
          setTimeout(() => {
            toast.success('Ledger created successfully')
            reloadBook()
          }, 700)
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to create ledger')
      })
  }

  useEffect(() => {
    if (isOpen) {
      setName('')
      setSelectedNature(null)
      setColumnCount(1)
      setTopTextColumnCount(1)
      setPageNumber(0)
      setHasFolio(false)
      setIsInGL(true)

      fetchAutoFillData()
    }
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      as="div"
      onClose={() => {}}
      transition
      className="fixed z-[60] inset-0 flex w-screen items-center justify-center bg-black/20 backdrop-blur-sm p-4 transition duration-300 ease-out data-[closed]:opacity-0"
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-lg rounded-xl bg-zinc-900 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="w-full flex justify-between gap-8">
              <div>
                <DialogTitle
                  as="h3"
                  className="text-xl flex gap-2 items-center text-zinc-200 font-medium"
                >
                  <Icon icon="tabler:square-letter-t" className="w-6 h-6" />
                  Create Ledger
                </DialogTitle>
                <p className="mt-2 text-zinc-500">
                  Create a new ledger to start recording transactions.
                </p>
              </div>
              <Icon
                icon="uil:times"
                className="w-6 h-6 shrink-0 mt-2 cursor-pointer text-zinc-500 hover:text-zinc-200"
                onClick={onClose}
              />
            </div>

            <div className="flex flex-col gap-5 mt-6">
              <AutofillInput
                name="Ledger Name"
                icon="tabler:square-letter-t"
                value={name}
                onChange={(e) => {
                  setName(e)
                }}
                autofillData={nameAutofillData}
              />
              <Field className="relative w-full min-w-[200px] h-14 group">
                <div className="absolute grid w-5 h-5 place-items-center text-zinc-500 group-focus-within:text-zinc-100 top-1/2 right-5 -translate-y-[55%]">
                  <Icon icon={'tabler:report-money'} className="w-6 h-6" />
                </div>
                <Combobox
                  value={selectedNature}
                  immediate
                  onChange={(type) => {
                    setSelectedNature(type)
                  }}
                  onClose={() => {
                    setQuery('')
                  }}
                >
                  <ComboboxInput
                    displayValue={(type: { id: string; name: string } | null) =>
                      type?.name ?? ''
                    }
                    onChange={(event) => {
                      setQuery(event.target.value)
                    }}
                    className="w-full h-full px-3 py-3 font-sans text-base font-normal transition-all bg-transparent border rounded-md peer text-zinc-200 outline outline-0 focus:outline-0 disabled:bg-zinc-50 disabled:border-0 placeholder-shown:border-[1.5px] placeholder-shown:border-zinc-700 placeholder-shown:border-t-zinc-700 focus:border-2 border-t-transparent focus:border-t-transparent border-zinc-700 focus:border-zinc-200"
                    placeholder=" "
                  />
                  <ComboboxOptions
                    anchor="bottom"
                    className="z-10 w-[var(--input-width)] !max-h-96 mt-2 bg-zinc-800 rounded-md shadow-lg"
                  >
                    {filteredNatures.map((type) => (
                      <ComboboxOption
                        key={type.id}
                        value={type}
                        className="px-4 py-4 text-zinc-200 hover:bg-zinc-700"
                      >
                        {type.name}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                </Combobox>
                <Label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-zinc-500 leading-[0.8] peer-focus:font-medium peer-focus:leading-[0.8] peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-zinc-500 transition-all -top-[5px] peer-placeholder-shown:text-base text-[14px] peer-focus:text-[14px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[4.1] text-zinc-500 peer-focus:text-zinc-200 before:border-zinc-700 peer-focus:before:!border-zinc-200 after:border-zinc-700 peer-focus:after:!border-zinc-200">
                  Ledger Nature
                </Label>
              </Field>
              <Input
                name="Number of Columns"
                icon="uil:grid"
                value={columnCount === 0 ? '' : columnCount + ''}
                onChange={(e) => {
                  setColumnCount(parseInt(e.target.value) || 0)
                }}
              />
              <Input
                name="Number of Top Text Columns"
                icon="uil:grid"
                value={topTextColumnCount === 0 ? '' : topTextColumnCount + ''}
                onChange={(e) => {
                  setTopTextColumnCount(parseInt(e.target.value) || 0)
                }}
              />
              <Input
                name="Page Number (Optional)"
                icon="uil:file"
                value={pageNumber === 0 ? '' : pageNumber + ''}
                onChange={(e) => {
                  setPageNumber(parseInt(e.target.value) || 0)
                }}
              />
              <div className="flex items-center justify-between gap-4 h-14 border-[1.5px] border-zinc-700 rounded-md px-4">
                <p className="text-zinc-500">Enable Folio Column</p>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={hasFolio}
                    onChange={setHasFolio}
                    className="group inline-flex h-6 w-11 items-center rounded-full bg-zinc-800 transition"
                  >
                    <span className="size-4 translate-x-1 rounded-full bg-zinc-500 group-data-[checked]:bg-zinc-100 transition group-data-[checked]:translate-x-6" />
                  </Switch>
                  <Icon icon="uil:folder" className="w-6 h-6 text-zinc-500" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 h-14 border-[1.5px] border-zinc-700 rounded-md px-4">
                <p className="text-zinc-500">Include in General Ledger</p>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={isInGL}
                    onChange={setIsInGL}
                    className="group inline-flex h-6 w-11 items-center rounded-full bg-zinc-800 transition"
                  >
                    <span className="size-4 translate-x-1 rounded-full bg-zinc-500 group-data-[checked]:bg-zinc-100 transition group-data-[checked]:translate-x-6" />
                  </Switch>
                  <Icon
                    icon="uil:book-open"
                    className="w-6 h-6 text-zinc-500"
                  />
                </div>
              </div>
            </div>

            <CreateButton action="Create" onSubmit={onSubmit} />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default CreateLedgerModal

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import Input from '../../../../components/Input'
import CreateButton from '../../../../components/CreateButton'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

function CreatePettyCashBookModal({
  isOpen,
  onClose,
  reloadBook
}: {
  isOpen: boolean
  onClose: () => void
  reloadBook: () => void
}): React.ReactElement {
  const { id } = useParams()
  const [analysisColumnCount, setColumnCount] = useState(1)
  const [pageNumber, setPageNumber] = useState(0)

  function onSubmit(): void {
    if (analysisColumnCount === 0) {
      toast.error('Please fill all the fields')
      return
    }

    fetch(`http://localhost:3000/pcb/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        analysisColumnCount,
        pageNumber
      })
    })
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          onClose()
          setTimeout(() => {
            toast.success('Petty Cash Book created successfully')
            reloadBook()
          }, 700)
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to create petty cash book')
      })
  }

  useEffect(() => {
    if (isOpen) {
      setColumnCount(1)
      setPageNumber(0)
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
                  <Icon icon="tabler:square-letter-p" className="w-6 h-6" />
                  Create Petty Cash Book
                </DialogTitle>
                <p className="mt-2 text-zinc-500">
                  Create a new petty cash book to start recording transactions.
                </p>
              </div>
              <Icon
                icon="uil:times"
                className="w-6 h-6 shrink-0 mt-2 cursor-pointer text-zinc-500 hover:text-zinc-200"
                onClick={onClose}
              />
            </div>

            <div className="flex flex-col gap-5 mt-6">
              <Input
                name="Number of Analysis Columns"
                icon="uil:grid"
                value={
                  analysisColumnCount === 0 ? '' : analysisColumnCount + ''
                }
                onChange={(e) => {
                  setColumnCount(parseInt(e.target.value) || 0)
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
            </div>
            <CreateButton action="Create" onSubmit={onSubmit} />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default CreatePettyCashBookModal

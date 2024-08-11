import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import Input from '../Input'
import CreateButton from '../CreateButton'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

function CreateJournalModal({
  isOpen,
  onClose,
  reloadBook
}: {
  isOpen: boolean
  onClose: () => void
  reloadBook: () => void
}): React.ReactElement {
  const [name, setName] = useState('')
  const { id } = useParams()

  function onSubmit(): void {
    if (name.trim() === '') {
      toast.error('Please fill all the fields')
      return
    }

    fetch(`http://localhost:3000/journals/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    })
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          onClose()
          setTimeout(() => {
            toast.success('Journal created successfully')
            reloadBook()
          }, 700)
        }
      }).catch((err) => {
        console.error(err)
        toast.error('Failed to create journal')
      })
  }

  useEffect(() => {
    setName('')
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      as="div"
      onClose={() => {}}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
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
                  <Icon icon="uil:file-alt" className="w-6 h-6 shrink-0" />
                  Create Journal
                </DialogTitle>
                <p className="mt-2 text-zinc-500">
                  Create a new journal to start recording transactions.
                </p>
              </div>
              <Icon
                icon="uil:times"
                className="w-6 h-6 cursor-pointer mt-2 text-zinc-500 hover:text-zinc-200"
                onClick={onClose}
              />
            </div>

            <div className="flex flex-col gap-6 mt-6">
              <Input
                name="Journal Name"
                icon="tabler:file"
                value={name}
                onChange={(e) => { setName(e.target.value) }}
              />
            </div>
            <CreateButton action="Create" onSubmit={onSubmit} />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default CreateJournalModal

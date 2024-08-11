import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import Input from '../../../components/Input'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

function DeleteBookConfirmationModal({
  isOpen,
  onClose,
  bookName
}: {
  isOpen: boolean
  onClose: () => void
  bookName: string
}): React.ReactElement {
  const [name, setName] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  function onSubmit(): void {
    if (name.trim() !== bookName) {
      toast.error('Book name does not match')
      return
    }

    fetch(`http://localhost:3000/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          onClose()
          setTimeout(() => {
            navigate('/')
            toast.success('Book deleted successfully')
          }, 700)
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to delete book')
      })
  }

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
            <div className="w-full flex justify-between items-center gap-8">
              <DialogTitle
                as="h3"
                className="text-xl flex gap-2 items-center text-red-500 font-medium"
              >
                <Icon icon="tabler:trash" className="w-6 h-6" />
                Are you sure?
              </DialogTitle>
              <button className="shrink-0 w-8 h-8 flex items-center justify-center hover:bg-zinc-100/10 rounded-md transition-all cursor-pointer text-zinc-500 hover:text-zinc-200">
                <Icon
                  icon="uil:times"
                  className="w-6 h-6"
                  onClick={() => {
                    onClose()
                  }}
                />
              </button>
            </div>
            <p className="mt-2 text-zinc-500">
              Are you sure you want to delete this book? This action cannot be
              undone.
            </p>
            <p className="text-zinc-500 mt-4 mb-4">
              Please type the book name to confirm.
            </p>
            <Input
              name="Book Name"
              icon="tabler:book"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
            <Button
              onClick={onSubmit}
              disabled={name.trim() !== bookName}
              className="px-6 py-3 w-full mt-6 bg-red-500 hover:bg-red-600 disabled:hover:bg-zinc-500 disabled:bg-zinc-500 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center"
            >
              <Icon icon="uil:trash" className="w-5 h-5" />
              Delete
            </Button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default DeleteBookConfirmationModal

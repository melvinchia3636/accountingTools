import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import Input from '../Input'
import { toast } from 'react-toastify'
import CreateButton from '../CreateButton'
import AutofillInput from '../../AutofillInput'

function ModifyBookModal({
  openType,
  onClose,
  reloadBooks,
  existingBook
}: {
  openType: 'update' | 'create' | null
  onClose: () => void
  reloadBooks: () => void
  existingBook: {
    id: string
    name: string
    code: string
    topic: string
  } | null
}): React.ReactElement {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [topic, setTopic] = useState('')
  const [topicAutofillData, setTopicAutofillData] = useState<string[]>([])

  function fetchAutoFillData(): void {
    fetch('http://localhost:3000/autofill/book-topics')
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          setTopicAutofillData(data.data as string[])
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    switch (e.target.name) {
      case 'Book Name':
        setName(e.target.value)
        break
      case 'Book Code':
        setCode(e.target.value)
        break
      case 'Book Topic':
        setTopic(e.target.value)
        break
    }
  }

  function onSubmit(): void {
    if (name.trim() === '' || code.trim() === '' || topic.trim() === '') {
      toast.error('Please fill all the fields')
      return
    }

    fetch(
      `http://localhost:3000/books${
        openType === 'update' ? `/${existingBook?.id}` : ''
      }`,
      {
        method: openType === 'update' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          code,
          topic
        })
      }
    )
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.status === 'success') {
          onClose()
          setTimeout(() => {
            reloadBooks()
            toast.success(`Book ${openType + 'd'} successfully`)
          }, 700)
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error(`Failed to ${openType} book`)
      })
  }

  useEffect(() => {
    if (openType === 'update' && existingBook !== null) {
      setName(existingBook.name)
      setCode(existingBook.code)
      setTopic(existingBook.topic)
    } else {
      setName('')
      setCode('')
      setTopic('')
    }

    fetchAutoFillData()
  }, [openType, existingBook])

  return (
    <Dialog
      open={openType !== null}
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
                  <Icon icon="tabler:pencil-plus" className="w-6 h-6" />
                  {openType === 'update' ? 'Update' : 'Create'} Book
                </DialogTitle>
                <p className="mt-2 text-zinc-500">
                  {openType === 'update'
                    ? 'Edit the book details to update the book.'
                    : 'Create a new book to start recording transactions.'}
                </p>
              </div>
              <Icon
                icon="uil:times"
                className="w-6 h-6 cursor-pointer shrink-0 mt-2 text-zinc-500 hover:text-zinc-200"
                onClick={onClose}
              />
            </div>

            <div className="flex flex-col gap-6 mt-6">
              <Input
                name="Book Name"
                icon="tabler:book"
                value={name}
                onChange={onChange}
              />
              <Input
                name="Book Code"
                icon="tabler:hash"
                value={code}
                onChange={onChange}
              />
              <AutofillInput
                name="Book Topic"
                icon="tabler:key"
                value={topic}
                onChange={(e) => {
                  setTopic(e)
                }}
                autofillData={topicAutofillData}
              />
            </div>
            <CreateButton
              action={openType === 'update' ? 'Update' : 'Create'}
              onSubmit={onSubmit}
            />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default ModifyBookModal

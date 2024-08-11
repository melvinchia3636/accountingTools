import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function UnsaveChangeLeaveConfirmationModal({
  isOpen,
  proceed,
  saveData,
  cancel
}: {
  isOpen: boolean
  proceed: () => void
  saveData: () => Promise<void>
  cancel: () => void
}): React.ReactElement {
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
                  className="text-xl flex gap-2 items-center text-red-500 font-medium"
                >
                  <Icon icon="tabler:logout" className="w-6 h-6" />
                  Wait A Minute!
                </DialogTitle>
              </div>
              <button className="shrink-0 w-8 h-8 flex items-center justify-center hover:bg-zinc-100/10 rounded-md transition-all cursor-pointer text-zinc-500 hover:text-zinc-200">
                <Icon
                  icon="uil:times"
                  className="w-6 h-6"
                  onClick={() => {
                    cancel()
                  }}
                />
              </button>
            </div>
            <p className="mt-2 text-zinc-500">
              You have unsaved changes. Do you want to save them before you
              leave?
            </p>
            <div className="w-full flex gap-2">
              <Button
                onClick={() => {
                  proceed()
                }}
                className="px-6 w-1/2 py-3 mt-6 bg-red-500 hover:bg-red-600 disabled:hover:bg-zinc-500 disabled:bg-zinc-500 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center"
              >
                <Icon icon="uil:trash" className="w-5 h-5" />
                Discard
              </Button>
              <Button
                onClick={() => {
                  saveData()
                    .then(() => {
                      proceed()
                    })
                    .catch((err) => {
                      console.error(err)
                    })
                }}
                className="px-6 py-3 w-1/2 mt-6 bg-zinc-100 hover:bg-zinc-200 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center"
              >
                <Icon icon="uil:save" className="w-5 h-5" />
                Save
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default UnsaveChangeLeaveConfirmationModal

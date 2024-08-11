import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link } from 'react-router-dom'
import { type IEverything } from '../../../../../typescript/everything.interface'

function SidebarHeader({
  everything,
  openModifyBookModal,
  toggleDeleteBookConfirmationModal
}: {
  everything: IEverything
  openModifyBookModal: () => void
  toggleDeleteBookConfirmationModal: (arg0: boolean) => void
}): React.ReactElement {
  return (
    <header className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="w-8 h-8 shrink-0 transition-all rounded-md hover:bg-zinc-100/10 hover:text-zinc-200 text-zinc-500 flex items-center justify-center"
        >
          <Icon icon="uil:arrow-left" className="w-6 h-6 shrink-0" />
        </Link>
        <div>
          <h1 className="text-lg font-medium text-zinc-200 flex items-center">
            {everything.code}
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
                  toggleDeleteBookConfirmationModal(true)
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
  )
}

export default SidebarHeader

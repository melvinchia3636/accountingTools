import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function CreateDocumentMenu({
  openModal
}: {
  openModal: (
    type: 'createJournal' | 'createLedger' | 'createStatement'
  ) => void
}): React.ReactElement {
  return (
    <div className="relative w-full mt-8">
      <Menu>
        <MenuButton className="w-full py-3 bg-zinc-200 hover:bg-zinc-300 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center">
          <Icon icon="uil:plus" className="w-5 h-5" />
          Add
        </MenuButton>
        <MenuItems
          transition
          anchor="top start"
          className="w-[var(--button-width)] z-[60] rounded-lg border bg-zinc-900 border-zinc-800 text-zinc-500 p-1 transition duration-100 ease-out [--anchor-gap:16px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {[
            { name: 'Journal', icon: 'uil:file-alt' },
            { name: 'Ledger', icon: 'tabler:square-letter-t' },
            { name: 'Statement', icon: 'uil:chart-line' }
          ].map((item) => (
            <MenuItem key={item.name}>
              <button
                type="button"
                onClick={() => {
                  openModal(
                    `create${item.name}` as
                      | 'createJournal'
                      | 'createLedger'
                      | 'createStatement'
                  )
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
  )
}

export default CreateDocumentMenu

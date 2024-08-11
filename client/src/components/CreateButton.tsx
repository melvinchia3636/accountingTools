import { Button } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function CreateButton({
  action,
  onSubmit
}: {
  action: string
  onSubmit: () => void
}): React.ReactElement {
  return (
    <Button
      onClick={onSubmit}
      className="px-6 py-3 w-full mt-6 bg-zinc-200 hover:bg-zinc-300 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center"
    >
      {action}
      <Icon icon="uil:arrow-right" className="w-5 h-5" />
    </Button>
  )
}

export default CreateButton

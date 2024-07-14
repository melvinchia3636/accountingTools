import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Button,
} from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Input from "../Input";
import { toast } from "react-toastify";

function CreateBookModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): React.ReactElement {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [topic, setTopic] = useState("");

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target);
    switch (e.target.name) {
      case "Book Name":
        setName(e.target.value);
        break;
      case "Book Code":
        setCode(e.target.value);
        break;
      case "Book Topic":
        setTopic(e.target.value);
        break;
    }
  }

  function onSubmit() {
    if (name.trim() === "" || code.trim() === "" || topic.trim() === "") {
      toast.error("Please fill all the fields");
      return;
    }

    fetch("http://localhost:3000/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        code,
        topic,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          onClose();
        }
      });
  }

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => {}}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-zinc-900 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-xl flex gap-2 items-center text-zinc-200 font-medium"
            >
              <Icon icon="tabler:pencil-plus" className="w-6 h-6" />
              Create Book
            </DialogTitle>
            <p className="mt-2 text-zinc-500">
              Create a new book to start recording transactions.
            </p>
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
              <Input
                name="Book Topic"
                icon="tabler:key"
                value={topic}
                onChange={onChange}
              />
            </div>
            <Button
              onClick={onSubmit}
              className="px-6 py-3 w-full mt-6 bg-zinc-200 hover:bg-zinc-300 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center"
            >
              Create
              <Icon icon="uil:arrow-right" className="w-5 h-5" />
            </Button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default CreateBookModal;

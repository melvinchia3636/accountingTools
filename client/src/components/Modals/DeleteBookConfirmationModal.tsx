import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Input from "../Input";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function DeleteBookConfirmationModal({
  isOpen,
  onClose,
  bookName,
}: {
  isOpen: boolean;
  onClose: () => void;
  bookName: string;
}): React.ReactElement {
  const [name, setName] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  function onSubmit() {
    if (name.trim() !== bookName) {
      toast.error("Book name does not match");
      return;
    }

    fetch(`http://localhost:3000/delete/book/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          onClose();
          setTimeout(() => {
            navigate("/");
            toast.success("Book deleted successfully");
          }, 700);
        }
      });
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
            <div className="w-full flex justify-between gap-8">
              <div>
                <DialogTitle
                  as="h3"
                  className="text-xl flex gap-2 items-center text-red-500 font-medium"
                >
                  <Icon icon="tabler:trash" className="w-6 h-6" />
                  Are you sure?
                </DialogTitle>
                <p className="mt-2 text-zinc-500">
                  Are you sure you want to delete this book? This action cannot
                  be undone.
                </p>
              </div>
              <Icon
                icon="uil:times"
                className="w-6 h-6 shrink-0 mt-2 cursor-pointer text-zinc-500 hover:text-zinc-200"
                onClick={onClose}
              />
            </div>
            <p className="text-zinc-500 mt-4 mb-4">
              Please type the name of the book to confirm.
            </p>
            <Input
              name="Book Name"
              icon="tabler:book"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
  );
}

export default DeleteBookConfirmationModal;
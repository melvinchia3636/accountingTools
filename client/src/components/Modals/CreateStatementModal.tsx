import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Input from "../Input";
import CreateButton from "../CreateButton";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function CreateStatementModal({
  isOpen,
  onClose,
  reloadBook,
}: {
  isOpen: boolean;
  onClose: () => void;
  reloadBook: () => void;
}): React.ReactElement {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [columnCount, setColumnCount] = useState(1);
  const [topTextColumnCount, setTopTextColumnCount] = useState(1);
  const { id } = useParams();

  function onSubmit() {
    if (
      name.trim() === "" ||
      columnCount <= 0 ||
      subtitle.trim() === "" ||
      topTextColumnCount <= 0
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    fetch(`http://localhost:3000/create/statement/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        subtitle,
        columnCount,
        topTextColumnCount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          onClose();
          setTimeout(() => {
            toast.success("Statement created successfully");
            reloadBook();
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
                  className="text-xl flex gap-2 items-center text-zinc-200 font-medium"
                >
                  <Icon icon="tabler:chart-line" className="w-6 h-6" />
                  Create Statement
                </DialogTitle>
                <p className="mt-2 text-zinc-500">
                  Create a new statement to start recording transactions.
                </p>
              </div>
              <Icon
                icon="uil:times"
                className="w-6 h-6 shrink-0 mt-2 cursor-pointer text-zinc-500 hover:text-zinc-200"
                onClick={onClose}
              />
            </div>

            <div className="flex flex-col gap-6 mt-6">
              <Input
                name="Statement Name"
                icon="tabler:chart-line"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                name="Statement Subtitle"
                icon="uil:text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
              <Input
                name="Number of Columns"
                icon="uil:grid"
                value={columnCount + ""}
                onChange={(e) => setColumnCount(parseInt(e.target.value) || 0)}
              />
              <Input
                name="Number of Top Text Columns"
                icon="tabler:square-t"
                value={topTextColumnCount + ""}
                onChange={(e) =>
                  setTopTextColumnCount(parseInt(e.target.value) || 0)
                }
              />
            </div>
            <CreateButton action="Create" onSubmit={onSubmit} />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default CreateStatementModal;

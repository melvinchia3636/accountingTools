import { Button } from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModifyBookModal from "../components/Modals/ModifyBookModal";

interface IListEntry {
  id: string;
  code: string;
  name: string;
  topic: string;
  docAmount: {
    journal: number;
    ledger: number;
    statement: number;
  };
}

function Home() {
  const [data, setData] = useState<IListEntry[] | null>(null);
  const [modifyBookModalOpenType, setModifyBookModalOpenType] = useState<
    "create" | "update" | null
  >(null);

  function fetchData() {
    setData(null);
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setData(data.data);
        }
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (data === null) {
    return (
      <div className="w-full flex flex-col flex-1 p-24 items-center justify-center">
        Loading
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col overflow-y-auto flex-1 p-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <Icon icon="uil:book" className="w-9 h-9" />
          All Books
        </h1>
        <Button
          onClick={() => {
            setModifyBookModalOpenType("create");
          }}
          className="px-6 py-3 bg-zinc-200 hover:bg-zinc-300 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center"
        >
          <Icon icon="uil:plus" className="w-5 h-5" />
          Create
        </Button>
      </div>
      <ul className="mt-8 flex flex-col gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item: IListEntry) => (
          <li
            key={item.id}
            className="border-2 border-zinc-800 shadow-md hover:bg-zinc-100/5 transition-all rounded-md"
          >
            <Link
              to={`/book/${item.id}`}
              className="p-4 flex items-center w-full justify-between"
            >
              <div>
                <code className="text-xl font-medium">{item.code}</code>
                <p className="text-zinc-500">{item.topic}</p>
              </div>
              <div className="flex items-end flex-col text-zinc-500 gap-1">
                <p className="text-zinc-500">{item.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Icon icon="uil:file-alt" className="w-5 h-5" />
                    <span className="text-zinc-500">
                      {item.docAmount.journal}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:square-letter-t" className="w-5 h-5" />
                    <span className="text-zinc-500">
                      {item.docAmount.ledger}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:chart-line" className="w-5 h-5" />
                    <span className="text-zinc-500">
                      {item.docAmount.statement}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <ModifyBookModal
        openType={modifyBookModalOpenType ? "create" : null}
        onClose={() => {
          setModifyBookModalOpenType(null);
        }}
        reloadBooks={fetchData}
        existingBook={null}
      />
    </div>
  );
}

export default Home;

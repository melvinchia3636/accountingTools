import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Journal from "../components/Journal";
import Ledger from "../components/Ledger";
import Statement from "../components/Statement";
import {
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import ModifyBookModal from "../components/Modals/ModifyBookModal";
import { toast } from "react-toastify";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import DeleteDocumentConfirmationModal from "../components/Modals/DeleteDocumentConfirmationModal";
import UnsaveChangeLeaveConfirmationModal from "../components/Modals/UnsaveChangeLeaveConfirmationModal";

function Book(): React.ReactElement {
  const [everything, setEverything] = useState<any>("loading");
  const [data, setData] = useState<any>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [modifyBookModalOpenType, setModifyBookModalOpenType] = useState<
    "create" | "update" | null
  >(null);
  const [deleteDocumentModalOpen, setDeleteDocumentModalOpen] = useState(false);
  const [saved, setSaved] = useState(true);
  const [firstFetch, setFirstFetch] = useState(true);

  function fetchData() {
    fetch(`http://localhost:3000/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEverything(data.data);
          setData(data.data.data[0] || null);
          setTimeout(() => {
            setFirstFetch(false);
          }, 100);
        }
      });
  }

  async function saveData() {
    await fetch(`http://localhost:3000/save/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: everything,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setSaved(true);
          toast.success("Saved successfully");
        }
      });
  }

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveData();
      }
    };
  }, [everything, id]);

  useEffect(() => {
    if (
      !id?.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
    ) {
      navigate("/");
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!firstFetch) {
      setSaved(false);
    }
  }, [everything]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !saved && currentLocation.pathname !== nextLocation.pathname
  );

  if (everything === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Sidebar
        everything={everything}
        currentDocument={data}
        setCurrentDocument={setData}
        reloadEverything={fetchData}
        openModifyBookModal={() => {
          setModifyBookModalOpenType("update");
        }}
        saved={saved}
      />
      <div className="w-full h-full overflow-y-auto p-8 pb-0 flex flex-col relative">
        <div className="absolute right-8 top-8">
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
                  onClick={() => {}}
                  className="group flex w-full items-center gap-2 rounded-lg py-4 px-5 data-[focus]:text-zinc-200 data-[focus]:bg-white/10"
                >
                  <Icon icon="uil:edit" className="w-5 h-5" />
                  Edit
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => {
                    setDeleteDocumentModalOpen(true);
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
        {data !== null ? (
          (() => {
            switch (data.type) {
              case "journal":
                return (
                  <Journal
                    key={`doc-${data.id}`}
                    data={data.entries}
                    setData={(newData) => {
                      const newEverything = { ...everything };
                      newEverything.data.find(
                        (item) => item.id === data.id
                      ).entries = newData;
                      setEverything(newEverything);
                    }}
                  />
                );
              case "ledger":
                return (
                  <Ledger
                    key={`doc-${data.id}`}
                    data={data.entries}
                    headers={data.headers}
                    name={data.name}
                    companyName={everything.entityName}
                    columnCount={data.column}
                    topTextColumnCount={data.topTextColumnCount}
                    setData={(newData) => {
                      const newEverything = { ...everything };
                      newEverything.data.find(
                        (item) => item.id === data.id
                      ).entries = newData;
                      setEverything(newEverything);
                    }}
                    setHeaders={(newHeaders) => {
                      const newEverything = { ...everything };
                      newEverything.data.find(
                        (item) => item.id === data.id
                      ).headers = newHeaders;
                      setEverything(newEverything);
                    }}
                  />
                );
              case "statement":
                return (
                  <Statement
                    key={`doc-${data.id}`}
                    data={data.entries}
                    headers={data.headers}
                    companyName={everything.entityName}
                    name={data.name}
                    subtitle={data.subtitle}
                    columnCount={data.columnCount}
                    topTextColumnCount={data.topTextColumnCount}
                    setData={(newData) => {
                      const newEverything = { ...everything };
                      newEverything.data.find(
                        (item) => item.id === data.id
                      ).entries = newData;
                      setEverything(newEverything);
                    }}
                    setHeaders={(newHeaders) => {
                      const newEverything = { ...everything };
                      newEverything.data.find(
                        (item) => item.id === data.id
                      ).headers = newHeaders;
                      setEverything(newEverything);
                    }}
                  />
                );
              default:
                return <h1>Default</h1>;
            }
          })()
        ) : (
          <div className="w-full flex items-center justify-center h-full flex-col gap-12">
            <Icon icon="tabler:file-off" className="w-44 h-44 text-zinc-700" />
            <h1 className="text-3xl text-zinc-700 font-medium">
              No Document Selected
            </h1>
          </div>
        )}
      </div>
      <ModifyBookModal
        openType={modifyBookModalOpenType}
        onClose={() => {
          setModifyBookModalOpenType(null);
        }}
        reloadBooks={fetchData}
        existingBook={{
          id: id as string,
          name: everything.entityName,
          code: everything.code,
          topic: everything.topic,
        }}
      />
      <DeleteDocumentConfirmationModal
        isOpen={deleteDocumentModalOpen}
        onClose={() => {
          setDeleteDocumentModalOpen(false);
        }}
        documentID={data?.id}
        refreshData={fetchData}
      />
      <UnsaveChangeLeaveConfirmationModal
        isOpen={blocker.state === "blocked"}
        proceed={() => {
          if (blocker.state === "blocked") {
            blocker.proceed();
          }
        }}
        saveData={saveData}
        cancel={() => {
          if (blocker.state === "blocked") {
            blocker.reset();
          }
        }}
      />
    </>
  );
}

export default Book;

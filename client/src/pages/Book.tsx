import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Journal from "../components/Journal";
import Ledger from "../components/Ledger";
import Statement from "../components/Statement";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import ModifyBookModal from "../components/Modals/ModifyBookModal";

function Book(): React.ReactElement {
  const [everything, setEverything] = useState<any>("loading");
  const [data, setData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [modifyBookModalOpenType, setModifyBookModalOpenType] = useState<
    "create" | "update" | null
  >(null);

  function fetchData() {
    fetch(`http://localhost:3000/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setEverything(data.data);
          setData(data.data.data[0] || null);
        }
      });
  }

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
      />
      <div className="w-3/4 h-full overflow-y-auto p-8 flex flex-col">
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
                    name={data.name}
                    setData={(newData) => {
                      const newEverything = { ...everything };
                      newEverything.data.find(
                        (item) => item.id === data.id
                      ).entries = newData;
                      setEverything(newEverything);
                    }}
                  />
                );
              case "statement":
                return (
                  <Statement
                    key={`doc-${data.id}`}
                    data={data.entries}
                    companyName={everything.entityName}
                    name={data.name}
                    subtitle={data.subtitle}
                    columnCount={data.columnCount}
                    setData={(newData) => {
                      const newEverything = { ...everything };
                      newEverything.data.find(
                        (item) => item.id === data.id
                      ).entries = newData;
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
    </>
  );
}

export default Book;

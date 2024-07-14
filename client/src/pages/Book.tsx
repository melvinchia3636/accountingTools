import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Journal from "../components/Journal";
import Ledger from "../components/Ledger";
import Statement from "../components/Statement";
import { useNavigate, useParams } from "react-router-dom";

function Book() {
  const [everything, setEverything] = useState<any>("loading");
  const [data, setData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !id?.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
    ) {
      navigate("/");
    }

    fetch(`http://localhost:3000/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        if (data.status === "success") {
          setEverything(data.data);
          setData(data.data.data[0] || null);
        }
      });
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
      />
      <div className="w-3/4 h-full overflow-y-auto p-8 flex flex-col">
        {data !== null &&
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
                    name={data.name}
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
          })()}
      </div>
    </>
  );
}

export default Book;

import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Link } from "react-router-dom";

function Sidebar({
  everything,
  currentDocument,
  setCurrentDocument,
}: {
  everything: any;
  currentDocument: any;
  setCurrentDocument: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <aside className="w-1/4 h-full border-r border-zinc-700 p-8 flex flex-col">
      <header className="flex items-center justify-between gap-2 mb-8">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="w-8 h-8 transition-all rounded-md hover:bg-zinc-100/10 hover:text-zinc-200 text-zinc-500 flex items-center justify-center"
          >
            <Icon icon="uil:arrow-left" className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-medium text-zinc-200 flex items-center">
              {everything.entityName}
            </h1>
            <p className="text-sm text-zinc-500">{everything.topic}</p>
          </div>
        </div>
        <button className="w-8 h-8 text-zinc-500 hover:bg-zinc-100/10 hover:text-zinc-200 transition-all rounded-md flex items-center justify-center">
          <Icon icon="tabler:dots-vertical" className="w-5 h-5" />
        </button>
      </header>
      <div className="w-full flex-1 overflow-y-auto flex flex-col">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-zinc-500 gap-2 flex items-center">
            <Icon icon="uil:file-alt" className="w-6 h-6" />
            Journals
          </h1>
          <button className="w-8 h-8 text-zinc-500 rounded-md flex items-center justify-center">
            <Icon icon="uil:angle-up" className="w-6 h-6" />
          </button>
        </header>
        {everything.data.filter((item) => item.type === "journal").length ? (
          <div className="pl-[10px]">
            <ul className="w-full mt-4 border-l-2 border-zinc-700">
              {everything.data
                .filter((item) => item.type === "journal")
                .map((item) => (
                  <li
                    key={item.id}
                    className={`w-full py-4 rounded-md cursor-pointer hover:bg-zinc-100/10 hover:text-zinc-100 transition-all ${
                      currentDocument.id === item.id
                        ? "relative after:absolute after:left-[-2px] font-semibold after:top-1/2 after:-translate-y-1/2 after:h-full after:w-[2px] after:bg-zinc-200 after:rounded-full hover:bg-zinc-100/10"
                        : "text-zinc-500"
                    } flex items-center justify-between gap-2 px-4`}
                    onClick={() => {
                      setCurrentDocument(item);
                    }}
                  >
                    {item.name}
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <p className="text-zinc-500 text-center mt-6">No journals found</p>
        )}
        <header className="flex items-center justify-between mt-8">
          <h1 className="text-lg font-medium text-zinc-500 flex items-center gap-2">
            <Icon icon="tabler:square-letter-t" className="w-6 h-6" />
            Ledgers
          </h1>
          <button className="w-8 h-8 text-zinc-500 rounded-md flex items-center justify-center">
            <Icon icon="uil:angle-up" className="w-6 h-6" />
          </button>
        </header>
        {everything.data.filter((item) => item.type === "ledger").length ? (
          <div className="pl-[10px]">
            <ul className="w-full mt-4 border-l-2 border-zinc-700">
              {everything.data
                .filter((item) => item.type === "ledger")
                .map((item) => (
                  <li
                    key={item.id}
                    className={`w-full py-4 rounded-md cursor-pointer hover:bg-zinc-100/10 hover:text-zinc-100 transition-all ${
                      currentDocument.id === item.id
                        ? "relative after:absolute after:left-[-2px] font-semibold after:top-1/2 after:-translate-y-1/2 after:h-full after:w-[2px] after:bg-zinc-200 after:rounded-full hover:bg-zinc-100/10"
                        : "text-zinc-500"
                    } flex items-center justify-between gap-2 px-4`}
                    onClick={() => {
                      setCurrentDocument(item);
                    }}
                  >
                    {item.name}
                    <span className="text-zinc-500 font-medium text-sm">
                      {item.nature}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <p className="text-zinc-500 text-center mt-6">No ledgers found</p>
        )}
        <header className="flex items-center justify-between mt-8">
          <h1 className="text-lg font-medium text-zinc-500 flex items-center gap-2">
            <Icon icon="uil:chart-line" className="w-6 h-6" />
            Statements
          </h1>
          <button className="w-8 h-8 text-zinc-500 rounded-md flex items-center justify-center">
            <Icon icon="uil:angle-up" className="w-6 h-6" />
          </button>
        </header>
        {everything.data.filter((item) => item.type === "statement").length ? (
          <div className="pl-[10px]">
            <ul className="w-full mt-4 border-l-2 border-zinc-700">
              {everything.data
                .filter((item) => item.type === "statement")
                .map((item) => (
                  <li
                    key={item.id}
                    className={`w-full py-4 rounded-md cursor-pointer hover:bg-zinc-100/10 hover:text-zinc-100 transition-all ${
                      currentDocument.id === item.id
                        ? "relative after:absolute after:left-[-2px] font-semibold after:top-1/2 after:-translate-y-1/2 after:h-full after:w-[2px] after:bg-zinc-200 after:rounded-full hover:bg-zinc-100/10"
                        : "text-zinc-500"
                    } flex items-center justify-between gap-2 px-4`}
                    onClick={() => {
                      setCurrentDocument(item);
                    }}
                  >
                    {item.name}
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <p className="text-zinc-500 text-center mt-6">No statements found</p>
        )}
      </div>
      <button className="w-full py-3 bg-zinc-200 hover:bg-zinc-300 transition-all text-zinc-900 rounded-md flex items-center font-medium gap-2 justify-center">
        <Icon icon="uil:plus" className="w-5 h-5" />
        Add
      </button>
    </aside>
  );
}

export default Sidebar;

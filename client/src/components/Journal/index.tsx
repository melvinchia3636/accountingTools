import React, { useState } from "react";

function Journal({
  data,
  setData,
}: {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [isEditing, setIsEditing] = useState(-1);
  return (
    <>
      <h2 className="text-lg text-zinc-500 underline decoration-zinc-500 underline-offset-4 decoration-2">
        In the books of{"  "}
        <span className="font-semibold text-zinc-100">S Bhd and P Bhd</span>
      </h2>
      <h3 className="text-2xl text-center font-semibold mt-4 underline decoration-zinc-200 underline-offset-4 decoration-2">
        General Journal
      </h3>
      <div className="w-full flex-1 mt-8 overflow-y-auto">
        <table className="w-full border-2 border-zinc-700">
          <thead className="border-2 border-zinc-700">
            <tr className="text-zinc-500">
              <th className="py-2 border-r-2 w-1/12 border-zinc-700">Date</th>
              <th className="py-2 border-r-2 border-zinc-700">Particulars</th>
              <th className="py-2 w-2/12 border-r-2 border-zinc-700">Debit</th>
              <th className="py-2 w-2/12 border-r-2 border-zinc-700">Credit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) =>
              item.isNew || isEditing === index ? (
                <tr key={index} className="text-zinc-200">
                  <td className="py-2 border-r-2 p-4 border-zinc-700 text-right">
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index].date = e.target.value;
                        if (newData[index].isNew) {
                          newData.push({
                            isNew: true,
                            date: "",
                            particular: "",
                            debit: 0,
                            credit: 0,
                          });
                          setIsEditing(index);
                          newData[index].isNew = false;
                        }
                        setData(newData);
                      }}
                      onBlur={() => {
                        if (
                          !item.isNew &&
                          !item.date &&
                          !item.particular &&
                          !item.debit &&
                          !item.credit
                        ) {
                          const newData = [...data];
                          newData.splice(index, 1);
                          setData(newData);
                        }
                      }}
                      className="w-full h-full bg-transparent text-right text-zinc-200"
                    />
                  </td>
                  <td
                    className={`py-2 border-r-2 p-4 border-zinc-700 ${
                      item.credit ? "pl-12" : ""
                    } ${
                      data[index + 1]?.date && !item.date?.match(/^\d{4}$/)
                        ? "border-b-2 border-zinc-700"
                        : ""
                    }`}
                  >
                    <input
                      type="text"
                      value={item.particular}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index].particular = e.target.value;
                        if (newData[index].isNew) {
                          newData.push({
                            isNew: true,
                            date: "",
                            particular: "",
                            debit: 0,
                            credit: 0,
                          });
                          setIsEditing(index);
                          newData[index].isNew = false;
                        }
                        setData(newData);
                      }}
                      onBlur={() => {
                        if (
                          !item.isNew &&
                          !item.date &&
                          !item.particular &&
                          !item.debit &&
                          !item.credit
                        ) {
                          const newData = [...data];
                          newData.splice(index, 1);
                          setData(newData);
                        }
                      }}
                      className="w-full h-full bg-transparent text-zinc-200"
                    />
                  </td>
                  <td className="py-2 border-r-2 p-4 border-zinc-700 text-right">
                    <input
                      type="text"
                      value={item.debit ? item.debit?.toLocaleString() : ""}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index].debit =
                          parseInt(e.target.value.replace(/,/g, "")) || 0;
                        if (newData[index].isNew) {
                          newData.push({
                            isNew: true,
                            date: "",
                            particular: "",
                            debit: 0,
                            credit: 0,
                          });
                          setIsEditing(index);
                          newData[index].isNew = false;
                        }
                        setData(newData);
                      }}
                      onBlur={() => {
                        if (
                          !item.isNew &&
                          !item.date &&
                          !item.particular &&
                          !item.debit &&
                          !item.credit
                        ) {
                          const newData = [...data];
                          newData.splice(index, 1);
                          setData(newData);
                        }
                      }}
                      className="w-full h-full bg-transparent text-right text-zinc-200"
                    />
                  </td>
                  <td className="py-2 border-r-2 p-4 border-zinc-700 text-right">
                    <input
                      type="text"
                      value={item.credit ? item.credit?.toLocaleString() : ""}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index].credit =
                          parseInt(e.target.value.replace(/,/g, "")) || 0;
                        if (newData[index].isNew) {
                          newData.push({
                            isNew: true,
                            date: "",
                            particular: "",
                            debit: 0,
                            credit: 0,
                          });
                          setIsEditing(index);
                          newData[index].isNew = false;
                        }
                        setData(newData);
                      }}
                      onBlur={() => {
                        if (
                          !item.isNew &&
                          !item.date &&
                          !item.particular &&
                          !item.debit &&
                          !item.credit
                        ) {
                          const newData = [...data];
                          newData.splice(index, 1);
                          setData(newData);
                        }
                      }}
                      className="w-full h-full bg-transparent text-right text-zinc-200"
                    />
                  </td>
                </tr>
              ) : (
                <tr key={index} className="text-zinc-200">
                  <td
                    onClick={() => {
                      setIsEditing(index);
                    }}
                    className="py-2 border-r-2 p-4 border-zinc-700 text-right"
                  >
                    {item.date}
                  </td>
                  <td
                    onClick={() => {
                      setIsEditing(index);
                    }}
                    className={`py-2 border-r-2 p-4 border-zinc-700 ${
                      item.credit ? "pl-12" : ""
                    } ${
                      data[index + 1]?.date && !item.date?.match(/^\d{4}$/)
                        ? "border-b-2 border-zinc-700"
                        : ""
                    }`}
                  >
                    {item.particular}
                  </td>
                  <td
                    onClick={() => {
                      setIsEditing(index);
                    }}
                    className="py-2 border-r-2 p-4 border-zinc-700 text-right"
                  >
                    {item.debit ? item.debit?.toLocaleString() : ""}
                  </td>
                  <td
                    onClick={() => {
                      setIsEditing(index);
                    }}
                    className="py-2 border-r-2 p-4 border-zinc-700 text-right"
                  >
                    {item.credit ? item.credit?.toLocaleString() : ""}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Journal;

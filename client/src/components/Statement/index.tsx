import React from "react";

function Statement({
  data,
  name,
  columnCount,
  setData,
}: {
  data: any[];
  name: string;
  columnCount: number;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  return (
    <div className="w-full flex-1 mt-8 overflow-y-auto">
      <h2 className="text-xl text-zinc-500 text-center">
        <span className="font-medium">S Bhd and P Bhd</span>
      </h2>
      <h3 className="text-2xl text-center font-semibold mt-2">{name}</h3>
      <p className="text-xl text-center text-zinc-500 mt-2">
        For the year ended 31 December 2021
      </p>
      <table className="w-full border-2 mt-8 border-zinc-700 table-fixed">
        <thead className="border-2 border-zinc-700">
          <tr className="text-zinc-500">
            <th className="py-2 border-r-2 w-full border-zinc-700"></th>
            {Array.from({ length: columnCount }).map((_, index) => (
              <th
                key={index}
                className={`py-2 border-r-2 w-3/12 border-zinc-700`}
              >
                RM
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-zinc-200">
              <td className={`py-2 border-r-2 p-4 border-zinc-700 `}>
                <input
                  type="text"
                  value={item.particular}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[index].particular = e.target.value;
                    setData(newData);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      const newData = data.map((item, i) =>
                        index === i
                          ? {
                              ...item,
                              bold: !item.bold,
                              particularUnderline: false,
                            }
                          : item
                      );
                      setData(newData);
                    }
                    if (e.key === "u" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      const newData = data.map((item, i) =>
                        index === i
                          ? {
                              ...item,
                              bold: false,
                              particularUnderline: !item.particularUnderline,
                            }
                          : item
                      );
                      setData(newData);
                    }
                  }}
                  className={`bg-transparent ${item.bold ? "font-bold" : ""} ${
                    item.particularUnderline
                      ? "underline decoration-2 underline-offset-4 font-semibold"
                      : ""
                  } `}
                />
              </td>
              {item.amount.map((amount, index) => (
                <td
                  key={index}
                  className={`py-2 border-r-2 p-4 border-zinc-700 text-right ${
                    item.underline?.[index]
                      ? item.underline?.[index] === "double"
                        ? "border-b-[6px] border-double border-b-zinc-500"
                        : "border-b-2 border-b-zinc-500"
                      : ""
                  }`}
                >
                  {amount ? (
                    amount > 0 ? (
                      amount.toLocaleString()
                    ) : (
                      <>({Math.abs(amount).toLocaleString()})</>
                    )
                  ) : (
                    ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Statement;

import React from "react";

function Statement({
  data,
  companyName,
  name,
  columnCount,
  subtitle,
  setData,
}: {
  data: any[];
  companyName: string;
  name: string;
  columnCount: number;
  subtitle: string;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  return (
    <div className="w-full flex-1 mt-8 overflow-y-auto">
      <h2 className="text-xl text-zinc-500 text-center">
        <span className="font-medium">{companyName}</span>
      </h2>
      <h3 className="text-2xl text-center font-semibold mt-2">{name}</h3>
      <p className="text-xl text-center text-zinc-500 mt-2">{subtitle}</p>
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
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="text-zinc-200">
              <td className={`py-2 border-r-2 p-4 border-zinc-700 `}>
                <input
                  type="text"
                  value={item.particular}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[rowIndex].particular = e.target.value;

                    if (rowIndex === data.length - 1) {
                      const newEntry = {
                        particular: "",
                        amount: Array.from({ length: columnCount }).map(
                          () => 0
                        ),
                        underline: false,
                      };

                      newData.push(newEntry);
                    }

                    setData(newData);
                  }}
                  onBlur={() => {
                    if (rowIndex === data.length - 1) {
                      return;
                    }

                    if (
                      item.amount.every((item) => item === 0) &&
                      item.particular === ""
                    ) {
                      const newData = data.filter((_, i) => i !== rowIndex);
                      setData(newData);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      const newData = data.map((item, i) =>
                        rowIndex === i
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
                        rowIndex === i
                          ? {
                              ...item,
                              bold: false,
                              particularUnderline: !item.particularUnderline,
                            }
                          : item
                      );
                      setData(newData);
                    }

                    if (e.key === " " && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      const newData = data.map((item, i) =>
                        rowIndex === i
                          ? {
                              ...item,
                              underline: item.underline,
                              tabIn: !item.tabIn,
                            }
                          : item
                      );
                      setData(newData);
                    }
                  }}
                  className={`bg-transparent w-full ${
                    item.bold ? "font-bold" : ""
                  } ${
                    item.particularUnderline
                      ? "underline decoration-2 underline-offset-4 font-semibold"
                      : ""
                  } ${item.tabIn ? "pl-8" : ""}`}
                />
              </td>
              {item.amount.map((amount, columnIndex) => (
                <td
                  key={columnIndex}
                  className={`py-2 border-r-2 p-4 border-zinc-700 text-right ${
                    item.underline?.[columnIndex]
                      ? item.underline?.[columnIndex] === "double"
                        ? "border-b-[6px] border-double border-b-zinc-500"
                        : "border-b-2 border-b-zinc-500"
                      : ""
                  }`}
                >
                  <input
                    type="text"
                    value={amount === 0 ? "" : amount.toLocaleString()}
                    onBlur={() => {
                      if (rowIndex === data.length - 1) {
                        return;
                      }

                      if (
                        item.amount.every((item) => item === 0) &&
                        item.particular === ""
                      ) {
                        const newData = data.filter((_, i) => i !== rowIndex);
                        setData(newData);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "u" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        const underline = (
                          item.underline || Array(columnCount).fill(false)
                        ).map((item, i) =>
                          columnIndex === i
                            ? item === true
                              ? "double"
                              : item === "double"
                              ? false
                              : true
                            : item
                        );

                        const newData = data.map((item, i) =>
                          rowIndex === i
                            ? {
                                ...item,
                                underline,
                              }
                            : item
                        );

                        setData(newData);
                      }
                    }}
                    onChange={(e) => {
                      const newData = [...data];
                      newData[rowIndex].amount = newData[rowIndex].amount.map(
                        (item, i) =>
                          i === columnIndex
                            ? parseInt(e.target.value.replace(/,/g, "")) || 0
                            : item
                      );

                      if (rowIndex === data.length - 1) {
                        const newEntry = {
                          particular: "",
                          amount: Array.from({ length: columnCount }).map(
                            () => 0
                          ),
                          underline: false,
                        };

                        newData.push(newEntry);
                      }

                      setData(newData);
                    }}
                    className="w-full h-full bg-transparent text-right text-zinc-200"
                  />
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

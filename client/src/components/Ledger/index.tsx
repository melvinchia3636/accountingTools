import React, { useEffect, useState } from "react";

interface ILedgerEntry {
  date: string;
  particular: string;
  side: "debit" | "credit";
  amount: number[];
}

function Ledger({
  data,
  name,
  companyName,
  setData,
  columnCount,
}: {
  data: {
    date: string;
    particular: string;
    side: "debit" | "credit";
    amount: number[];
  }[];
  companyName: string;
  name: string;
  setData: React.Dispatch<React.SetStateAction<ILedgerEntry[]>>;
  columnCount: number;
}) {
  const [debitEntries, setDebitEntries] = useState<ILedgerEntry[]>(
    data.filter((item) => item.side === "debit")
  );
  const [creditEntries, setCreditEntries] = useState<ILedgerEntry[]>(
    data.filter((item) => item.side === "credit")
  );
  const maxEntries = Math.max(debitEntries.length, creditEntries.length);

  function updateBottomRow(
    newData: ILedgerEntry[],
    index: number,
    side: "debit" | "credit"
  ) {
    const sides: {
      [key: string]: [
        ILedgerEntry[],
        React.Dispatch<React.SetStateAction<ILedgerEntry[]>>
      ];
    } = {
      debit: [debitEntries, setDebitEntries],
      credit: [creditEntries, setCreditEntries],
    };

    if (index === sides[side][0].length - 1) {
      newData.push({
        date: "",
        particular: "",
        side,
        amount: Array(columnCount).fill(0),
      });

      sides[side][1](newData);
    }

    setData(
      side === "debit"
        ? [...newData, ...creditEntries]
        : [...debitEntries, ...newData]
    );
  }

  function checkAndClearEmptyRow() {
    const jointData = debitEntries
      .map((item, i) => [item, creditEntries[i]])
      .filter(
        ([debit, credit], index) =>
          debit.date ||
          credit.date ||
          debit.particular ||
          credit.particular ||
          debit.amount.some((amount) => amount) ||
          credit.amount.some((amount) => amount) ||
          index === debitEntries.length - 1
      );

    const _debitEntries = jointData.map(([debit]) => debit);
    const _creditEntries = jointData.map(([, credit]) => credit);

    setDebitEntries(_debitEntries);
    setCreditEntries(_creditEntries);
    setData([..._debitEntries, ..._creditEntries]);
  }

  useEffect(() => {
    if (debitEntries.length > creditEntries.length) {
      setCreditEntries([
        ...creditEntries,
        ...Array.from({
          length: debitEntries.length - creditEntries.length,
        }).map(() => ({
          date: "",
          particular: "",
          side: "credit" as const,
          amount: Array(columnCount).fill(0),
        })),
      ]);
    }

    if (creditEntries.length > debitEntries.length) {
      setDebitEntries([
        ...debitEntries,
        ...Array.from({
          length: creditEntries.length - debitEntries.length,
        }).map(() => ({
          date: "",
          particular: "",
          side: "debit" as const,
          amount: Array(columnCount).fill(0),
        })),
      ]);
    }
  }, [debitEntries, creditEntries]);

  return (
    <>
      <h2 className="text-lg text-zinc-500 underline decoration-zinc-500 underline-offset-4 decoration-2">
        In the books of{"  "}
        <span className="font-semibold text-zinc-100">{companyName}</span>
      </h2>
      <h3 className="text-2xl text-center font-semibold mt-4 underline decoration-zinc-200 underline-offset-4 decoration-2">
        General Ledger
      </h3>
      <h4 className="text-lg text-center mt-8 font-medium">{name}</h4>
      <table className="w-full border-2 border-zinc-700 mt-2 table-fixed">
        <thead className="border-2 border-zinc-700">
          <tr className="text-zinc-500">
            <th className="py-2 border-r-2 w-24 border-zinc-700"></th>
            <th className="py-2 w-full border-r-2 border-zinc-700"></th>
            {Array(columnCount)
              .fill(0)
              .map((_, i) => (
                <th
                  className={`py-2 w-4/12 ${
                    i === columnCount - 1
                      ? "border-r-[6px] border-double"
                      : "border-r-2"
                  } border-zinc-700`}
                >
                  RM
                </th>
              ))}
            <th className="py-2 border-r-2 w-24 border-zinc-700"></th>
            <th className="py-2 w-full border-r-2 border-zinc-700"></th>
            {Array(columnCount)
              .fill(0)
              .map(() => (
                <th className="py-2 w-4/12 border-r-2 border-zinc-700">RM</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxEntries }).map(
            (_, index) =>
              (Boolean(
                debitEntries[index]?.date ||
                  creditEntries[index]?.date ||
                  debitEntries[index]?.particular ||
                  creditEntries[index]?.particular ||
                  debitEntries[index]?.amount ||
                  creditEntries[index]?.amount
              ) ||
                index === maxEntries - 1) && (
                <tr key={index} className="text-zinc-200">
                  {debitEntries[index] && (
                    <>
                      <td className="py-2 border-r-2 p-4 border-zinc-700 text-right">
                        <input
                          type="text"
                          value={debitEntries[index]?.date}
                          onChange={(e) => {
                            const newData = [...debitEntries];
                            newData[index].date = e.target.value;
                            updateBottomRow(newData, index, "debit");
                          }}
                          onBlur={checkAndClearEmptyRow}
                          className={`w-full h-full bg-transparent text-right ${
                            debitEntries[index]?.particular === "TOTAL"
                              ? "text-transparent"
                              : "text-zinc-200"
                          }`}
                        />
                      </td>
                      <td className="py-2 border-r-2 p-4 border-zinc-700">
                        <input
                          type="text"
                          value={debitEntries[index]?.particular}
                          onChange={(e) => {
                            const newData = [...debitEntries];
                            newData[index].particular = e.target.value;
                            updateBottomRow(newData, index, "debit");
                          }}
                          onBlur={checkAndClearEmptyRow}
                          className={`w-full h-full bg-transparent ${
                            debitEntries[index]?.particular === "TOTAL"
                              ? "text-transparent"
                              : "text-zinc-200"
                          }`}
                        />
                      </td>
                      {debitEntries[index]?.particular === "TOTAL"
                        ? Array(columnCount)
                            .fill(0)
                            .map((_, i) => (
                              <td
                                className={`${
                                  i === columnCount - 1
                                    ? "border-r-[6px] border-double"
                                    : "border-r-2"
                                } border-zinc-700`}
                              >
                                <div className="border-b-4 border-zinc-500 border-double">
                                  <div className="border-t text-right border-zinc-500 p-4 py-2">
                                    {(() => {
                                      const allEntries = debitEntries.slice(
                                        0,
                                        index
                                      );
                                      const splitByTotal = allEntries.reduce(
                                        (acc, item) => {
                                          if (item.particular === "TOTAL") {
                                            acc.push([]);
                                          } else {
                                            acc[acc.length - 1].push(item);
                                          }
                                          return acc;
                                        },
                                        [[]] as ILedgerEntry[][]
                                      );

                                      return splitByTotal
                                        .pop()
                                        ?.filter((item) => item.amount[i])
                                        .reduce(
                                          (acc, item) => acc + item.amount[i],
                                          0
                                        )
                                        .toLocaleString();
                                    })()}
                                  </div>
                                </div>
                              </td>
                            ))
                        : Array(columnCount)
                            .fill(0)
                            .map((_, i) => (
                              <td
                                className={`py-2 p-4 ${
                                  i === columnCount - 1
                                    ? "border-r-[6px] border-double"
                                    : "border-r-2"
                                } border-zinc-700 text-right`}
                              >
                                <input
                                  type="text"
                                  value={
                                    debitEntries[index]?.amount[i]
                                      ? debitEntries[index]?.amount[
                                          i
                                        ].toLocaleString()
                                      : ""
                                  }
                                  onBlur={checkAndClearEmptyRow}
                                  onChange={(e) => {
                                    const newData = [...debitEntries];
                                    newData[index].amount[i] =
                                      parseInt(
                                        e.target.value.replace(/,/g, "")
                                      ) || 0;

                                    updateBottomRow(newData, index, "debit");
                                  }}
                                  className="w-full h-full bg-transparent text-right text-zinc-200"
                                />
                              </td>
                            ))}
                    </>
                  )}
                  {creditEntries[index] && (
                    <>
                      <td className="py-2 border-r-2 p-4 border-zinc-700 text-right">
                        <input
                          type="text"
                          value={creditEntries[index]?.date}
                          onChange={(e) => {
                            const newData = [...creditEntries];
                            newData[index].date = e.target.value;
                            updateBottomRow(newData, index, "credit");
                          }}
                          onBlur={checkAndClearEmptyRow}
                          className={`w-full h-full bg-transparent text-right ${
                            creditEntries[index]?.particular === "TOTAL"
                              ? "text-transparent"
                              : "text-zinc-200"
                          }`}
                        />
                      </td>
                      <td className="py-2 border-r-2 p-4 border-zinc-700">
                        <input
                          type="text"
                          value={creditEntries[index]?.particular}
                          onChange={(e) => {
                            const newData = [...creditEntries];
                            newData[index].particular = e.target.value;
                            updateBottomRow(newData, index, "credit");
                          }}
                          onBlur={checkAndClearEmptyRow}
                          className={`w-full h-full bg-transparent ${
                            creditEntries[index]?.particular === "TOTAL"
                              ? "text-transparent"
                              : "text-zinc-200"
                          }`}
                        />
                      </td>
                      {creditEntries[index]?.particular === "TOTAL"
                        ? Array(columnCount)
                            .fill(0)
                            .map((_, i) => (
                              <td className="border-r-2 border-zinc-700">
                                <div className="border-b-4  border-zinc-500 border-double">
                                  <div className="border-t text-right border-zinc-500 p-4 py-2">
                                    {(() => {
                                      const allEntries = creditEntries.slice(
                                        0,
                                        index
                                      );

                                      const splitByTotal = allEntries.reduce(
                                        (acc, item) => {
                                          if (item.particular === "TOTAL") {
                                            acc.push([]);
                                          } else {
                                            acc[acc.length - 1].push(item);
                                          }
                                          return acc;
                                        },
                                        [[]] as ILedgerEntry[][]
                                      );

                                      return splitByTotal
                                        .pop()
                                        ?.filter((item) => item.amount[i])
                                        .reduce(
                                          (acc, item) => acc + item.amount[i],
                                          0
                                        )
                                        .toLocaleString();
                                    })()}
                                  </div>
                                </div>
                              </td>
                            ))
                        : Array(columnCount)
                            .fill(0)
                            .map((_, i) => (
                              <td className="py-2 p-4 border-r-2 border-zinc-700 text-right">
                                <input
                                  type="text"
                                  value={
                                    creditEntries[index]?.amount[i]
                                      ? creditEntries[index]?.amount[
                                          i
                                        ].toLocaleString()
                                      : ""
                                  }
                                  onBlur={checkAndClearEmptyRow}
                                  onChange={(e) => {
                                    const newData = [...creditEntries];
                                    newData[index].amount[i] =
                                      parseInt(
                                        e.target.value.replace(/,/g, "")
                                      ) || 0;
                                    updateBottomRow(newData, index, "credit");
                                  }}
                                  className="w-full h-full bg-transparent text-right text-zinc-200"
                                />
                              </td>
                            ))}
                    </>
                  )}
                </tr>
              )
          )}
        </tbody>
      </table>
    </>
  );
}

export default Ledger;

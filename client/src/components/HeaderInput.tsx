import React, { useEffect, useRef } from "react";

function HeaderInput<T>({
  headers,
  setHeaders,
  i,
  j,
  side,
}: {
  headers: T[];
  setHeaders: React.Dispatch<React.SetStateAction<T[]>>;
  i: number;
  j: number;
  side?: "debit" | "credit";
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "1px";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [ref.current]);

  return (
    <textarea
      ref={ref}
      onChange={(e) => {
        const newHeaders = [...headers];
        if (side) {
          newHeaders[i][side][j] = e.target.value;
        } else {
          newHeaders[i][j] = e.target.value;
        }
        setHeaders(newHeaders);
      }}
      onKeyUp={(e) => {
        e.target.style.height = "1px";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      value={side ? headers[i][side][j] : headers[i][j]}
      className="w-full bg-transparent resize-none text-center"
    />
  );
}

export default HeaderInput;

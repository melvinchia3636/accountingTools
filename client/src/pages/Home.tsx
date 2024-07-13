import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/list")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  if (data === null) {
    return (
      <div className="w-full flex flex-col flex-1 p-24 items-center justify-center">
        Loading
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col flex-1 p-24">
      <h1 className="text-3xl font-semibold flex items-center gap-2">
        <Icon icon="uil:book" className="w-9 h-9" />
        All Books
      </h1>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item: any) => (
          <li
            key={item.id}
            className="border-2 border-zinc-800 shadow-md hover:bg-zinc-100/5 transition-all rounded-md p-4"
          >
            <Link to={`/book/${item.id}`}>
              <h2 className="text-xl font-medium">{item.name}</h2>
              <p className="text-zinc-500">{item.topic}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;

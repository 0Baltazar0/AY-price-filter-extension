import React, { useEffect, useState } from "react";
import { storageFunction } from "@/shared/storage-comms";

function App() {
  const [data, setData] = useState<undefined | any>(undefined);
  const [strict, setStrict] = useState<boolean>(false);
  const [req, _set] = useState(
    storageFunction((data) => {
      if (data.field == "activate") {
        setData(() => data.data);
      }
      if (data.field == "strict") {
        setStrict(() => data.data);
      }
    })
  );
  useEffect(() => {
    req.get({ field: "activate" });
    req.get({ field: "strict" });
  }, []);
  return (
    <div className="App bg-slate-500">
      <header className="App-header">
        <h1>Pretty Stupid filter</h1>
        <p>This an example for a popup.</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => {
            req.set({ field: "activate", data: Boolean(data) ? false : true });
          }}
        >
          {Boolean(data) ? "Disable" : "Activate"}
        </button>

        <label className="inline-flex items-center cursor-pointer">
          <input
            onChange={() =>
              req.set({ field: "strict", data: Boolean(strict) ? false : true })
            }
            type="checkbox"
            checked={strict}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Is Strict
          </span>
        </label>
      </header>
    </div>
  );
}

export default App;

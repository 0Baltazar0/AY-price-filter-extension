import React, { useState } from "react";
import { storageFunction } from "@/shared/storage-comms";

function App() {
  const [data, setData] = useState<undefined | any>(undefined);
  const [_, _set] = useState(
    storageFunction((data) => {
      if (data.field == "windowVariable") {
        setData(() => data.data);
      }
    })
  );
  return (
    <div className="App bg-slate-500 w-60 h-fit">
      <header className="App-header">
        <h1>Welcome to My React App</h1>
        <p>This is a simple starter template for a React application.</p>
        <p>The last windowVariable is: {data}</p>
      </header>
    </div>
  );
}

export default App;

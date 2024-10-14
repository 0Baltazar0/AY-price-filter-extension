import React, { useEffect, useState } from "react";
import { storageFunction } from "@/shared/storage-comms";
import { CheckBox } from "@/shared/components/checkbox";

// keys =
// AYO_ITEM_SELECTOR
// AYO_DELETE
// AYO_REMOVE_NO_LOWEST
// AYO_DO_RUN
// AY_ITEM_SELECTOR
// AY_INSPIRATION_SELECTOR
// AY_DELETE
// AY_DO_RUN
// AY_INSPIRATION_REMOVE
// AY_REMOVE_NO_LOWEST
type ActiveKeys = {
  AYO_ITEM_SELECTOR: string;
  AYO_DELETE: boolean;
  AYO_REMOVE_NO_LOWEST: boolean;
  AYO_DO_RUN: boolean;
  AY_ITEM_SELECTOR: string;
  AY_INSPIRATION_SELECTOR: string;
  AY_DELETE: boolean;
  AY_DO_RUN: boolean;
  AY_INSPIRATION_REMOVE: boolean;
  AY_REMOVE_NO_LOWEST: boolean;
};
const ActiveKeysDict = {
  AYO_ITEM_SELECTOR: undefined,
  AYO_DELETE: false,
  AYO_REMOVE_NO_LOWEST: false,
  AYO_DO_RUN: true,
  AY_ITEM_SELECTOR: undefined,
  AY_INSPIRATION_SELECTOR: undefined,
  AY_DELETE: false,
  AY_DO_RUN: true,
  AY_INSPIRATION_REMOVE: false,
  AY_REMOVE_NO_LOWEST: false,
};

function onChanged(changes: { [key: string]: chrome.storage.StorageChange }) {
  const data: Partial<ActiveKeys> = {};
  Object.keys(ActiveKeysDict).forEach((key) => {
    if (key in changes) {
      data[key as keyof ActiveKeys] = changes[key].newValue;
    }
  });
  return data;
}

function applyFilter(old: Partial<ActiveKeys>, new_: Partial<ActiveKeys>) {
  const data = { ...old };
  if (
    "AYO_ITEM_SELECTOR" in new_ &&
    typeof new_["AYO_ITEM_SELECTOR"] == "string"
  ) {
    data["AYO_ITEM_SELECTOR"] = new_["AYO_ITEM_SELECTOR"];
  }
  if ("AYO_DELETE" in new_ && typeof new_["AYO_DELETE"] == "boolean") {
    data["AYO_DELETE"] = new_["AYO_DELETE"];
  }
  if (
    "AYO_REMOVE_NO_LOWEST" in new_ &&
    typeof new_["AYO_REMOVE_NO_LOWEST"] == "boolean"
  ) {
    data["AYO_REMOVE_NO_LOWEST"] = new_["AYO_REMOVE_NO_LOWEST"];
  }
  if ("AYO_DO_RUN" in new_ && typeof new_["AYO_DO_RUN"] == "boolean") {
    data["AYO_DO_RUN"] = new_["AYO_DO_RUN"];
  }
  if (
    "AY_ITEM_SELECTOR" in new_ &&
    typeof new_["AY_ITEM_SELECTOR"] == "string"
  ) {
    data["AY_ITEM_SELECTOR"] = new_["AY_ITEM_SELECTOR"];
  }
  if (
    "AY_INSPIRATION_SELECTOR" in new_ &&
    typeof new_["AY_INSPIRATION_SELECTOR"] == "string"
  ) {
    data["AY_INSPIRATION_SELECTOR"] = new_["AY_INSPIRATION_SELECTOR"];
  }
  if ("AY_DELETE" in new_ && typeof new_["AY_DELETE"] == "boolean") {
    data["AY_DELETE"] = new_["AY_DELETE"];
  }
  if ("AY_DO_RUN" in new_ && typeof new_["AY_DO_RUN"] == "boolean") {
    data["AY_DO_RUN"] = new_["AY_DO_RUN"];
  }
  if (
    "AY_INSPIRATION_REMOVE" in new_ &&
    typeof new_["AY_INSPIRATION_REMOVE"] == "boolean"
  ) {
    data["AY_INSPIRATION_REMOVE"] = new_["AY_INSPIRATION_REMOVE"];
  }
  if (
    "AY_REMOVE_NO_LOWEST" in new_ &&
    typeof new_["AY_REMOVE_NO_LOWEST"] == "boolean"
  ) {
    data["AY_REMOVE_NO_LOWEST"] = new_["AY_REMOVE_NO_LOWEST"];
  }
  return data;
}

function App() {
  const [data, setData] = useState<Partial<ActiveKeys>>(ActiveKeysDict);
  useEffect(() => {
    chrome.storage.local.get(ActiveKeysDict).then((res) => {
      setData((old) => applyFilter(old, res));
    });
    function change(changes: { [key: string]: chrome.storage.StorageChange }) {
      setData((old) => applyFilter(old, onChanged(changes)));
    }
    chrome.storage.local.onChanged.addListener(change);
    return () => {
      chrome.storage.local.onChanged.removeListener(change);
    };
  }, []);
  return (
    <div className="App bg-slate-500 w-60 h-fit">
      <h1>Extension Settings</h1>
      <h2>Run this extension:</h2>
      <CheckBox
        onChange={() => {
          chrome.storage.local.set({ AY_DO_RUN: !data["AY_DO_RUN"] });
        }}
        checked={data["AY_DO_RUN"]}
        label="About You"
      ></CheckBox>
      <CheckBox
        onChange={() => {
          chrome.storage.local.set({ AYO_DO_RUN: !data["AYO_DO_RUN"] });
        }}
        checked={data["AYO_DO_RUN"]}
        label="About You Outlet"
      ></CheckBox>
      <h2>Delete Entries (or just hide them)</h2>
      <CheckBox
        onChange={() => {
          chrome.storage.local.set({ AY_DELETE: !data["AY_DELETE"] });
        }}
        checked={data["AY_DELETE"]}
        label="About You"
      ></CheckBox>
      <CheckBox
        onChange={() => {
          chrome.storage.local.set({ AYO_DELETE: !data["AYO_DELETE"] });
        }}
        checked={data["AYO_DELETE"]}
        label="About You Outlet"
      ></CheckBox>
      <h2>Apply to new items</h2>
      <CheckBox
        onChange={() => {
          chrome.storage.local.set({
            AY_REMOVE_NO_LOWEST: !data["AY_REMOVE_NO_LOWEST"],
          });
        }}
        checked={data["AY_REMOVE_NO_LOWEST"]}
        label="About You"
      ></CheckBox>
      <CheckBox
        onChange={() => {
          chrome.storage.local.set({
            AYO_REMOVE_NO_LOWEST: !data["AYO_REMOVE_NO_LOWEST"],
          });
        }}
        checked={data["AYO_REMOVE_NO_LOWEST"]}
        label="About You Outlet"
      ></CheckBox>
      <h2>Remove "Inspiration" Boxes</h2>
      <CheckBox
        onChange={() => {
          chrome.storage.local.set({
            AY_INSPIRATION_REMOVE: !data["AY_INSPIRATION_REMOVE"],
          });
        }}
        checked={data["AY_INSPIRATION_REMOVE"]}
        label="About You"
      ></CheckBox>
    </div>
  );
}

export default App;

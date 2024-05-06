import { FC, ReactNode, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { EntriesContext } from "./EntriesContext";
import { entriesReducer } from "./entriesReducer";
import { Entry } from "../../interfaces";
import { entriesApi } from "../../apis";

export interface EntriesState {
  entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: [],
};

export const EntriesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);

  const addNewEntry = (description: string) => {
    const newEntry: Entry = {
      _id: uuidv4(),
      description: description,
      createdAt: Date.now(),
      status: "pending",
    };

    dispatch({ type: "[Entry] Add-Entry", payload: newEntry });
  };

  const onEntryUpdated = (entry: Entry) => {
    dispatch({ type: "[Entry] Entry-Updated", payload: entry });
  };

  const refreshEntries = async () => {
    const { data } = await entriesApi.get<Entry[]>("/entries");
    dispatch({ type: "[Entry] Entries-Loaded", payload: data });
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  return (
    <EntriesContext.Provider
      value={{
        ...state,

        // Methods
        addNewEntry,
        onEntryUpdated,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

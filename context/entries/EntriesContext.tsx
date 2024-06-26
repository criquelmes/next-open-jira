import { createContext } from "react";
import { Entry } from "../../interfaces";

interface ContextProps {
  entries: Entry[];

  // Methods
  addNewEntry: (description: string) => void;
  onEntryUpdated: (entry: Entry, showSnackbar?: boolean) => void;
  deleteEntry: (_id: string, showSnackbar?: boolean) => void;
}

export const EntriesContext = createContext({} as ContextProps);

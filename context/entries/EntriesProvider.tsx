import { FC, ReactNode, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

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
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const addNewEntry = async (description: string) => {
    const { data } = await entriesApi.post<Entry>("/entries", { description });
    dispatch({ type: "[Entry] Add-Entry", payload: data });
  };

  const onEntryUpdated = async (
    { _id, description, status }: Entry,
    showSnackbar = false
  ) => {
    try {
      const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, {
        description,
        status,
      });
      dispatch({ type: "[Entry] Entry-Updated", payload: data });

      if (showSnackbar) {
        enqueueSnackbar("Entrada actualizada", {
          variant: "success",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const refreshEntries = async () => {
    const { data } = await entriesApi.get<Entry[]>("/entries");
    dispatch({ type: "[Entry] Entries-Loaded", payload: data });
  };

  const deleteEntry = async (_id: string, showSnackbar = false) => {
    await entriesApi.delete(`/entries/${_id}`);
    dispatch({ type: "[Entry] Entry-Deleted", payload: _id });
    if (showSnackbar) {
      enqueueSnackbar("Entrada eliminada", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      router.replace(`/`);
    }
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
        deleteEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

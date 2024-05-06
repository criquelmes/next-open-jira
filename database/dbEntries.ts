import { isValidObjectId } from "mongoose";
import { db } from ".";
import { Entry, IEntry } from "../models";

export const getEntryById = async (id: string): Promise<IEntry | null> => {
  if (!isValidObjectId(id)) {
    return null;
  }

  await db.connectDB();
  const entry = await Entry.findById(id).lean();
  await db.disconnectDB();

  return JSON.parse(JSON.stringify(entry));

  // const response = await fetch(`/api/entries/${id}`);
  // const data = await response.json();
  // return data;
};

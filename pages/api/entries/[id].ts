import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Entry, IEntry } from "../../../models";

type Data = { message: string } | IEntry;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  switch (req.method) {
    case "GET":
      return getEntry(req, res);

    case "PUT":
      return updateEntry(req, res);

    case "DELETE":
      return deleteEntry(req, res);

    default:
      return res.status(400).json({ message: "Invalid method" });
  }
}

const getEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  await db.connectDB();

  const entry = await Entry.findById(id);
  await db.disconnectDB();

  if (!entry) {
    return res.status(404).json({ message: "Entry not found" });
  }

  res.status(200).json(entry);
};

const updateEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  await db.connectDB();

  const entryToUpdate = await Entry.findById(id);
  if (!entryToUpdate) {
    await db.disconnectDB();
    return res.status(400).json({ message: "Entry not found" });
  }

  const {
    description = entryToUpdate.description,
    status = entryToUpdate.status,
  } = req.body;

  try {
    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      { description, status },
      { runValidators: true, new: true }
    );
    await db.disconnectDB();
    res.status(200).json(updatedEntry!);
  } catch (error) {
    await db.disconnectDB();
    res.status(400).json({ message: "Error updating entry" });
  }

  //   entryToUpdate.description = description;
  //   entryToUpdate.status = status;
  //   await entryToUpdate.save();
};

const deleteEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;
  await db.connectDB();

  const entryToDelete = await Entry.findById(id);
  if (!entryToDelete) {
    await db.disconnectDB();
    return res.status(400).json({ message: "Entry not found" });
  }

  try {
    await Entry.findByIdAndDelete(id);
    await db.disconnectDB();
    res.status(200).json({ message: "Entry deleted" });
  } catch (error) {
    await db.disconnectDB();
    res.status(400).json({ message: "Error deleting entry" });
  }
};

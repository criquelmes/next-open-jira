import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Entry, IEntry } from "../../../models";

type Data = { message: string } | IEntry[] | IEntry;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getEntries(res);

    case "POST":
      return addEntry(req, res);

    case "PUT":
      return res.status(400).json({ message: "method PUT not implemented" });

    default:
      return res.status(400).json({ message: "Invalid method" });
  }
}

const getEntries = async (res: NextApiResponse<Data>) => {
  await db.connectDB();
  const entries = await Entry.find().sort({ createdAt: "ascending" });
  await db.disconnectDB();

  res.status(200).json(entries);
};

const addEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // return res.status(400).json({ message: "method POST not implemented" });

  const { description } = req.body;
  const newEntry = new Entry({ description, createdAt: Date.now() });

  try {
    await db.connectDB();
    await newEntry.save();
    await db.disconnectDB();

    return res.status(201).json(newEntry);
  } catch (error) {
    await db.disconnectDB();
    console.log(error);

    return res.status(500).json({ message: "Error creating entry" });
  }
};

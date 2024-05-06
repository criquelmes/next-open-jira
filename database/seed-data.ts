interface SeedData {
  entries: SeedEntry[];
}

interface SeedEntry {
  description: string;
  status: string;
  createdAt: number;
}

export const seedData: SeedData = {
  entries: [
    {
      description: "Pendiente: Create a new project",
      createdAt: Date.now(),
      status: "pending",
    },
    {
      description: "En-Progreso: Update the README file",
      createdAt: Date.now() - 1000000,
      status: "in-progress",
    },
    {
      description: "Terminadas: Push the changes to GitHub",
      createdAt: Date.now() - 10000,
      status: "finished",
    },
  ],
};

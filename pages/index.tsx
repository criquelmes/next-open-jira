import type { NextPage } from "next";
import { Layout } from "../components/layouts";
import { Typography } from "@mui/material";

const HomePage: NextPage = () => {
  return (
    <Layout title="OpenJira">
      <Typography variant="h1" color="primary">
        Hola Mundo
      </Typography>
    </Layout>
  );
};

export default HomePage;

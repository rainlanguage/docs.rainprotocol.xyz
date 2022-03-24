import React from "react";
import { Redirect } from "react-router-dom";
import Layout from "@theme/Layout";

export default function Home() {
  return (
    <Layout>
      <Redirect to="/intro" />
    </Layout>
  );
}

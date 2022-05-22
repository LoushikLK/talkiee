import { Home } from "pages";
import { Route, Routes } from "react-router-dom";
import Layout from "../layouts";

const PrivateRoute = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
};

export default PrivateRoute;

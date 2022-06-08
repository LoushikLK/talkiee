import { Home, Login, Register } from "pages";
import { Route, Routes } from "react-router-dom";
import Layout from "../layouts";

const PrivateRoute = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
    </Routes>
  );
};

export default PrivateRoute;

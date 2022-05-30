import { Home, Login, Register } from "pages";
import { Route, Routes } from "react-router-dom";
import Layout from "../layouts";

const PrivateRoute = () => {
  return (
    <>
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

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default PrivateRoute;

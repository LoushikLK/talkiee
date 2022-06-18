import { Feed, Group, Home, Profile, Settings } from "pages";
import View from "pages/feed/View";

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

      <Route
        path="/groups"
        element={
          <Layout>
            <Group />
          </Layout>
        }
      />
      <Route
        path="/status"
        element={
          <Layout>
            <Feed />
          </Layout>
        }
      />
      <Route path="/status/view/:id" element={<View />} />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/setting"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
    </Routes>
  );
};

export default PrivateRoute;

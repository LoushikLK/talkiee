import { Feed, Group, Home, Message, Profile, Settings } from "pages";
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
        path="/message/:id"
        element={
          <Layout>
            <Message />
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

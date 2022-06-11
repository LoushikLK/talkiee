import { ForgetPassword, Login, Register } from "pages";
import React from "react";
import { Route, Routes } from "react-router-dom";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
    </Routes>
  );
};

export default PublicRoutes;

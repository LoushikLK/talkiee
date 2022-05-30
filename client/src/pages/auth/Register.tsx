import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

const Register = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      name: "",
      gender: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid Email").required("Email is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      phone: Yup.string().required("Phone is required"),
      name: Yup.string().required("Name is required"),
      gender: Yup.string().required("Gender is required"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <section className="w-full h-full bg-white dark:bg-gray-900 min-h-screen flex justify-center items-center ">
      <div className="flex flex-row ">
        <div className="w-1/2"></div>
        <div className=" w-1/2">
          <div className="w-full col-span-12 flex flex-col gap-8 ">
            <h3 className="text-black font-medium tracking-wide text-lg">
              Register
            </h3>
            <h4 className="text-base text-black font-medium">
              Create your account
            </h4>
          </div>

          <form
            className="grid grid-cols-12 gap-8 my-8 "
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-12 md:col-span-6">
              <label htmlFor="register-name">Name*</label>
              <input type="text" name="" id="register-name" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label htmlFor="register-email">Email*</label>
              <input type="email" name="" id="register-email" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label htmlFor="register-password">Password*</label>
              <input type="password" name="" id="register-password" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label htmlFor="register-confirm-password">
                Confirm Password*
              </label>
              <input type="password" name="" id="register-confirm-password" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label htmlFor="register-phone">Phone*</label>
              <input type="number" name="" id="register-phone" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label htmlFor="register-gender">Gender*</label>
              <input type="select" name="" id="register-gender" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;

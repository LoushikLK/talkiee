import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import Lottie from "react-lottie";
import { loginAnimation } from "assets/animations";

const Login = () => {
  const formik = useFormik({
    initialValues: {
      phone: "",
      otp: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().required("Required"),
      otp: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const loginAnimationOption = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  console.log("hello world");

  return (
    <section className="w-full flex items-center bg-white dark:bg-gray-900 min-h-screen h-full justify-center">
      <div className="h-fit w-full flex items-center justify-center max-w-4xl gap-8 container p-4 mx-auto ">
        <div className="flex w-1/2 flex-col gap-8 ">
          <h3 className="py-12 text-gray-900 dark:text-white font-semibold tracking-wide text-4xl  ">
            Login
          </h3>

          <div className="flex flex-col gap-4 items-center">
            <div className=" w-full flex flex-col gap-2 ">
              <label
                className="text-gray-900 dark:text-white text-base tracking-wider font-medium"
                htmlFor="login-phone"
              >
                Phone*
              </label>
              <span className="flex flex-col gap-1">
                <input
                  className="h-10 w-full  focus:outline bg-transparent  border-b  focus:outline-blue-500 px-2  "
                  type="text"
                  name="phone"
                  placeholder="Enter your number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  id="login-phone"
                />
                <small className="text-red-500 tracking-wide font-medium ml-2">
                  {formik.touched.phone && formik.errors.phone}
                </small>
              </span>
            </div>
            <div className="w-full flex flex-col gap-2 ">
              <label
                className="text-gray-900 dark:text-white text-base tracking-wider font-medium"
                htmlFor="login-otp"
              >
                Otp*
              </label>
              <span className="flex flex-col gap-1">
                <input
                  className="h-10 w-full  focus:outline focus:outline-blue-500 px-2 border-b bg-transparent "
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.otp}
                  id="login-otp"
                />
                <small className="text-red-500 tracking-wide font-medium ml-2">
                  {formik.touched.otp && formik.errors.otp}
                </small>
              </span>
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <span className="flex items-center gap-4">
              <input
                className="  rounded-md  cursor-pointer "
                type="checkbox"
                name="terms-agree"
                id=""
              />
              <h3 className="text-sm text-gray-900 dark:text-white tracking-wide font-medium">
                Remember me
              </h3>
            </span>
            <h3 className="text-sm tracking-wide cursor-pointer text-blue-500 font-medium">
              Forget Password?
            </h3>
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              type="submit"
              className="text-white bg-blue-500/90 tracking-wide font-medium justify-center text-lg flex items-center gap-4 w-44  px-6   py-2 rounded-md hover:bg-blue-700   "
            >
              Submit OTP
            </button>
          </div>
        </div>
        <div className=" w-1/2 flex items-center justify-center ">
          <Lottie options={loginAnimationOption} height={500} width={500} />
        </div>
      </div>
    </section>
  );
};

export default Login;

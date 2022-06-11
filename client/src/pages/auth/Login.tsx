import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import Lottie from "react-lottie";
import { loginAnimation } from "assets/animations";
import { EyeOff, EyeVisible, Loader } from "assets/icons";
import PhoneInput from "react-phone-number-input";
import Swal from "sweetalert2";
import { loginPath } from "config/path";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [passwordType, setPasswordType] = React.useState(true);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await fetch(loginPath, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        // console.log(data);

        if (response.status !== 200) {
          Swal.fire({
            title: "Error",
            text: data?.message,
            icon: "error",
            confirmButtonText: "OK",
          });
          setLoading(false);
          return;
        }
        Swal.fire({
          title: "Success",
          text: data?.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          setLoading(false);
          if (result.value) {
            localStorage.setItem("authToken", data?.data?.token);
            dispatch({ type: "SET-USER", payload: data?.data?.data });
          }
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
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

  // console.log("hello world");

  return (
    <section className="w-full flex items-center bg-white dark:bg-gray-900 min-h-screen h-full justify-center">
      <div className="h-fit w-full flex items-center justify-center max-w-4xl gap-8 container p-4 mx-auto ">
        <form
          onSubmit={formik.handleSubmit}
          className="flex w-1/2 flex-col gap-8 "
        >
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
              <span className="flex flex-col gap-1 auth-login-input ">
                <PhoneInput
                  defaultCountry="IN"
                  name="phone"
                  placeholder="Enter your phone number"
                  id="register-phone"
                  className="h-10 w-full rounded-md  focus:!outline-blue-500 px-2 border 
                   "
                  value={formik.values.phone}
                  onChange={(value) => {
                    formik.setFieldValue("phone", value);
                  }}
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
                Password*
              </label>
              <span className="flex flex-col gap-1">
                <span className="relative flex items-center justify-end  ">
                  <input
                    className="h-10 w-full  focus:outline-none  focus:outline-blue-500 px-2 border rounded-md "
                    type={passwordType ? "password" : "text"}
                    name="password"
                    placeholder="Enter password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    id="login-otp"
                  />
                  <span
                    className="absolute cursor-pointer mr-1 "
                    onClick={() => {
                      setPasswordType(!passwordType);
                    }}
                  >
                    {!passwordType ? <EyeOff /> : <EyeVisible />}
                  </span>
                </span>
                <small className="text-red-500 tracking-wide font-medium ml-2">
                  {formik.touched.password && formik.errors.password}
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
            <Link
              to={"/forget-password"}
              className="text-sm tracking-wide cursor-pointer text-blue-500 font-medium"
            >
              Forget Password?
            </Link>
          </div>

          <div className="w-full flex items-center justify-center">
            <button
              type="submit"
              className="text-white bg-blue-500/90 tracking-wide font-medium justify-center text-lg flex items-center gap-4 w-44  px-6   py-2 rounded-full hover:bg-blue-700   "
              // onClick={() => formik.handleSubmit()}
            >
              {loading ? (
                <>
                  <Loader className="text-2xl animate-spin " />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <div className="w-full flex items-center justify-center ">
            <span className="text-gray-500 text-base">
              Don't have an account?
            </span>
            <Link
              to="/register"
              className="text-blue-500 text-sm ml-2 cursor-pointer"
            >
              Register
            </Link>
          </div>
        </form>
        <div className=" w-1/2 flex items-center justify-center ">
          <Lottie options={loginAnimationOption} height={500} width={500} />
        </div>
      </div>
    </section>
  );
};

export default Login;

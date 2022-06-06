import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import Lottie from "react-lottie";
import { registerAnimations } from "assets/animations";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "config/firebaseConfig";
import Swal from "sweetalert2";
declare var window: any;

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
      try {
        console.log(values);

        window.captchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "normal",
            callback: (response: any) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // ...
            },
            "expired-callback": () => {
              // Response expired. Ask user to solve reCAPTCHA again.
              // ...
            },
          },
          auth
        );

        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, values.phone, appVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;

            Swal.fire({
              title: "Code Sent",
              text: "Please enter the code sent to your phone",
              icon: "success",
            });
            // ...
          })
          .catch((error) => {
            // Error; SMS not sent
            console.log(error);
            // ...
          });
      } catch (error) {
        console.log(error);
      }
    },
  });

  console.log(formik.errors);

  const registerOptions = {
    loop: true,
    autoplay: true,
    animationData: registerAnimations,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <section className="w-full h-full bg-white dark:bg-gray-900 min-h-screen flex justify-center items-center ">
      <div className="flex flex-row w-full items-center container mx-auto p-4 ">
        <div className="w-1/2 h-full">
          <div className="flex flex-col items-center justify-center">
            <Lottie options={registerOptions} height={300} width={300} />
          </div>
        </div>
        <div className=" w-1/2">
          <div className="w-full pb-6 flex flex-col gap-8 ">
            <h3 className="text-black dark:text-white text-4xl tracking-wider  font-medium ">
              Register
            </h3>
            <h4 className=" text-black dark:text-white text-2xl tracking-wider  font-medium">
              Create your account
            </h4>
          </div>

          <form
            className="grid grid-cols-12 gap-8 my-8 "
            onSubmit={formik.handleSubmit}
          >
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2 ">
              <label
                className="text-gray-900 dark:text-white text-base tracking-wider font-medium"
                htmlFor="register-name"
              >
                Name*
              </label>
              <span className="flex flex-col gap-1">
                <input
                  className="h-10 w-full rounded-md focus:outline focus:outline-blue-500 px-2 border "
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  id="register-name"
                />
                <small className="text-red-500 tracking-wide font-medium ml-2">
                  {formik.touched.name && formik.errors.name}
                </small>
              </span>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2 ">
              <label
                className="text-gray-900 dark:text-white text-base tracking-wider font-medium"
                htmlFor="register-email"
              >
                Email*
              </label>
              <span className="flex flex-col gap-1">
                <input
                  className="h-10 w-full rounded-md focus:outline focus:outline-blue-500 px-2 border "
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  id="register-email"
                />
                <small className="text-red-500 tracking-wide font-medium ml-2">
                  {formik.touched.email && formik.errors.email}
                </small>
              </span>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2 ">
              <label
                className="text-gray-900 dark:text-white text-base tracking-wider font-medium"
                htmlFor="register-password"
              >
                Password*
              </label>
              <span className="flex flex-col gap-1">
                <input
                  className="h-10 w-full rounded-md focus:outline focus:outline-blue-500 px-2 border "
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  id="register-password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <small className="text-red-500 tracking-wide font-medium ml-2">
                  {formik.touched.password && formik.errors.password}
                </small>
              </span>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2 ">
              <label
                className="text-gray-900 dark:text-white text-base tracking-wider font-medium"
                htmlFor="register-confirm-password"
              >
                Confirm Password*
              </label>
              <span className="flex flex-col gap-1">
                <input
                  className="h-10 w-full rounded-md focus:outline focus:outline-blue-500 px-2 border "
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  id="register-confirm-password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
                <small className="text-red-500 tracking-wide font-medium ml-2">
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword}
                </small>
              </span>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2 ">
              <label
                className="text-gray-900 dark:text-white text-base tracking-wider font-medium"
                htmlFor="register-phone"
              >
                Phone*
              </label>
              <span className="flex flex-col gap-1">
                <input
                  className="h-10 w-full rounded-md focus:outline focus:outline-blue-500 px-2 border "
                  type="number"
                  name="phone"
                  placeholder="Enter your phone number"
                  id="register-phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                <small className="text-red-500 tracking-wide font-medium ml-2">
                  {formik.touched.phone && formik.errors.phone}
                </small>
              </span>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2 ">
              <label
                className="text-gray-900 dark:text-white text-base tracking-wider font-medium"
                htmlFor="register-gender"
              >
                Gender*
              </label>

              <span className="flex flex-col gap-1">
                <select
                  name="gender"
                  id="register-gender"
                  className="h-10 w-full rounded-md focus:outline px-2 focus:outline-blue-500 border "
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <small className="text-red-500 tracking-wide font-medium ml-2">
                  {formik.touched.gender && formik.errors.gender}
                </small>
              </span>
            </div>
            <div className="flex items-center gap-1 col-span-12 ">
              <input
                className="  rounded-md focus:outline focus:outline-blue-500"
                type="checkbox"
                name="terms-agree"
                id=""
              />

              <span className="text-black dark:text-white">
                I agree to the{" "}
                <a href="/" className="text-blue-500">
                  Terms and Conditions
                </a>
              </span>
            </div>
            <div className="w-full">
              <button
                type="submit"
                className="text-white bg-blue-500/90 tracking-wide font-medium text-lg   px-6 py-3 rounded-md  "
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;

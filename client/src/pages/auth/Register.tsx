import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import Lottie from "react-lottie";
import { otpAnimation, registerAnimations } from "assets/animations";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "config/firebaseConfig";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-number-input";
import { checkUserPath, registerPath } from "config/path";
import { useNavigate } from "react-router-dom";

declare var window: any;

const Register = () => {
  const [otpValue, setOtpValue] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [otpReSent, setOtpResent] = React.useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      name: "",
      gender: "Male",
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
        setLoading(true);

        const serverCheck = await fetch(checkUserPath, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: values.phone,
          }),
        });

        if (serverCheck.status === 200) {
          Swal.fire({
            title: "Error",
            text: "Phone number already exists",
            icon: "error",
            confirmButtonText: "OK",
          });
          setLoading(false);
          return;
        }

        // console.log(values);

        window.recaptchaVerifier = new RecaptchaVerifier(
          "sign-in-button",
          {
            size: "invisible",
            callback: () => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
            },
          },
          auth
        );

        const appVerifier = window.recaptchaVerifier;

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          values?.phone,
          appVerifier
        );

        if (!confirmationResult.verificationId) {
          setLoading(false);
          Swal.fire({
            title: "Error",
            text: "OTP not sent",
            icon: "error",
            confirmButtonText: "Ok",
          });
          return;
        }
        window.confirmationResult = confirmationResult;

        Swal.fire({
          title: `OTP Sent`,
          text: `Please enter the code sent to phone number ${values?.phone}`,
          icon: "success",
        });
        setLoading(false);
        setOtpSent(true);
        // ...
      } catch (error) {
        console.log(error);
        setLoading(false);
        Swal.fire({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    },
  });

  console.log(otpSent);
  console.log(loading);

  // console.log(formik.errors);

  const registerOptions = {
    loop: true,
    autoplay: true,
    animationData: registerAnimations,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const otpOptions = {
    loop: true,
    autoplay: true,
    animationData: otpAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      // console.log(values);

      window.recaptchaVerifier = new RecaptchaVerifier(
        "reset-button",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        },
        auth
      );

      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formik?.values?.phone,
        appVerifier
      );

      if (!confirmationResult.verificationId) {
        setLoading(false);
        Swal.fire({
          title: "Error",
          text: "OTP not sent",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
      window.confirmationResult = confirmationResult;

      Swal.fire({
        title: `OTP Resent Successful`,
        text: `Please enter the code sent to phone number ${formik?.values?.phone}`,
        icon: "success",
      });
      setLoading(false);
      setOtpResent(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const verifyOtp = async () => {
    try {
      if (!otpValue) {
        Swal.fire({
          title: "Error",
          text: "OTP is required",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      setLoading(true);

      const user = await window.confirmationResult.confirm(otpValue);

      if (!user) {
        Swal.fire({
          title: "Error",
          text: "Invalid OTP",
          icon: "error",
          confirmButtonText: "Ok",
        });
        setLoading(false);
        return;
      }

      const token = await auth?.currentUser?.getIdToken(true);

      if (!token) {
        Swal.fire({
          title: "Error",
          text: "Error while getting token",
          icon: "error",
          confirmButtonText: "Ok",
        });
        setLoading(false);
        return;
      }

      console.log(token);

      const registerData = {
        idToken: token,
        email: formik.values.email,
        name: formik.values.name,
        phone: formik.values.phone,
        password: formik.values.password,
        gender: formik.values.gender,
      };

      const URL = registerPath;

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      console.log(data);

      if (response.status !== 200) {
        Swal.fire({
          title: "Error",
          text: data?.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
        setLoading(false);
        return;
      }
      localStorage.setItem("authToken", data?.data?.token);
      Swal.fire({
        title: "Success",
        text: data?.message,
        icon: "success",
        confirmButtonText: "Ok",
      });

      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      Swal.fire({
        title: "Error",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <>
      {otpSent ? (
        <section className="w-full flex min-h-screen bg-white dark:bg-gray-900 items-center justify-center ">
          <div className="w-fit flex flex-col gap-2 p-8 rounded-md max-w-md border border-gray-400/20 ">
            <h3 className=" w-full text-center tracking-wide text-black dark:text-white text-[4rem] py-4 ">
              Talkiee
            </h3>

            <div className="flex flex-col gap-4 items-center  ">
              <Lottie options={otpOptions} height={200} width={200} />
              <h3 className="text-center text-gray-900 dark:text-white text-4xl">
                Verify your phone number
              </h3>

              <p className="text-base font-medium tracking-wide text-center text-gray-900 dark:text-gray-200/50 ">
                To verify your phone number, we sent an OTP to your phone number
                ending in{" "}
                <span className="text-gray-900 dark:text-white">
                  {formik.values.phone.slice(-4)}
                </span>
              </p>

              <div className="w-full flex flex-col gap-4 items-center">
                <span className="flex flex-col w-full gap-2">
                  <label
                    htmlFor="otp-code-register"
                    className="text-gray-900 dark:text-gray-50 text-base tracking-wide font-medium "
                  >
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    id="otp-code-register"
                    value={otpValue}
                    // placeholder="Enter OTP"
                    onChange={(e) => {
                      setOtpValue(e.target.value);
                    }}
                    className="w-full focus:outline-blue-200  py-2 px-4 rounded-md text-gray-900  "
                  />
                </span>

                <button
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium tracking-wide "
                  onClick={verifyOtp}
                >
                  Verify
                </button>

                {!otpReSent && (
                  <span
                    className="w-full text-center  text-xs cursor-pointer text-blue-500 tracking-wide"
                    onClick={resendOtp}
                  >
                    Resend OTP
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
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
                  <span className="flex flex-col gap-1 auth-phone-input ">
                    <PhoneInput
                      defaultCountry="IN"
                      name="phone"
                      placeholder="Enter your phone number"
                      id="register-phone"
                      className="h-10 w-full rounded-md focus:outline focus:outline-blue-500 px-2 border "
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
                  <div id="sign-in-button"></div>
                  <div id="reset-button"></div>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";
import { io } from "socket.io-client";
import { auth } from "./config/firebaseConfig";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

function App() {
  const [idToken, setIdToken] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>();

  const data = {
    name: "lkgiri",
    phone: 911234567890,
    email: "loushik.giri@gmail.com",
    password: "1234567890",
    gender: "male",
    idToken: idToken,
  };

  const getOtp = () => {
    const phone = "+911234567890";
    window.recaptchaVerifier = new RecaptchaVerifier(
      "captcha",
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

    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        setConfirmationResult(confirmationResult);
        console.log("sms sent");
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        console.log("error", error);
      });
  };

  const confirmOTP = () => {
    const code: number = Number("111111");
    confirmationResult
      .confirm(code)
      .then((result: any) => {
        // User signed in successfully.
        const user = result.user;

        user
          .getIdToken(/* forceRefresh */ true)
          .then(function (idToken: any) {
            // Send token to your backend via HTTPS
            // ...
            console.log("idToken", idToken);
            setIdToken(idToken);
          })
          .catch(function (error: any) {
            // Handle error
            console.log("error", error);
          });
        // ...
      })
      .catch((error: any) => {
        // User couldn't sign in (bad verification code?)
        // ...
        console.log("error", error);
      });
  };

  const fetchServer = async () => {
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();
      console.log("json", json);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <main>
      {/* <form action=""> */}
      <input type="text" placeholder="name" />
      <input type="text" placeholder="password" />
      <input type="email" name="" id="" />
      <button onClick={getOtp} className="bg-red-500 text-white">
        Get OTP
      </button>
      <button onClick={confirmOTP} className="bg-red-500 text-white">
        Confirm OTP
      </button>
      <div>
        <button onClick={fetchServer} className="bg-green-500 text-white">
          sent req
        </button>
      </div>
      <div id="captcha"></div>
      {/* </form> */}
    </main>
  );
}

export default App;

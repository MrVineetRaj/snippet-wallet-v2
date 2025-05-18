import { useState } from "react";
import SignIn from "../components/auth/signin";
import Signup from "../components/auth/signup";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  return (
    <div className="min-h-screen ">
      <div className="flex items-center h-screen">
        <div className="bg-gray-500 flex-1 w-full h-[80%]"></div>
        <div className="min-w-124 p-4">
          <div className="flex items-center gap-4 justify-center h-full w-full bg-black p-4 rounded-2xl">
            <span
              className={`text-xl font-bold  p-2 w-full text-center rounded-xl cursor-pointer transition-all duration-150 ${
                isSignIn ? "bg-primary" : "bg-background"
              }`}
              onClick={() => {
                setIsSignIn(true);
                setIsSignUp(false);
                setIsForgotPassword(false);
              }}
            >
              Login
            </span>
            <span
              className={`text-xl font-bold  p-2 w-full text-center rounded-xl cursor-pointer transition-all duration-150 ${
                isSignUp ? "bg-primary" : "bg-background"
              }`}
              onClick={() => {
                setIsSignIn(false);
                setIsSignUp(true);
                setIsForgotPassword(false);
              }}
            >
              Sign Up
            </span>
          </div>

          {isSignIn && <SignIn />}
          {isSignUp && <Signup />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

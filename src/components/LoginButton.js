import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({ setIsAuthenticated, setCurrentStage }) => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  console.log("isAuthenticated", isAuthenticated);

  if (isAuthenticated) {
    const saveStage = (stage) => {
      localStorage.setItem("currentStage", stage);
    };

    saveStage("walletconnect");
    setCurrentStage("walletconnect");
  }

  useEffect(() => {
    setIsAuthenticated(isAuthenticated);
  }, [isAuthenticated, setIsAuthenticated]);

  return (
    <button
      className="bg-[#F0C600] px-16 py-2 font-bold"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  );
};

export default LoginButton;

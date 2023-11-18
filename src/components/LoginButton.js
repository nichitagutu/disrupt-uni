import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className="bg-[#F0C600] px-16 py-2 font-bold" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;

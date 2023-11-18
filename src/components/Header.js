import React from "react";
import { ReactComponent as UniLogo } from "./uni_logo.svg";
import Profile from "./Profile";

const Header = () => {
  return (
    <div className="flex justify-between items-center justify-center">
      <UniLogo />

      <Profile />
    </div>
  );
};

export default Header;

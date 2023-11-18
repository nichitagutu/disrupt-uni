import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="flex flex-row items-center gap-3">
        <img src={user.picture} alt={user.name} className="w-[40px] border-orange-600 border-4 rounded-full" />
        <h2>{user.name}</h2>
      </div>
    )
  );
};

export default Profile;

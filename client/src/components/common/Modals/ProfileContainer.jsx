import { useState } from "react";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";

function ProfileContainer() {
  const [activeProfile, setActiveProfile] = useState(true);
  const [activeUpdate, setActiveUpdate] = useState(false);

  const handleOpenProfile = () => setActiveProfile(true);
  const handleCloseProfile = () => setActiveProfile(false);

  const handleOpenUpdate = () => setActiveUpdate(true);
  const handleCloseUpdate = () => setActiveUpdate(false);

  return (
    <>
      {activeProfile && (
        <Profile
          onOpenUpdate={handleOpenUpdate}
          onCloseProfile={handleCloseProfile}
        />
      )}
      {activeUpdate && (
        <UpdateProfile
          onCloseUpdate={handleCloseUpdate}
          onOpenProfile={handleOpenProfile}
        />
      )}
    </>
  )
}

export default ProfileContainer
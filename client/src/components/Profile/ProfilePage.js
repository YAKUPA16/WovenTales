import React, { useEffect, useState } from "react";
import { getProfile, updateAvatar, updateProfile } from "../../services/userService";
import "./Profile.css";

const backendUrl = "http://localhost:5000";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState("#f5f7fa");

  const colors = ["#f5f7fa", "#1e1e2f", "#ffefd5", "#d0f0c0", "#ffe4e1"];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
        setDisplayName(data.username);
        setEmail(data.email);
        setDescription(data.description || "");
        setBgColor(data.bgColor || "#f5f7fa");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSaveProfilePicture = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    try {
      const updatedUser = await updateAvatar(formData);
      setUser(updatedUser);
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const updatedUser = await updateProfile({ username: displayName, email, description, bgColor });
      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const profileImageUrl = preview
    ? preview
    : user.profileImage
    ? backendUrl + user.profileImage
    : "/avatars/default.png";

  return (
    <div
      className="profile-page"
      style={{
        backgroundColor: bgColor,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <img src={profileImageUrl} alt="Profile" className="profile-img" />
          <h2 className="username">{user.username}</h2>

          <label className="upload-btn">
            Choose Image
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </label>

          {selectedFile && (
            <button className="save-btn" onClick={handleSaveProfilePicture}>
              Save Profile Picture
            </button>
          )}
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

          {/* ✅ NEW: liked stories count */}
          <p><strong>Liked Stories:</strong> {user.likedStoriesCount ?? 0}</p>

          <p><strong>Bio:</strong> {description || "No description set."}</p>
        </div>

        {/* Settings Section */}
        <div className="profile-settings">
          <h3>Edit Profile</h3>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            className="settings-input"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="settings-input"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bio / Description"
            className="settings-input"
            rows={3}
          />

          <h4>Select Background Color</h4>
          <div className="color-options">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-box ${color === bgColor ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setBgColor(color)}
              />
            ))}
          </div>

          <button className="save-btn" onClick={handleSaveSettings}>
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

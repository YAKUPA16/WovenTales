import React from "react";
import { useNavigate } from "react-router-dom";

const AuthLanding = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to WovenTales</h2>
      <button onClick={() => navigate("/login")} style={{ margin: "10px" }}>
        Login
      </button>
      <button onClick={() => navigate("/signup")} style={{ margin: "10px" }}>
        Signup
      </button>
    </div>
  );
};

export default AuthLanding;

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Sign_in.css";
import axios from "axios"

function Sign_in() {
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...user, [name]: value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/sign_in/", user);
      const data = res.data;

      if (data.success) {
        const userId = data.user_id;
        const userRole = data.role; // Get role from the response

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        document.cookie = `userId=${userId}; expires=${expiryDate.toUTCString()}; path=/; secure; SameSite=Lax`;

        // Redirect based on user role
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setFormErrors(data);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="sign-in">
      <div className="login">
        <form>
          <h1>Login</h1>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={changeHandler}
            value={user.email}
          />
          <p className="error">{formErrors.email}</p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password}
          />
          <p className="error">{formErrors.notMatch}</p>
          <button
            type="submit"
            className="button_common"
            onClick={loginHandler}
          >
            Sign in
          </button>
        </form>
        <a href="/sign_up">Not yet registered? Sign up Now</a>
      </div>
    </div>
  );
}

export default Sign_in;

import { useState } from "react";

function Login({
  onLogin,
  onRegister
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    await onLogin({
      email: email,
      password: password
    });
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <span>✦ WELCOME BACK ✦</span>

        <h1>Login</h1>

        <p>
          Enter your details to continue.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?
          <button
            type="button"
            onClick={onRegister}
          >
            Register
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;
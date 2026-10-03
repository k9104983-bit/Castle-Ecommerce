
import { useState } from "react";

function Register({
  onRegister,
  onLogin
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      alert("Please fill all fields.");
      return;
    }

    const emailPattern =
      /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    await onRegister({
      name: trimmedName,
      email: trimmedEmail,
      password
    });
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <span>✦ JOIN CASTLE ✦</span>

        <h1>Create Account</h1>

        <p>
          Create your Castle shopping account.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

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
            Create Account
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?
          <button onClick={onLogin}>
            Login
          </button>
        </p>

      </div>

    </div>
  );
}

export default Register;


import { useState } from "react";

function VerifyOtp({
  email,
  onVerify,
  onResend,
  onLogin
}) {
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      alert("OTP must contain exactly 6 digits.");
      return;
    }

    await onVerify(email, otp);
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <span>✦ VERIFY EMAIL ✦</span>

        <h1>Verify Your Email</h1>

        <p>
          We sent a 6-digit OTP to
        </p>

        <p>
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
          />

          <button type="submit">
            Verify Email
          </button>

        </form>

        <p className="auth-switch">
          Didn't receive the OTP?

          <button
            type="button"
            onClick={() => onResend(email)}
          >
            Resend OTP
          </button>
        </p>

        <p className="auth-switch">
          Already verified?

          <button
            type="button"
            onClick={onLogin}
          >
            Login
          </button>
        </p>

      </div>

    </div>
  );
}

export default VerifyOtp;
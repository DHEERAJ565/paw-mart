import React, { useEffect, useRef, useState } from "react";
import "./ForgotPassword.css";

const API_BASE = "http://localhost:5000/api";

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    arrow: <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="m3 3 18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 4.1M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.3 3.5-.8" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    paw: <><ellipse cx="12" cy="15.5" rx="5.5" ry="4.2" /><ellipse cx="5.7" cy="9" rx="2" ry="2.7" /><ellipse cx="10" cy="5.7" rx="2" ry="2.7" /><ellipse cx="15" cy="5.7" rx="2" ry="2.7" /><ellipse cx="18.3" cy="9" rx="2" ry="2.7" /></>,
    spark: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const emptyDigits = ["", "", "", "", "", ""];

export default function ForgotPassword({ onBackToLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(emptyDigits);
  const [seconds, setSeconds] = useState(45);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const inputs = useRef([]);

  useEffect(() => {
    if (step !== 2 || seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [step, seconds]);

  const passwordScore = [
    newPassword.length >= 8,
    /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword),
    /\d/.test(newPassword),
    /[^A-Za-z0-9]/.test(newPassword)
  ].filter(Boolean).length;

  async function postJson(path, body) {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");
    return data;
  }

  async function requestOtp(event) {
    event.preventDefault(); setError(""); setNotice("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address to continue."); return;
    }
    setLoading(true);
    try {
      await postJson("/auth/forgot-password", { email });
      setStep(2); setSeconds(45);
      setNotice("If this email is registered, a verification code has been sent.");
      window.setTimeout(() => inputs.current[0]?.focus(), 80);
    } catch (err) { setError(err.message || "Unable to send the code right now."); }
    finally { setLoading(false); }
  }

  function changeDigit(index, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((item, i) => i === index ? digit : item));
    setError("");
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === "Backspace" && !digits[index] && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) inputs.current[index + 1]?.focus();
  }

  function pasteOtp(event) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    setDigits([...pasted.split(""), ...Array(6 - pasted.length).fill("")]);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function verifyOtp(event) {
    event.preventDefault(); setError("");
    const otp = digits.join("");
    if (otp.length !== 6) { setError("Enter all six digits from your email."); return; }
    setLoading(true);
    try {
      await postJson("/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err) { setError(err.message || "That code could not be verified."); }
    finally { setLoading(false); }
  }

  async function resendOtp() {
    if (seconds > 0 || loading) return;
    setError(""); setNotice(""); setLoading(true);
    try {
      await postJson("/auth/forgot-password", { email });
      setSeconds(45); setDigits(emptyDigits);
      setNotice("If this email is registered, a new code has been sent.");
      inputs.current[0]?.focus();
    } catch (err) { setError(err.message || "Could not resend the code."); }
    finally { setLoading(false); }
  }

  async function resetPassword(event) {
    event.preventDefault(); setError(""); setNotice("");
    if (newPassword.length < 8) { setError("Your password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("The passwords don't match yet."); return; }
    setLoading(true);
    try {
      await postJson("/auth/reset-password", { email, otp: digits.join(""), newPassword });
      setStep(4);
    } catch (err) { setError(err.message || "Could not reset the password."); }
    finally { setLoading(false); }
  }

  function backToLogin() {
    if (onBackToLogin) onBackToLogin();
    else window.location.href = "/login";
  }

  return (
    <main className="fp-page">
      <div className="fp-noise" aria-hidden="true" /><div className="fp-orb fp-orb-one" aria-hidden="true" /><div className="fp-orb fp-orb-two" aria-hidden="true" /><div className="fp-orb fp-orb-three" aria-hidden="true" /><div className="fp-grid" aria-hidden="true" />
      <header className="fp-topbar">
        <a className="fp-brand" href="/" aria-label="PawMart home"><span className="fp-brand-mark"><Icon name="paw" size={23} /></span><span>Paw<span>Mart</span><small>HAPPY PETS, HAPPY HOMES</small></span></a>
        <div className="fp-secure-label"><Icon name="shield" size={16} /> SECURE ACCOUNT RECOVERY</div>
      </header>

      <section className="fp-layout">
        <aside className="fp-story">
          <div className="fp-eyebrow"><span className="fp-eyebrow-dot" /> YOUR PETS. YOUR WORLD.</div>
          <h1>A fresh start<br />is just <span>one step</span><br />away.</h1>
          <p className="fp-story-copy">Your PawMart account keeps your pet journey close. Let’s get you back to the moments that matter.</p>
          <div className="fp-pet-card">
            <div className="fp-pet-art"><div className="fp-pet-halo" /><div className="fp-pet-moon" /><div className="fp-pet-star fp-star-a">✦</div><div className="fp-pet-star fp-star-b">✧</div><div className="fp-pet-star fp-star-c">·</div>
              <svg className="fp-dog-illustration" viewBox="0 0 260 230" role="img" aria-label="Illustration of a friendly dog">
                <defs><linearGradient id="dogFur" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f8d4a0" /><stop offset="1" stopColor="#b96e37" /></linearGradient><linearGradient id="dogEar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#75412f" /><stop offset="1" stopColor="#3b2431" /></linearGradient></defs>
                <ellipse cx="132" cy="202" rx="76" ry="12" fill="#070a19" opacity=".45" /><path d="M78 104C54 75 41 84 40 115c-1 26 11 48 31 48l18-27Z" fill="url(#dogEar)" /><path d="M178 103c28-28 43-16 39 16-3 25-17 43-36 41l-15-30Z" fill="url(#dogEar)" /><path d="M78 135c-2-41 16-74 53-78 42-5 68 27 64 73l-7 39c-4 27-28 43-58 43-33 0-54-18-55-46Z" fill="url(#dogFur)" /><path d="M85 149c-5-17 7-34 23-33 15 1 21 17 16 34-5 17-15 26-24 22-8-3-12-12-15-23Z" fill="#f7e4c5" /><path d="M153 149c-5-17 6-34 22-33 16 1 22 18 16 34-5 16-16 25-25 21-7-3-11-11-13-22Z" fill="#f7e4c5" /><ellipse cx="106" cy="119" rx="6" ry="8" fill="#201827" /><ellipse cx="166" cy="119" rx="6" ry="8" fill="#201827" /><circle cx="108" cy="116" r="2" fill="white" /><circle cx="168" cy="116" r="2" fill="white" /><path d="M122 145c0-9 7-15 15-15s15 6 15 15c0 7-7 11-15 11s-15-4-15-11Z" fill="#39232a" /><path d="M137 156v8c-4 8-14 8-19 2" fill="none" stroke="#39232a" strokeWidth="3" strokeLinecap="round" /><path d="M123 164c8 12 20 12 29 0" fill="none" stroke="#39232a" strokeWidth="2.5" strokeLinecap="round" /><path d="M91 181c12 7 24 8 39 8s29-2 40-9" fill="none" stroke="#a65e31" strokeWidth="2" opacity=".5" /><path d="M86 186c-13 10-18 18-17 27h35l8-21M178 186c13 10 18 18 17 27h-35l-8-21" fill="#d99a58" /><path d="M87 180c-7 7-10 16-10 26" fill="none" stroke="#f8d4a0" strokeWidth="8" strokeLinecap="round" /><path d="M179 180c7 7 10 16 10 26" fill="none" stroke="#f8d4a0" strokeWidth="8" strokeLinecap="round" /><path d="M98 91c9-11 20-17 34-18" fill="none" stroke="#fff0d6" strokeWidth="5" strokeLinecap="round" opacity=".65" />
              </svg>
              <span className="fp-floating-paw fp-paw-one"><Icon name="paw" size={21} /></span><span className="fp-floating-paw fp-paw-two"><Icon name="paw" size={14} /></span>
            </div>
            <div className="fp-pet-caption"><span className="fp-caption-icon"><Icon name="spark" size={17} /></span><div><strong>Every tail has a story.</strong><small>Let’s continue yours.</small></div><span className="fp-caption-line" /></div>
          </div>
          <div className="fp-trust-row"><span><Icon name="shield" size={15} /> Private by design</span><i /><span>Made for pet people <Icon name="paw" size={15} /></span></div>
        </aside>

        <section className="fp-panel-wrap" aria-live="polite">
          <div className="fp-panel">
            <div className="fp-panel-topline"><span>ACCOUNT RECOVERY</span><span className="fp-step-count">{step < 4 ? `0${step} / 03` : "COMPLETE"}</span></div>
            <div className="fp-progress" aria-label={`Step ${Math.min(step, 3)} of 3`}><span className={step >= 1 ? "active" : ""} /><span className={step >= 2 ? "active" : ""} /><span className={step >= 3 ? "active" : ""} /></div>

            {step === 1 && <>
              <div className="fp-icon-tile"><Icon name="mail" size={25} /></div><p className="fp-kicker">FORGOT YOUR PASSWORD?</p><h2>Let’s get you<br /><span>back in.</span></h2><p className="fp-panel-copy">It happens to the best of us. Enter the email linked to your account and we’ll send you a verification code.</p>
              <form onSubmit={requestOtp} className="fp-form"><label htmlFor="fp-email">Email address</label><div className="fp-input-wrap"><Icon name="mail" size={18} /><input id="fp-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>{error && <p className="fp-error" role="alert">{error}</p>}<button className="fp-primary" type="submit" disabled={loading}>{loading ? <><span className="fp-spinner" /> Sending secure code...</> : <>Send verification code <span>↗</span></>}</button></form>
              <button className="fp-back-link" type="button" onClick={backToLogin}><Icon name="arrow" size={17} /> Back to sign in</button><div className="fp-panel-foot"><Icon name="shield" size={15} /> Your account security is our priority.</div>
            </>}

            {step === 2 && <>
              <div className="fp-icon-tile"><Icon name="mail" size={25} /></div><p className="fp-kicker">CHECK YOUR INBOX</p><h2>Verify it’s<br /><span>really you.</span></h2><p className="fp-panel-copy">Enter the 6-digit code sent to <strong className="fp-email-highlight">{email}</strong>. Check your spam folder if it’s not there.</p>
              <form onSubmit={verifyOtp} className="fp-form"><label>Verification code</label><div className="fp-otp-row">{digits.map((digit, index) => <input key={index} ref={(el) => { inputs.current[index] = el; }} className={`fp-otp-box ${digit ? "has-value" : ""}`} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} value={digit} aria-label={`OTP digit ${index + 1}`} onChange={(e) => changeDigit(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} onPaste={pasteOtp} autoComplete={index === 0 ? "one-time-code" : "off"} />)}</div><div className="fp-resend-row"><span>Didn't receive the code?</span><button type="button" disabled={seconds > 0 || loading} onClick={resendOtp}>{seconds > 0 ? `Resend in 00:${String(seconds).padStart(2, "0")}` : "Resend code"}</button></div>{notice && <p className="fp-notice">{notice}</p>}{error && <p className="fp-error" role="alert">{error}</p>}<button className="fp-primary" type="submit" disabled={loading}>{loading ? <><span className="fp-spinner" /> Verifying...</> : <>Verify code <span>↗</span></>}</button></form>
              <button className="fp-back-link" type="button" onClick={() => { setStep(1); setError(""); setNotice(""); }}><Icon name="arrow" size={17} /> Change email address</button><div className="fp-panel-foot"><Icon name="shield" size={15} /> Never share your verification code.</div>
            </>}

            {step === 3 && <>
              <div className="fp-icon-tile"><Icon name="lock" size={25} /></div><p className="fp-kicker">ALMOST THERE</p><h2>Create a new<br /><span>password.</span></h2><p className="fp-panel-copy">Choose a strong password you haven't used before. Keep your account safe and sound.</p>
              <form onSubmit={resetPassword} className="fp-form"><label htmlFor="fp-new-password">New password</label><div className="fp-input-wrap"><Icon name="lock" size={18} /><input id="fp-new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /><button className="fp-eye" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)}><Icon name={showPassword ? "eyeOff" : "eye"} size={18} /></button></div><div className="fp-strength"><div className="fp-strength-bars">{[1,2,3,4].map((n) => <span key={n} className={passwordScore >= n ? `strength-${passwordScore}` : ""} />)}</div><small>{newPassword ? ["Too weak", "Weak", "Fair", "Good", "Strong"][passwordScore] : "Password strength"}</small></div><label htmlFor="fp-confirm-password">Confirm password</label><div className="fp-input-wrap"><Icon name="lock" size={18} /><input id="fp-confirm-password" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Enter it again" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /><button className="fp-eye" type="button" aria-label={showConfirm ? "Hide password" : "Show password"} onClick={() => setShowConfirm((v) => !v)}><Icon name={showConfirm ? "eyeOff" : "eye"} size={18} /></button></div>{error && <p className="fp-error" role="alert">{error}</p>}<button className="fp-primary" type="submit" disabled={loading}>{loading ? <><span className="fp-spinner" /> Updating password...</> : <>Reset password <span>↗</span></>}</button></form>
              <button className="fp-back-link" type="button" onClick={() => { setStep(2); setError(""); }}><Icon name="arrow" size={17} /> Back to verification</button><div className="fp-panel-foot"><Icon name="shield" size={15} /> Use a unique password for PawMart.</div>
            </>}

            {step === 4 && <div className="fp-success"><div className="fp-success-mark"><Icon name="check" size={34} /></div><p className="fp-kicker">YOU’RE ALL SET</p><h2>Password<br /><span>updated!</span></h2><p className="fp-panel-copy">Your PawMart account is safe and ready for you. Time to get back to the good stuff.</p><div className="fp-success-note"><Icon name="shield" size={19} /><span><strong>All secure.</strong><small>Your password has been changed successfully.</small></span></div><button className="fp-primary" type="button" onClick={backToLogin}>Back to sign in <span>↗</span></button><div className="fp-panel-foot"><Icon name="paw" size={15} /> Welcome back to your happy place.</div></div>}
          </div>
          <p className="fp-copyright">© {new Date().getFullYear()} PawMart <span>•</span> Made with love for every paw.</p>
        </section>
      </section>
      <div className="fp-bottom-glow" aria-hidden="true" />
    </main>
  );
}

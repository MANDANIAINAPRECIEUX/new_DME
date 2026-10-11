import { SignIn } from "@clerk/react";
import "./LoginPage.css";

function LoginPage() {
  return (
    <div className="login-page">
      <SignIn routing="path" path="/login" afterSignInUrl="/" />
    </div>
  );
}

export default LoginPage;
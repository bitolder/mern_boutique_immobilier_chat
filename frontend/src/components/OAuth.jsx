import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../lib/firebase.js";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

export default function OAuth() {
  const navigate = useNavigate();
  const { google } = useAuthStore();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      google(result);

      navigate("/");
    } catch (error) {
      console.log("Could not sign with google", error);
    }
  };
  // const handleGoogleClick = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const auth = getAuth(app);
  //     const result = await signInWithPopup(auth, provider);

  //     const res = await fetch("/api/auth/google", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: result.user.displayName,
  //         email: result.user.email,
  //         photo: result.user.photoURL,
  //       }),
  //     });
  //     const data = await res.json();

  //     dispatch(signInSuccess(data));
  //     navigate("/");
  //   } catch (error) {
  //     console.log("Could not sign with google", error);
  //   }
  // };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="text-white bg-red-700 uppercase rounded-lg p-3 hover:opacity-85 disabled:opacity-60"
    >
      Continue with Google
    </button>
  );
}

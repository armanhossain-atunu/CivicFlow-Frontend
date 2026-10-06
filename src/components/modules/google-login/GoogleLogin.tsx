import { GoogleLogin } from "@react-oauth/google";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";
import { useRouter } from "next/dist/client/components/navigation";

export default function GoogleLoginComponent() {
  const { mutate: googleLogin } = useGoogleOAuth();
  const router = useRouter();
  // ------------------------------------------
  // Google OAuth Success
  // ------------------------------------------

  const handleGoogleLoginSuccess = (credentialResponse: {
    credential?: string;
  }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      handleGoogleLoginError();
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: (res) => {
          console.log(res);

          toast.add({
            title: "Google login successful",
            description: "Welcome to CivicFlow!",
            type: "success",
          });

          router.push("/");
        },

        onError: (err) => {
          toast.add({
            title: "Google login failed",
            description:
              err instanceof Error
                ? err.message
                : "Google login failed. Please try again.",
            type: "error",
          });
        },
      },
    );
  };

  // ------------------------------------------
  // Google OAuth Error
  // ------------------------------------------

  const handleGoogleLoginError = () => {
    toast.add({
      title: "Google OAuth failed",
      description: "Please try again.",
      type: "error",
    });
  };

  return (
    <GoogleLogin
      theme="outline"
      shape="pill"
      text="continue_with"
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginError}
      useOneTap={false}
    />
  );
}

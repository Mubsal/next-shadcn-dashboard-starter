import { FC, ReactNode } from "react";
import{ signIn } from "next-auth/react";
import { Button } from "./ui/button";
import googleLogo from '@/components/ui/Google_ G _logo.svg.png'; // replace with the actual path to your Google logo



interface GoogleSignInButtonProps {
    children?: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
    const signInWithGoogle = () => signIn("google", {callbackUrl: "http://localhost:3000/dashboard"});
       return (
       <Button
       
         onClick=  {signInWithGoogle}
         
         className="w-full">
         {children}
       </Button>
     );
   };


   export default GoogleSignInButton;

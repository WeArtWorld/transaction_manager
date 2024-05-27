import { AppProps } from "next/app";
import "../styles/globals.css";
import Sidebar from "../components/sideBar"; 
import { initializeApp, getApps } from "firebase/app";
import { useRouter } from "next/router";
import {
    getAuth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithRedirect,
    User,
} from "firebase/auth";
import { useEffect, useState } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyD_Goee3aXsWuQfhjCV39VbIrmTTpLm0Gc",
    authDomain: "transactions-man.firebaseapp.com",
    databaseURL: "https://transactions-man-default-rtdb.firebaseio.com",
    projectId: "transactions-man",
    storageBucket: "transactions-man.appspot.com",
    messagingSenderId: "997311695247",
    appId: "1:997311695247:web:098cfc7a82a23f6490e3fa"
    /*apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID*/
};


const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

const signInWithGoogle = () => signInWithRedirect(auth, googleProvider);
const signOut = () => auth.signOut();

function MyApp({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            const isAuthorizedUser = user && user.email && user.email.endsWith("@loriginal.org");

            if (!isAuthorizedUser) {
                signOut();
            } else {
                setUser(user);
            }
        });

        return () => unsubscribe();
    }, []);

    const registerWithEmail = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signInWithEmail = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    return (
        <>
            {user && <Sidebar user={user}></Sidebar>}
            <Component
                {...pageProps}
                user={user}
                signInWithGoogle={signInWithGoogle}
                signInWithEmail={signInWithEmail}
                registerWithEmail={registerWithEmail}
                signOut={signOut}
            />
        </>
    );
}

export default MyApp;

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
    apiKey: process.env.apiKey,
    authDomain:  process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

// Check if a Firebase app is already initialized
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

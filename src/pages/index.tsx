import React, { useState } from "react";
import { useRouter } from "next/router";

interface HomeProps {
    user: {
        email: string;
    };
    signInWithGoogle: () => void;
    signInWithEmail: (email: string, password: string) => Promise<any>;
    registerWithEmail: (email: string, password: string) => Promise<any>;
    signOut: () => void;
}

const Home: React.FC<HomeProps> = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = () => {
        props.registerWithEmail(email, password)
            .then(() => {
                router.push("/artists"); 
            })
            .catch((error) => {
                console.error("Error registering with email and password", error);
            });
    };

    const handleSignIn = () => {
        props.signInWithEmail(email, password)
            .then(() => {
                router.push("/artists"); 
            })
            .catch((error) => {
                console.error("Error signing in with email and password", error);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img
                className="max-h-80 hover:text-gray-100 hover:shadow-gray-100 p-10"
                src="../logo.png"
            />
            {props.user ? (
                <>
                    <span className="mb-4">
                        Signed in as: {props.user.email}
                    </span>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={props.signOut}
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mb-2 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={handleSignIn}
                    >
                        Sign In
                    </button>
            {/*        <button
                        className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                        onClick={props.signInWithGoogle}
                    >
                        Sign In with Google
            </button>*/}
                </>
            )}
        </div>
    );
};

export default Home;

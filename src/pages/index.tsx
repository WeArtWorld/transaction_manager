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
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleRegister = () => {
        setError(null); // Reset error before attempting registration
        props.registerWithEmail(email, password)
            .then(() => {
                router.push("/artists");
            })
            .catch((error) => {
                console.error("Error registering with email and password", error);
                setError("Error registering with email and password. Please try again.");
            });
    };

    const handleSignIn = () => {
        setError(null); // Reset error before attempting sign-in
        props.signInWithEmail(email, password)
            .then(() => {
                router.push("/artists");
            })
            .catch((error) => {
                console.error("Error signing in with email and password", error);
                setError("Incorrect username or password. Please try again.");
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
                    <span className="mb-4 text-black">
                        Signed in as: {props.user.email}
                    </span>
                </>
            ) : (
                <>
                    <div className="mb-4 flex flex-col space-y-2 w-80">
                        {error && <p className="text-red-500 text-xs italic">{error}</p>}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 text-black border border-gray-300 rounded w-full"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 text-black border border-gray-300 rounded w-full"
                        />
                    </div>

                    <button className="group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow" onClick={handleSignIn}>
                        <div className="absolute inset-0 w-3 bg-amber-400 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                        <span className="relative text-black group-hover:text-white">Sign In</span>
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

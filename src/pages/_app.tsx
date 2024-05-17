import { AppProps } from "next/app";
import "../styles/globals.css";
//import Header from "../components/header";
import Sidebar from "../components/sideBar";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="flex min-h-screen">
          <div className="fixed h-screen">
            <Sidebar />
          </div>
          <div className="flex-grow">
            <Component {...pageProps} />
          </div>
        </div>
      );
    }

export default MyApp;
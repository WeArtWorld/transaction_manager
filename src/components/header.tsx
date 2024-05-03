"use state";

import Link from "next/link";
import { useState } from "react";

interface MenuItem {
    name: string;
    path: string;
}

const menuItems: MenuItem[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transaction", path: "/transaction" },
    { name: "Artist", path: "/artist" },
    { name: "Volunteer", path: "/volunteer" },
];

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="fixed top-0 left-0 z-50 md:hidden">
            <p>okokoko</p>
            <button
                onClick={toggleMenu}
                className="block text-gray-500 hover:text-white focus:text-white focus:outline-none"
            >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
                    />
                </svg>
            </button>
            <nav
                className={`${
                    isMenuOpen ? "block" : "hidden"
                } absolute top-0 left-0 w-full bg-gray-900 text-white py-4 px-6`}
            >
                <ul className="flex flex-col space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link href={item.path}>
                                <span
                                    onClick={toggleMenu}
                                    className="py-2 px-4 hover:text-gray-300 cursor-pointer"
                                >
                                    {item.name}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Header;

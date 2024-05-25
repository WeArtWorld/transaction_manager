import Link from 'next/link';
import React, { ReactNode } from 'react';
import { MdOutlineVolunteerActivism } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { FaUserAlt } from "react-icons/fa";
import { IoDiamondOutline } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { User, getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import 'firebase/auth';

interface SidebarProps {
  children?: ReactNode;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ children, user }) => {

  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/').then(() => router.reload());
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className='flex'>
      <div className='fixed w-30 h-screen p-4 bg-white border-r-[2px] flex flex-col justify-between'>
        <div className='flex flex-col items-center'>
          <Link legacyBehavior href='/dashBoard'>
            <a className='bg-purple-800 text-white p-3 rounded-lg inline-block'>
              <IoDiamondOutline size={20} />
            </a>
          </Link>
          <span className='border-b-[1px] border-gray-200 w-full p-2'></span>
          <Link legacyBehavior href='/sales'>
            <a className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <GrTransaction style={{ color: '#333' }} size={20} />
            </a>
          </Link>
          <Link legacyBehavior href='/artists'>
            <a className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <FaUserAlt style={{ color: '#333' }} size={20} />
            </a>
          </Link>
          <Link legacyBehavior href='/volunteers'>
            <a className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <MdOutlineVolunteerActivism style={{ color: '#333' }} size={20} />
            </a>
          </Link>
        </div>

        <div className='flex flex-col items-center'>

          <Link legacyBehavior href='/settings'>
            <a className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <IoSettings style={{ color: '#333' }} size={20} />
            </a>
          </Link>

          <button
            className='bg-red-500 text-xs hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center'
            onClick={handleLogout}
          >
            <MdLogout style={{ color: '#333' }} size={20} className='mr-2' />
            
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Sidebar;

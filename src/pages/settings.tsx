import React, { useState } from 'react';
import { getAuth, updatePassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import withAuth from '@/components/withAuth';

const AdminPage: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const handleChangePassword = () => {
    if (user) {
      updatePassword(user, newPassword)
        .then(() => {
          alert('Password updated successfully');
          setNewPassword('');
        })
        .catch((error) => {
          alert('Error updating password: ' + error.message);
        });
    }
  };

  const handleRegisterNewUser = () => {
    createUserWithEmailAndPassword(auth, newEmail, newUserPassword)
      .then(() => {
        alert('New user registered successfully');
        setNewEmail('');
        setNewUserPassword('');
      })
      .catch((error) => {
        alert('Error registering new user: ' + error.message);
      });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl">You are not logged in.</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => router.push('/')}
        >
          Go to Login Page
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl text-black mb-4">Admin Page</h1>
      <div className="mb-4 text-black">
        <span>Logged in as: {user.email}</span>
      </div>
      <div className="mb-4 flex flex-col items-center">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-2 p-2 text-black border border-gray-300 rounded w-80"
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default withAuth(AdminPage);

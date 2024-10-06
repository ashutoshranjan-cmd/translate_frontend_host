import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

interface AboutMeProps {
  name?: string;
  title?: string;
  description?: string;
  birthday?: string;
  age?: number;
  residence?: string;
  address?: string;
  email?: string;
  phone?: string;
  skype?: string;
  freelance?: string;
  happyClients?: number;
  projectsCompleted?: number;
  photoCapture?: number;
  telephonicTalk?: number;
  totalAttempts?: number;
}

interface User {
  username: string;
  profile?: string;
  email: string;
  phone: string;
}

const AboutMe: React.FC<AboutMeProps> = ({
  title,
  description,
 
}) => {
  // const navigate = useNavigate();
  const [image, setImage] = useState<string>('');
  const [User, setUser] = useState<User|any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const userCookie = Cookies.get('user');
  useEffect(() => {
    try {
      if (userCookie) {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setImage(parsedUser.user.profile || '');
      }
    } catch (error) {
      console.error('Failed to parse user from cookies', error);
    }
  }, [userCookie]);

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };
  
  const confirmDeleteAccount = async () => {
    console.log('Attempting to delete account');
    try {
      // Get user ID (ensure User.user._id is defined and valid)
      const user_id = User.user?._id;  // Optional chaining in case User.user is undefined
      if (!user_id) {
        throw new Error('User ID is not available');
      }
      
      console.log(`Deleting user with ID: ${user_id}`);
  
      // Send DELETE request to the API
      const response = await axios.delete(`/api/users/delete/${user_id}`);
      
      // Check response status or message if necessary
      console.log('Account deleted successfully:', response.data);
  
      // Remove cookie
      Cookies.remove('user');
  
      // Redirect to home page
      setTimeout(()=>{window.location.href = "/"},1000)
  
      // Optionally hide delete confirmation dialog if applicable
      setShowDeleteConfirmation(false);
  
    } catch (error) {
      // Log the error and optionally show a user-friendly message
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again later.');
    }
  };
  

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-[10rem] relative"
    >
      <h1 className="text-4xl font-bold text-black-700 mb-2">About Me</h1>
      <h2 className="text-xl text-red-500 mb-6">{title}</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-48 h-48 bg-gray-300 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0"
        >
          <img src={image} alt="" className="object-cover w-full h-full" />
        </motion.div>
        <div className="flex-grow flex justify-between items-start">
          <div className="space-y-4">
            <p className="text-2xl font-semibold">{User?.user.username}</p>
            <p className="text-xl">{User?.user.email}</p>
            <p className="text-xl">{User?.user.phone}</p>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mt-6 mb-8">{description}</p>


      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 bg-red-500 text-white  px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors"
        onClick={handleDeleteAccount}
      >
        Delete Account
      </motion.button>

      <AnimatePresence>
        {showDeleteConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4">Are you sure you want to delete your account?</h3>
              <p className="mb-6">This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  No, Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  onClick={confirmDeleteAccount}
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AboutMe;
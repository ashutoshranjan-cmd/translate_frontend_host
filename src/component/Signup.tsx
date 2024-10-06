import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { useSignup } from '../hooks/useSignup';

interface Props {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const Signup: React.FC<Props> = ({ visible, setVisible }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const { signup, isLoading} = useSignup();

  const submitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;
    const phone = numberRef.current?.value;
    const photo = photoRef.current?.files?.[0];

    if (!username || !email || !password || !confirmPassword || !phone || !photo) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('photo', photo);

      const errorValue = await signup(formData);
      console.log(errorValue);
      

      toast.success('Signup successful');
      setVisible(false);
      setTimeout(()=>{

        window.location.href = '/'
      },1000)
    } catch (error) {
      toast.error('Signup failed');
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Sign up</h2>
            <form onSubmit={submitHandle} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input ref={nameRef} type="text" id="name" name="name" className="mt-1  block w-full rounded-md h-[2rem] text-black px-2 outline-none border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Enter your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input ref={emailRef} type="email" id="email" name="email" className="mt-1 block w-full rounded-md h-[2rem] text-black px-2 outline-none border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input ref={passwordRef} type="password" id="password" name="password" className="mt-1 block w-full rounded-md h-[2rem] text-black px-2 outline-none border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Enter your password" />
              </div>
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input ref={confirmPasswordRef} type="password" id="confirm_password" name="confirm_password" className="mt-1 block w-full rounded-md h-[2rem] text-black px-2 outline-none border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Confirm your password" />
              </div>
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input ref={numberRef} type="text" id="number" name="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-[2rem] text-black px-2 outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Enter your phone number" />
              </div>
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <input ref={photoRef} type="file" id="photo" name="photo" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Signing up...' : 'Submit'}
                </motion.button>
              </div>
            </form>
           { /*{error && <p className="mt-4 text-red-500">{error}</p>}*/}
          </motion.div>
        </motion.div>
      )}
      <Toaster />
    </AnimatePresence>
  );
};

export default Signup;
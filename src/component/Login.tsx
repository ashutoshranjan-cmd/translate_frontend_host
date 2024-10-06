import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useLogin } from '../hooks/useLogin';
import Signup from './Signup';
import { Eye, EyeOff } from 'lucide-react';
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const Login: React.FC<Props> = ({ open, setOpen }) => {
  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const notify1 = () => toast('Login successful');
  const notify2 = () => toast('invalid user or password')

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (email && password) {
       const flag = await login(email, password);
       console.log(flag);
       
      if(!flag) {
        notify2();
      } else {
        notify1();
        navigate('/');
      }
      
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const signupHandler = () => {
    setOpen(false);
    setVisible(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const forgetPasswordHandler = ()=>{
    window.location.href ='/forget'
  }

  return (
    <>
      <Signup visible={visible} setVisible={setVisible} />
      <AnimatePresence>
        {open && (
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
              <h2 className="text-2xl font-bold mb-4">Login</h2>
              <form onSubmit={submitHandler}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="mb-6 relative">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-black">
                    New user? Click{' '}
                    <button
                      type="button"
                      onClick={signupHandler}
                      className="text-blue-500 hover:text-blue-700 font-bold"
                    >
                      Sign Up
                    </button>
                  </p>
                  <p className="text-sm text-black">
                    <button
                      type="button"
                      onClick={forgetPasswordHandler}
                      className="text-blue-500 hover:text-blue-700 font-bold"
                    >
                      Forget Password
                    </button>
                 
                  </p>
                </div>
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleClose}
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-red-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </>
  );
};

export default Login;
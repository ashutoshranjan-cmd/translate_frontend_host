import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './Login';
import SideBox from './SideBox';

const Header = () => {
  // const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSideBoxOpen, setIsSideBoxOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
 
  const userCookie = Cookies.get('user');
  useEffect(() => {
    const fetchUser = () => {
      try {
        const userData = userCookie ? JSON.parse(userCookie) : null;
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse user from cookies", error);
      }
    };

    fetchUser();
  }, [userCookie]);

  const handleLoginClick = () => setIsLoginOpen(true);
  const handleProfileClick = () => setIsSideBoxOpen(true);

  // const handleLoginSuccess = (userData:any) => {
  //   setUser(userData);
  //   setIsLoginOpen(false);
  // };

  return (
    <motion.header
      className="bg-blue-600 text-white fixed top-0 right-0 left-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <motion.h1
            className="text-2xl font-bold uppercase"
            whileHover={{ scale: 1.05 }}
          >
            Learningo
          </motion.h1>
          
          <nav className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="font-bold">HOME</Link>
            </motion.div>
            
            {user ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileClick}
                className="flex items-center"
              >
                <img
                  src={user.user.profile}
                  alt="User profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className="font-bold"
              >
                Log In
              </motion.button>
            )}
          </nav>
        </div>
      </div>

      {/* <Login open={isLoginOpen} setOpen={setIsLoginOpen} onLoginSuccess={handleLoginSuccess} /> */}
      <Login open={isLoginOpen} setOpen={setIsLoginOpen}  />
      <SideBox open={isSideBoxOpen} onClose={() => setIsSideBoxOpen(false)} />
    </motion.header>
  );
};

export default Header;
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, Toaster } from 'react-hot-toast';
import {loadStripe} from '@stripe/stripe-js';

const languages = [
  { name: "Japanese", code: "ja" },
  { name: "Hindi", code: "hi" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
];

const Home = () => {
  const navigate = useNavigate();
  const user = Cookies.get('user');

  const notify = () => toast('Please login first');

  const languageSelectHandler = (language: any) => {
    if (user) {
      navigate(`/learn?language=${language}`);
    } else {
      notify();
    }
  };

  const makePayment = async () => {
    try {
      const stripe:any = await loadStripe("pk_test_51PbRzn2NvV01L85tyV1c9LXiFivix9VnXxsC4apuDTkD72nzqE8V75ok9FdZJoJ1JiJCmx5GzPhicB7AQCE9tdhT00rbN5xOpS");
  
      const body = {
        amount: 100,
        currency: 'usd',
      };
  
      const headers = {
        "Content-Type": "application/json",
      };
  
      const response = await fetch("/pay/payment/createpayment", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
  
      const { id: sessionId } = await response.json();
  
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });
  
      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-blue-800 mb-8 text-center"
      >
        Welcome, Begin your journey of learning
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        {languages.map((lang, index) => (
          <motion.button
            key={lang.code}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => languageSelectHandler(lang.code)}
            className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold shadow-lg hover:bg-blue-600 transition-colors duration-300"
          >
            {lang.name}
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-blue-700 text-center mb-12"
      >
        Choose one language from above
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        onClick={() => makePayment()}
        className="fixed bottom-8 right-8 bg-yellow-400 text-yellow-800 px-4 py-2 rounded-full font-bold shadow-lg hover:bg-yellow-300 transition-colors duration-300"
      >
        Buy me a coffee ☕
      </motion.button>

      <Toaster />
      {/* <Footer/> */}
    </div>
  );
};

export default Home;
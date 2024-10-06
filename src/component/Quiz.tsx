import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { saveResult } from "../redux/slices";
import LoadingBar from 'react-top-loading-bar';

const Quiz = () => {
  const [result, setResult] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [ans, setAns] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loadingBarRef = useRef<any>(null);

  const { words } = useSelector((state:any) => state.root);

  const nextHandler = () => {
    setResult((prev:any) => [...prev, ans]);
    setCount((prev) => prev + 1);
    loadingBarRef.current?.complete();
    setAns("");
  };

  useEffect(() => {
    if (count + 1 > words.length) navigate("/result");
    dispatch(saveResult(result));
  }, [result]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 mt-20 max-w-2xl"
    >
      <LoadingBar color="orange" ref={loadingBarRef} />

      <h1 className="text-3xl font-bold mb-8 text-center">Quiz</h1>

      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">
            {count + 1}. {words[count]?.word}
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Meaning</h3>
            <div className="space-y-2">
              {words[count]?.options.map((option:any, idx:number) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-50">
                    <input
                      type="radio"
                      value={option}
                      checked={ans === option}
                      onChange={(e) => setAns(e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-lg text-white font-semibold ${
          ans === "" ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
        }`}
        onClick={nextHandler}
        disabled={ans === ""}
      >
        {count === words.length - 1 ? "Submit" : "Next"}
      </motion.button>
    </motion.div>
  );
};

export default Quiz;
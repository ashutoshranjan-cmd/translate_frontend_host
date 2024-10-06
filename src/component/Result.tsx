import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { clearState } from "../redux/slices";
import { countMatchingElements } from "../utils/features";

const Result = () => {
  const { words, result } = useSelector((state:any) => state.root);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const correctAns = countMatchingElements(
    result,
    words.map((i:any) => i.meaning)
  );
  const percentage = (correctAns / words.length) * 100;

  const resetHandler = () => {
    navigate("/");
    dispatch(clearState());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 mt-20 max-w-4xl"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Result</h1>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow-lg rounded-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">
          You got {correctAns} right out of {words?.length}
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <motion.div
            className="bg-blue-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>
        <p className={`text-2xl font-bold ${percentage > 50 ? 'text-green-500' : 'text-red-500'}`}>
          {percentage > 50 ? "Pass" : "Fail"}
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between gap-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1"
        >
          <h3 className="text-xl font-semibold mb-4">Your Answers</h3>
          <ul className="space-y-2">
            {result.map((answer:any, idx:number) => (
              <li key={idx} className="bg-gray-100 p-3 rounded">
                <span className="font-medium">{idx + 1}.</span> {answer}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex-1"
        >
          <h3 className="text-xl font-semibold mb-4">Correct Answers</h3>
          <ul className="space-y-2">
            {words?.map((word:any, idx:number) => (
              <li key={idx} className="bg-gray-100 p-3 rounded">
                <span className="font-medium">{idx + 1}.</span> {word.meaning}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
        onClick={resetHandler}
      >
        Reset
      </motion.button>
    </motion.div>
  );
};

export default Result;
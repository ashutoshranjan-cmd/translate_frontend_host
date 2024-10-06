import  { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { translateWords, fetchAudio } from "../utils/features";
import { clearState, getWordsFail, getWordsRequest, getWordsSuccess } from "../redux/slices";
import LoadingBar from 'react-top-loading-bar';
import Loader from "./Loader";

const Learning = () => {
  const [count, setCount] = useState(0);
  const [audioSrc, setAudioSrc] = useState("");
  const audioRef = useRef<any>(null);
  const params = useSearchParams()[0].get("language");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loadingBarRef = useRef<any>(null);

  const { loading, error, words } = useSelector((state:any) => state.root);

  useEffect(() => {
    dispatch(getWordsRequest());
    translateWords(params || "hi")
      .then((arr) => {
        dispatch(getWordsSuccess(arr));
      })
      .catch((err) => {
        dispatch(getWordsFail(err));
        if (error) alert(error);
        dispatch(clearState());
      });
  }, []);

  const nextHandler = () => {
    setCount((prev) => prev + 1);
    loadingBarRef.current?.complete();
    setAudioSrc("");
  };

  const audioHandler = async () => {
    const player = audioRef.current;
    if (player) {
      player.play();
    } else {
      const data = await fetchAudio(words[count]?.meaning, params);
      setAudioSrc(data);
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 mt-20"
    >
      <LoadingBar color="orange" ref={loadingBarRef} />
      {audioSrc && <audio src={audioSrc} autoPlay ref={audioRef}></audio>}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-8 flex items-center text-blue-500"
        onClick={count === 0 ? () => navigate("/") : () => { setCount((prev) => prev - 1); setAudioSrc(""); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </motion.button>

      <h1 className="text-3xl font-bold mb-8 text-center">Learning made easy</h1>

      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-semibold">{count + 1}.</span>
              <span className="text-2xl ml-2">{words[count]?.word}</span>
            </div>
            <span className="text-2xl text-blue-500">{words[count]?.meaning}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-4 bg-blue-500 text-white p-2 rounded-full"
            onClick={audioHandler}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </motion.button>
        </motion.div>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-lg text-white font-semibold ${count === 7 ? 'bg-green-500' : 'bg-blue-500'}`}
        onClick={count === 7 ? () => navigate("/quiz") : nextHandler}
      >
        {count === 7 ? "Start Quiz" : "Next Word"}
      </motion.button>
    </motion.div>
  );
};

export default Learning;
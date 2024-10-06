import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Header from "./component/Header"
import {Suspense, lazy} from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {useSelector } from "react-redux";
import Private from "./component/Private";





const Home = lazy(()=> import("./component/Home"));
const Learning = lazy(()=> import("./component/Learning"))
const Quiz = lazy(()=> import("./component/Quiz"))
const Result = lazy(() => import("./component/Result"))
const Loader = lazy(() => import("./component/Loader"))
const About = lazy(()=> import("./component/About"))
const Forget = lazy(()=> import("./component/Forget") )
const Password = lazy(()=> import("./component/UpdatePassword"))

function App() {
  const {darkMode} = useSelector((state:{root:StateType})=>state.root)
  const darkTheme = createTheme({
    palette: {
      mode: `${darkMode?"dark":"light"}`,
      primary:{
        main:`${darkMode?"#BB86FC":"rgb(255,0,0)"}`,
      }
    },

  });
  return (

    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    <Router>
      <Suspense fallback={<Loader/>}>
      <Header/>
      <Routes>
      
        <Route element={<Private/>}>
        <Route path="/learn" element={<Learning/>} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route  path="/result" element={<Result/>}/>
        <Route  path="/about" element={<About/>}/>
        </Route>
        <Route path="/" element={<Home/>} />
        <Route path="/forget" element={<Forget/>} />
        <Route path="/update" element={<Password/>} />

        {/* <Route  path="/login" element={<Login/>}/> */}
      </Routes>
      </Suspense>
        {/* <Footer/> */}
    </Router>
     </ThemeProvider>
   
  )
}

export default App

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Debut from "./pages/Debut";
import Fearless from "./pages/Fearless";
import SpeakNow from "./pages/SpeakNow";
import Red from "./pages/Red";
import NineteenEightyNine from "./pages/1989";
import Reputation from "./pages/Reputation";
import Lover from "./pages/Lover";
import Folklore from "./pages/Folklore";
import Evermore from "./pages/Evermore";
import Midnights from "./pages/Midnights";
import TTPD from "./pages/TTPD";
import Showgirl from "./pages/Showgirl";
import FearlessGallery from "./pages/Fearless/FearlessGallery";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/debut" element={<Debut />} />
        <Route path="/fearless" element={<Fearless />} />
        <Route path="/fearless-gallery" element={<FearlessGallery />} />
        <Route path="/speak-now" element={<SpeakNow />} />
        <Route path="/red" element={<Red />} />
        <Route path="/1989" element={<NineteenEightyNine />} />
        <Route path="/reputation" element={<Reputation />} />
        <Route path="/lover" element={<Lover />} />
        <Route path="/folklore" element={<Folklore />} />
        <Route path="/evermore" element={<Evermore />} />
        <Route path="/midnights" element={<Midnights />} />
        <Route path="/ttpd" element={<TTPD />} />
        <Route path="/showgirl" element={<Showgirl />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
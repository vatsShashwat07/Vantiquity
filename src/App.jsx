import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Results from './pages/Results'
import Pricing from './pages/Pricing'
import History from './pages/History'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import DpdpaNotice from './pages/DpdpaNotice'
import HelpCenter from './pages/HelpCenter'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/results" element={<Results />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/history" element={<History />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dpdpa" element={<DpdpaNotice />} />
            <Route path="/help" element={<HelpCenter />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import CharacterDetails from './pages/CharacterDetails/CharacterDetails'
import SearchResults from './pages/SearchResults/SearchResults'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/character/:id" element={<CharacterDetails />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Layout>
  )
}

export default App

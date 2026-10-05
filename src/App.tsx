import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BusinessPage } from './pages/BusinessPage'
import { EventsPage } from './pages/EventsPage'
import { HomePage } from './pages/HomePage'
import { VideoPage } from './pages/VideoPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

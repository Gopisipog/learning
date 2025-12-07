import { useState } from 'react'
import YouTubeTextGenerator from './components/YouTubeTextGenerator'
import VideoToTextConverter from './components/VideoToTextConverter'
import VideoToMp3Converter from './components/VideoToMp3Converter'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('youtube')

  return (
    <div className="App">
      <nav className="app-nav">
        <button
          className={`nav-tab ${activeTab === 'youtube' ? 'active' : ''}`}
          onClick={() => setActiveTab('youtube')}
        >
          🎥 YouTube Transcriber
        </button>
        <button
          className={`nav-tab ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          🎬 Video to Text
        </button>
        <button
          className={`nav-tab ${activeTab === 'mp3' ? 'active' : ''}`}
          onClick={() => setActiveTab('mp3')}
        >
          🎵 Video to MP3
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'youtube' && <YouTubeTextGenerator />}
        {activeTab === 'video' && <VideoToTextConverter />}
        {activeTab === 'mp3' && <VideoToMp3Converter />}
      </main>
    </div>
  )
}

export default App


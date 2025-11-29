import { useState } from 'react'
import JobsListing from './components/JobsListing'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Upwork Jobs Listing</h1>
        <p>Search for .NET, React, and Angular jobs</p>
      </header>
      <main className="app-main">
        <JobsListing />
      </main>
    </div>
  )
}

export default App


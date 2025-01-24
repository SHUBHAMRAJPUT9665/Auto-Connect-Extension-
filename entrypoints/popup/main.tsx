import React from 'react';
import ReactDOM from 'react-dom/client';
import './popup.css';
import { FaLinkedin } from 'react-icons/fa6';


const App = () => {
  const handleStart = () => {
    window.open('https://www.linkedin.com/mynetwork/grow/', '_blank');

    // // Logic to send a message to the content script to start connecting
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   if (tabs[0]) {
    //     chrome.tabs.sendMessage(tabs[0].id as number, { action: 'connect' });
    //   }
    // });
  };
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <FaLinkedin style={{ fontSize: '2rem', color: '#0073b1' }} />
      <h1 style={{ fontSize: '1.5rem', margin: '10px 0' }}>LinkedIn Auto Connect</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={handleStart}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0073b1',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s',
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

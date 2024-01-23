import React, { useRef, useReducer, useState } from 'react';
import './App.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        color: action.payload.color,
        background: action.payload.background,
        errorMessage: action.payload.errorMessage,
      };
    default:
      return state;
  }
};

const invertColor = (hex) => {
  return '#' + (0xFFFFFF - parseInt(hex.slice(1), 16)).toString(16).padStart(6, '0');
};

function App() {
  const [state, dispatch] = useReducer(reducer, {
    color: '#000000',
    background: '#ffffff',
    errorMessage: '',
  });
  const input = useRef(null);
  const [notification, setNotification] = useState('');

  const handleSubmit = () => {
    const inputColor = input.current.value;

    const isColorValid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputColor);

    const comboColor = isColorValid ? invertColor(inputColor) : 'white';

    dispatch({
      type: 'update',
      payload: {
        color: isColorValid ? inputColor : 'black',
        background: isColorValid ? comboColor : 'white',
        errorMessage: isColorValid ? '' : 'Wrong input color!',
      },
    });

    input.current.value = '';
  };

  const handleCopyText = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    setNotification(`${text} copied to clipboard!`);
    setTimeout(() => {
      setNotification('');
    }, 2000);
  };

  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <nav>
        <h1>Combo Finder</h1>
      </nav>

      <main style={{ background: state.background }}>
        <div>
          <h3 style={{ color: state.color, display: 'inline-block', marginRight: '10px' }}>{state.errorMessage || "Text/input Color: " +  state.color}</h3>
          <button onClick={() => handleCopyText(state.color)} style={{ background: state.color, color: state.background }}>Copy</button>
        </div>
        <div>
          <h3 style={{ color: state.color, display: 'inline-block', marginRight: '10px' }}>{state.errorMessage || "Background Color: " +  state.background}</h3>
          <button onClick={() => handleCopyText(state.background)} style={{ background: state.color, color: state.background }}>Copy</button>
        </div>
        <input
          placeholder='Input Hex Code...'
          type="text"
          ref={input}
        />
        <button onClick={handleSubmit} style={{ background: state.color, color: state.background }}>Submit</button>
      </main>

      {notification && (
        <div style={{ position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)', backgroundColor: state.color, padding: '10px', borderRadius: '5px', color: state.background }}>
          {notification}
        </div>
      )}
    </div>
  );
}

export default App;

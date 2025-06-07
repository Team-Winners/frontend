import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const fetchResult = async () => {
    setLoading(true);
    try {
      const data = await fetch('https://backend-y8rv.onrender.com');
      const r = await data.text();
      setResponse(r);
    } catch (e) {
      setResponse('Error: ' + e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult()
  }, [])

  return (
    <>
      <p className='text-blue-500'>Hello World</p>
      {loading ? <p>Loading....</p> : <div className='text-5xl mt-2 text-red-500'>{response}</div>}
    </>
  )
}

export default App

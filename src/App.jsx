import React from 'react';

const App = () => {
    console.log(import.meta.env.VITE_HOST);
    console.log(process.env.API_KEY);
    console.log(import.meta.env.VITE_HELLO_KEY);
    console.log(process.env.HELLO_WORLD);
  return (
    <h1 style={{backgrounColor:"green"}}>
        Welcome TO vite React SHopify Project</h1>
  )
}

export default App;
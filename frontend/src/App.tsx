import { useState } from 'react'
import { Button } from './components/ui/button'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-3xl font-bold mb-4">Vite + React</h1>
        <Button onClick={() => setCount((count) => count + 1)}>count is: {count}</Button>
      </main>
    </>
  )
}

export default App

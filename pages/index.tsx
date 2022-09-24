import type { NextPage } from 'next'
import Editor from '@monaco-editor/react'
import { useState, useRef, useEffect } from 'react'

import files from './data/files'

const Home: NextPage = () => {
  const editorRef = useRef(null)
  const [fileName, setFileName] = useState('script.js')

  const file = files[fileName]

  useEffect(() => {
    editorRef.current?.focus()
  }, [file.name])

  return (
    <div>
      <button
        disabled={fileName === 'script.js'}
        onClick={() => setFileName('script.js')}
      >
        script.js
      </button>
      <button
        disabled={fileName === 'style.css'}
        onClick={() => setFileName('style.css')}
      >
        style.css
      </button>
      <button
        disabled={fileName === 'index.html'}
        onClick={() => setFileName('index.html')}
      >
        index.html
      </button>
      <Editor
        height="80vh"
        theme="vs-dark"
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
        onMount={(editor) => (editorRef.current = editor)}
      />
    </div>
  )
}

export default Home

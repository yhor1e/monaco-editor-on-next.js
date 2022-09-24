import type { NextPage } from 'next'
import Editor from '@monaco-editor/react'
import { useState, useRef, useEffect } from 'react'
import type { editor } from 'monaco-editor'

import files from './data/files'

const Home: NextPage = () => {
  const editorRef = useRef(null)
  const [fileName, setFileName] = useState('script.js')
  const [lang, setLang] = useState('')

  const file = files[fileName]

  useEffect(() => {
    editorRef.current?.focus()
  }, [file.name])

  const onMountHandler = (editor: editor.IStandaloneCodeEditor) => {
    setLang(editor.getModel()?.getLanguageId())
    editor.onDidChangeModel(({ newModelUrl }) => {
      setLang(editor.getModel()?.getLanguageId())
    })
    editorRef.current = editor
  }

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
      <p>lang: {lang}</p>
      <Editor
        height="80vh"
        theme="vs-dark"
        path={file.name}
        /* defaultLanguage={file.language} */
        defaultValue={file.value}
        onMount={onMountHandler}
      />
    </div>
  )
}

export default Home

import type { NextPage } from 'next'
import Editor, { Monaco, useMonaco } from '@monaco-editor/react'
import { useState, useRef, useEffect } from 'react'
import type { editor } from 'monaco-editor'

import sourcefiles from './data/files'

const Home: NextPage = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null)
  const monacoRef = useRef<Monaco>(null)
  const [fileName, setFileName] = useState('script.js')
  const [files, setFiles] = useState(sourcefiles)
  const [lang, setLang] = useState('')
  const [langs, setLangs] = useState([])
  const filesRef = useRef({})
  filesRef.current = files
  const file = files[fileName]
  useEffect(() => {
    editorRef.current?.focus()
  }, [file.name])

  const onMountHandler = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    setLang(editor.getModel()?.getLanguageId())
    setLangs(monaco.languages.getLanguages())
    editor.onDidChangeModel(({ newModelUrl }) => {
      setLang(editor.getModel()?.getLanguageId())
    })
    editor.onDidBlurEditorText((...args) => {
      setFiles((files) => {
        return {
          ...files,
          ...{
            [`${editor.getModel()?.uri.path.replace('/', '')}`]: {
              name: files[`${editor.getModel()?.uri.path.replace('/', '')}`]
                .name,
              language:
                files[`${editor.getModel()?.uri.path.replace('/', '')}`]
                  .language,
              value: editor.getModel()?.getValue(),
            },
          },
        }
      })
    })
    editorRef.current = editor
    monacoRef.current = monaco
  }
  const renderLangsList = () => {
    return (
      <select
        value={lang}
        onChange={(e) => {
          const langId = e.target.value
          setLang(langId)
          monacoRef.current?.editor.setModelLanguage(
            editorRef.current?.getModel(),
            langId
          )
        }}
      >
        {langs.map((e) => (
          <option key={e.id}>{e.id}</option>
        ))}
      </select>
    )
  }
  const renderButtons = () => {
    return Object.keys(files).map((key) => (
      <button
        key={key}
        disabled={fileName === key}
        onClick={() => setFileName(key)}
      >
        {key}
      </button>
    ))
  }
  return (
    <div>
      <div>{renderLangsList()}</div>
      {renderButtons()}
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

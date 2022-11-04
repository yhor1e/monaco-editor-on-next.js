import type { NextPage } from 'next'
import Editor, { Monaco } from '@monaco-editor/react'
import { useState, useRef, useEffect } from 'react'
import type { editor, languages } from 'monaco-editor'

import sourcefiles from './data/files'

const EditorPage: NextPage = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const [fileName, setFileName] = useState<string>('script.js')
  const [files, setFiles] = useState<{
    [key: string]: {
      name: string
      language: string
      value: string
    }
  }>(sourcefiles)
  const [lang, setLang] = useState<string>('')
  const [langs, setLangs] = useState<languages.ILanguageExtensionPoint[]>([])
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
    const langId = editor.getModel()?.getLanguageId()
    if (langId) setLang(langId)
    setLangs(monaco.languages.getLanguages())
    editor.onDidChangeModel(({ newModelUrl }) => {
      const langId = editor.getModel()?.getLanguageId()
      if (langId) setLang(langId)
    })
    editor.onDidBlurEditorText((...args) => {
      setFiles((files) => {
        const model = editor.getModel()
        if (!model) return files
        return {
          ...files,
          ...{
            [`${model.uri.path.replace('/', '')}`]: {
              name: files[`${model.uri.path.replace('/', '')}`].name,
              language: files[`${model?.uri.path.replace('/', '')}`].language,
              value: model?.getValue(),
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
          const model = editorRef.current?.getModel()
          if (model) {
            setLang(langId)
            monacoRef.current?.editor.setModelLanguage(model, langId)
          }
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

export default EditorPage

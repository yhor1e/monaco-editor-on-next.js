import type { NextPage } from 'next'
import Editor, { DiffEditor, Monaco } from '@monaco-editor/react'
import { useState, useRef, useEffect } from 'react'
import type { editor, languages } from 'monaco-editor'

import sourcefiles from './data/files'

const EditorAndDiffEditorPage: NextPage = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const [isMount, setIsMount] = useState<Boolean>(false)
  const diffEditorRef = useRef<editor.IDiffEditor | null>(null)
  const [fileName, setFileName] = useState<string>('style.css')
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

  //useEffect(() => {
  //  editorRef.current?.focus()
  //}, [file.name])

  const onMountHandler = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    const langId = editor.getModel()?.getLanguageId()
    if (langId) setLang(langId)
    setLangs(monaco.languages.getLanguages())

    editor.onDidChangeModel(({ newModelUrl }) => {
      console.log('editor model changed')
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
  const onDiffMountHandler = (editor: editor.IDiffEditor, monaco: Monaco) => {
    const modifiedEditor = editor.getModifiedEditor()
    editor.onDidUpdateDiff((e) => {
      console.log(e)
    })

    modifiedEditor.onDidChangeModel(({ newModelUrl }) => {
      console.log('diffEditor model changed')
    })

    modifiedEditor.onDidBlurEditorText((...args) => {
      setFiles((files) => {
        const model = modifiedEditor.getModel()
        console.log(model.uri)

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
    diffEditorRef.current = editor
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
        onClick={() => {
          setFileName(key)
          setIsMount(true)
        }}
      >
        {key}
      </button>
    ))
  }
  return (
    <div>
      <button
        onClick={() => {
          setIsMount(true)
        }}
      >
        mount diffeditor
      </button>
      <button
        onClick={() => {
          setIsMount(false)
        }}
      >
        ummount diffeditor
      </button>

      <div>{renderLangsList()}</div>
      {renderButtons()}
      <p>lang: {lang}</p>
      <div style={{ display: 'flex' }}>
        <Editor
          height="80vh"
          width="45vw"
          theme="vs-dark"
          path={file.name}
          value={file.value}
          defaultValue={file.value}
          onMount={onMountHandler}
        />
        {console.log('file.value:', file.value)}
        {isMount && (
          <DiffEditor
            options={{ renderSideBySide: false }}
            height="80vh"
            width="45vw"
            theme="vs-dark"
            language={lang}
            original={''}
            modifiedModelPath={`${file.name}?diff`}
            modified={file.value}
            onMount={onDiffMountHandler}
          />
        )}
      </div>
    </div>
  )
}

export default EditorAndDiffEditorPage

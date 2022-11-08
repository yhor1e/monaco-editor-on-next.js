import type { NextPage } from 'next'
import React, { useRef } from 'react'
import { DiffEditor } from '@monaco-editor/react'
import type { editor, languages } from 'monaco-editor'

const Diff: NextPage = () => {
  const diffEditorRef = useRef<editor.IDiffEditor>(null)

  function handleEditorDidMount(editor, monaco) {
    diffEditorRef.current = editor
  }

  function showOriginalValue() {
    alert(diffEditorRef.current.getOriginalEditor().getValue())
  }

  function showModifiedValue() {
    alert(diffEditorRef.current.getModifiedEditor().getValue())
  }

  return (
    <>
      <button onClick={showOriginalValue}>show original value</button>
      <button onClick={showModifiedValue}>show modified value</button>
      <DiffEditor
        height="90vh"
        language="javascript"
        original="// the original code"
        modified="// the modified code"
        onMount={handleEditorDidMount}
      />
    </>
  )
}
export default Diff

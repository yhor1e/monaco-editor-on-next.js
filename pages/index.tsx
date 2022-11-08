import type { NextPage } from 'next'
import Editor, { Monaco, useMonaco } from '@monaco-editor/react'
import { useState, useRef, useEffect } from 'react'
import type { editor } from 'monaco-editor'

import sourcefiles from './data/files'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/editor">Multi modle editor + change language sample</Link>
      </li>
      <li>
        <Link href="/resizable">Resizable layout by DnD</Link>
      </li>
    </ul>
  )
}

export default Home

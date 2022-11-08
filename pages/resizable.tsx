import type { NextPage } from 'next'
import { useState } from 'react'

const ResizablePage: NextPage = () => {
  const [horizontalFlexPositon, sethorizontalFlexPositon] = useState<number[]>([
    33, 34, 67, 68, 100,
  ])

  return (
    <div className="columns">
      <div className="column" style={{ flex: `${horizontalFlexPositon[0]}%` }}>
        Column 1: Put any relevant content here
      </div>
      <div
        style={{
          flex: `${horizontalFlexPositon[1] - horizontalFlexPositon[0]}%`,
        }}
        onDrag={(e) => {
          console.log('onDrag')
          console.log(e.screenX)
          console.log(window.innerWidth)
          console.log((e.screenX / window.innerWidth) * 100)
          sethorizontalFlexPositon((prev) => {
            const current = [...prev]
            if (
              (e.clientX / window.innerWidth) * 100 > 10 &&
              (e.clientX / window.innerWidth) * 100 < current[2] - 10
            ) {
              current[0] = (e.clientX / window.innerWidth) * 100 - 1
              current[1] = (e.clientX / window.innerWidth) * 100
              console.log(current)
            }
            return current
          })
        }}
        className="diviver"
      ></div>
      <div
        className="column"
        style={{
          flex: `${horizontalFlexPositon[2] - horizontalFlexPositon[1]}%`,
        }}
      >
        Column 2: Put any relevant content here{' '}
      </div>
      <div
        className="diviver"
        style={{
          flex: `${horizontalFlexPositon[3] - horizontalFlexPositon[2]}%`,
        }}
      ></div>
      <div
        className="column"
        style={{
          flex: `${horizontalFlexPositon[4] - horizontalFlexPositon[3]}%`,
        }}
      >
        Column 3: Put any relevant content here
      </div>
    </div>
  )
}

export default ResizablePage

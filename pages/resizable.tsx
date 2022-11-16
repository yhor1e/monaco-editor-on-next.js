import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'

const ResizablePage: NextPage = () => {
  const initFraction = [20, 40, 40]
  const [colFraction, setColFraction] = useState<number[]>([])
  const refContainer = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState<Boolean>(false)

  const resizeHandler = () => {
    console.log('resize')
  }

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => {
      return window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  useEffect(() => {
    if (isDragging) {
    } else {
    }
  }, [isDragging])

  useEffect(() => {
    if (!refContainer.current) return
    const width = Number(
      window.getComputedStyle(refContainer.current).width.replace('px', '')
    )
    const elmentsWidth = initFraction.map((w) => (width * w) / 100)
    const modified = elmentsWidth.map((width, index) => {
      return elmentsWidth.slice(0, index + 1).reduce((acc, value) => {
        return acc + value
      }, 0)
    })
    setColFraction(modified)
  }, [refContainer.current])

  const onDragHandler = (e) => {
    //if (!isDragging) return
    if (e.clientX === 0) return
    const pos = Number(e.target.getAttribute('data-diviver-pos'))
    setColFraction((prev) => {
      const modified = [0, ...prev]
      if (modified[pos - 1] < e.clientX && modified[pos + 1] > e.clientX) {
        modified[pos] = e.clientX
      }
      modified.shift()
      return modified
    })
  }

  const onMouseDown = (e) => {
    console.log('onMouseDown')
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onDragHandler)
    //setIsDragging(true)
  }

  const onMouseUp = (e) => {
    console.log('onMouseUp')
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('mousemove', onDragHandler)
    //setIsDragging(false)
  }

  return (
    <div
      ref={refContainer}
      className="container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <div>
        <div
          onMouseDown={onMouseDown}
          data-diviver-pos="1"
          className="diviver"
          style={{
            position: 'absolute',
            backgroundColor: 'black',
            padding: '0 4px',
            left: `${colFraction[0]}px`,
            height: '100%',
            zIndex: '2',
            transform: 'translate(-50%, 0)',
          }}
        ></div>
        <div
          onMouseDown={onMouseDown}
          onDragStart={(event) => {
            event.dataTransfer.clearData()
          }}
          onDragOver={(e) => {
            e.preventDefault()
          }}
          data-diviver-pos="2"
          className="diviver"
          style={{
            position: 'absolute',
            left: `${colFraction[1]}px`,
            height: '100%',
          }}
        ></div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: `${colFraction[0]}px`,
          height: '100%',
          backgroundColor: 'pink',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          left: `${colFraction[0]}px`,
          width: `${colFraction[1] - colFraction[0]}px`,
          height: '100%',
          backgroundColor: 'skyblue',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          left: `${colFraction[1]}px`,
          width: `${colFraction[2] - colFraction[1]}px`,
          height: '100%',
          backgroundColor: 'grey',
        }}
      >
        right
      </div>
    </div>
  )
}

export default ResizablePage

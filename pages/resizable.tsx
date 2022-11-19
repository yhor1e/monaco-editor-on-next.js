import type { NextPage } from 'next'
import { useEffect, useRef, useState, useCallback } from 'react'

const ResizablePage: NextPage = () => {
  const [colFraction, setColFraction] = useState<number[]>([])
  const [isDragging, setIsDragging] = useState<Boolean>(false)
  const refContainer = useRef<HTMLDivElement | null>(null)
  const refDrag = useRef<number | null>(null)

  const setColFractionFromInit = useCallback(() => {
    const initFraction = [20, 40, 40]
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
  }, [])

  useEffect(() => {
    if (refContainer.current === null) return
    const observer = new ResizeObserver(() => {
      setColFractionFromInit()
    })
    observer.observe(refContainer.current)
    return () => {
      observer.disconnect()
    }
  }, [setColFractionFromInit])

  useEffect(() => {
    const onMoveHandler = (e: MouseEvent) => {
      if (!isDragging) return
      if (e.clientX === 0) return

      setColFraction((prev) => {
        if (!refDrag.current) return prev
        const modified = [0, ...prev]
        const pos = refDrag.current
        if (modified[pos - 1] < e.clientX && modified[pos + 1] > e.clientX) {
          modified[pos] = e.clientX
        }
        modified.shift()
        return modified
      })
    }
    if (isDragging === false) return
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMoveHandler)
    console.log(isDragging)
    return () => {
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMoveHandler)
      console.log(isDragging)
    }
  }, [isDragging])

  useEffect(() => {
    setColFractionFromInit()
  }, [setColFractionFromInit])

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log('onMouseDown')
    const target = e.target as HTMLDivElement
    refDrag.current = Number(target.getAttribute('data-diviver-pos'))
    setIsDragging(true)
  }

  const onMouseUp = (e: MouseEvent) => {
    console.log('onMouseUp')
    refDrag.current = null
    setIsDragging(false)
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
            left: `${colFraction[0]}px`,
          }}
        ></div>
        <div
          onMouseDown={onMouseDown}
          data-diviver-pos="2"
          className="diviver"
          style={{
            left: `${colFraction[1]}px`,
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
      >
        left
      </div>
      <div
        style={{
          position: 'absolute',
          left: `${colFraction[0]}px`,
          width: `${colFraction[1] - colFraction[0]}px`,
          height: '100%',
          backgroundColor: 'skyblue',
        }}
      >
        center
      </div>
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

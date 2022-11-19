import type { NextPage } from 'next'
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  cloneElement,
  MutableRefObject,
  isValidElement,
} from 'react'

const ResizableLayout = ({
  refContainer,
  children,
}: {
  refContainer: MutableRefObject<HTMLDivElement>
  children: React.ReactNode
}): JSX.Element => {
  const [colFraction, setColFraction] = useState<number[]>([])
  const [isDragging, setIsDragging] = useState<Boolean>(false)
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
  }, [refContainer])

  useEffect(() => {
    if (refContainer.current === null) return
    const observer = new ResizeObserver(() => {
      setColFractionFromInit()
    })
    observer.observe(refContainer.current)
    return () => {
      observer.disconnect()
    }
  }, [refContainer, setColFractionFromInit])

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
  const renderDiviver = () => {
    const diviver = children.map((child, index) => {
      if (index == 0) return
      return (
        <div
          key={index}
          onMouseDown={onMouseDown}
          data-diviver-pos={index}
          className="diviver"
          style={{
            left: `${colFraction[index - 1]}px`,
          }}
        ></div>
      )
    })
    return <>{diviver}</>
  }

  const renderChildren = () => {
    const modifiedChldren = children.map((child, index) => {
      const left = index === 0 ? 0 : `${colFraction[index - 1]}px`
      const width =
        index === 0
          ? `${colFraction[0]}px`
          : `${colFraction[index] - colFraction[index - 1]}px`
      return cloneElement(child, {
        key: index,
        style: {
          ...child.props.style,
          ...{ left, width: width },
        },
      })
    })
    return <>{modifiedChldren}</>
  }

  return (
    <>
      <div className="diviverContainer">{renderDiviver()}</div>
      {renderChildren()}
    </>
  )
}

const ResizablePage: NextPage = () => {
  const refContainer = useRef<HTMLDivElement | null>(null)
  const refContainer2 = useRef<HTMLDivElement | null>(null)
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
      <ResizableLayout refContainer={refContainer}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            height: '100%',
            backgroundColor: 'pink',
          }}
        >
          left
        </div>
        <div
          style={{
            position: 'absolute',
            height: '100%',
            backgroundColor: 'skyblue',
          }}
        >
          center
        </div>
        <div
          style={{
            position: 'absolute',
            height: '100%',
            backgroundColor: 'grey',
          }}
        >
          right
        </div>
      </ResizableLayout>
    </div>
  )
}

export default ResizablePage

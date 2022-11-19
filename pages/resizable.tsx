import type { NextPage } from 'next'
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  cloneElement,
  MutableRefObject,
} from 'react'

const ResizableLayout = ({
  refContainer,
  direction,
  initFraction,
  children,
}: {
  refContainer: MutableRefObject<HTMLDivElement | null>
  direction: 'HORIZONTAL' | 'VIRTICAL'
  initFraction: number[]
  children: React.ReactNode
}): JSX.Element => {
  const [fraction, setFraction] = useState<number[]>([])
  const [isDragging, setIsDragging] = useState<Boolean>(false)
  const refDrag = useRef<number | null>(null)

  const setFractionFromInit = useCallback(() => {
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
    setFraction(modified)
  }, [])

  useEffect(() => {
    if (refContainer.current === null) return
    const observer = new ResizeObserver(() => {
      setFractionFromInit()
    })
    observer.observe(refContainer.current)
    return () => {
      observer.disconnect()
    }
  }, [refContainer, setFractionFromInit])

  useEffect(() => {
    const onMoveHandler = (e: MouseEvent) => {
      if (!isDragging) return
      if (e.clientX === 0) return

      setFraction((prev) => {
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
    setFractionFromInit()
  }, [setFractionFromInit])

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
            left: `${fraction[index - 1]}px`,
          }}
        ></div>
      )
    })
    return <>{diviver}</>
  }

  const renderChildren = () => {
    const modifiedChldren = children.map((child, index) => {
      const leftOrTop = index === 0 ? 0 : `${fraction[index - 1]}px`
      const widthOrHeight =
        index === 0
          ? `${fraction[0]}px`
          : `${fraction[index] - fraction[index - 1]}px`
      return cloneElement(child, {
        key: index,
        style: {
          ...child.props.style,
          ...{
            position: 'absolute',
            height: '100%',
            left: leftOrTop,
            width: widthOrHeight,
          },
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
      <ResizableLayout
        refContainer={refContainer}
        direction={'HORIZONTAL'}
        initFraction={[20, 40, 40]}
      >
        <div
          style={{
            backgroundColor: 'pink',
          }}
        >
          left
        </div>
        <div
          style={{
            backgroundColor: 'skyblue',
          }}
        >
          center
        </div>
        <div
          style={{
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

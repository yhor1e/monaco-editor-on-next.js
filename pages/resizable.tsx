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
  const [leftOrTopPosition, setLeftOrTopPosition] = useState<number[]>([])
  const [isDragging, setIsDragging] = useState<Boolean>(false)
  const refDrag = useRef<number | null>(null)

  const setFractionFromInit = useCallback(
    (fraction: number[]) => {
      if (!refContainer.current) return

      const widthOrHeight =
        direction === 'HORIZONTAL'
          ? Number(
              window
                .getComputedStyle(refContainer.current)
                .width.replace('px', '')
            )
          : Number(
              window
                .getComputedStyle(refContainer.current)
                .height.replace('px', '')
            )
      const elmentsWidthOrHeight = fraction.map(
        (wh) => (widthOrHeight * wh) / 100
      )
      const modified = elmentsWidthOrHeight.map((wh, index) => {
        return elmentsWidthOrHeight.slice(0, index + 1).reduce((acc, value) => {
          return acc + value
        }, 0)
      })
      setLeftOrTopPosition(modified)
    },
    [direction, refContainer]
  )

  useEffect(() => {
    if (refContainer.current === null) return
    const observer = new ResizeObserver(() => {
      console.log('resize')
      setFractionFromInit(initFraction)
    })
    observer.observe(refContainer.current)
    return () => {
      observer.disconnect()
    }
  }, [initFraction, refContainer, setFractionFromInit])

  useEffect(() => {
    const onMoveHandler = (e: MouseEvent) => {
      if (!isDragging) return
      if (!refContainer.current) return
      if (
        (direction === 'HORIZONTAL' &&
          refContainer.current?.clientLeft - e.clientX > 0) ||
        (direction === 'VIRTICAL' &&
          refContainer.current?.clientTop - e.clientY > 0)
      )
        return

      setLeftOrTopPosition((prev) => {
        if (!refDrag.current) return prev
        const clientXorY = direction === 'HORIZONTAL' ? e.clientX : e.clientY
        const modified = [0, ...prev]
        const pos = refDrag.current
        if (modified[pos - 1] < clientXorY && modified[pos + 1] > clientXorY) {
          modified[pos] = clientXorY
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
  }, [direction, isDragging, refContainer])

  useEffect(() => {
    setFractionFromInit(initFraction)
  }, [initFraction, setFractionFromInit])

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
      const leftOrTopStyle =
        direction === 'HORIZONTAL'
          ? {
              left: `${leftOrTopPosition[index - 1]}px`,
            }
          : {
              top: `${leftOrTopPosition[index - 1]}px`,
            }
      return (
        <div
          key={index}
          onMouseDown={onMouseDown}
          data-diviver-pos={index}
          className={direction === 'HORIZONTAL' ? 'diviver-h' : 'diviver-v'}
          style={leftOrTopStyle}
        ></div>
      )
    })
    return <>{diviver}</>
  }

  const renderChildren = () => {
    const modifiedChldren = children.map((child, index) => {
      const leftOrTop = index === 0 ? 0 : `${leftOrTopPosition[index - 1]}px`
      const widthOrHeight =
        index === 0
          ? `${leftOrTopPosition[0]}px`
          : `${leftOrTopPosition[index] - leftOrTopPosition[index - 1]}px`
      const style =
        direction === 'HORIZONTAL'
          ? {
              left: leftOrTop,
              width: widthOrHeight,
              height: '100%',
            }
          : {
              top: leftOrTop,
              width: '100%',
              height: widthOrHeight,
            }
      return cloneElement(child, {
        key: index,
        style: {
          ...child.props.style,
          ...{
            position: 'absolute',
          },
          ...style,
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
        //direction={'HORIZONTAL'}
        direction={'VIRTICAL'}
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
          <ResizableLayout
            refContainer={refContainer}
            direction={'HORIZONTAL'}
            //direction={'VIRTICAL'}
            initFraction={[20, 40, 40]}
          >
            <div
              style={{
                backgroundColor: 'white',
              }}
            >
              center-left
            </div>
            <div
              style={{
                backgroundColor: 'green',
              }}
            >
              center-center
            </div>
            <div
              style={{
                backgroundColor: 'violet',
              }}
            >
              center-right
            </div>
          </ResizableLayout>
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

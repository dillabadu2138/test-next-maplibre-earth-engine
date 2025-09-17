import { useEffect, useRef } from 'react'
import { select, scaleLinear, range, quantize, interpolate, axisBottom } from 'd3'

// generate a reusable ramp for visualizing color scales
function ramp(color: (a: number) => string, n = 256) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  // create a horizontal color ramp
  canvas.width = n
  canvas.height = 1
  for (let i = 0; i < n; ++i) {
    context!.fillStyle = color(i / (n - 1))
    context!.fillRect(i, 0, 1, 1) // x, y, width, height
  }

  return canvas
}

interface LegendPanelProps {
  title: string
  width: number
  height: number
  tickSize: number
  tickFormat: string
  minValue: number
  maxValue: number
  colorScheme: string[]
}

const LegendPanel = ({
  title,
  width,
  height,
  tickSize,
  tickFormat,
  minValue,
  maxValue,
  colorScheme,
}: LegendPanelProps) => {
  // use a ref to store a reference to our svg element
  const svgRef = useRef(null)

  useEffect(() => {
    const ticks = width / 64
    const newHeight = height + tickSize
    const marginTop = 10
    const marginRight = 5
    const marginBottom = 10 + tickSize
    const marginLeft = 5

    // Use `d3.select()` to turn our ref into a d3 selection object
    const svgElement = select(svgRef.current)

    // Remove the old svg
    svgElement.selectAll('*').remove()

    // Update attributes and styles
    svgElement
      .attr('width', width)
      .attr('height', newHeight)
      .attr('viewBox', [0, 0, width, newHeight])
      .style('overflow', 'visible')
      .style('display', 'block')

    // Intialize a sequential scale
    const domain = [minValue, maxValue]
    const hex_array = colorScheme.map((elem) => `#${elem}`)
    console.log('hex_array: ', hex_array)
    const scale = scaleLinear<string>(domain, hex_array)
    console.log('scale: ', scale)

    // 눈금을 위한 스케일
    const n = scale.domain().length
    const x = scale.copy().rangeRound(quantize(interpolate(marginLeft, width - marginRight), n))
    const stepValue = (maxValue - minValue) / (Math.ceil(ticks) - 1)
    const tickValues = range(minValue, maxValue + stepValue, stepValue)
    // console.log('stepValue: ', stepValue);
    // console.log('tickValues: ', tickValues);

    // Add a color image
    svgElement
      .append('image')
      .attr('x', marginLeft)
      .attr('y', marginTop)
      .attr('width', width - marginLeft - marginRight)
      .attr('height', newHeight - marginTop - marginBottom)
      .attr('preserveAspectRatio', 'none')
      .attr(
        'href',
        ramp(scale.copy().domain(quantize(interpolate(0, 1), scale.range().length))).toDataURL()
      )

    // Set ticks and tick labels
    svgElement
      .append('g')
      .attr('transform', `translate(0, ${newHeight - marginBottom})`)
      // @ts-expect-error: FIXME
      .call(axisBottom(x).ticks(ticks, tickFormat).tickSize(tickSize).tickValues(tickValues))
      .call((g) =>
        g
          .append('text')
          .attr('x', marginLeft)
          .attr('y', marginTop + marginBottom - newHeight - 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .attr('class', 'title')
          .text(title)
      )
  }, [title, width, height, tickSize, tickFormat, minValue, maxValue, colorScheme])

  return <svg ref={svgRef} />
}

export default LegendPanel

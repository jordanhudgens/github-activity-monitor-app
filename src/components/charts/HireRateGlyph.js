import React from "react";
import { Group } from "@vx/group";
import { GlyphDot } from "@vx/glyph";
import { LinePath } from "@vx/shape";
import { genDateValue } from "@vx/mock-data";
import { scaleTime, scaleLinear } from "@vx/scale";
import { curveMonotoneX, curveBasis } from "@vx/curve";

const data = genDateValue(15);

// accessors
const date = d => d.date;
const value = d => d.value;

// scales
const xScale = scaleTime({
  domain: [Math.min(...data.map(date)), Math.max(...data.map(date))]
});
const yScale = scaleLinear({
  domain: [0, Math.max(...data.map(value))]
});

// positions
const x = d => xScale(date(d));
const y = d => yScale(value(d));

// colors
const primary = "#26abe3";
const contrast = "#d8d8d8";
const secondary = "#21282f";

export default ({ width, height, margin }) => {
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale range to match bounds
  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  return (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={secondary}
        rx={14}
      />
      <Group top={margin.top}>
        <LinePath
          data={data}
          x={x}
          y={y}
          stroke={primary}
          strokeWidth={2}
          strokeDasharray="2,2"
          curve={curveBasis}
        />
        <LinePath
          data={data}
          x={x}
          y={y}
          stroke={primary}
          strokeWidth={3}
          curve={curveMonotoneX}
        />
        {data.map((d, i) => {
          const cx = x(d);
          const cy = y(d);
          return (
            <g key={`line-point-${i}`}>
              <GlyphDot
                cx={cx}
                cy={cy}
                r={6}
                fill={contrast}
                stroke={secondary}
                strokeWidth={10}
              />
              <GlyphDot
                cx={cx}
                cy={cy}
                r={6}
                fill={secondary}
                stroke={primary}
                strokeWidth={3}
              />
              <GlyphDot cx={cx} cy={cy} r={4} fill={contrast} />
            </g>
          );
        })}
      </Group>
    </svg>
  );
};

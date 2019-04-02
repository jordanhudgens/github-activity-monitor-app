import React, { Component } from "react";
import moment from "moment";
import { Group } from "@vx/group";
import { scaleLinear } from "@vx/scale";
import { HeatmapCircle } from "@vx/heatmap";
import { withTooltip, TooltipWithBounds } from "@vx/tooltip";
import { localPoint } from "@vx/event";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AccountHeatMap extends Component {
  constructor(props) {
    super(props);

    this.handleMouseOver = this.handleMouseOver.bind(this);
  }

  handleMouseOver(event, datum) {
    const coords = localPoint(event.target.ownerSVGElement, event);
    this.props.showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum
    });
  }

  render() {
    const {
      data,
      width,
      height,
      separation = 20,
      margin = {
        top: 10,
        left: 20,
        right: 20,
        bottom: 110
      },
      tooltipData,
      tooltipLeft,
      tooltipTop,
      tooltipOpen,
      hideTooltip
    } = this.props;

    const hot1 = "#d8d8d8";
    const hot2 = "#26abe3";
    const bg = "#28272c";

    const max = (data, value = d => d) => Math.max(...data.map(value));
    const min = (data, value = d => d) => Math.min(...data.map(value));

    const bins = d => d.bins;
    const count = d => d.count;

    const colorMax = max(data, d => max(bins(d), count));
    const bucketSizeMax = max(data, d => bins(d).length);

    const xScale = scaleLinear({
      domain: [0, data.length]
    });
    const yScale = scaleLinear({
      domain: [0, bucketSizeMax]
    });
    const circleColorScale = scaleLinear({
      range: [hot1, hot2],
      domain: [0, colorMax]
    });
    const opacityScale = scaleLinear({
      range: [0.1, 1],
      domain: [0, colorMax]
    });

    let size = width;
    if (size > margin.left + margin.right) {
      size = width - margin.left - margin.right - separation;
    }

    const xMax = size;
    const yMax = height - margin.bottom - margin.top;

    const binWidth = xMax / data.length;
    const binHeight = yMax / bucketSizeMax;
    const radius = min([binWidth, binHeight]) / 2;

    xScale.range([0, xMax]);
    yScale.range([yMax, 0]);

    return (
      <React.Fragment>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} rx={14} fill={bg} />
          <Group top={margin.top} left={margin.left}>
            <HeatmapCircle
              data={data}
              xScale={xScale}
              yScale={yScale}
              colorScale={circleColorScale}
              opacityScale={opacityScale}
              radius={radius}
              gap={2}
            >
              {heatmap => {
                return heatmap.map(bins => {
                  return bins.map(bin => {
                    return (
                      <circle
                        key={`heatmap-circle-${bin.row}-${bin.column}`}
                        className="vx-heatmap-circle"
                        cx={bin.cx}
                        cy={bin.cy}
                        r={bin.r}
                        fill={bin.color}
                        fillOpacity={bin.opacity}
                        onClick={event => {
                          const { row, column } = bin;
                          alert(JSON.stringify({ row, column, ...bin.bin }));
                        }}
                        onMouseOver={event => {
                          const { row, column } = bin;
                          const coords = localPoint(
                            event.target.ownerSVGElement,
                            event
                          );
                          this.props.showTooltip({
                            tooltipLeft: coords.x,
                            tooltipTop: coords.y,
                            tooltipData: JSON.stringify({
                              data: bin.bin
                            })
                          });
                        }}
                        onMouseOut={hideTooltip}
                      />
                    );
                  });
                });
              }}
            </HeatmapCircle>
          </Group>
        </svg>

        {tooltipOpen && (
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            <div className="tooltip-wrapper">
              <img
                class="tooltip-avatar"
                src={JSON.parse(tooltipData)["data"]["avatar_url"]}
              />

              <div className="tooltip-data-wrappers">
                <div className="tooltip-data-wrapper">
                  <FontAwesomeIcon icon="calendar-check" />
                  <div className="tooltip-data-element-lg">
                    {moment(JSON.parse(tooltipData)["data"]["date"]).format(
                      "Do"
                    )}
                  </div>

                  <div className="tooltip-data-element-sm">
                    {moment(JSON.parse(tooltipData)["data"]["date"]).format(
                      "MMM"
                    )}
                  </div>
                </div>

                <div className="tooltip-data-wrapper">
                  <FontAwesomeIcon icon="code-branch" />
                  <div className="tooltip-data-element-lg">
                    {JSON.parse(tooltipData)["data"]["count"]}
                  </div>

                  <div className="tooltip-data-element-sm">commits</div>
                </div>
              </div>

              <div className="tooltip-username">
                {JSON.parse(tooltipData)["data"]["login"]}
              </div>
            </div>
          </TooltipWithBounds>
        )}
      </React.Fragment>
    );
  }
}

export default withTooltip(AccountHeatMap);

import React from "react";
import ReactDom from "react-dom";
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

const x = [1, 2, 3, 4, 5];
const y = [1, 6, 3, 6, 1];

const plot1 = {
  // x: [1, 2, 3, 4, 5],
  // y: [1, 6, 3, 6, 1],
  mode: "markers+text",
  type: "scatter",
  name: "Team A",
  text: ["A-1", "A-2", "A-3", "A-4", "A-5"],
  textposition: "top center",
  textfont: {
    family: "Raleway, sans-serif"
  },
  marker: { size: 12 }
};

const layout = {
  width: 600,
  height: 400,
  title: "Scatter On Labels",
  hovermode: "closest"
};

export default class App extends React.Component {
  state = {
    plot: {
      x,
      y
    }
  };

  onInitialized = (figure: any, graphDiv: any): void => {
    this.setState({ graphDiv });
    this.onInitialListner();
  };

  onInitialListner = () => {
    const { graphDiv } = this.state;

    var xaxis = graphDiv._fullLayout.xaxis;
    var yaxis = graphDiv._fullLayout.yaxis;
    var margin = graphDiv._fullLayout.margin;
    var offsets = graphDiv.getBoundingClientRect();

    //Calculate linear function to convert x coord
    var xy1 = graphDiv.layout.xaxis.range[0];
    var xy2 = graphDiv.layout.xaxis.range[1];
    var xx1 = offsets.left + margin.l;
    var xx2 = offsets.left + graphDiv.offsetWidth - margin.r;
    var mx = (xy2 - xy1) / (xx2 - xx1);
    var cx = -(mx * xx1) + xy1;

    //Calculate linear function to convert y coord
    var yy1 = graphDiv.layout.yaxis.range[0];
    var yy2 = graphDiv.layout.yaxis.range[1];
    var yx1 = offsets.top + graphDiv.offsetHeight - margin.b;
    var yx2 = offsets.top + margin.t;
    var my = (yy2 - yy1) / (yx2 - yx1);
    var cy = -(my * yx1) + yy1;

    // mousemove Hack
    // 座標デバッグ用
    // graphDiv.addEventListener("mousemove", evt => {
    //   var xInDataCoord = mx * evt.x + cx;
    //   var yInDataCoord = my * evt.y + cy;

    //   Plotly.relayout(
    //     graphDiv,
    //     "title",
    //     ["x: " + xInDataCoord, "y : " + yInDataCoord].join("<br>")
    //   );
    // });

    // click Hack
    graphDiv.addEventListener("click", evt => {
      var xInDataCoord = mx * evt.x + cx;
      var yInDataCoord = my * evt.y + cy;

      // 既存のPlot.data[index]オブジェクトにplotを追加する
      Plotly.extendTraces(
        graphDiv,
        { x: [[xInDataCoord]], y: [[yInDataCoord]] },
        [0] // 対象のtraceData index. 調整が必要になるかも
      );

      // Plot.dataオブジェクトにplotを新規追加する場合は↓
      // Plotly.addTraces(graphDiv, { x: [xInDataCoord], y: [yInDataCoord] });

      this.insertPlot(xInDataCoord, yInDataCoord);
    });
  };

  insertPlot = (x, y) => {
    console.debug(`call insert x: ${x} y: ${y}`);
    this.setState({
      plot: {
        x: this.state.plot.x.concat(x),
        y: this.state.plot.y.concat(y)
      }
    });
  };

  render() {
    // console.log("this.state.plot", this.state.plot);
    const { x, y } = this.state.plot;
    const data = [{ ...plot1, x, y }];

    return (
      <Plot
        ref={node => {
          this.graphNode = node;
        }}
        data={data}
        layout={layout}
        onInitialized={this.onInitialized}
        onClick={() => console.debug("onClick")}
      />
    );
  }
}

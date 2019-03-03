import React from "react";
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

const x = [1, 2, 3, 4, 5];
const y = [1, 6, 3, 6, 1];

const plot1 = {
  x: [1, 2, 3, 4, 5],
  y: [1, 6, 3, 6, 1],
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

    if (graphDiv) {
      var xaxis = graphDiv._fullLayout.xaxis;
      var yaxis = graphDiv._fullLayout.yaxis;
      var l = graphDiv._fullLayout.margin.l;
      var t = graphDiv._fullLayout.margin.t;

      // mousemove Hack
      graphDiv.addEventListener("mousemove", function(evt) {
        var xInDataCoord = xaxis.p2c(evt.x - l);
        var yInDataCoord = yaxis.p2c(evt.y - t);

        Plotly.relayout(
          graphDiv,
          "title",
          ["x: " + xInDataCoord, "y : " + yInDataCoord].join("<br>")
        );
        Plotly.relayout(graphDiv, "traceData", {
          x: xInDataCoord,
          y: yInDataCoord
        });
      });

      // click Hack
      graphDiv.addEventListener("click", function(evt) {
        var xInDataCoord = xaxis.p2c(evt.x - l);
        var yInDataCoord = yaxis.p2c(evt.y - t);

        // const { traceX, traceY } = this.state; // todo: stateアクセスだと動かない？？？
        console.debug(`click x:${xInDataCoord} y:${yInDataCoord}`);
        this.insertPlot(xInDataCoord, yInDataCoord);
      });
    }
  };

  onRelayout = e => {
    // graph div data set
    console.debug("onRelayout ", e);
    const traceX = e.traceData.x;
    const traceY = e.traceData.y;
    // stateアクセスだと動かないので今はsetするだけ
    if (traceX && traceY) this.setState({ traceX, traceY });
  };

  insertPlot = (x, y) => {
    // todo: Listnerからcallされない
    console.debug("call insert");
    // todo: setStateでRelayoutする必要がある
    this.setState({
      plot: {
        x: this.state.x.push(x),
        y: this.state.y.push(y)
      }
    });
  };

  render() {
    // console.log("this.state", this.state);
    const { x, y } = this.state.plot;
    const data = [{ ...plot1, x, y }];

    return (
      <Plot
        data={data}
        layout={layout}
        onInitialized={this.onInitialized}
        onClick={() => console.debug("onClick")}
        onRelayout={this.onRelayout}
      />
    );
  }
}

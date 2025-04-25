import React from "react";
import "./App.css";
import GridLayout from "react-grid-layout";
import { Sidebar } from "./side-bar";

class MyFirstGrid extends React.Component {
  generateLayout = ({ rows = 6, cols = 5 } = {}) => {
    const layout = [];
    let key_id = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        layout.push({
          i: key_id.toString(),
          x,
          y,
          w: 1,
          h: 1,
        });
        key_id++;
      }
    }
    return layout;
  };

  render() {
    // layout is an array of objects, see the demo for more complete usage
    const layout = this.generateLayout();
    return (
      <GridLayout
        className="layout bg-teal-400 mx-auto"
        layout={layout}
        cols={5}
        rowHeight={120}
        width={1200}
      >
        {layout.map((item) => (
          <div key={item.i} className="bg-amber-500">
            id: {item.i}, x: {item.x}, y: {item.y}
          </div>
        ))}
      </GridLayout>
    );
  }
}

function App() {
  return (
    <div className="dark">
      {/* <Sidebar></Sidebar> */}
      <MyFirstGrid></MyFirstGrid>
    </div>
  );
}

export default App;

import React from "react";
import SortingVisualizer from "./SortingVisualizer/SortingVisualizer.jsx";
import 'bootstrap/dist/css/bootstrap.css';
import './Styles/App.css';
import './Styles/Buttons.scss';
import './Styles/fontawesome-all.min.css';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SortingVisualizer> 
        </SortingVisualizer>
      </div>
    );
  }
}

export default App

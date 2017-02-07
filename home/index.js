import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

class ReactApp extends React.Component{

  constructor() {
    super();
    this.state = {
    }
  }

  render(){
    return (
      <div>
        Working!
      </div>
    )
  }
};

  ReactDOM.render(
    <ReactApp />, document.getElementById('content')
  );

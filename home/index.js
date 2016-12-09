import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
require('es6-promise').polyfill();
require('isomorphic-fetch');

class ReactApp extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  };

  componentDidMount = () => {

  };

    render(){
      return (
        <div>
        Working!
        </div>
      )
  };
};


  ReactDOM.render(
    <ReactApp />, document.getElementById('content')
  );

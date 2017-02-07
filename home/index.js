import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const activities = [
  {
    timestamp: new Date().getTime(),
    text: "Ate lunch",
    user: {
      id: 1,
      name: 'Doug',
      avatar: "http://www.croop.cl/UI/twitter/images/doug.jpg"
    },
    comments: [{ from: 'Ari', text: 'Me too!' }]
  },
  {
    timestamp: new Date().getTime(),
    text: "Ate lunch",
    user: {
      id: 2,
      name: 'Carl',
      avatar: "http://www.croop.cl/UI/twitter/images/carl.jpg"
    },
    comments: [{ from: 'Ari', text: 'Me too!' }]
  }
]
class ReactApp extends React.Component{


  render(){
    return (
      <div className="notificationsFrame">
        <div className="panel">
          <Header title="Timeline" />
          <Header title="Profile" />
          <Header title="Settings" />
          <Header title="Chat" />
          <Content activities={activities}/>
        </div>
      </div>
    )
  }
};

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="fa fa-more"></div>

        <span className="title">
          {this.props.title}
        </span>

        <input
          type="text"
          className="searchInput"
          placeholder="Search ..." />

        <div className="fa fa-search searchIcon"></div>
      </div>
    )
  }
}

class Content extends React.Component {
  render() {
    const {activities} = this.props;
    return (
      <div className="content">
        <div className="line"></div>
        {activities.map((activity) => {
          return (
            <div className="item">
              <div className="avatar">
              <img src={activity.user.avatar} />
              {activity.user.name}
              </div>

              <span className="time">
              An hour ago
              </span>
              <p>Ate lunch</p>
              <div className="commentCount">
              2
              </div>
            </div>
          );
        })}
      </div>
    )
  }
}

  ReactDOM.render(
    <ReactApp />, document.getElementById('content')
  );

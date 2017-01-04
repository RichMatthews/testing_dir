import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';
require('es6-promise').polyfill();
require('isomorphic-fetch');

class ReactApp extends React.Component{

  constructor() {
    super();
    this.state = {
      name: '',
      capturedDeck: this.shuffleDeck(),
      playersOverallTotal: 0,
      dealersOverallTotal: 0,
      playersDeck: [],
      dealersDeck: [],
      playerBusted: false
    }
  }

  componentDidMount = () => {

  };

  buildDeck = () => {
    let suit = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    let rank = {
      'A': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      'J': 10,
      'Q': 10,
      'K': 10
    };
    let deck = [];
    Object.keys(rank).forEach(function(key) {
        for (var k=0; k < suit.length; k++){
          deck.push({ rankKey: key, rankValue: rank[key], suit: suit[k]})
        }
    });
    return deck;
  }

  shuffleDeck = () => {
    return _.shuffle(this.buildDeck());
  }

  removeCardsFromDeck = () => {
    this.state.capturedDeck.shift();
  }

  dealToPlayer = () => {
    this.forceUpdate();
    this.state.playersDeck.push(this.state.capturedDeck[0]);
    this.removeCardsFromDeck();
    let playersDeck = this.state.playersDeck;
    let playersDeckTotal = [];
    for (var i=0; i < playersDeck.length; i++){
      playersDeckTotal.push(playersDeck[i].rankValue)
    }

    let total = playersDeckTotal.reduce(function(a, b) {
        return a + b;
      },
    0);
    this.setState({playersOverallTotal: total});
  }

  dealToDealer = () => {
    this.forceUpdate();
    this.state.dealersDeck.push(this.state.capturedDeck[0]);
    this.removeCardsFromDeck();
    let dealersDeck = this.state.dealersDeck;
    let dealersDeckTotal = [];
    for (var i=0; i < dealersDeck.length; i++){
      dealersDeckTotal.push(dealersDeck[i].rankValue)
    }

    let total = dealersDeckTotal.reduce(function(a, b) {
        return a + b;
      },
    0);
    this.setState({dealersOverallTotal: total});
  }

  handleClickStick = () => {
    let playersDeck = this.state.playersDeck;
    let playersDeckTotal = [];
    for (var i=0; i < playersDeck.length; i++){
      playersDeckTotal.push(playersDeck[i].rankValue)
    }

    let total = playersDeckTotal.reduce(function(a, b) {
        return a + b;
      },
    0);

    this.setState({playersOverallTotal: total});
    this.dealerTwisted();
  };

  handleClickTwist = () => {
    this.dealToPlayer();
    this.forceUpdate();
    let playersDeck = this.state.playersDeck;
    let playersDeckTotal = [];
      for (var i=0; i < playersDeck.length; i++){
        playersDeckTotal.push(playersDeck[i].rankValue)
      }
    let total = playersDeckTotal.reduce(function(a, b) {
        return a + b;
      },
    0);
    this.setState({ playersOverallTotal: total }, () => {
      this.playerTwisted();
    });
  };

  playerTwisted = () => {
    console.log(this.state.playersOverallTotal, 'total');
    if(this.state.playersOverallTotal > 21){
      console.log('bust');
      console.log('dealer wins!');
      this.setState({playerBusted: true});
    }
    else {
      console.log('no bust');
    }
  };

  dealerTwisted = () => {
    let dealersTotal = this.state.dealersOverallTotal;
    let looping = true;
    while(looping){
      if(dealersTotal < 17){
        this.deal2Dealer();
        let dealersDeck = this.state.dealersDeck;
        let newDealersDeckTotal = [];
        for (var i=0; i < dealersDeck.length; i++){
          newDealersDeckTotal.push(dealersDeck[i].rankValue)
        }
        let total = newDealersDeckTotal.reduce(function(a, b) {
          return a + b;
        },
        0);
        console.log(total, 'tot');
        dealersTotal = total;
        console.log(dealersTotal, 'dt');
      }
      else {
        console.log('logging as greater than 17');
        console.log(dealersTotal, 'dealers total');
        console.log(this.state.playersOverallTotal, 'players total');
        if(dealersTotal > 21){
          console.log('bust');
          console.log('player wins');
          break;
        }
        else if(this.state.playersOverallTotal > dealersTotal){
          console.log('player wins!');
          looping = false;
          break;
        }
        else if (this.state.playersOverallTotal > dealersTotal){
          console.log('its a tie!');
          looping = false;
          break;
        }
        else {
          console.log('dealer wins!');
          looping = false;
          break;
        }
      }
    }
  };

  deal2Player = () => {
    this.dealToPlayer();
    this.forceUpdate();
  };

  deal2Dealer = () => {
    this.dealToDealer();
  };

  shouldComponentUpdate = () => {
    return false;
  };

  render(){
    return (
      <div>
      {!this.state.playerBusted
        ?
        <div>
          <br />
          Player:
          <br />
          {this.state.playersDeck[0] ? this.state.playersDeck[0].rankKey : null }
          {this.state.playersDeck[0] ? this.state.playersDeck[0].suit : null }
          {' '}
          {this.state.playersDeck[1] ? this.state.playersDeck[1].rankKey : null }
          {this.state.playersDeck[1] ? this.state.playersDeck[1].suit : null }
          {' '}
          {this.state.playersDeck[2] ? this.state.playersDeck[2].rankKey : null }
          {this.state.playersDeck[2] ? this.state.playersDeck[2].suit : null }
          {' '}
          {this.state.playersDeck[3] ? this.state.playersDeck[3].rankKey : null }
          {this.state.playersDeck[3] ? this.state.playersDeck[3].suit : null }
          <br />
          Player Total: {this.state.playersOverallTotal}
          <button onClick={this.handleClickStick.bind(this)}>Stick</button>
          <button onClick={this.handleClickTwist.bind(this)}>Twist</button>
          <button onClick={this.deal2Player.bind(this)}>player</button>
          <button onClick={this.deal2Dealer.bind(this)}>dealer</button>
          <br />
          Dealer:
          <br />
          {this.state.dealersDeck[0] ? this.state.dealersDeck[0].rankKey : null }
          {this.state.dealersDeck[0] ? this.state.dealersDeck[0].suit : null }
          {' '}
          {this.state.dealersDeck[1] ? '-' : null }
          {' '}
          {this.state.dealersDeck[1] ? '-' : null }
          {' '}
          {this.state.dealersDeck[2] ? this.state.dealersDeck[2].rankKey : null }
          {this.state.dealersDeck[2] ? this.state.dealersDeck[2].suit : null }
          {' '}
          {this.state.dealersDeck[3] ? this.state.dealersDeck[3].rankKey : null }
          {this.state.dealersDeck[3] ? this.state.dealersDeck[3].suit : null }
          <br />
          Dealer Total: {this.state.dealersOverallTotal}
        </div>
        :
        <div>
          Busted!
        </div>
      }
    </div>
  )
 }
};


  ReactDOM.render(
    <ReactApp />, document.getElementById('content')
  );

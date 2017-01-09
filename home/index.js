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
      capturedDeck: this.shuffleDeck(),
      playersOverallTotal: 0,
      dealersOverallTotal: 0,
      playersDeck: [],
      dealersDeck: [],
      resultOutcome: '',
      revealCards: false
    }
  }

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
    this.setState({playersOverallTotal: total}, () => {
      this.dealerTwisted();
    });
  };

  handleClickTwist = () => {
    this.dealToPlayer();
    this.forceUpdate();
    let playersDeck = this.state.playersDeck;
    let playersTotal = this.state.playersOverallTotal;
    let playersDeckTotal = [];
      for (var i=0; i < playersDeck.length; i++){
        playersDeckTotal.push(playersDeck[i].rankValue)
      }
    let total = playersDeckTotal.reduce(function(a, b) {
        return a + b;
      },
    0);
    playersTotal = total;
    this.playerTwisted(playersTotal);
  };

  playerTwisted = (playersTotal) => {
    if(playersTotal > 21){
      this.setState({resultOutcome: 'dealer wins!'});
    }
    this.revealCards();
  };

  revealCards = () => {
    this.setState({revealCards: true})
  }

  newGame = () => {
    this.setState({dealersDeck: []})
    this.setState({playersDeck: []})
    this.setState({dealersOverallTotal: 0})
    this.setState({playersOverallTotal: 0})
    this.setState({resultOutcome: ''})
  }

  dealerTwisted = () => {
    let dealersTotal = this.state.dealersOverallTotal;
    let playersTotal = this.state.playersOverallTotal;
    let looping = true;
    let outcome = '';
    while(looping){
      if(dealersTotal < 17){
        this.dealToDealer();
        let dealersDeck = this.state.dealersDeck;
        let newDealersDeckTotal = [];
        for (var i=0; i < dealersDeck.length; i++){
          newDealersDeckTotal.push(dealersDeck[i].rankValue)
        }
        let total = newDealersDeckTotal.reduce(function(a, b) {
          return a + b;
        },
        0);
        dealersTotal = total;
      }
      else {
        if(dealersTotal > 21){
          outcome = 'player wins!';
        }
        else if(playersTotal > dealersTotal){
          outcome = 'player wins!';
        }
        else if (playersTotal == dealersTotal){
          outcome = 'tie!';
        }
        else if (dealersTotal > playersTotal){
          outcome = 'dealer wins!';
        }
        looping = false;
      }
    }
    this.setState({resultOutcome: outcome})
  };

  render(){
    return (
      <div>
        Player:
          <div>
          {this.state.playersDeck.map(function(card, index){
            return <span key={ index }> {card.rankKey}{card.suit} </span>;
          }, this)}
          </div>
        Player Total: {this.state.playersOverallTotal}
        <button onClick={this.handleClickStick.bind(this)}>Stick</button>
        <button onClick={this.handleClickTwist.bind(this)}>Twist</button>
        <button onClick={this.dealToPlayer.bind(this)}>Deal 2 Player</button>
        <button onClick={this.dealToDealer.bind(this)}>Deal 2 Dealer</button>
        <button onClick={this.newGame.bind(this)}>New Game</button>
        <br />
        Dealer:
          <br />
            <div>
            {this.state.dealersDeck.map(function(card, index){
              return <span key={ index }> {card.rankKey}{card.suit} </span>;
            }, this)}
            </div>
        Result: {this.state.resultOutcome}
        <br />
        Cards Left : {this.state.capturedDeck.length}
      </div>
  )
 }
};

  ReactDOM.render(
    <ReactApp />, document.getElementById('content')
  );

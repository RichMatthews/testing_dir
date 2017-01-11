import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';
import './index.scss';
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
      revealCards: false,
      currentBalance: 1000,
      stakeValue: 0,
      submittedStakeValue: 0
    }
    this.handleStakeChange = this.handleStakeChange.bind(this);
  }

  buildDeck = () => {
    let suit = ['C', 'D', 'H', 'S'];
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

  // componentDidMount = () => {
  //   this.dealToPlayer();
  //   this.dealToPlayer();
  //   this.dealToDealer();
  //   this.dealToDealer();
  // }

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
    this.revealCards();
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
      this.revealCards();
    }
  };

  revealCards = () => {
    this.setState({revealCards: true});
  }

  newGame = () => {
    this.setState({dealersDeck: []});
    this.setState({playersDeck: []});
    this.setState({dealersOverallTotal: 0});
    this.setState({playersOverallTotal: 0});
    this.setState({resultOutcome: ''});
    this.setState({revealCards: false});
  }

  dealerTwisted = () => {
    let dealersTotal = this.state.dealersOverallTotal;
    let playersTotal = this.state.playersOverallTotal;
    let looping = true;
    let outcome = '';
    let moneyOutcome = '';
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
          moneyOutcome = this.state.stakeValue*2;
        }
        else if(playersTotal > dealersTotal){
          outcome = 'player wins!';
          moneyOutcome = this.state.stakeValue*2;
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
    let newBalance = this.state.currentBalance + moneyOutcome;
    this.setState({resultOutcome: outcome})
    this.setState({currentBalance: newBalance})
  };

  handleStakeChange(event) {
    this.setState({stakeValue: event.target.value});
  }

  handleBetPlaced() {
    let balance = this.state.currentBalance;
    let stakeValue = this.state.stakeValue;
    this.setState({currentBalance: balance - stakeValue})
    this.setState({submittedStakeValue: stakeValue})
    this.refs.stakeField.value = '';
  }

  render(){
    return (
      <div>
        Current Balance: £{this.state.currentBalance}
        <br />
        Place your stake: <label>£</label><input type="text" ref="stakeField" onChange={this.handleStakeChange}/>
        <button onClick={this.handleBetPlaced.bind(this)}>Place Bet</button>
        <br />
        You have staked: £{this.state.submittedStakeValue}
        <br />
          <button onClick={this.handleClickStick.bind(this)}>Stick</button>
          <button onClick={this.handleClickTwist.bind(this)}>Twist</button>
          <button onClick={this.dealToPlayer.bind(this)}>Deal 2 Player</button>
          <button onClick={this.dealToDealer.bind(this)}>Deal 2 Dealer</button>
          <button onClick={this.newGame.bind(this)}>New Game</button>
          <br />
          Cards Left : {this.state.capturedDeck.length}
          <br />
          <span id="outcome"> {this.state.resultOutcome} </span>
        <br />
        <p className="participants" > Player: </p>
          <div>
          {this.state.playersDeck.map(function(card, index){
              if (card.suit == 'D' || card.suit == 'H'){
                return <div className="cardFormatDH" key={ index }> {card.rankKey}{card.suit} </div>;
              }
              else if (card.suit == 'C' || card.suit == 'S'){
                return <div className="cardFormatCS" key={ index }> {card.rankKey}{card.suit} </div>;
              }
          }, this)}
          <span id="scores"> {this.state.playersOverallTotal} </span>
          </div>
        <br />
          <div>
            {this.state.revealCards
              ?
              <div>
              <p className="participants" > Dealer: </p>
              {this.state.dealersDeck.map(function(card, index){
                if (index == 1){
                  return <div className="cardFormatDH" key={ index }> {card.rankKey}{card.suit} </div>;
                }
                else{
                  if (card.suit == 'D' || card.suit == 'H'){
                    return <div className="cardFormatDH" key={ index }> {card.rankKey}{card.suit} </div>;
                  }
                  else if (card.suit == 'C' || card.suit == 'S'){
                    return <div className="cardFormatCS" key={ index }> {card.rankKey}{card.suit} </div>;
                  }
                }
              }, this)}
              <span id="scores"> {this.state.dealersOverallTotal} </span>
              </div>
              :
              <div>
              <p className="participants" > Dealer: </p>
              {this.state.dealersDeck.map(function(card, index){
                if (index == 1){
                  return <div className="cardFormatCS" key={ index }> {'-'}{'-'} </div>;
                }
                else{
                  if (card.suit == 'D' || card.suit == 'H'){
                    return <div className="cardFormatDH" key={ index }> {card.rankKey}{card.suit} </div>;
                  }
                  else if (card.suit == 'C' || card.suit == 'S'){
                    return <div className="cardFormatCS" key={ index }> {card.rankKey}{card.suit} </div>;
                  }
                }
              }, this)}
              </div>
            }
        </div>
  </div>
  )
 }
};

  ReactDOM.render(
    <ReactApp />, document.getElementById('content')
  );

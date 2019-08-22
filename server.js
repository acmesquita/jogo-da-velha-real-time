const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
})

let players = []
let board = new Array(8)
const possibilities_with_line = [ 
  {value: [0,1,2], line: "h1"},
  {value: [3,4,5], line: "h2"}, 
  {value: [6,7,8], line: "h3"}, 
  {value: [0,3,6], line: "v1"}, 
  {value: [1,4,7], line: "v2"}, 
  {value: [2,5,8], line: "v3"}, 
  {value: [0,4,8], line: "d1"}, 
  {value: [2,4,6], line: "d2"}
 ]
let current_player;

io.on('connection', socket => {

  socket.on('create', player => {
    console.log('createPlayer', player)
    let playerObj = {
      id: socket.id,
      name: player.player,
      symbol: players.length == 0 ? 'X' : 'O'
    }
    console.log(playerObj)
    initGame(playerObj)
    players.push(playerObj);
    if(players.length > 2) {
      players.pop()
      socket.emit('fail', {message: 'Somente 2 competidores podem jogar'});
      return
    }

    if(players.length == 2){
      current_player = players[1]
      players.forEach(player => {
        io.to(player.id).emit('startGame', {players, current_player})
      })
    }

  });

  socket.on('play', play=> {
    
    if(current_player.name === play.name){
      return
    }
    current_player =  players.filter(p => p.name === play.name)[0];
    let symbol = current_player.symbol
    
    if(board[play.val] === undefined){
      board[play.val] = symbol
      emit('renderPlay', {
        val: play.val,
        symbol
      })      
    }

    let combination = board.map((p, index) => {
      if(p === current_player.symbol){
        return index
      }
    }).filter(p=> p != undefined ).sort()
    
    if(combination.length >= 3){
            
      let aux = possibilities_with_line.filter(p => {return arrayIncludes(p.value, combination) })
      
      if(!!aux.length){
        emit('gameOver', { message: `${current_player.name} Venceu!`, result: aux[0]})
        players = new Array()
        board = new Array(8)
        return
      }
    }

    if(board.filter(p=> p != undefined ).length === 9){
      console.log('Deu velha')
      emit('gameOver', { message: 'Deu Velha'})
      players = new Array()
      board = new Array(8)
      return
    }
    
  })
});

function arrayIncludes(base, compere){
  let result = 0
  compere.forEach( v => {
    if(base.includes(v)){
      result++
    }
  })
  return result === 3;
}

function arraysEqual(a1,a2) {
  return JSON.stringify(a1)==JSON.stringify(a2);
}

function emit(action, obj){
  players.forEach(p => {
    io.to(p.id).emit(action, obj)
  })
}

function initGame(player){
  if(!current_player){
    current_player = player;
  }
  if(!board){
    board = [null, null, null, null, null, null, null, null]
  }
}
server.listen(3000);
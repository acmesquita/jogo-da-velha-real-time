const socket = io('http://localhost:3000')

$('#btn-start').click( event => {
  let player = $('#player').val();
  console.log('btn-start click', player)
  socket.emit('create', {player});
  $(".content")[0].innerHTML = 'Esperando um outro jogador';
  $('#btn-start').remove();
  $("#player").prop( "disabled", true );
});

socket.on('startGame', response => {
  let boardEl = `
    <div class="board">
      <div id="0" name="0" onclick="play(this);" class="square"><p class="ex"></p></div>
      <div id="1" name="1" onclick="play(this);" class="square border-left-right"><p class="ex"></p></div>
      <div id="2" name="2" onclick="play(this);" class="square"><p class="ex"></p></div>
      <div id="3" name="3" onclick="play(this);" class="square border-top-bottom"><p class="ex"></p></div>
      <div id="4" name="4" onclick="play(this);" class="square borders"><p class="ex"></p></div>
      <div id="5" name="5" onclick="play(this);" class="square border-top-bottom"><p class="ex"></p></div>
      <div id="6" name="6" onclick="play(this);" class="square"><p class="ex"></p></div>
      <div id="7" name="7" onclick="play(this);" class="square border-left-right"><p class="ex"></p></div>
      <div id="8" name="8" onclick="play(this);" class="square"><p class="ex"></p></div>
      <!-- Lines -->
      <!-- <div class="lines horizontal-line"></div> -->
    </div>
  `;
  $('.content')[0].innerHTML = boardEl;
  let player = $('#player').val();
  $("#symbol")[0].innerHTML = response.players[0].name == player ? response.players[0].symbol : response.players[1].symbol
  $("#info")[0].innerHTML = `${response.players[0].name} VS ${response.players[1].name} ${response.current_player.name == player ? '' : ' - Você inicia'}`
});

function play(elem) {
  let player = $('#player').val();
  let val = $(elem).attr('name')

  socket.emit('play', {
    name: player,
    val
  });
}

socket.on('renderPlay', play => {
  let elem = `#${play.val}`
  $(elem).children()[0].innerHTML= play.symbol
})

socket.on('gameOver', res => {  
  $('#message')[0].innerHTML = res.message
})

socket.on('fail', error=>{
  $(".content")[0].innerHTML = error.message;
});
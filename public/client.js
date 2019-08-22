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
    <div id="board" class="board">
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
      <svg height="100%" width="100%" id="svg" class="hide">
        <line class="hide" id="h1" x1="20" y1="62" x2="760" y2="62" style="stroke:rgb(0,0,0);stroke-width:2"/>
        <line class="hide" id="h2" x1="20" y1="196" x2="760" y2="196" style="stroke:rgb(0,0,0);stroke-width:2"/>
        <line class="hide" id="h3" x1="20" y1="330" x2="760" y2="330" style="stroke:rgb(0,0,0);stroke-width:2"/>
    
        <line class="hide" id="v1" x1="132" y1="20" x2="132" y2="380" style="stroke:rgb(0,0,0);stroke-width:2"/>
        <line class="hide" id="v2" x1="397" y1="20" x2="397" y2="380" style="stroke:rgb(0,0,0);stroke-width:2"/>
        <line class="hide" id="v3" x1="662" y1="20" x2="662" y2="380" style="stroke:rgb(0,0,0);stroke-width:2"/>
            
        <line class="hide" id="d1" x1="750" y1="366" x2="20" y2="20" style="stroke:rgb(0,0,0);stroke-width:2"/> -->
        <line class="hide" id="d2" x1="0" y1="388" x2="800" y2="0" style="stroke:rgb(0,0,0);stroke-width:2"></line>
      </svg>
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
  console.log(res)

  $('#message')[0].innerHTML = res.message

  $("#svg").removeClass('hide')

  $("#svg").addClass('absolute')

  let idLine = `#${res.result.line}`
  console.log(idLine)
  $(idLine).removeClass('hide')
})

socket.on('fail', error=>{
  $(".content")[0].innerHTML = error.message;
});
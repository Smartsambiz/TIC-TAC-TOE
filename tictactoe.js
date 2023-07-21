const Gameboard = (()=> {
   let gameboard = ["", "", "", "", "", "", "", "", ""];

   const displayArray=()=>{
    let boardHtml = "";
    gameboard.forEach((square, index)=> {
      boardHtml += `<div class="square" id="square-${index}">${square}</div>`
    });
    document.querySelector("#gameboard").innerHTML= boardHtml;
    const squares = document.querySelectorAll('.square');
  squares.forEach((square)=>{
    square.addEventListener('click', controller.makeMove)

  })

  };

  
  const updateboard = (index, value)=>{
    gameboard[index] = value;
    displayArray();
  }

  const Getgameboard = ()=> gameboard;
  
   return { displayArray, updateboard, Getgameboard}

})();



const Player = (name, mark)=>{
  return{name, mark}
}


const computer = (name, mark)=>{
  return {name, mark};
}


const controller = (()=>{
    let players = [];
    let currentPlayer;
    let gameStatus;

  const start = ()=>{
    const player1Name = document.querySelector("#Player1").value;
    const computersName = 'computer'
    players = [Player(player1Name, "X"),
              computer(computersName, "O")
              ];
    gameStatus = 'ongoing';
    currentPlayer = 0;
    Gameboard.displayArray();
    document.getElementById('status').textContent = `player ${players[currentPlayer].name} turn`;

    if(players[currentPlayer]=== computer){
      setTimeout(()=>{
        computersMove();
      }, 500)
    }

    
   
  }


  const makeMove = (event)=>{
    let squareIndex = parseInt(event.target.id.split('-')[1]);
    if(Gameboard.Getgameboard()[squareIndex] === '' && gameStatus == 'ongoing'){
          Gameboard.updateboard(squareIndex, players[currentPlayer].mark);
          if(checkWin()){
            gameStatus = 'win';
            document.getElementById('status').textContent = `Player ${players[currentPlayer].name} wins`;
          }else if (checkDraw()){
            gameStatus= 'draw';
            document.getElementById('status').textContent = `The game is a draw`
          }else{
            currentPlayer = currentPlayer === 0 ? 1 : 0;
            document.getElementById('status').textContent = `player ${players[currentPlayer].name}'s turn`
            setTimeout(()=>{
              computersMove()
            }, 500)
      }
            
          }
       };


    const checkWin = ()=>{
      for (let row = 0; row < 3; row++) {
        if (
          Gameboard.Getgameboard()[row * 3] !== '' &&
          Gameboard.Getgameboard()[row * 3] === Gameboard.Getgameboard()[row * 3 + 1] &&
          Gameboard.Getgameboard()[row * 3] === Gameboard.Getgameboard()[row * 3 + 2]
        ) {
          return true;
        }
      };

      for(let col = 0; col <3; col++){
        if(
          Gameboard.Getgameboard()[col] !== ''&&
          Gameboard.Getgameboard()[col] === Gameboard.Getgameboard()[col + 3]&&
          Gameboard.Getgameboard()[col] === Gameboard.Getgameboard()[col + 6]
        ){
          return true;
        }
      };

      
        if(Gameboard.Getgameboard()[0] !== ''&&
        Gameboard.Getgameboard()[0] === Gameboard.Getgameboard()[4] &&
        Gameboard.Getgameboard()[0]=== Gameboard.Getgameboard()[8]
        ){
          return true;
        };

        if(
          Gameboard.Getgameboard()[2]!== '' &&
          Gameboard.Getgameboard()[2] === Gameboard.Getgameboard()[4] &&
          Gameboard.Getgameboard()[2] === Gameboard.Getgameboard()[6]
        ){
          return true;
        }
        return false;
    };

    const checkDraw = () => {
    for (let square of Gameboard.Getgameboard()) {
      if (square === '') {
        return false; // If there is any empty square, the game is not a draw
      }
    }
    return true; // All squares are filled, the game is a draw
  };

  const restart = ()=>{
    for(let i=0; i<9; i++){
     Gameboard.Getgameboard()[i] = ""
    }
    Gameboard.displayArray();
    document.querySelector("#Player1").value = '';
    document.querySelector("#Player2").value = '';
     gameStatus = 'ongoing';
    currentPlayer = 0;
   document.getElementById('status').textContent= `${players[currentPlayer].name}'s turn`;
  };

  const computersMove = ()=>{
      const availableSquares = Gameboard.Getgameboard().reduce((acc, val, index) => {
        if (val === "") acc.push(index);
        return acc;
      }, []);
      const randomIndex = Math.floor(Math.random() * availableSquares.length);
      const randomSquare = availableSquares[randomIndex];
      Gameboard.updateboard(randomSquare, players[currentPlayer].mark);
    
      if (checkWin()) {
        gameStatus = 'win';
        document.getElementById('status').textContent = `Player ${players[currentPlayer].name} wins`;
      } else if (checkDraw()) {
        gameStatus = 'draw';
        document.getElementById('status').textContent = 'The game is a draw';
      } else {
        // Switch to the other player's turn
        currentPlayer = (currentPlayer === 0) ? 1 : 0;
        document.getElementById('status').textContent = `Player ${players[currentPlayer].name}'s turn`;
    
        // If it's the computer's turn, make the next move after a short delay
        if (players[currentPlayer] === computer) {
          setTimeout(() => {
            computersMove();
          }, 500); // Add a delay to see the computer's move
        }
      }
    
    
  };


   return {start, makeMove, restart}
})();



const restartButton = document.querySelector("#restartbutton");
restartButton.addEventListener("click", ()=> {
  controller.restart();
});

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", ()=> {

  controller.start()

})
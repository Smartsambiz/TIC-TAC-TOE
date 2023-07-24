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
    let selectedMark = '';

    const markX = document.querySelector("#X");
    const markO = document.querySelector("#O");

    markX.addEventListener('click', ()=>{
      selectedMark = 'X';
      return selectedMark
    });
    markO.addEventListener('click', ()=>{
      selectedMark = 'O';
      return selectedMark
    });



  const start = ()=>{
    const playerName = document.querySelector("#Player1").value;

    const computersName = 'SAM-AI';
      players = [Player(playerName, selectedMark),
        computer(computersName, selectedMark==="X"? "O":"X")
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
  };
   
  


  const makeMove = (event)=>{
    let squareIndex = parseInt(event.target.id.split('-')[1]);
    if(Gameboard.Getgameboard()[squareIndex] === '' && gameStatus == 'ongoing'){
      const currentPlayerMark = players[currentPlayer].mark;
      
      const currentSquare = document.getElementById(`square-${squareIndex}`);
      currentSquare.classList.add(currentPlayerMark === "X" ? "red" : "yellow");
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
     gameStatus = 'ongoing';
    currentPlayer = 0;
    
   document.getElementById('status').textContent= `${players[currentPlayer].name}'s turn`;
   
  };

  const computersMove = ()=>{
      const bestMove = minimax(players[1].mark, 0).index;
      Gameboard.updateboard(bestMove, players[1].mark);
      
    
      if (checkWin()) {
        gameStatus = 'win';
        document.getElementById('status').textContent = ` ${players[currentPlayer].name} wins`;
      } else if (checkDraw()) {
        gameStatus = 'draw';
        document.getElementById('status').textContent = 'The game is a draw';
      } else {
        currentPlayer = (currentPlayer === 0) ? 1 : 0;
        document.getElementById('status').textContent = ` ${players[currentPlayer].name}'s turn`;
    
      
        if (players[currentPlayer] === computer) {
          setTimeout(() => {
            computersMove();
          }, 500); 
        }
      }
    
    
  };

  const minimax = (currentMark, depth) => {
    const availableSquares = Gameboard.Getgameboard().reduce((acc, val, index) => {
      if (val === "") acc.push(index);
      return acc;
    }, []);
  
    if (checkWin() && currentMark === players[1].mark) {
      return { score: 10 - depth };
    } else if (checkWin() && currentMark === players[0].mark) {
      return { score: depth - 10 };
    } else if (checkDraw()) {
      return { score: 0 };
    }
  
    const moves = [];
  
    for (const index of availableSquares) {
      const move = {};
      move.index = index;
      Gameboard.updateboard(index, currentMark);
  
      if (currentMark === players[1].mark) {
        const result = minimax(players[0].mark, depth + 1);
        move.score = result.score;
      } else {
        const result = minimax(players[1].mark, depth + 1);
        move.score = result.score;
      }
  
      Gameboard.updateboard(index, ""); // Undo the move
      moves.push(move);
    }
  
    let bestMove;
    if (currentMark === players[1].mark) {
      let bestScore = -Infinity;
      for (const move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    } else {
      let bestScore = Infinity;
      for (const move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    }
  
    return bestMove;
  };
  
  

  


   return {start, makeMove, restart,}
})();



const restartButton = document.querySelector("#restartbutton");
restartButton.addEventListener("click", ()=> {
  controller.restart();
});

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", ()=> {

  controller.start()

});



(function (){
    'use strict';

        //create variables
        const startGame = document.getElementById('startgame');
        const gameControl = document.getElementById('gamecontrol');
        const game = document.getElementById('game');
        const score = document.getElementById('score');
        const actionArea = document.getElementById('actions');
        const form = document.querySelector("#gamecontrol form"); 
        const p1Input = document.getElementById("player1");
        const p2Input = document.getElementById("player2");

        const gameData = {
            dice: ['1die.jpg', '2die.jpg', '3die.jpg', '4die.jpg', '5die.jpg', '6die.jpg'],
            players: ['Player 1','Player 2'],
            score: [0, 0],
            roll1: 0,
            roll2: 0,
            rollSum: 0,
            index: 0,
            gameEnd: 29
        };


        //Save names
        const saved = JSON.parse(localStorage.getItem("pigPlayers") || "null");
        if (saved && saved.length === 2){
            gameData.players = saved;

            p1Input.value = saved[0];
            p2Input.value = saved[1];
        }

        
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            
            const p1Name = (p1Input.value || "").trim() || "Player 1"; //trim is used to clear accidental spaces
            const p2Name = (p2Input.value || "").trim() || "Player 2";

            localStorage.setItem("pigPlayers", JSON.stringify([p1Name, p2Name]));

            // feed into existing game state
            gameData.players = [p1Name, p2Name];
        });

        //start the game
        startGame.addEventListener('click', function(){
            gameData.index = Math.round(Math.random()) //pick a random number and round it. Choose player (0 or 1)

            gameControl.innerHTML = '<h2>The game has started </h2>';
            gameControl.innerHTML += '<button id="quit">Do you want to quit?</button>'

            document.getElementById('quit').addEventListener('click', function(){
                location.reload(); //refresh page
            });

            console.log(gameData.index);
            setUpTurn();
        });

        //Set up the turn 
        function setUpTurn() {
            game.innerHTML = `<p>Roll the dice for ${gameData.players[gameData.index]}</p>`;
            actionArea.innerHTML = '<button id="roll">Roll the dice!</button>';
            document.getElementById('roll').addEventListener('click', function(){
                console.log("roll the dice");
                throwDice();
            })
        }

        //Throw the dice
        function throwDice(){
            //1. Clean out the actionArea
            actionArea.innerHTML = '';

            //2. Records the two rolls of the dice
            gameData.roll1 =  Math.round(Math.random()* 6) + 1 //to get a number between 1-6 
            gameData.roll2 =  Math.round(Math.random()* 6) + 1

            //3. Sets a message and shows the dice
            game.innerHTML = `<p>Roll the dice for ${gameData.players[gameData.index]}</p>`;
            game.innerHTML += `<img src="${gameData.dice[gameData.roll1 - 1]}" alt="die">`; //choose from pictures in array above
            game.innerHTML += `<img src="${gameData.dice[gameData.roll2 - 1]}" alt="die">`;

            //4. Totals the rolls
            gameData.rollSum = gameData.roll1 + gameData.roll2;
            console.log(gameData.rollSum);

            gameData.rollSum =2;

            if(gameData.roll === 2){
                //SNAKE EYES- if two 1's are rolled 
                game.innerHTML += '<p>Oh snap! You got snake eyes!</p>'
                //reset score
                gameData.score[gameData.index] = 0;
                //switch player
                gameData.index ? (gameData.index = 0): (gameData.index = 1)
                //show current score after 2 secs
                showCurrentScore(); 
                setTimeout(setUpTurn, 2000); 
            }
            else if(gameData.roll1 === 1 || gameData.roll2 === 1){
                gameData.index ? (gameData.index = 0): (gameData.index = 1) //check value of index
                game.innerHTML += `<p>You rolled a 1, switching to ${gameData.players[gameData.index]}</p>`
                setTimeout(setUpTurn, 2000); 
            }
            else{
                gameData.score[gameData.index] = gameData.score[gameData.index] + gameData.rollSum;
                actionArea.innerHTML = '<button id= "rollagain">Roll Again </button> or <button id= "pass">Pass </button>';
                
                document.getElementById('rollagain').addEventListener('click', function(){
                    throwDice();
                });

                 document.getElementById('pass').addEventListener('click', function(){
                    gameData.index ? (gameData.index = 0): (gameData.index = 1);
                    setUpTurn();
                });

                checkWinningCondition();

                

                function checkWinningCondition(){
                    if(gameData.score[gameData.index] > gameData.gameEnd){
                        score.innerHTML = `<h2>${gameData.players[gameData.index]}
                        wins with ${gameData.score[gameData.index]} points! </h2>`

                        actionArea.innerHTML = '';
                        document.getElementById('quit').innerHTML = "Start a New Game?";
                    }
                    else{
                        showCurrentScore(); 
                    }
                }

                function showCurrentScore(){
                    //show the current score
                        score.innerHTML = `<p> The score is currently <strong>${gameData.players[0]} is
                        ${gameData.score[0]}</strong> and <strong>${gameData.players[1]} is
                        ${gameData.score[1]}</strong> </p>`;
                }
            }
        }  
    

})();
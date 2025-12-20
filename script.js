(function (){
    'use strict';

        //create variables
        const gameControl = document.getElementById('gamecontrol');
        const game = document.getElementById('game');
        const score = document.getElementById('score');
        const actionArea = document.getElementById('actions');
        const form = document.querySelector("#gamecontrol form"); 
        const p1Input = document.getElementById("player1");
        const p2Input = document.getElementById("player2");

        const gameScreen = document.getElementById('game-screen');
        const name1El = document.querySelector('.name1');
        const name2El = document.querySelector('.name2');
        const score1El = document.querySelector('.score1');
        const score2El = document.querySelector('.score2');

        const gameData = {
            dice: ['One.png', 'Two.png', 'Three.png', 'Four.png', 'Five.png', 'Six.png'],
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
            gameData.score = [0, 0]; // fresh game

            form.style.display = 'none';

            startGame(); // begin immediately after names are submitted
        });

        //start the game
         function startGame(){
            gameData.index = Math.round(Math.random()); //0 or 1 (Player 1 or 2)
            gameControl.innerHTML = '<p class="start">The game has started!</p>';
            document.querySelector("h2").style.display = 'none';
            gameControl.innerHTML += '<button id="quit"> Quit?</button>'
            
            /* gameScreen.style.display = 'grid'; */
            gameScreen.classList.remove('is-hidden');


            document.getElementById('quit').addEventListener('click', function () {
                location.reload(); 
            });

            setUpTurn();

         }

        //Set up the turn 
        function setUpTurn() {
            game.innerHTML = `<p class="roll">Roll the dice for ${gameData.players[gameData.index]}</p>`;
            actionArea.innerHTML = '<button id="roll">Roll the dice!</button>';
            
            const msg = document.querySelector('.start');
            
            document.getElementById('roll').addEventListener('click', function(){
                console.log("roll the dice");
                throwDice();
                if(msg){msg.remove();}
            })
        }

        //Throw the dice
        function throwDice(){
            //1. Clean out the actionArea
            actionArea.innerHTML = '';

            //2. Records the two rolls of the dice
            gameData.roll1 =  Math.floor(Math.random()* 6) + 1 //to get a number between 1-6 
            gameData.roll2 =  Math.floor(Math.random()* 6) + 1

            //3. Sets a message and shows the dice
            game.innerHTML = `<p>Roll the dice for ${gameData.players[gameData.index]}</p>`;
            game.innerHTML += `<img src="${gameData.dice[gameData.roll1 - 1]}" alt="die">`; //choose from pictures in array above
            game.innerHTML += `<img src="${gameData.dice[gameData.roll2 - 1]}" alt="die">`;

            //4. Totals the rolls
            gameData.rollSum = gameData.roll1 + gameData.roll2;
            /* console.log(gameData.rollSum); */

            if(gameData.roll1 === 1 && gameData.roll2 === 1){
                //SNAKE EYES- if two 1's are rolled 
                game.innerHTML += '<p>Oh snap! You got snake eyes! Score resets to 0.</p>'
                //reset score
                gameData.score[gameData.index] = 0;
                //switch player
                /* gameData.index ? (gameData.index = 0): (gameData.index = 1) */
                gameData.index = gameData.index ? 0 : 1;
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
                    gameData.index = gameData.index ? 0 : 1;
                    setUpTurn();
                });

                checkWinningCondition();
            }
        }  
    
        //Check for winning score 
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
            // update scoreboard cards
            name1El.textContent = gameData.players[0];
            name2El.textContent = gameData.players[1];

            //show the current score
            score1El.textContent = gameData.score[0];
            score2El.textContent = gameData.score[1];

            /* score.innerHTML = `<p> The score is currently <strong>${gameData.players[0]} is
            ${gameData.score[0]}</strong> and <strong>${gameData.players[1]} is
            ${gameData.score[1]}</strong> </p>`; */
        }

})();
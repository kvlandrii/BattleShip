function getArray(x, y)
{
    var array = new Array(x);
    for(let i = 0; i < y; i++)
    {
        array[i] = new Array(y);
    }
    return array;
}

const game = {

    isHit: function(coordinates, x, y)
    {
        return coordinates[x][y]
    },

    isWinner: function()
    {
        if(userScore.score == 20 || computerScore.score == 20)
        {
            return true;
        }
    },

    addScore: function(score)
    {
        return ++score.score
    },

    turn: function(shipCoordinates, x, y, shotPlaces, score)
    {
        game.markUsedPlace(shotPlaces, x, y);
        if(game.isHit(shipCoordinates, x, y))
        {
            game.addScore(score);
            return true;
        }
    },

    markUsedPlace: function(field, x, y)
    {
        field[x][y] = true;
    },

    createShipCoordinates: function(squaresCount)
    {
        let shipCoordinates = getArray(10, 10);
        let occupiedSquares = getArray(12, 12);

        for(let ship = 0; ship < squaresCount.length; ship++)
        {
            const nextPosition = function(position)
            {
                return position.isHorizontal
                    ? { x: position.x + 1, y: position.y, isHorizontal: position.isHorizontal }
                    : { x: position.x, y: position.y + 1, isHorizontal: position.isHorizontal };
            };

            let retry = true;
            while (retry)
            {
                retry = false;
                let tempCoordinates = [];

                let position = main.getRandomPosition();
                
                for (let length = 0; length < squaresCount[ship]; length++)
                {
                    if (position.x < 0 || position.x > 9
                        || position.y < 0 || position.y > 9
                        || occupiedSquares[position.x + 1][position.y + 1]
                        )
                    {
                        retry = true;
                        break;
                    }
                    tempCoordinates.push({ x: position.x, y: position.y });
                    position = nextPosition(position);
                }

                if (!retry)
                {
                    for (let i = 0; i < squaresCount[ship]; i++)
                    {
                        shipCoordinates[tempCoordinates[i].x][tempCoordinates[i].y] = true;
                    }

                    for (let i = 0; i < squaresCount[ship]; i++)
                    {
                        let x = tempCoordinates[i].x + 1;
                        let y = tempCoordinates[i].y + 1;
                        occupiedSquares[x - 1][y - 1] = true;
                        occupiedSquares[x - 1][y] = true;
                        occupiedSquares[x - 1][y + 1] = true;
                        occupiedSquares[x][y - 1] = true;
                        occupiedSquares[x][y] = true;
                        occupiedSquares[x][y + 1] = true;
                        occupiedSquares[x + 1][y - 1] = true;
                        occupiedSquares[x + 1][y] = true;
                        occupiedSquares[x + 1][y + 1] = true;
                    }
                }
            }
        }
        return shipCoordinates;
    }
}

const render = {
    
    userWonMsg: function()
    {
        console.log(`-------------------------------`);
        console.log(`\t\tUSER WON`);
        console.log(`-------------------------------`);
    },

    hitMsg: function()
    {
        console.log(`HIT`);
    },

    computerWonMsg: function()
    {
        console.log(`-------------------------------`);
        console.log(`\t\tCOMPUTER WON`);
        console.log(`-------------------------------`);
    },

    wrongPositionMsg: function()
    {
        console.log(`-------------------------------`);
        console.log(`You did shot this position\nChoose another coordinates`);
        console.log(`-------------------------------`);
    },

    scoreBoard: function()
    {
        console.log(`---------  ${userScore.score}  ---  ${computerScore.score}  ---------`);
    },

    userShotInfoMsg: function(x, y)
    {
        console.log(`You did shot [${x}][${y}]`);
    },

    computerShotInfoMsg: function(x, y)
    {
        console.log(`Computer did shot [${x}][${y}]`);
    },

    windowMsg: function()
    {
        return 'Enter coordinates to shot\nFor example:\nEnter \'24\' to shot [2][4] position:'
    },

    missMsg: function()
    {
        console.log(`MISS`);
    }
}

const main = {

    play: function()
    {
        main.userTurn();
        while(true)
        {
            switch(isPlayerTurn.turn)
            {
                case true:
                    main.userTurn();
                    break;

                case false:
                    main.computerTurn();
                    break;
            }

            render.scoreBoard();
            
            if(game.isWinner())
            {
                userScore.score == 20 ? render.userWonMsg() : render.computerWonMsg();
                return;
            }
        }
    },

    userTurn: function()
    {
        let userShot = main.getUserShotPosition();
        render.userShotInfoMsg(userShot.x, userShot.y);
        if(game.turn(userShipCoordinates, userShot.x, userShot.y, userShotPlaces, userScore))
        {
            isPlayerTurn.turn = true;
            render.hitMsg();
        }
        else 
        {
            isPlayerTurn.turn = false;
            render.missMsg();
        }
    },

    computerTurn: function()
    {
        let computerShot = main.getEmptyPosition();
        render.computerShotInfoMsg(computerShot.x, computerShot.y);
        if(game.turn(computerShipCoordinates, computerShot.x, computerShot.y, computerShotPlaces, computerScore))
        {
            isPlayerTurn.turn = false;
            render.hitMsg();
        }
        else 
        {
            isPlayerTurn.turn = true;
            render.missMsg();
        }
    },

    getUserShotPosition: function()
    {
        while(true)
        {
            let input = prompt(render.windowMsg());
            let position = userShotPlaces[input[0]][input[1]];
            if(!main.isWrongPosition(position))
            {
                game.markUsedPlace(userShotPlaces, input[0], input[1]);
                return {
                    x: parseInt(input[0]),
                    y: parseInt(input[1])
                };
            }
            else
            {
                render.wrongPositionMsg();
            }
        }
    },

    getEmptyPosition: function()
    {
        while(true)
        {
            let randPos = main.getRandomPosition();
            let position = computerShotPlaces[randPos.x][randPos.y];
            if(!main.isWrongPosition(position))
            {
                game.markUsedPlace(computerShotPlaces, randPos.x, randPos.y);
                return {
                    x: randPos.x,
                    y: randPos.y
                }
            }
        }
    },

    isWrongPosition: function(pos)
    {
        return pos;
    },

    getRandomPosition: function() 
    {
        return { 
            x : Math.floor(Math.random() * 10),
            y : Math.floor(Math.random() * 10),
            isHorizontal : isHorizontal = Math.random() > 0.5 
        }
    },
}

const squaresCount = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
const userShipCoordinates = game.createShipCoordinates(squaresCount);
const computerShipCoordinates = game.createShipCoordinates(squaresCount);
var userScore = {score: 0};
var computerScore = {score: 0};
const computerShotPlaces = getArray(10, 10);
const userShotPlaces = getArray(10, 10);
var isPlayerTurn = {turn: false};

main.play();
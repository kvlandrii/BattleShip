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

    getRandomPosition: function() 
    {
        return { 
            x : Math.floor(Math.random() * 10),
            y : Math.floor(Math.random() * 10),
            isHorizontal : isHorizontal = Math.random() > 0.5 
        }
    },

    isHit: function(coordinates, x, y)
    {
        return coordinates[x][y]
    },

    isWinner: function()
    {
        if(userScore == 20)
        {
            return true;
        }
        else if(computerScore == 20)
        {
            return true;
        }
    },

    addScore: function(score)
    {
        return ++score
    },

    computerTurn: function()
    {
        let hit = true;
        while(hit){
            let randPos = game.getRandomPosition();
            let position = computerShotPlaces[randPos.x][randPos.y];
            if(!game.isWrongPosition(position))
            {
                game.markUsedPlace(computerShotPlaces, randPos.x, randPos.y);
                render.computerShotInfoMsg(randPos.x, randPos.y);
                if(game.isHit(userShipCoordinates, randPos.x, randPos.y))
                {
                    render.hitMsg();
                    computerScore = game.addScore(computerScore);
                }
                hit = false;
            }
        }
    },

    playerTurn: function()
    {
        while(true)
        {
            let shot = prompt(render.windowMsg());
            let position = userShotPlaces[shot[0]][shot[1]];
            if(!game.isWrongPosition(position))
            {
                game.markUsedPlace(userShotPlaces, shot[0], shot[1]);
                render.userShotInfoMsg(shot);
                if(game.isHit(computerShipCoordinates, shot[0], shot[1]))
                {
                    render.hitMsg();
                    userScore = game.addScore(userScore);
                    if(game.isWinner())
                    {
                        render.userWonMsg();
                        return; 
                    }
                }
                game.computerTurn();
                if(game.isWinner())
                {
                    render.computerWonMsg();
                    return;
                }
                render.scoreBoard();
            }
            else
            {
                render.wrongPositionMsg();
            }
        }
    },

    isWrongPosition: function(pos)
    {
        return pos;
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

                let position = game.getRandomPosition();
                
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
        console.log(`---------  ${userScore}  ---  ${computerScore}  ---------`);
    },

    userShotInfoMsg: function(shot)
    {
        console.log(`You did shot [${shot[0]}][${shot[1]}]`);
    },

    computerShotInfoMsg: function(x, y)
    {
        console.log(`Computer did shot [${x}][${y}]`);
    },

    windowMsg: function()
    {
        return 'Enter coordinates to shot\nFor example:\nEnter \'24\' to shot [2][4] position:'
    }
}

const squaresCount = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
const userShipCoordinates = game.createShipCoordinates(squaresCount);
const computerShipCoordinates = game.createShipCoordinates(squaresCount);
var userScore = 0;
var computerScore = 0;
const computerShotPlaces = getArray(10, 10);
const userShotPlaces = getArray(10, 10);

game.playerTurn();
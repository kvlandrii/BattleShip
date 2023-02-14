var squaresCount = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
var userShipCoordinates = createShipCoordinates(squaresCount);
var computerShipCoordinates = createShipCoordinates(squaresCount);
var userScore = 0;
var computerScore = 0;
var computerShotPlaces = getArray(10, 10);
var userShotPlaces = getArray(10, 10);


function createShipCoordinates(squaresCount)
{
    var shipCoordinates = getArray(10, 10);
    var occupiedSquares = getArray(12, 12);

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

            var position = getRandomPosition();
            
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
                    var x = tempCoordinates[i].x + 1;
                    var y = tempCoordinates[i].y + 1;
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

function getArray(x, y)
{
    var array = new Array(x);
    for(let i = 0; i < y; i++)
    {
        array[i] = new Array(y);
    }
    return array;
}

function getRandomPosition() 
{
    return { 
        x : Math.floor(Math.random() * 10),
        y : Math.floor(Math.random() * 10),
        isHorizontal : isHorizontal = Math.random() > 0.5 
    }
}

const game = {

    isHit: function(coordinates, x, y)
    {
        return coordinates[x][y]
    },

    whoWinner: function()
    {
        if(userScore == 20)
        {
            console.log('USER WON')
            return true;
        }
        else if(computerScore == 20)
        {
            console.log('COMPUTER WON')
            return true;
        }
    },

    addScore: function(score)
    {
        console.log(`+1 score`);
        return ++score
    },

    computerTurn: function()
    {
        let hit = true;
        while(hit){
            var randPos = getRandomPosition();
            if(!computerShotPlaces[randPos.x][randPos.y])
            {
                computerShotPlaces[randPos.x][randPos.y] = true;
                console.log(`Computer did shot [${randPos.x}][${randPos.y}]`);
                if(game.isHit(userShipCoordinates, randPos.x, randPos.y))
                {
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
            var shot = prompt('Enter coordinates to shot\nFor example:\nEnter \'24\' to shot [2][4] position:')
            if(!userShotPlaces[shot[0]][shot[1]])
            {
                userShotPlaces[shot[0]][shot[1]] = true;
                console.log(`You did shot [${shot[0]}][${shot[1]}]`);
                if(game.isHit(computerShipCoordinates, shot[0], shot[1]))
                {
                    userScore = game.addScore(userScore);
                    if(game.whoWinner()) return;
                }
                game.computerTurn();
                if(game.whoWinner()) return;
                console.log(`---------  ${userScore}  ---  ${computerScore}  ---------`);
            }
            else
            {
                console.log(`You did shot this position\nChoose another coordinates`);
                console.log(`-------------------------------`);
            }
        }
    }
}

game.playerTurn();
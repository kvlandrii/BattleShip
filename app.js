function shipPlacementGeneration()
{
    createGrid(getContainer("player-grid-container"));
    createGrid(getContainer("computer-grid-container"));
}

function createGrid(container)
{
    for(let i = 0; i < 10; i++)
    {
        for(let j = 0; j < 10; j++)
        {
            var item = document.createElement("div");
            item.className = "square ";
            item.className += getSquareClass(i , j);
            container.appendChild(item);
        }
    }
}

function getSquareClass(x, y)
{
    return `square-${x}-${y} `;
}

function getContainer(id)
{
    return document.getElementById(id);
}

function getRandomPosition() 
{
    return { 
        x : Math.floor(Math.random() * 10),
        y : Math.floor(Math.random() * 10),
        isHorizontal : isHorizontal = Math.random() > 0.5 
    }
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
                    console.log(`ship - ${ship}, position: {x: ${tempCoordinates[i].x}, y: ${tempCoordinates[i].y} }`);
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

function createShipSquares(shipCoordinates, battleField)
{
    for (let x = 0; x < 10; x++)
    {
        for (let y = 0; y < 10; y++)
        {
            const squareClass = '.' + getSquareClass(x, y);
            const square = battleField.querySelector(squareClass);
            if (shipCoordinates[x][y])
            {
                square.className += "square-ship ";
            }
        }
    }
}

function createShotAccess(battleField, computerShipCoordinates, userShipCoordinates)
{
    const shotPlaces = getArray(10, 10);
    var userScore = 0;
    var computerScore = 0;

    battleField.addEventListener('click', doShot)

    function doShot(e)
    {
        var pos = getPosition(e.target.classList[1]);
        var shot = isHit(computerShipCoordinates[pos.x][pos.y]);
        e.target.style.backgroundColor = shot.color;
        userScore = hitCounter(userScore, shot.hit).score;
        winner(userScore, '.player-side');
        computerTurn();
    }

    function computerTurn()
    {
        let hit = true;
        while(hit)
        {
            var randomPosition = getRandomPosition();
            if(!shotPlaces[randomPosition.x][randomPosition.y])
            {
                const randomSquare = "." + getSquareClass(randomPosition.x, randomPosition.y);
                const field = getContainer("player-grid-container");
                const square = field.querySelector(randomSquare);
                var shot = isHit(userShipCoordinates[randomPosition.x][randomPosition.y]);
                square.style.backgroundColor = shot.color;
                shotPlaces[randomPosition.x][randomPosition.y] = true;
                computerScore = hitCounter(computerScore, shot.hit).score;
                winner(computerScore, '.computer-side');
                hit = false;
            }
        }
    }

    function hitCounter(score, hit)
    {
        return {score: hit ? (score + 1) : score}
    }

    function winner(score, s)
    {
        if(score == 20){
            const side = document.querySelector(s);
            const winnerMsg = document.createElement("div");
            winnerMsg.innerHTML = "WINNER";
            side.appendChild(winnerMsg);
            battleField.removeEventListener('click', doShot)
        }
    }

    function getPosition(sqr)
    {
        return { 
            x: sqr[7],
            y: sqr[9]
        }
    }

    function isHit(hit)
    {
        return { 
            color: hit ? "#ffa3a3" : "#b3b3ff",
            hit : hit
        }
    }
}

function createShips()
{
    var squaresCount = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    var userShipCoordinates = createShipCoordinates(squaresCount);
    var computerShipCoordinates = createShipCoordinates(squaresCount);
    var userBattleField = getContainer("player-grid-container");
    var computerBattleField = getContainer("computer-grid-container");
    createShipSquares(userShipCoordinates, userBattleField);
    //createShipSquares(computerShipCoordinates, computerBattleField);
    createShotAccess(computerBattleField, computerShipCoordinates, userShipCoordinates);
}

function startSinglePlayerMode()
{    
    shipPlacementGeneration();
    createShips();
}

startSinglePlayerMode();
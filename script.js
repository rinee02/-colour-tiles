//For each tile
class Cell{
    constructor(rg,x,y,color){
        this.grid = rg;
        this.x = x;
        this.y = y;
        this.color = color;
    }
    render(){
        this.grid.fillCell(this);
    }
}

// For 5x5 board
class Board{
    constructor(rg){
        this.grid = rg;
        this.cells = [];
        this.empty = {};
        this.buildBoard();
    }

    buildBoard(){
        let colors = ['red','blue','white','yellowgreen','yellow','orange'];
    
        let ap = [];
        for(let ci=0;ci<this.grid.gs+1;ci++){
            for(let ei=0;ei<this.grid.gs-1;ei++){
                ap.push(colors[ci]);
            }
        }
        ap.push(false);

        for(let x = 0;x<this.grid.gs;x++){
            this.cells[x] = [];
            for(let y=0;y<this.grid.gs;y++){
                let piece_index = Math.random() * ap.length | 0;
                this.cells[x][y] = new Cell(this.grid,x,y,ap[piece_index]);
                if(ap[piece_index]==false)this.empty = this.cells[x][y];
                ap.splice(piece_index,1);
            }
        }
    }

    getEmptyCell(){
        return this.empty;
    }

    render(){
        for(let x=0;x<this.grid.gs;x++){
            for(let y=0;y<this.grid.gs;y++){
                this.cells[x][y].render();
            }
        }
    }
}


// Build grid, For 5x5 board
class RenderGrid{
    constructor(gs,cs,parent){
        this.gs = gs;
        this.cs = cs;
        this.parent = parent;
        this.grid = [];
        this.buildGrid();
    }

    buildGrid(){
        for(let x=0;x<this.gs;x++){
            this.grid[x] = [];
            for(let y=0;y<this.gs;y++){
                let dom = document.createElement("div");
                dom.setAttribute("class","cell");
                dom.style.width = dom.style.height = this.cs +"px";
                dom.style.left=(this.cs * x) + "px";
                dom.style.top=(this.cs * y) + "px";
                this.parent.appendChild(dom);
                this.grid[x][y] = {dom:dom,color:false};
            }
        }
    }

    fillCell(cell){
        if(this.grid[cell.x] && this.grid[cell.x][cell.y])
            this.grid[cell.x][cell.y].color = cell.color
    }

    render(){
        for(let x=0;x<this.gs;x++){
            for(let y=0;y<this.gs;y++){
                if(this.grid[x][y].color!=false)
                    this.grid[x][y].dom.style.background = this.grid[x][y].color;
                else
                    this.grid[x][y].dom.style.background = "none";
                this.grid[x][y].color = false;        
            }
        }
    }
}





// For 3x3 board
class GameBoard2{
    constructor(rg){
        this.grid = rg;
        this.cells = [];
        this.empty = {};
        this.buildBoard();
    }

    buildBoard(){
        let colors = ['red','blue','white','yellowgreen','yellow','orange'];
    
        let ap = [];
        for(let ci=0;ci<6;ci++){
            for(let ei=0;ei<3;ei++){
                ap.push(colors[ci]);
            }
        }
            
        for(let x = 0;x<this.grid.gs;x++){
            this.cells[x] = [];
            for(let y=0;y<this.grid.gs;y++){
                let piece_index = Math.random() * ap.length | 0;
                this.cells[x][y] = new Cell(this.grid,x,y,ap[piece_index]);
                ap.splice(piece_index,1);
            }
        }


    }

    getEmptyCell(){
        return this.empty;
    }

    render(){
        for(let x=0;x<this.grid.gs;x++){
            for(let y=0;y<this.grid.gs;y++){
                this.cells[x][y].render();
            }
        }
    }
}


// Build grid, For 3x3 grid
class RenderGrid2{
    constructor(gs,cs,parent){
        this.gs = gs;
        this.cs = cs;
        this.parent = parent;
        this.grid = [];
        this.buildGrid();
    }

    buildGrid(){
        for(let x=0;x<this.gs;x++){
            this.grid[x] = [];
            for(let y=0;y<this.gs;y++){
                let dom = document.createElement("div");
                dom.setAttribute("class","cell");
                dom.style.width = dom.style.height = this.cs +"px";
                dom.style.left=(this.cs * x) + "px";
                dom.style.top=(this.cs * y) + "px";
                this.parent.appendChild(dom);
                this.grid[x][y] = {dom:dom};
                
            }
        }
    }

    fillCell(cell){
        if(this.grid[cell.x] && this.grid[cell.x][cell.y])
            this.grid[cell.x][cell.y].color = cell.color
    }

    render(){
        for(let x=0;x<this.gs;x++){
            for(let y=0;y<this.gs;y++){
                this.grid[x][y].dom.style.background = this.grid[x][y].color;
            }    
        }
    }
}




//Set Variables
let biggrid = 5;
let smallgrid = 3;
let win = false;
let moves = 0;
let score = 0;

//Timer
let timer_dom = document.getElementById("timer");
let last_time = 0;
let timer = 0;
let delta_time = 0;
let minutes = 0;
let seconds = 0;

//Playerboard(5x5)
let player_board = document.getElementById("player_board");
let rg = new RenderGrid(biggrid,100,player_board);
let gb = new Board(rg);
let empty = gb.getEmptyCell();

//Patternboard(3x3)
let pattern_board = document.getElementById("pattern_board");
let pg = new RenderGrid2(smallgrid,60,pattern_board);
let pb = new GameBoard2(pg);


    
function loop(time){
    delta_time += time-last_time;
    last_time = time;
    if(delta_time>1000){
        delta_time-=1000;
        timer++;
        seconds++;
    }
    if(seconds>60)seconds = 0;
    minutes = timer/60 | 0;
    timer_dom.innerHTML ="<span style = 'font-size:25px'>TIMER: </span>" +
    (minutes<10?"0"+minutes:minutes)+":"+(seconds<10?"0"+seconds:seconds);


    //function newgame(){}

    
    gb.render();
    rg.render();

    pb.render();
    pg.render();

    win = true;
    for(let x=0;x<pg.gs;x++){
        for(let y=0;y<pg.gs;y++){
            if(gb.cells[x+1][y+1].color!=pb.cells[x][y].color)
                win = false;        
        }
    }

    if(win){
        console.log("you win in "+minutes + " minutes and " +seconds + " seconds");
        document.getElementById("score").innerHTML ="<span style = 'font-size:25px'> SCORE : </span>" + Math.round((1/Math.sqrt(seconds) + 2/(moves^2))*1000);
        document.getElementById("score").style.color = "white";
        document.getElementById("score").style.textAlign = "center";
        document.getElementById("score").style.fontSize = "25px";
        swal("GAME OVER", "You won the game!");
    }
    else    
        requestAnimationFrame(loop); 
}
requestAnimationFrame(loop);

//Moving cells

document.onkeydown = function(e){
    switch(e.which){
        case 37:
        if(gb.cells[empty.x+1]){
            gb.cells[empty.x][empty.y] = new Cell(rg,empty.x,empty.y,gb.cells[empty.x+1][empty.y].color);
            gb.cells[empty.x+1][empty.y] = new Cell(rg,empty.x+1,empty.y,false);
            empty.x++;
        moves = moves+1;
        }
        break;
        case 39:
        if(gb.cells[empty.x-1]){
            gb.cells[empty.x][empty.y] = new Cell(rg,empty.x,empty.y,gb.cells[empty.x-1][empty.y].color);
            gb.cells[empty.x-1][empty.y] = new Cell(rg,empty.x-1,empty.y,false);
            empty.x--;
        moves = moves+1;    
        }
        break;
        case 40:
        if(gb.cells[empty.x][empty.y-1]){
            gb.cells[empty.x][empty.y] = new Cell(rg,empty.x,empty.y,gb.cells[empty.x][empty.y-1].color);
            gb.cells[empty.x][empty.y-1] = new Cell(rg,empty.x,empty.y-1,false);
            empty.y--;
        moves = moves+1;    
        }
        break;
        case 38:
        if(gb.cells[empty.x][empty.y+1]){
            gb.cells[empty.x][empty.y] = new Cell(rg,empty.x,empty.y,gb.cells[empty.x][empty.y+1].color);
            gb.cells[empty.x][empty.y+1] = new Cell(rg,empty.x,empty.y+1,false);
            empty.y++;
        moves = moves+1;    
        } 
        break;
    }
}

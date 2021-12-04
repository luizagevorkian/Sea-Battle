seaBattle.Field = function (width, height) {
	this.maxShipSize = 4;//максимальный размер клеток корабля
	this.width = width;
	this.height = height;
	this.cells = [];
	this.ships = [];
	//размер и номер текущего корабля
	var s = this.maxShipSize-1,
		n = 0;

	//переменные, используемые при размещении кораблей вручную
	var lastX = 'empty',
		lastY = null,
		h = false,
		v = false;

	for (var i = 0; i < width; i++) {
		this.cells.push([]);
		for (var j = 0; j < height; j++) {
			this.cells[i].push(null);
		}
	}
	
//определение размера корябля
	for (var k = 0; k < this.maxShipSize ; k++) {
		this.ships.push([]);
		for (var m = 0; m < (this.maxShipSize - k); m++) {
			this.ships[k].push(null);
		}
	}
	//координаты клетки
	this.addCell = function (cell) {
		this.cells[cell.x][cell.y] = cell;
	}
	//добавление корабля
	this.addShip = function (ship, orderNumber) {
		this.ships[ship.size-1][orderNumber] = ship; 
	}
	//отрисовка таблицы
	this.draw = function (attachment, randomly) {
		var table = document.createElement('table');
		table.setAttribute('id', attachment);
		table.setAttribute('align', 'left');
		body = document.querySelector('body');
		body.appendChild(table);
		for (var y = 0; y < this.width; y++) {
			var tr = document.createElement('tr');
			table.appendChild(tr);
			for (var x = 0; x < this.height; x++) {
				var td = this.cells[x][y].createElement(attachment, randomly);
				tr.appendChild(td);
			}
		}
	}
// нажатие на клетки
this.delCelEvents = function () {
	for (var i = 0; i < width; i++) {
	for (var j = 0; j < height; j++) {
	this.cells[i][j].delEvent('click');
	}
	}	
}

	//расставление кораблей случайным образом
	this.arrangeShipRandomly = function ( ) {
	
		for (s; s >= 0 ; s--) {
			for (n =0 ; n < (this.maxShipSize - s); n++) {
				size = this.ships[s][n].size;
				var orientation = (Math.round(Math.random()) == 0) ? 'vertical' : 'horizontal';
				var check = false;
					while (!(check)) {
						var orientation = (Math.round(Math.random()) == 0) ? 'vertical' : 'horizontal';
						var randomX = ( Math.round( Math.random()*10- 0.5 ) );
						var randomY = ( Math.round( Math.random()*10- 0.5 ) );
						check = this.checkPlace (randomX, randomY, size, orientation);
					}
				this.ships[s][n].orientation = orientation;
				this.putShip (this.ships[s][n], randomX, randomY);
			}
		}
	}
	//расположение корабля
	
	this.arrangeShip = function (x,y) {

		if (lastX == 'empty')  {
			h = this.checkPlace (x,y,s + 1, 'horizontal');
			v = this.checkPlace (x,y,s + 1, 'vertical');
			if ( (!v) && (!h) ) {
				return; 
			}
			lastX = x;
			lastY = y;
			this.cells[x][y].setClassName('darkblue');
		}
		else {
			if ( ( (x == lastX) && v ) || (s == 0) ) { 
				this.ships[s][n].orientation = 'vertical'
			}
			else {
				if ((y == lastY) && h) {
					this.ships[s][n].orientation = 'horizontal'
				}
				else {
					message = ( (y-lastY) < 0) ? 'И как ты себе это представляешь? ' :
					'Нельзя расположить корабль по диагонали';
					alert (message);
					return;
				}
			}
			
			

			this.putShip(this.ships[s][n], lastX, lastY);
			this.ships[s][n].draw();
			
			//проверка расстановки кораблей
			if ((s == 0) && (n == this.maxShipSize-1)) {
				this.delCelEvents();
				seaBattle.theGame.start();//начало игры
				return;
			}
			
			
			if (n < (this.maxShipSize - s-1) ) {
				n++ ;
			}
			else {
				n=0;
				s--;
			}
			
			lastX = 'empty';
			lastY = null;
		}
	} 
		
	//правильная расстановка кораблей
	this.checkPlace = function ( x, y, size, orientation ) {
		var coords = {};
		var cellX = this.cells[x];
		var check = false;
		var cellState = null;
		if ( ( cellX == undefined ) || (cellX[y] == undefined) || (cellX[y].state == 'miss') || (cellX[y].state == 'ship-crashed') || (cellX[y].state == 'sank') ) {
			return false;
		}
		
		if (orientation == 'vertical') {
			var keyX = 'crosscut',
			keyY = 'lengthway' ;
		}
		else {
			var keyX ='lengthway', 
			keyY = 'crosscut' ;
		}
		coords[keyX] = x;
		coords[keyY] = y;
				
		if ((coords.lengthway+size)> 10) { 
			return false; 
		}
		coords.lengthway --;
		var m = coords.crosscut;
		for ( var i = 0; i < size + 2; i++ ) {
			for ( var j = -1; j <= 1 ; j++ ) { 
			
				coords.crosscut = m + j;
				if ((this.cells[ coords[keyX] ]!= undefined) && (this.cells[ coords[keyX] ][ coords[keyY] ] != undefined )) {
						cellState = this.cells[ coords[keyX] ][ coords[keyY] ].state;
					check = (orientation) ? ( cellState == 'empty') : (cellState != 'sank');
					if   (!(check)) { 
						return false;	
					}
				}
			}
		coords.lengthway++;	
		}
		return true;
	}	
	
	//устанавливает корабль в ячейку по начальным координатам и ориентации
	this.putShip = function(ship, x, y) {
		for ( var i = 0; i < ship.size ; i++) {
			ship.decks[i] = this.cells[x][y];
			this.cells[x][y].ship = ship;
			ship.makeState(i);
			if (ship.orientation == 'vertical') {
				y++;
			}
			else {
				x++;
			}
		}
	}
	//отрисовка кораблей
	this.drawLiveShips = function () {
		for (var k = 0; k < this.maxShipSize ; k++) {
			for (var m = 0; m < (this.maxShipSize - k); m++) {
				if (this.ships[k][m].lives != 0) {
					this.ships[k][m].draw(false);
				}
			}
		}	
	}
}
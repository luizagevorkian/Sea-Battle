seaBattle.Cell = function (x, y) {
	var empty = 'empty',
		miss = 'miss',
		ship = 'ship-horizontal',
		shipBegin = 'ship-begin-horizontal',
		shipEnd = 'ship-end-horizontal',
		ship = 'ship-vertical',
		shipBegin = 'ship-begin-vertical',
		shipEnd = 'ship-end-vertical',
		shipCrashed = 'ship-crashed',
		sank = 'sank';
		
	var handlerClick = null;
		
	this.x = x;
	this.y = y;
	this.state = empty;
	this.ship = null;
	this.td = null;
	this.field = null;
	
	this.setClassName = function (state) {
		this.td.className = (state == 'sank') ? state : ('standart-cell '+ state);   
	}
//данные по таблице
	this.createElement = function (attachment, randomly) {
		this.td = document.createElement('td');
		this.td.setAttribute('data-x', this.x);
		this.td.setAttribute('data-y', this.y);

		//вражеское поле
		if (attachment == 'enemyField') {
			this.td.className = 'standart-cell '+'empty';
			handlerClick = this.shoot.bind(this);
			this.td.addEventListener('click', handlerClick );
		}
		else {
			// поле игрока
			if (randomly) {
				this.td.className = 'standart-cell '+this.state;
			}
		
			else {
				this.td.className = 'standart-cell '+this.state;
				handlerClick = this.clicked.bind(this);
				this.td.addEventListener('click', handlerClick);
			}
		}
		return this.td;
	};
	//расположение корабля
	this.clicked = function () {
		this.field.arrangeShip(this.x, this.y);
	}
		//обработчик выстрела	
	this.shoot = function (event) {
		var shotResult = this.checkShot();
		this.delEvent('click', handlerClick);
		seaBattle.theGame.priority(shotResult);
	}

	
	this.delEvent = function (event) {
		this.td.removeEventListener(event, handlerClick );
	}
	
	//показывает итог выстрела
	this.checkShot = function () {
		if (this.state == 'empty') {
					this.state ='miss';
		}
		else {
			this.ship.lives --;
			if (this.ship.lives == 0) {
				this.ship.draw ('sank');
				this.state = 'sank';
			}
			else {
				this.state = 'ship-crashed';
			}
		}
		this.setClassName(this.state);
		return this.state;
	}	
}
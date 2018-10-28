// Enemies our player must avoid

class Enemy {
  constructor(x,y,speed) {
    this.sprite = 'images/enemy-bug.png'
    this.x= x
    this.y= y
    this.speed = speed
    this.getNewY = (num) => {
      let y
      if (num > .66) y = 300
      if (num <= .66 && num > .33) y = 150
      if (num <= .33 && num > .2) y = 50
      if (num <= .20) y = 225
      return y
    }
    this.drawCollisionBox = (x,y) => {
      let x1 = x - 40
      let x2 = x + 40
      let y1 = y - 20
      let y2 = y + 20
      return { x1, y1, x2, y2 }
    }

  }


  update(dt) {
    this.x = (this.x + this.speed)
    this.render()

    // if the enemy goes off screen, destroy it, create a new enemy sometime between 0 and 3 seconds
    if (this.x > 505) {
      allEnemies.splice(allEnemies.indexOf(this),1)
      let wait = 6000 * Math.random()
      let newSpeed = (4 * Math.random()) +.5
      let newY = this.getNewY(Math.random())
      // kill offscreen enemies and generate extra new ones if someone's going really slow
      if (newSpeed < 2 && allEnemies.length < 5) setTimeout(() => {allEnemies.push(new Enemy(-100, newY, 4.5))}, 1000)
      // ...but don't get too crazy with it now
      if (allEnemies.length < 8) setTimeout(() => {allEnemies.push(new Enemy(-100, this.y, newSpeed))},wait)
    }
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
  constructor(x,y) {
    this.sprite = 'images/char-boy.png'
    this.x = x //201
    this.y = y //420
    this.drawCollisionBox = (x,y) => {
      let x1 = x - 20
      let x2 = x + 20
      let y1 = y - 20
      let y2 = y + 20
      return { x1, y1, x2, y2 }
    }
    this.movement = true
    this.checkPlayerWon = () => {
      if (this.y < 50) return true
    }
    this.disableMovement = () => {
      this.movement = false
    }
  }

  handleInput(direction) {
    let directionHandler = {
      left:   ()  =>   { if (this.x > 2) this.x = this.x - 100 },
      right:  ()  =>   { if (this.x < 400) this.x = this.x + 100 },
      down:   ()  =>   { if (this.y < 400) this.y = this.y + 85 },
      up:     ()  =>   { if (this.y > 10) this.y = this.y - 85 }
    }
    if (this.movement) return directionHandler[direction]()
  }
  update() {
    let playerCollisionBox = this.drawCollisionBox(this.x,this.y)
    for (let enemy of allEnemies) {
      let enemyCollisionBox = enemy.drawCollisionBox(enemy.x,enemy.y)
      if (enemyCollisionBox.x2 > playerCollisionBox.x1
          && playerCollisionBox.x2 > enemyCollisionBox.x1
          && enemyCollisionBox.y2 > playerCollisionBox.y1
          && playerCollisionBox.y2 > enemyCollisionBox.y1) {
            player.x = 201
            player.y = 410
          }
    }

  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
    if (this.checkPlayerWon()) {
      ctx.drawImage(Resources.get('images/win-png--313.png'), 100, 150)
      this.disableMovement()
    }

  }
}

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

let allEnemies = [new Enemy(10,50,1),new Enemy(10,150,2),new Enemy(10,300,3)]
let player = new Player(201,410)

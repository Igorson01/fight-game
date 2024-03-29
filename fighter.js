const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.9

//background
const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/background1.png'
})

//shop
const shop = new Sprite({
    position: {
        x:630,
        y:128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

//player
const player = new Fighter({
    position: {
    x:35,
    y:0
    },
    velocity:{
    x:0,
    y:0
    },
    offset: {
    x:0,
    y:0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall : {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1 : {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit : {
            imageSrc: './img/samuraiMack/Take Hit.png',
            framesMax: 4
        },
        death : {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        },
        dodge : {
            imageSrc: './img/samuraiMack/Attack2.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: { 
            x:100,
            y:50
        },
        width:156,
        height:50 
      }
})


//enemy 
const enemy = new Fighter({
    position: { 
    x:canvas.width - 100,
    y:0
    },
    velocity: {
    x:0,
    y:0
    },
    offset: {
    x:-50,
    y:0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall : {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1 : {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit : {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death : {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        },
        dodge : {
            imageSrc: './img/kenji/Attack2.png',
            framesMax: 4
        }
    },
    attackBox: {
        offset: { 
            x:-172,
            y:50
        },
        width:150,
        height:50 
      }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    j: {
        pressed: false
    },
    l: {
        pressed: false
    },
    k: {
        pressed: false
    },
    s: {
        pressed: false
    },
    r: {
        pressed: false
    },
    p: {
        pressed: false
    }
}
const projectiles = []


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    projectiles.forEach(projectile=>{
        projectile.update()
    })
    


    
    // player movement
    player.velocity.x = 0

    if(keys.a.pressed && player.lastKey === 'a' && player.position.x >= 0 + 35 && player.position.x <= enemy.position.x + 100) {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if(keys.d.pressed && player.lastKey === 'd' && player.position.x <= canvas.width - 80 && player.position.x <= enemy.position.x - 100) {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    
    // jumping
    if(player.velocity.y < 0 ) {
        player.switchSprite('jump')
        
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
        
    } 

    // enemy movement
    enemy.velocity.x = 0

    if(keys.j.pressed && enemy.lastKey === 'j' && enemy.position.x >= 0 + 10 && enemy.position.x >= player.position.x + 100) {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if(keys.l.pressed && enemy.lastKey === 'l' && enemy.position.x <= canvas.width - 100 && enemy.position.x >= player.position.x - 100) {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    
    //enemy jumping
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect for collision enemy
    projectiles.forEach(projectile=>{
        if(projectile.position.y - projectile.radius <= enemy.position.y + enemy.height &&
            projectile.position.x + projectile.radius >=
            enemy.position.x && projectile.position.x - projectile.radius <= enemy.position.x + enemy.width&&
            projectile.position.y + projectile.radius >= enemy.position.y
            ) {
                enemy.takeHit()
                enemy.health -= 0.1
                gsap.to('#enemyHealth', {
                width: enemy.health + '%'
                }) 
            }
        })
    //detect for collision player
    projectiles.forEach(projectile=>{
        if(projectile.position.y - projectile.radius <= player.position.y + player.height &&
            projectile.position.x + projectile.radius >=
            player.position.x && projectile.position.x - projectile.radius <= player.position.x + player.width&&
            projectile.position.y + projectile.radius >= player.position.y
            ) {
                player.takeHit()
                player.health -= 0.1
                gsap.to('#playerHealth', {
                width: player.health + '%'
                }) 
            }
        })
    
    //player
    if (
        keys.k.pressed && enemy.lastKey === 'k') { 
        enemy.dodge()
    }
    else if(
        rectangularCollision({
            rectangle1:player,
            rectangle2:enemy
        }) &&
         player.isAttacking && !enemy.isDodging && !keys.k.pressed
         ) {
         enemy.takeHit()
         player.isAttacking = false
         enemy.health -= 20
         gsap.to('#enemyHealth', {
            width: enemy.health + '%'
         })  
    }
    

    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    } else if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
        
    }
    if(player.isDodging && player.framesCurrent === 6) {
        player.isDodging = false
    } else if(enemy.isDodging && enemy.framesCurrent === 3) {
        enemy.isDodging = false
    }
    //enemy 
    if (
        keys.s.pressed && enemy.lastKey === 's'){ 
        player.dodge()
    }
    else if(
        rectangularCollision({
            rectangle1:enemy,
            rectangle2:player
        }) &&
         enemy.isAttacking && !player.isDodging && !keys.s.pressed
         ) {
         player.takeHit()
         enemy.isAttacking = false
         player.health -= 10
         gsap.to('#playerHealth', {
            width: player.health + '%'
         })
         enemy.lifeSteal()
         gsap.to('#enemyHealth', {
            width: enemy.health + '%'
         })
    }

}

animate()

window.addEventListener('keydown' ,(event)=>{
    if(!player.isDead && !enemy.isDead) {
   
    switch(event.key) {
        // player keys
        case 'd' :
            keys.d.pressed = true
            player.lastKey = 'd'
            break
         case 'a' :
            keys.a.pressed = true
            player.lastKey = 'a'
            break
         case 'w' :
         if(player.velocity.y <= 0 && player.position.y >= 300) { 
            player.velocity.y = -20
            keys.w.pressed = true
            }
            break
         case 'e' :
            player.attack()
            break
        case 's' :
            player.dodge()
            keys.s.pressed = true
            break
        case 'r' :
            keys.r.pressed = true
            projectiles.push(
            new Projectile({
                position:{
                    x:player.position.x  + player.width * 2,
                    y:player.position.y  + player.height /2
                },
                velocity:{
                    x:10,
                    y:0
                }
            })
         )
         break
        
     }
    }
    if(!enemy.isDead && !player.isDead) { 
    switch(event.key) { 
         // enemy keys
         case 'l' :
            keys.l.pressed = true
            enemy.lastKey = 'l'
            break
         case 'j' :
            keys.j.pressed = true
            enemy.lastKey = 'j'
            break
         case 'i' :
            if(enemy.velocity.y <= 0 && enemy.position.y >= 300) {
            enemy.velocity.y = -20
            }
            break
         case 'o' :
            enemy.attack()
            break
        case 'k' :
            enemy.dodge()
            keys.k.pressed = true
            break
        case 'p' :
            keys.p.pressed = true
            projectiles.push(
            new Projectile({
                position:{
                    x:enemy.position.x  - enemy.width ,
                    y:enemy.position.y  + enemy.height /2
                },
                velocity:{
                    x:-10,
                    y:0
                }
            })
         )
         break
     }
    }
    
})
window.addEventListener('keyup' , (event)=>{
    //player keys
    switch(event.key) {
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :           
            keys.a.pressed = false
            break
        case 's' :           
            keys.s.pressed = false
            break
        case 'r' :           
            keys.r.pressed = false
            break
    
    }
    //enemy keys
    switch(event.key) { 
        case 'l' :
            keys.l.pressed = false
            break
        case 'j' :           
            keys.j.pressed = false
            break
        case 'k' :
            keys.k.pressed = false
            break
        case 'p' :
            keys.p.pressed = false
            break
    }
    
})

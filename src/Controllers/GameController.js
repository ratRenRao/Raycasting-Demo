/**
 * Created by branric on 7/14/2017.
 */
import React, { Component } from 'react'
//import RaycastGraphics from "./GraphicsController";
//import {Controls} from "GraphicsController"
//import Player from 'PlayerController'
import SkyImage from '../assets/deathvalley_panorama.jpg'
import WallImage from '../assets/wall_texture.jpg'
import './GameController.css'

const CIRCLE = Math.PI * 2;

class GameController extends Component {
    constructor() {
        super();
        let map = new Map(24);

        this.player = new Player(15.3, -1.2, Math.PI * 0.3);
        this.controls = new Controls();
        this.loop = new GameLoop();
        //map.randomize();
        this.map = map;
        this.resolution = 700;

        this.state = {
            // resolution: 1080,
            // focalLength: 0.8,
            // left: false,
            // right: false,
            // forward: false,
            // backward: false,
            // player: player,
            // map: map,
            // loop: loop,
            // controls: controls,
            // context: null,
        };
    }

    render() {
        return (
            <div id="mainDiv" onKeyDown={(e) => this.controls.handleKeyPressed(e)} onKeyUp={(e) => this.controls.handleKeyReleased(e)} tabIndex="0">
                <button type="button" onClick={() => this.start(this.controls, this.map, this.player)} >Start</button>
                <canvas width={this.resolution} height={this.resolution} ref={(x) => this.canvas = x} />
            </div>
        );
    }

    start(controls, map, player) {
        let camera = new Camera(this.canvas, this.resolution, 0.8);

        this.loop.start(function frame(seconds) {
            map.update(seconds);
            player.update(controls, map, seconds);
            camera.draw(player, map);
        });
    }
}

class Player{

    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.paces = 0;
        //this.weapon = new Bitmap('assets/knife_hand.png', 319, 320);
    }

    rotate(angle) {
        this.direction =  (this.direction + angle + CIRCLE) % (CIRCLE);
    }

    walk(distance, map) {
        let dx = Math.cos(this.direction) * distance;
        let dy = Math.sin(this.direction) * distance;
        if (map.get(this.x + dx, this.y) <= 0) this.x = this.x + dx;
        if (map.get(this.x, this.y + dy) <= 0) this.y = this.y + dy;
        this.paces = this.paces + distance;
    }

    update(controls, map, seconds) {
        if (controls.left) this.rotate(-Math.PI * seconds);
        if (controls.right) this.rotate(Math.PI * seconds);
        if (controls.forward) this.walk(3 * seconds, map);
        if (controls.backward) this.walk(-3 * seconds, map);
    }
}

class Controls{
    constructor() {
        this.left = false;
        this.right = false;
        this.forward = false;
        this.backward = false;
    }

    handleKeyPressed(e) {
        if (e.key === 'a')
        //left
            this.left = true;
        if (e.key === 'd')
        //right
            this.right = true;
        if (e.key === 'w')
        //forward
            this.forward = true;
        if (e.key === 's')
        //backward
            this.backward = true;
    }

    handleKeyReleased(e) {
        if (e.key === 'a')
        //left
            this.left = false;
        if (e.key === 'd')
        //right
            this.right = false;
        if (e.key === 'w')
        //forward
            this.forward = false;
        if (e.key === 's')
        //backward
            this.backward = false;

        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    }
}

class GameLoop {
    constructor() {
        this.frame = this.frame.bind(this);
        this.lastTime = 0;
        this.callback = function () {
        };
    }

    start(callback) {
        this.callback = callback;
        requestAnimationFrame(this.frame);
    };

    frame(time) {
        let seconds = (time - this.lastTime) / 1000;
        this.lastTime = time;
        if (seconds < 0.2) this.callback(seconds);
        requestAnimationFrame(this.frame);
    };
}

class Bitmap{
    constructor(src, width, height) {
        this.image = new Image();
        this.image.src = src;
        this.width = width;
        this.height = height;
    }
}

class Map{
    constructor(size) {
        this.size = size;
        this.wallGrid = //new Uint8Array(size * size);
            [
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,1,0,1,0,0,0,1],
                    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1],
                    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,1,0,1,0,1,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
                    [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
                    [1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
                    [1,1,0,0,0,0,5,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
                    [1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
                    [1,1,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
                    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ];
        this.skybox = new Bitmap(SkyImage, 2000, 750);
        this.wallTexture = new Bitmap(WallImage, 1024, 1024);
        this.light = 0;
    }

    get(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1;
        return this.wallGrid[y * this.size + x];
    }

    randomize() {
        for (let i = 0; i < this.size * this.size; i++) {
            this.wallGrid[i] = Math.random() < 0.3 ? 1 : 0;
        }
    }

    cast(player, angle, range) {
        let self = this;
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        let noWall = { length2: Infinity };
        return ray({ x: player.x, y: player.y, height: 0, distance: 0 });

        function ray(origin) {
            let stepX = step(sin, cos, origin.x, origin.y, false);
            let stepY = step(cos, sin, origin.y, origin.x, true);
            let nextStep = stepX.length2 < stepY.length2
                ? inspect(stepX, 1, 0, origin.distance, stepX.y)
                : inspect(stepY, 0, 1, origin.distance, stepY.x);
            if (nextStep.distance > range) return [origin];
            return [origin].concat(ray(nextStep));
        }

        function step(rise, run, x, y, inverted) {
            if (run === 0) return noWall;
            let dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
            let dy = dx * (rise / run);
            return {
                x: inverted ? y + dy : x + dx,
                y: inverted ? x + dx : y + dy,
                length2: (dx * dx) + (dy * dy)
            };
        }

        function inspect(step, shiftX, shiftY, distance, offset) {
            let dx = cos < 0 ? shiftX : 0;
            let dy = sin < 0 ? shiftY : 0;
            step.height = self.get(step.x - dx, step.y - dy);
            step.distance = distance + Math.sqrt(step.length2);
            if (shiftX) step.shading = cos < 0 ? 2 : 0;
            else step.shading = sin < 0 ? 2 : 1;
            step.offset = offset - Math.floor(offset);
            return step;
        }
    }

    update(seconds) {
        if (this.light > 0) this.light = Math.max(this.light - 10 * seconds, 0);
        else if (Math.random() * 5 < seconds) this.light = 2;
    }
}

class Camera {
    constructor(canvas, resolution, focalLength) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width + window.innerWidth * 0.5;
        this.height = canvas.height + window.innerHeight * 0.5;
        this.resolution = resolution;
        this.spacing = this.width / resolution;
        this.focalLength = focalLength || 0.8;
        this.range = 14;
        this.lightRange = 50;
        this.scale = (this.width + this.height) / 1200;
    }

    draw(player, map) {
        this.drawSky(player.direction, map.skybox, map.light);
        this.drawColumns(player, map);
        //this.drawWeapon(player.weapon, player.paces);
    }

    drawSky(direction, sky, ambient) {
        let width = sky.width * (this.height / sky.height) * 2;
        let left = (direction / CIRCLE) * -width;
        this.ctx.save();
        this.ctx.drawImage(sky.image, left, 0, width, this.height);
        if (left < width - this.width) {
            this.ctx.drawImage(sky.image, left + width, 0, width, this.height);
        }
        if (ambient > 0) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.globalAlpha = ambient * 0.1;
            this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
        }
        this.ctx.restore();
    }

    drawColumns(player, map) {
        this.ctx.save();
        for (let column = 0; column < this.resolution; column++) {
            let angle = this.findRayAngle(column);
            let ray = map.cast(player, player.direction + angle, this.range);
            this.drawColumn(column, ray, angle, map);
        }
        this.ctx.restore();
    }

    findRayAngle(column) {
        let x = column / this.resolution - 0.5;
        return Math.atan2(x, this.focalLength);
    }

    drawColumn(column, ray, angle, map) {
        let ctx = this.ctx;
        let texture = map.wallTexture;
        let left = Math.floor(column * this.spacing);
        let width = Math.ceil(this.spacing);
        let hit = -1;
        while (++hit < ray.length && ray[hit].height <= 0) {
            for (let s = ray.length - 1; s >= 0; s--) {
                let step = ray[s];
                let rainDrops = Math.pow(Math.random(), 2) * s;
                let rain = (rainDrops > 0) && this.project(0.1, angle, step.distance);
                if (s === hit) {
                    let textureX = Math.floor(texture.width * step.offset);
                    let wall = this.project(step.height, angle, step.distance);
                    ctx.globalAlpha = 1;
                    ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);

                    ctx.fillStyle = '#000000';
                    ctx.globalAlpha = Math.max((step.distance + step.shading) / this.lightRange - map.light, 0);
                    ctx.fillRect(left, wall.top, width, wall.height);
                }

                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.15;
                //while (--rainDrops > 0) ctx.fillRect(left, Math.random() * rain.top, 1, 4/*rain.height*/);
            }
        }
    }

    drawWeapon(weapon, paces) {
        let bobX = Math.cos(paces * 2) * this.scale * 6;
        let bobY = Math.sin(paces * 4) * this.scale * 6;
        let left = this.width * 0.66 + bobX;
        let top = this.height * 0.6 + bobY;
        this.ctx.drawImage(weapon.image, left, top, weapon.width * this.scale, weapon.height * this.scale);
    }

    project(height, angle, distance) {
        let z = distance * Math.cos(angle);
        let wallHeight = this.height * height / z;
        let bottom = this.height / 2 * (1 + 1 / z);
        return {
            top: bottom - wallHeight,
            height: wallHeight
        };
    }
}

export default GameController;
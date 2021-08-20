/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
// Basic Vector
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    update() {
        this.len = this.length;
        this.dir = this.direction;
    }
    isShorterThan(d) {
        return this.x * this.x + this.y * this.y <= d * d;
    }
    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    get direction() {
        return Math.atan2(this.y, this.x);
    }
};
// Null vector that will turn a vector into null.
function nullVector(v) {
    v.x = 0;
    v.y = 0;
};
// Gets a priority queue and returns the nearest.
function nearest(array, location, test = () => true) {
    let list = new goog.structs.PriorityQueue();
    let d;
    if (!array.length) return undefined;
    for (let i = 0; i < array.length; i++) {
        let instance = array[i];
        d = Math.pow(instance.x - location.x, 2) + Math.pow(instance.y - location.y, 2);
        if (test(instance, d)) list.enqueue(d, instance);
    };
    return list.dequeue();
}

function timeOfImpact(p, v, s) {
    // Requires relative position and velocity to aiming point
    let a = s * s - (v.x * v.x + v.y * v.y);
    let b = p.x * v.x + p.y * v.y;
    let c = p.x * p.x + p.y * p.y;
    let d = b * b + a * c;
    let t = 0;
    if (d >= 0) t = Math.max(0, (b + Math.sqrt(d)) / a);
    return t * 0.9;
}
module.exports = {
    Vector,
    nullVector,
    nearest,
    timeOfImpact
};

/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
// Define IOs (AI)
class IO {
    constructor(body) {
        this.body = body;
        this.acceptsFromTop = true;
    }
    think() {
        return {
            target: null,
            goal: null,
            fire: null,
            main: null,
            alt: null,
            power: null,
        };
    }
}
class io_doNothing extends IO {
    constructor(body) {
        super(body);
        this.acceptsFromTop = false;
    }
    think() {
        return {
            goal: {
                x: this.body.x,
                y: this.body.y,
            },
            main: false,
            alt: false,
            fire: false,
        };
    }
}
class io_moveInCircles extends IO {
    constructor(body) {
        super(body);
        this.acceptsFromTop = false;
        this.timer = ran.irandom(10) + 3;
        this.goal = {
            x: this.body.x + 10 * Math.cos(-this.body.facing),
            y: this.body.y + 10 * Math.sin(-this.body.facing),
        };
    }
    think() {
        if (!(this.timer--)) {
            this.timer = 10;
            this.goal = {
                x: this.body.x + 10 * Math.cos(-this.body.facing),
                y: this.body.y + 10 * Math.sin(-this.body.facing),
            };
        }
        return {
            goal: this.goal
        };
    }
}
class io_listenToPlayer extends IO {
    constructor(b, p) {
        super(b);
        this.player = p;
        this.acceptsFromTop = false;
    }
    // THE PLAYER MUST HAVE A VALID COMMAND AND TARGET OBJECT
    think() {
        let targ = {
            x: this.player.target.x,
            y: this.player.target.y,
        };
        if (this.player.command.autospin) {
            let kk = Math.atan2(this.body.control.target.y, this.body.control.target.x) + 0.02;
            targ = {
                x: 100 * Math.cos(kk),
                y: 100 * Math.sin(kk),
            };
        }
        if (this.body.invuln) {
            if (this.player.command.right || this.player.command.left || this.player.command.up || this.player.command.down || this.player.command.lmb) {
                this.body.invuln = false;
            }
        }
        this.body.autoOverride = this.player.command.override;
        let goal = {
            x: this.player.command.right - this.player.command.left,
            y: this.player.command.down - this.player.command.up
        };
        /*if (c.SPACE_MODE) {
            let spaceOffsetAngle = Math.atan2(room.width / 2 - this.body.x, room.height / 2 - this.body.y);
            goal = rotatePoint(goal, -spaceOffsetAngle);
        }*/
        return {
            target: targ,
            goal: {
                x: this.body.x + goal.x,
                y: this.body.y + goal.y
            },
            fire: this.player.command.lmb || this.player.command.autofire,
            main: this.player.command.lmb || this.player.command.autospin || this.player.command.autofire,
            alt: this.player.command.rmb,
        };
    }
}
class io_mapTargetToGoal extends IO {
    constructor(b) {
        super(b);
    }
    think(input) {
        if (this.body.master.master.controllingSquadron && this.body.master.master.control.target && !this.body.settings.independent) {
            input.target = this.body.master.master.control.target;
            return {
                goal: {
                    x: input.target.x + this.body.x,
                    y: input.target.y + this.body.y,
                },
                power: 1
            }
        }
        if (input.main || input.alt) {
            return {
                goal: {
                    x: input.target.x + this.body.x,
                    y: input.target.y + this.body.y,
                },
                power: 1,
            };
        }
    }
}
class io_plane extends IO {
    constructor(b) {
        super(b);
    }
    think(input) {
        if (this.body.master.master.controllingSquadron && this.body.master.master.control.target) {
            input.target = this.body.master.master.control.target;
            return {
                goal: {
                    x: input.target.x + this.body.x,
                    y: input.target.y + this.body.y,
                },
                power: 1
            }
        }
    }
}
class io_boomerang extends IO {
    constructor(b) {
        super(b);
        this.r = 0;
        this.b = b;
        this.m = b.master;
        this.turnover = false;
        let len = 10 * util.getDistance({
            x: 0,
            y: 0
        }, b.master.control.target);
        this.myGoal = {
            x: 3 * b.master.control.target.x + b.master.x,
            y: 3 * b.master.control.target.y + b.master.y,
        };
    }
    think(input) {
        if (this.b.range > this.r) this.r = this.b.range;
        let t = 1; //1 - Math.sin(2 * Math.PI * this.b.range / this.r) || 1;
        if (!this.turnover) {
            if (this.r && this.b.range < this.r * 0.5) {
                this.turnover = true;
            }
            return {
                goal: this.myGoal,
                power: t,
            };
        } else {
            return {
                goal: {
                    x: this.m.x,
                    y: this.m.y,
                },
                power: t,
            };
        }
    }
}
class io_goToMasterTarget extends IO {
    constructor(body) {
        super(body);
        this.myGoal = {
            x: body.master.control.target.x + body.master.x,
            y: body.master.control.target.y + body.master.y,
        };
        this.countdown = 5;
    }
    think() {
        if (this.countdown) {
            if (util.getDistance(this.body, this.myGoal) < 1) {
                this.countdown--;
            }
            return {
                goal: {
                    x: this.myGoal.x,
                    y: this.myGoal.y,
                },
            };
        }
    }
}
class io_canRepel extends IO {
    constructor(b) {
        super(b);
    }
    think(input) {
        if (input.alt && input.target) {
            return {
                target: {
                    x: -input.target.x,
                    y: -input.target.y,
                },
                main: true,
            };
        }
    }
}
class io_alwaysFire extends IO {
    constructor(body) {
        super(body);
    }
    think() {
        return {
            fire: true,
        };
    }
}
class io_targetSelf extends IO {
    constructor(body) {
        super(body);
    }
    think() {
        return {
            main: true,
            target: {
                x: 0,
                y: 0,
            },
        };
    }
}
class io_mapAltToFire extends IO {
    constructor(body) {
        super(body);
    }
    think(input) {
        if (input.alt) {
            return {
                fire: true,
            };
        }
    }
}
class io_onlyAcceptInArc extends IO {
    constructor(body) {
        super(body);
    }
    think(input) {
        if (input.target && this.body.firingArc != null) {
            if (Math.abs(util.angleDifference(Math.atan2(input.target.y, input.target.x), this.body.firingArc[0])) >= this.body.firingArc[1]) {
                return {
                    fire: false,
                    alt: false,
                    main: false,
                };
            }
        }
    }
}
class io_onlyFireWhenInRange extends IO {
    constructor(body) {
        super(body);
    }
    think(input) {
        if (input.target && this.body.firingArc != null) {
            if (Math.abs(util.angleDifference(Math.atan2(input.target.y, input.target.x), this.body.facing)) >= .025) {
                return {
                    fire: false
                };
            }
        }
    }
}
class io_nearestDifferentMaster extends IO {
    constructor(body) {
        super(body);
        this.targetLock = undefined;
        this.tick = ran.irandom(30);
        this.lead = 0;
        this.validTargets = this.buildList(body.fov / 2);
        this.oldHealth = body.health.display();
    }
    buildList(range) {
        // Establish whom we judge in reference to
        let m = {
                x: this.body.x,
                y: this.body.y,
            },
            mm = {
                x: this.body.master.master.x,
                y: this.body.master.master.y,
                fov: this.body.master.master.fov
            };
        if (this.body.aiSettings.blind) range = mm.fov / 2;
        let mostDangerous = 0,
            sqrRange = range * range,
            keepTarget = false;
        // Filter through everybody...
        let out = [];
        for (let i = 0, length = entities.length; i < length; i ++) if (this.checkEntity(entities[i], m, mm, range) != null) out.push(entities[i]);
        if (!out.length) return [];
        out = out.map((e) => {
            // Only look at those within range and arc (more expensive, so we only do it on the few)
            let yaboi = false;
            if (this.body.aiSettings.blind || ((this.body.x - e.x) * (this.body.x - e.x) + (this.body.y - e.y) * (this.body.y - e.y) < sqrRange)) {
                if (this.body.firingArc == null || this.body.aiSettings.view360) {
                    yaboi = true;
                } else if (Math.abs(util.angleDifference(util.getDirection(this.body, e), this.body.firingArc[0])) < this.body.firingArc[1]) yaboi = true;
            }
            if (yaboi) {
                mostDangerous = Math.max(e.dangerValue, mostDangerous);
                return e;
            }
        }).filter((e) => {
            // Only return the highest tier of danger
            if (e != null) {
                if (this.body.aiSettings.farm || e.dangerValue === mostDangerous) {
                    if (this.targetLock) {
                        if (e.id === this.targetLock.id) keepTarget = true;
                    }
                    return e;
                }
            }
        });
        // Reset target if it's not in there
        if (!keepTarget) this.targetLock = undefined;
        return out;
    }
    checkEntity(e, m, mm, range) {
        // Only look at those within our view, and our parent's view, not dead, not our kind, not a bullet/trap/block etc
        const validType = this.body.settings.targetPlanes ? e.isPlane : this.body.settings.targetMissiles ? e.settings.missile : this.body.settings.targetAmmo ? (e.type === "drone" || e.type === "minion" || e.type === "swarm" || e.type === "crasher") : (e.type === "tank" || e.type === "crasher" || e.type === "miniboss" || (!this.body.aiSettings.shapefriend && e.type === 'food'));
        if (e.master.master.team !== this.body.master.master.team && e.health.amount > 0 && e.master.master.team !== 101 && !e.invuln && !e.passive && (this.body.seeInvisable || e.alpha > 0.25) && validType && e.dangerValue > 0) {
            if ((this.body.aiSettings.blind ? (util.getDistance(e, mm) < mm.fov / 2) : (Math.abs(e.x - m.x) < range && Math.abs(e.y - m.y) < range))) {
                if (!c.SANDBOX || this.body.master.master.sandboxId === e.master.master.sandboxId) {
                    if (this.body.isDominator) {
                        if (!e.isDominator) {
                            return e;
                        }
                    } else {
                        return e;
                    }
                }
            }
        }
        return null;
    }
    think(input) {
        // Override target lock upon other commands
        if (input.main || input.alt || this.body.master.autoOverride) {
            this.targetLock = undefined;
            return {};
        }
        // Otherwise, consider how fast we can either move to ram it or shoot at a potiential target.
        let tracking = this.body.topSpeed,
            range = this.body.fov / 2;
        // Use whether we have functional guns to decide
        for (let i = 0; i < this.body.guns.length; i++) {
            if (this.body.guns[i].canShoot && !this.body.aiSettings.skynet) {
                let v = this.body.guns[i].getTracking();
                tracking = v.speed;
                if (!this.body.isPlayer || this.body.type === "miniboss" || this.body.master !== this.body) range = 640 * this.body.FOV;
                else range = Math.min(range, (v.speed || 1) * (v.range || 90));
                break;
            }
        }
        // Check if my target's alive
        if (this.targetLock) {
            if (this.targetLock.health.amount <= 0) {
                this.targetLock = undefined;
                this.tick = 100;
            }
        }
        // Think damn hard
        if (this.body.aiSettings.blind && this.targetLock != null) { // Always run if we rely on the control center for instructions
            const e = this.targetLock;
            const mm = this.body.master.master;
            if (util.getDistance(e, mm) > mm.fov / 2) { // Range limiting effects
                this.targetLock = null;
            }
        }
        if (this.tick ++ > 15 * roomSpeed) {
            this.tick = 0;
            this.validTargets = this.buildList(range);
            // Ditch our old target if it's invalid
            if (this.targetLock && this.validTargets.indexOf(this.targetLock) === -1) {
                this.targetLock = undefined;
            }
            // Lock new target if we still don't have one.
            if (this.targetLock == null && this.validTargets.length) {
                this.targetLock = (this.validTargets.length === 1) ? this.validTargets[0] : nearest(this.validTargets, {
                    x: this.body.x,
                    y: this.body.y
                });
                this.tick = -90;
            }
        }
        // Consider how fast it's moving and shoot at it
        if (this.targetLock != null) {
            let radial = this.targetLock.velocity;
            let diff = {
                x: this.targetLock.x - this.body.x,
                y: this.targetLock.y - this.body.y,
            };
            /// Refresh lead time
            if (this.tick % 4 === 0) {
                this.lead = 0;
                // Find lead time (or don't)
                if (!this.body.aiSettings.chase) {
                    let toi = timeOfImpact(diff, radial, tracking);
                    this.lead = toi;
                }
            }
            // And return our aim
            return {
                target: {
                    x: diff.x + this.lead * radial.x,
                    y: diff.y + this.lead * radial.y,
                },
                fire: true,
                main: true,
            };
        }
        return {};
    }
}
class io_avoid extends IO {
    constructor(body) {
        super(body);
    }
    think(input) {
        let masterId = this.body.master.id;
        let range = this.body.size * this.body.size * 100;
        this.avoid = nearest(entities, {
            x: this.body.x,
            y: this.body.y
        }, function(test, sqrdst) {
            return (test.master.id !== masterId && (test.type === "tank" || test.type === 'bullet' || test.type === 'drone' || test.type === 'swarm' || test.type === 'trap' || test.type === 'block') && sqrdst < range);
        });
        // Aim at that target
        if (this.avoid != null) {
            // Consider how fast it's moving.
            let delt = new Vector(this.body.velocity.x - this.avoid.velocity.x, this.body.velocity.y - this.avoid.velocity.y);
            let diff = new Vector(this.avoid.x - this.body.x, this.avoid.y - this.body.y);
            let comp = (delt.x * diff.x + delt.y * diff.y) / delt.length / diff.length;
            let goal = {};
            if (comp > 0) {
                if (input.goal) {
                    let goalDist = Math.sqrt(range / (input.goal.x * input.goal.x + input.goal.y * input.goal.y));
                    goal = {
                        x: input.goal.x * goalDist - diff.x * comp,
                        y: input.goal.y * goalDist - diff.y * comp,
                    };
                } else {
                    goal = {
                        x: -diff.x * comp,
                        y: -diff.y * comp,
                    };
                }
                return goal;
            }
        }
    }
}
class io_minion extends IO {
    constructor(body) {
        super(body);
        this.turnwise = 1;
    }
    think(input) {
        if (this.body.aiSettings.reverseDirection && ran.chance(0.005)) {
            this.turnwise = -1 * this.turnwise;
        }
        if (input.target != null && (input.alt || input.main)) {
            let sizeFactor = Math.sqrt(this.body.master.size / this.body.master.SIZE);
            if (this.body.type === "miniboss") sizeFactor = (this.body.master.SIZE / 15) + 0.5;
            let leash = 60 * sizeFactor;
            let orbit = 120 * sizeFactor;
            let repel = 135 * sizeFactor;
            let goal;
            let power = 1;
            let target = new Vector(input.target.x, input.target.y);
            if (input.alt) {
                // Leash
                if (target.length < leash) {
                    goal = {
                        x: this.body.x + target.x,
                        y: this.body.y + target.y,
                    };
                    // Spiral repel
                } else if (target.length < repel) {
                    let dir = -this.turnwise * target.direction + Math.PI / 5;
                    goal = {
                        x: this.body.x + Math.cos(dir),
                        y: this.body.y + Math.sin(dir),
                    };
                    // Free repel
                } else {
                    goal = {
                        x: this.body.x - target.x,
                        y: this.body.y - target.y,
                    };
                }
            } else if (input.main) {
                // Orbit point
                let dir = this.turnwise * target.direction + 0.01;
                goal = {
                    x: this.body.x + target.x - orbit * Math.cos(dir),
                    y: this.body.y + target.y - orbit * Math.sin(dir),
                };
                if (Math.abs(target.length - orbit) < this.body.size * 2) {
                    power = 0.7;
                }
            }
            return {
                goal: goal,
                power: power,
            };
        }
    }
}
class io_hangOutNearMaster extends IO {
    constructor(body) {
        super(body);
        this.acceptsFromTop = false;
        this.orbit = 30;
        this.currentGoal = {
            x: this.body.source.x,
            y: this.body.source.y,
        };
        this.timer = 0;
    }
    think(input) {
        if (this.body.source != this.body) {
            let bound1 = this.orbit * 0.8 + this.body.source.size + this.body.size;
            let bound2 = this.orbit * 1.5 + this.body.source.size + this.body.size;
            let dist = util.getDistance(this.body, this.body.source) + Math.PI / 8;
            let output = {
                target: {
                    x: this.body.velocity.x,
                    y: this.body.velocity.y,
                },
                goal: this.currentGoal,
                power: undefined,
            };
            // Set a goal
            if (dist > bound2 || this.timer > 30) {
                this.timer = 0;
                let dir = util.getDirection(this.body, this.body.source) + Math.PI * ran.random(0.5);
                let len = ran.randomRange(bound1, bound2);
                let x = this.body.source.x - len * Math.cos(dir);
                let y = this.body.source.y - len * Math.sin(dir);
                this.currentGoal = {
                    x: x,
                    y: y,
                };
            }
            if (dist < bound2) {
                output.power = 0.15;
                if (ran.chance(0.3)) {
                    this.timer++;
                }
            }
            return output;
        }
    }
}
class io_spin extends IO {
    constructor(b) {
        super(b);
        this.a = 0;
    }
    think(input) {
        this.a += 0.05;
        let offset = 0;
        if (this.body.bond != null) {
            offset = this.body.bound.angle;
        }
        return {
            target: {
                x: Math.cos(this.a + offset),
                y: Math.sin(this.a + offset),
            },
            main: true,
        };
    }
}
class io_fastspin extends IO {
    constructor(b) {
        super(b);
        this.a = 0;
    }
    think(input) {
        this.a += 0.072;
        let offset = 0;
        if (this.body.bond != null) {
            offset = this.body.bound.angle;
        }
        return {
            target: {
                x: Math.cos(this.a + offset),
                y: Math.sin(this.a + offset),
            },
            main: true,
        };
    }
}
class io_reversespin extends IO {
    constructor(b) {
        super(b);
        this.a = 0;
    }
    think(input) {
        this.a -= 0.05;
        let offset = 0;
        if (this.body.bond != null) {
            offset = this.body.bound.angle;
        }
        return {
            target: {
                x: Math.cos(this.a + offset),
                y: Math.sin(this.a + offset),
            },
            main: true,
        };
    }
}
class io_slowSpin extends IO {
    constructor(b) {
        super(b);
        this.a = 0;
    }
    think(input) {
        this.a += 0.01;
        let offset = 0;
        if (this.body.bond != null) {
            offset = this.body.bound.angle;
        }
        return {
            target: {
                x: Math.cos(this.a + offset),
                y: Math.sin(this.a + offset)
            },
            main: true
        };
    }
}
class io_reverseSlowSpin extends IO {
    constructor(body) {
        super(body)
        this.a = 0
    }
    think(input) {
        this.a -= 0.01;
        let offset = 0
        if (this.body.bond != null) {
            offset = this.body.bound.angle
        }
        return {
            target: {
                x: Math.cos(this.a + offset),
                y: Math.sin(this.a + offset),
            },
            main: true,
        };
    }
}
class io_dontTurn extends IO {
    constructor(b) {
        super(b);
    }
    think(input) {
        return {
            target: {
                x: 1,
                y: 0,
            },
            main: true,
        };
    }
}
class io_dontTurnDominator extends IO {
    constructor(b) {
        super(b);
    }
    think(input) {
        return {
            target: rotatePoint({
                x: 10,
                y: 10
            }, Math.PI / 4),
            main: true,
        };
    }
}
class io_fleeAtLowHealth extends IO {
    constructor(b) {
        super(b);
        this.fear = Math.random() * 0.5;
    }
    think(input) {
        if (input.fire && input.target != null && this.body.health.amount < this.body.health.max * this.fear) {
            return {
                goal: {
                    x: this.body.x - input.target.x,
                    y: this.body.y - input.target.y,
                },
            };
        }
    }
}
class io_botMovement extends IO {
    constructor(body) {
        super(body);
        this.nearEdge = 1;
        this.avoidEdge = false;
        this.timer = 61;
        this.offset = 0;
        this.offset2 = 1;
        this.avoidEdge = 90;
        this.PI180 = Math.PI / 180;
        this.orbit = 0.7 * this.body.fov;
        this.orbit2 = 0.5 * this.body.fov;
        this.wanderGoal = {
            x: ran.randomRange(0, room.width),
            y: ran.randomRange(0, room.height)
        };
        this.dir = 0;
    }
    chooseSpot() {
        this.wanderRoom = Math.random() < 0.8 ? "norm" : "nest";
        return room.randomType(this.wanderRoom);
    }
    think(input) {
        if (!room.isInRoom(this.wanderGoal)) this.wanderGoal = this.chooseSpot();
        this.timer++;
        let goal = {},
            power = 1;
        this.previousNearEdge = JSON.parse(JSON.stringify(this.nearEdge));
        this.nearEdge = "5";
        if (this.body.x < 200) this.nearEdge += "1";
        if (this.body.y < 200) this.nearEdge += "2";
        if (this.body.x > room.width - 200) this.nearEdge += "3";
        if (this.body.y > room.height - 200) this.nearEdge += "4";
        if (this.previousNearEdge !== this.nearEdge) switch (this.nearEdge) {
            case "51":
            case "53":
                this.avoidEdge = /*ran.choose(*/ [90 * this.PI180, 270 * this.PI180] //);
                break;
            case "52":
            case "54":
                this.avoidEdge = /*ran.choose(*/ [180 * this.PI180, 0 * this.PI180] //);
                break;
            case "512":
                this.avoidEdge = /*ran.choose(*/ [90 * this.PI180, 0 * this.PI180] //);
                break;
            case "514":
                this.avoidEdge = /*ran.choose(*/ [270 * this.PI180, 0 * this.PI180] //);
                break;
            case "523":
                this.avoidEdge = /*ran.choose(*/ [90 * this.PI180, 180 * this.PI180] //);
                break;
            case "534":
                this.avoidEdge = /*ran.choose(*/ [270 * this.PI180, 180 * this.PI180] //);
                break;
        }
        if (input.target != null) {
            this.wanderGoal = this.chooseSpot();
            let target = new Vector(input.target.x, input.target.y);
            if (this.timer > 60) {
                this.offset = ran.randomRange(30 * Math.PI / 180, 45 * Math.PI / 180) * this.offset2,
                    this.offset2 *= -1,
                    this.timer = 0;
            }
            if (this.body.health.amount / this.body.health.max > 0.4) {
                if (this.nearEdge === "5") {
                    if (target.length > this.orbit) {
                        goal = {
                            x: (this.body.x) + this.orbit * Math.cos(Math.floor((target.direction) / (Math.PI / 4)) * Math.PI / 4),
                            y: (this.body.y) + this.orbit * Math.sin(Math.floor((target.direction) / (Math.PI / 4)) * Math.PI / 4)
                        }, power = 1
                    } else if (target.length > this.orbit2 && target.length < this.orbit) {
                        goal = {
                            x: (this.body.x) + this.orbit2 * Math.cos(Math.floor((target.direction + this.offset) / Math.PI / 4) * Math.PI / 4),
                            y: (this.body.y) + this.orbit2 * Math.sin(Math.floor((target.direction + this.offset) / Math.PI / 4) * Math.PI / 4),
                        }, power = 1
                    } else {
                        goal = {
                            x: (this.body.x) - this.orbit2 * Math.cos(Math.floor((target.direction) / (Math.PI / 4)) * Math.PI / 4),
                            y: (this.body.y) - this.orbit2 * Math.sin(Math.floor((target.direction) / (Math.PI / 4)) * Math.PI / 4),
                        }, power = 1
                    }
                } else {
                    if (target.length > this.orbit2) {
                        goal = {
                            x: (this.body.x) + 100 * Math.cos(this.avoidEdge[util.angleDifference(target.direction, this.avoidEdge[0]) < util.angleDifference(target.direction, this.avoidEdge[1]) ? 0 : 1]),
                            y: (this.body.y) + 100 * Math.sin(this.avoidEdge[util.angleDifference(target.direction, this.avoidEdge[0]) < util.angleDifference(target.direction, this.avoidEdge[1]) ? 0 : 1])
                        }, power = 1;
                    } else {
                        goal = {
                            x: (this.body.x) + 100 * Math.cos(this.avoidEdge[util.angleDifference(target.direction, this.avoidEdge[0]) < util.angleDifference(target.direction, this.avoidEdge[1]) ? 1 : 0]),
                            y: (this.body.y) + 100 * Math.sin(this.avoidEdge[util.angleDifference(target.direction, this.avoidEdge[0]) < util.angleDifference(target.direction, this.avoidEdge[1]) ? 1 : 0])
                        }, power = 1;
                    }
                }
            } else {
                if (this.nearEdge === "5") {
                    goal = {
                            x: (this.body.x) + 100 * -Math.cos(this.dir + this.offset),
                            y: (this.body.y) + 100 * -Math.sin(this.dir + this.offset)
                        },
                        power = 1;
                } else {
                    goal = {
                        x: (this.body.x) + 100 * Math.cos(this.avoidEdge[Math.abs(target.direction - this.avoidEdge[0]) > Math.abs(target.direction - this.avoidEdge[1]) ? 1 : 0]),
                        y: (this.body.y) + 100 * Math.sin(this.avoidEdge[Math.abs(target.direction - this.avoidEdge[0]) > Math.abs(target.direction - this.avoidEdge[1]) ? 1 : 0])
                    }, power = 1;
                }
            };
        } else {
            goal = this.wanderGoal, power = 1;
            if (util.getDistance(this.wanderGoal, this.body) < 10) {
                this.wanderGoal = this.chooseSpot()
            };
        };
        return {
            goal: goal,
            power: power,
        };
    }
}
class io_droneStabilizer extends IO {
    constructor(b) {
        super(b);
        this.e = false;
    }
    think(input) {
        if (input.alt && !this.e) {
            this.e = true;
            this.body.controllers = this.body.controllers.filter(entry => entry !== this);
            this.body.define(Class.redistributorBullet);
            this.body.skill.set([9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
            this.body.damage *= 10;
            this.body.health.max *= 10;
            this.body.health.amount = this.body.health.max;
        }
    }
}
class io_droneTrap extends IO {
    constructor(b) {
        super(b);
    }
    think(input) {
        if (input.alt) {
            return this.body.define(Class.trap)
        }
    }
}
class io_listenToPlayerStatic extends IO {
    constructor(b, p) {
        super(b);
        this.player = p;
        this.acceptsFromTop = false;
    }
    think() {
        let targ = {
            x: this.player.target.x,
            y: this.player.target.y,
        };
        if (this.player.command.autospin) {
            let kk = Math.atan2(this.body.control.target.y, this.body.control.target.x) + 0.02;
            targ = {
                x: 275 * Math.cos(kk),
                y: 275 * Math.sin(kk),
            };
        }
        if (this.body.invuln && (this.player.command.right || this.player.command.left || this.player.command.up || this.player.command.down || this.player.command.lmb)) {
            this.body.invuln = false;
            if (this.body.invisible[0] === 0) {
                let alpha = this.body.alphaMax
                this.body.alpha = alpha
            }
        }
        this.body.autoOverride = this.body.passive || this.player.command.override;
        return {
            target: targ,
            fire: this.player.command.lmb || this.player.command.autofire,
            main: this.player.command.lmb || this.player.command.autospin || this.player.command.autofire,
            alt: this.player.command.rmb,
            power: 1,
            goal: {
                x: this.body.x,
                y: this.body.y
            }
        };
    }
}
class io_spinWhenIdle extends IO {
    constructor(b) {
        super(b);
        this.a = 0;
    }
    think(input) {
        if (input.target) {
            this.a = Math.atan2(input.target.y, input.target.x);
            return input;
        }
        this.a += 0.02;
        return {
            target: {
                x: Math.cos(this.a),
                y: Math.sin(this.a)
            },
            main: true,
            goal: {
                x: this.body.x,
                y: this.body.y
            }
        };
    }
}
class io_multiboxClone extends IO {
    constructor(b) {
        super(b);
    }
    think(input) {
        if (this.body.multiboxMaster) {
            let control = this.body.multiboxMaster.control;
            control.goal = {
                x: this.body.multiboxMaster.x,
                y: this.body.multiboxMaster.y
            };
            control.power = 1;
            return control;
        }
    }
}
class io_taurusPortal extends IO {
    constructor(body) {
        super(body);
        this.myGoal = {
            x: body.master.control.target.x + body.master.x,
            y: body.master.control.target.y + body.master.y,
        };
    }
    think() {
        this.body.x = this.myGoal.x;
        this.body.y = this.myGoal.y;
    }
}
class io_spinMissile extends IO {
    constructor(body) {
        super(body);
        this.angle = 0;
    }
    think(input) {
        this.angle += (0.125 * (input.alt ? -2 : 1));
        let offset = 0;
        if (this.body.bond != null) {
            offset = this.body.bound.angle;
        }
        return {
            target: {
                x: Math.cos(this.angle + offset),
                y: Math.sin(this.angle + offset),
            },
            main: true
        };
    }
}
const skipBombVariation = Math.PI / 3;
class io_skipBomb extends IO {
    constructor(body) {
        super(body);
        this.goal = {
            x: 0,
            y: 0
        };
        this.lastSkip = Date.now();
    }
    think(input) {
        if (Date.now() - this.lastSkip >= 1250) {
            this.lastSkip = Date.now();
            const angle = this.body.velocity.direction + (Math.random() * (skipBombVariation * 2) + skipBombVariation);
            this.goal = {
                x: Math.cos(angle) * 100,
                y: Math.cos(angle) * 100
            };
        }
        return {
            target: {
                x: this.goal.x,
                y: this.goal.y
            },
            power: 1
        }
    }
}
module.exports = {
    IO,
    io_doNothing,
    io_moveInCircles,
    io_listenToPlayer,
    io_mapTargetToGoal,
    io_boomerang,
    io_goToMasterTarget,
    io_canRepel,
    io_alwaysFire,
    io_targetSelf,
    io_mapAltToFire,
    io_onlyAcceptInArc,
    io_nearestDifferentMaster,
    io_avoid,
    io_minion,
    io_hangOutNearMaster,
    io_spin,
    io_fastspin,
    io_reversespin,
    io_slowSpin,
    io_reverseSlowSpin,
    io_dontTurn,
    io_dontTurnDominator,
    io_fleeAtLowHealth,
    io_botMovement,
    io_droneStabilizer,
    io_droneTrap,
    io_listenToPlayerStatic,
    io_spinWhenIdle,
    io_multiboxClone,
    io_taurusPortal,
    io_spinMissile,
    io_plane,
    io_onlyFireWhenInRange,
    io_skipBomb
};

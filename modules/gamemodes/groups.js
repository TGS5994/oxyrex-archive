/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
let activeGroups = [];
const getID = () => {
    let i = 0;
    while (i < 100) {
        const id = Math.random() * 100 | 0;
        if (!activeGroups.find(e => e.teamID === id)) return id;
        i ++;
    }
    return Number(Math.random().toString().replace("0.", ""));
};
class Group {
    constructor(size, key = -1) {
        this.members = [];
        this.size = size;
        this.teamID = getID();
        this.color = (100 + (this.teamID % 85)) | 0;
        activeGroups.push(this);
        console.log("New group created.");
    }
    addMember(socket) {
        if (this.members.length === this.size) return false;
        this.members.push(socket);
        socket.rememberedTeam = this.teamID;
        socket.group = this;
        return true;
    }
    removeMember(socket) {
        this.members = this.members.filter(entry => entry !== socket);
        if (this.members.length === 0) this.delete();
    }
    delete() {
        for (let i = 0; i < this.members.length; i++) removeMember(this.members[i]);
        activeGroups = activeGroups.filter(entry => entry !== this);
        console.log("Group deleted.");
    }
    getSpawn() {
        let validMembers = this.members.map(entry => entry).filter(a => !!a.player).filter(b => !!b.player.body);
        if (!validMembers.length) return room.random();
        let {
            x,
            y
        } = ran.choose(validMembers).player.body;
        return {
            x,
            y
        };
    }
}
const addMember = (socket, party = -1) => {
    let group = activeGroups.find(entry => entry.members.length < entry.size);
    if (party !== -1) group = activeGroups.find(entry => (entry.teamID === party / room.partyHash && entry.members.length < entry.size));
    if (!group) group = new Group(c.GROUPS || 0);
    group.addMember(socket);
};
const removeMember = socket => {
    if (!socket.group) return;
    let group = activeGroups.find(entry => entry === socket.group);
    group.removeMember(socket);
    socket.group = null;
};
let groups = {
    addMember,
    removeMember
};
module.exports = {
    Group,
    activeGroups,
    addMember,
    groups
};

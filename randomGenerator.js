"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function randomId() {
    var id = Math.floor(Math.random() * 1000).toString();
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var randomChar = function () {
        return characters[Math.floor(Math.random() * characters.length)];
    };
    id = randomChar() + id + randomChar();
    return id;
}
exports.default = randomId;
;

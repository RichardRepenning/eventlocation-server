"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = void 0;
var typeorm_1 = require("typeorm");
var UserData = /** @class */ (function () {
    function UserData() {
    }
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], UserData.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ unique: true }),
        __metadata("design:type", String)
    ], UserData.prototype, "username", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserData.prototype, "vorname", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserData.prototype, "nachname", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserData.prototype, "strasse", void 0);
    __decorate([
        typeorm_1.Column({ default: 0 }),
        __metadata("design:type", Number)
    ], UserData.prototype, "plz", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserData.prototype, "ort", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], UserData.prototype, "passwort", void 0);
    __decorate([
        typeorm_1.Column({ unique: true }),
        __metadata("design:type", String)
    ], UserData.prototype, "email", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], UserData.prototype, "status", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserData.prototype, "profilePicture", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserData.prototype, "businessLetter", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserData.prototype, "favourites", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserData.prototype, "messages", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserData.prototype, "blockmessages", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Date)
    ], UserData.prototype, "registerDate", void 0);
    UserData = __decorate([
        typeorm_1.Entity()
    ], UserData);
    return UserData;
}());
exports.UserData = UserData;

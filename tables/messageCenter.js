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
exports.MessageCenter = void 0;
var typeorm_1 = require("typeorm");
var MessageCenter = /** @class */ (function () {
    function MessageCenter() {
    }
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], MessageCenter.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ unique: true }),
        __metadata("design:type", String)
    ], MessageCenter.prototype, "messageId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Date)
    ], MessageCenter.prototype, "date", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageCenter.prototype, "topic", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageCenter.prototype, "message", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageCenter.prototype, "createdByName", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageCenter.prototype, "createdById", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageCenter.prototype, "receivedByName", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageCenter.prototype, "receivedById", void 0);
    MessageCenter = __decorate([
        typeorm_1.Entity()
    ], MessageCenter);
    return MessageCenter;
}());
exports.MessageCenter = MessageCenter;

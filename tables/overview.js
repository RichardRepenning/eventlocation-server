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
exports.LocationPreview = void 0;
var typeorm_1 = require("typeorm");
var details_1 = require("./details");
var LocationPreview = /** @class */ (function () {
    function LocationPreview() {
    }
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], LocationPreview.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], LocationPreview.prototype, "title", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], LocationPreview.prototype, "bild", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], LocationPreview.prototype, "place", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], LocationPreview.prototype, "price", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Date)
    ], LocationPreview.prototype, "date", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return details_1.LocationDetails; }),
        typeorm_1.JoinColumn({ name: 'id' }),
        __metadata("design:type", details_1.LocationDetails)
    ], LocationPreview.prototype, "details", void 0);
    LocationPreview = __decorate([
        typeorm_1.Entity()
    ], LocationPreview);
    return LocationPreview;
}());
exports.LocationPreview = LocationPreview;

var DatabaseConn = /** @class */ (function () {
    function DatabaseConn() {
        this.testString = "Test";
    }
    DatabaseConn.test = function () {
        console.log("Serveranfrage");
        return "Connection steht !, aber sowas von getestet !!";
    };
    DatabaseConn.prototype.test2 = function () {
        return this.testString;
    };
    return DatabaseConn;
}());
module.exports = new DatabaseConn();

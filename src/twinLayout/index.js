
// 构造函数
function twin(options) {
    this.options = options;
    if (localStorage.getItem("twinLayout") == "classic") {
        let twinClassic = require("./lib/classic/index");
        this.create = twinClassic.default;
    } else {
        let twinDesktop = require("./lib/desktop/index");
        this.create = twinDesktop.default;
    }
}
export default twin;

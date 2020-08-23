
// 构造函数
function twin(loadContainer, options) {
    if (loadContainer == null) {
        // 没有传入任何参数，报错
        throw new Error("错误：初始化编辑器时候未传入任何参数，请查阅文档");
    }
    this.loadContainer = loadContainer;
    this.options = options;
    let twinDesktop = require("./lib/desktop/index");
    // this.prototype.apply(this);
    this.create = twinDesktop.default;
}
export default twin;

var Common = function(){
  var self = this;

  self.init = function() {
    console.log("Initialize!");
  }

  self.init();
}
var common = new Common();
var IndexController = function() {
  let self = this;

  self.init = () => console.log("IndexController Initialize!");

  self.init();
};

var idxCtl = new IndexController();

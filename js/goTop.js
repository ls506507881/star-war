function GoTop(ct) {
  this.ct = ct;
  this.target = $('<span class="back-top">Top</span>');
  this.bindEvent(); //调用bindEvent函数
  this.createNode(); //调用createNode函数
}

GoTop.prototype = {
  //绑定到原型
  bindEvent: function() {
    var timer = null;
    var _this = this;
    $(window).on("scroll", function() {
      //当页面滚动
      if (timer) {
        //如果有timer
        clearTimeout(timer); //清除timer计时器
      }
      timer = setTimeout(function() {
        //没有timer 就设定一个定时器
        if ($(window).scrollTop() > 150) {
          _this.target.fadeIn("fast"); //速度：可以设置的值为：1500毫秒、"slow"、"normal"、"fast"
        } else {
          _this.target.fadeOut("fast");
        }
      }, 300);
    });

    this.target.on("click", function() {
      $("html,body").animate({ scrollTop: 0 }, 220);
      //$('body')被Chrome，IE，Opera支持，不被Firefox支持；
      //$('html')只被Firefox支持，不被其他浏览器支持。
      //$('html,body')Chrome和Firefox都支持
      //animate({ scrollTop: 0 },220)滚动条跳到0的位置，页面移动速度是220。
    });
  },
  createNode: function() {
    this.target.css({
      position: "fixed",
      right: "30px",
      bottom: "100px",
      width: "50px",
      "text-align": "center",
      "line-height": "50px",
      height: "50px",
      boxShadow:"2px 2px 5px #333333",
      cursor: "pointer",
      display: "none",
      borderRadius: "50%",
      background: "#222",
      color: "#fff",
      opacity:".9",
      fontFamily: "Montserrat,'Helvetica Neue',Helvetica,Arial,sans-serif"
    });
    this.ct.append(this.target);
  }
};
new GoTop($("body"));

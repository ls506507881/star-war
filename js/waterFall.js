



var lunBo = (function(){

  function Carousel(container){
    this.init(container);
    this.bind(container);
  }

  Carousel.prototype.init = function(container){
    this.headerwrap = container.parent();
    console.log(this.headerwrap)
    this.windowwidth = $(window).width();
    console.log(this.windowwidth)
    this.$ulpic = container.find('.picwrap');
    this.$piclist = this.$ulpic.children();

    this.$imgs = this.$piclist.find('img');
    this.imageWidth = this.$imgs.width(this.windowwidth);

    // console.log(this.imageWidth)


    this.$touchbar = container.find('.touchbar');
    this.$touchlist = container.find('.touchbar li');
    this.$leftbtn = container.find('.btn1');
    this.$rgtbtn = container.find('.btn2');
    
    var touchbarleft = this.windowwidth/2;
    console.log(this.$touchbar)
    this.$touchbar.css({left: touchbarleft});
    this.$ulpic.append(this.$piclist.eq(0).clone());
    this.$ulpic.prepend(this.$piclist.eq(this.$piclist.length-1).clone());
    // console.log(this.$ulpic.children().length*this.imageWidth)
    this.$ulpic.width(this.$ulpic.children().length*this.windowwidth);
    container.height(this.$ulpic.height());
    container.width(this.windowwidth);
    this.headerwrap.height(container.height());
    this.$ulpic.css({left:-this.imageWidth})
    this.playlockr = true;
    this.playlockl = true;
  }


  Carousel.prototype.bind = function(container){
      var self = this;
      this.$touchlist.on('mouseover',function(){  
      self.dotselected($(this))

      console.log(self.$touchlist)
      var linum = self.$touchlist.index(this);
            console.log(linum)
        self.$ulpic.stop().animate({'left': -self.windowwidth*(linum+1)}, 1000);
    })
    // var playlockr = true;
    // var playlockl = true;
    this.$leftbtn.on('click',function(){
      console.log(self.playPre)
      self.playPre();
    })

    this.$rgtbtn.on('click',function(){
      self.playNext();
    })
  }

  Carousel.prototype.playNext = function(){
    var self = this;
      var $css_left = parseInt(this.$ulpic.css('left'));
      var pageIndex = Math.abs($css_left)/this.windowwidth;
      pageIndex++;      
      if(this.playlockr){
      if(pageIndex > this.$ulpic.children().length-2){
        this.playlockr = false;
        this.dotselected(this.$touchlist.eq(0));
        this.$ulpic.animate({'left': -pageIndex*self.windowwidth},400,function(){self.$ulpic.css('left', -self.windowwidth);self.playlockr = true;});
        
      } else {
        this.playlockr = false;
        this.dotselected(this.$touchlist.eq(pageIndex-1));
        this.$ulpic.animate({'left': -pageIndex*self.windowwidth},400,function(){self.playlockr = true;});
      }
      }  
  }

  Carousel.prototype.playPre = function(){
    var self = this;
      var $css_left = parseInt(this.$ulpic.css('left'));
      var pageIndex = Math.abs($css_left)/this.windowwidth;
      pageIndex--;
      if(this.playlockl){
      if(pageIndex === 0){
        this.playlockl = false;
        this.dotselected(this.$touchlist.eq(this.$ulpic.children().length-3));
        this.$ulpic.animate({'left': 0},400,function(){self.$ulpic.css('left', -(self.$ulpic.children().length-2)*self.windowwidth);self.playlockl = true;});

      } else {
        this.playlockl = false;
        this.dotselected(this.$touchlist.eq(pageIndex-1));
        this.$ulpic.animate({'left': -pageIndex*self.windowwidth},400,function(){self.playlockl = true;});

      } 
      }    
  }


    Carousel.prototype.dotselected = function(node){
      node.siblings('.touchbar>li').css('background-color','#777')
      node.css('background-color','#eee')
    }


    return {
      init: function($ctn){
        $ctn.each(function(idx,ele){
          new Carousel($(ele));
        })
      }
    }

})()
    
    var container = $('#header-wrap .container');
    lunBo.init(container);


// 瀑布流新闻开始


    var water = (function () {
        function waterFall($data){
            var curPage = 1,
                PageCount = 9;

            function loadAndPlace() {
                $.ajax({
                    url: 'http://platform.sina.com.cn/slide/album_tech',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: {
                        app_key: '1271687855',
                        num: PageCount,
                        page: curPage
                    }
                }).done(function (ret) {//$.done()知识点
                    if(ret && ret.status && ret.status.code == '0'){

                        place(ret.data);
                    }else{
                        console.log('get wrong data');
                    }
                });
                curPage++
            }

            loadAndPlace();

            $('#load').on('click',function () {
                loadAndPlace();
            })

            function place(nodeList) {
                var $node = renderData(nodeList),
                    defereds = [];

                $node.find('img').each(function () {
                    var defer = $.Deferred();
                    $(this).load(function () {
                        defer.resolve();
                    })
                    defereds.push(defer);
                })

                $.when.apply(null,defereds).done(function () {
                    waterFallPlace($node);
                })
            }

            function renderData(items) {
                var tpl = '',
                    $node;
                for(var i = 0;i<items.length;i++){
                    tpl += '<li class="item">';
                    tpl += ' <a href="'+ items[i].url +'" class="link"><img src="' + items[i].img_url + '" alt=""></a>';
                    tpl += ' <h4 class="header">'+ items[i].short_name +'</h4>';
                    tpl += '<p class="desp">'+items[i].short_intro+'</p>';
                    tpl += '</li>';
                }
                $node = $(tpl);
                $data.append($node);

                return $node;
            }

            var colSumHeight = [],
                nodeWidth = $data.find('.item').outerWidth(true),
                colNum = parseInt($data.width()/nodeWidth);
            for (var i=0;i<colNum;i++){
                colSumHeight.push(0)
            }
//          console.log(nodeWidth)
            function waterFallPlace($nodes){
                $nodes.each(function (){
                    var $cur = $(this),
                        idx = 0,
                        minSumHeight = colSumHeight[0];


                    for (var i=0;i<colSumHeight.length;i++){
                        if(colSumHeight[i]<minSumHeight){
                            minSumHeight = colSumHeight[i];
                            idx = i;
                        }
                    }

                    $cur.css({
                        top: minSumHeight,
                        left: idx*nodeWidth,
                        opacity: 1
                    })

                    colSumHeight[idx] += $cur.outerHeight(true);
                    $data.height(Math.max.apply(null,colSumHeight));//添加完成后需要增加父容器宽度
//              console.log(Math.max.apply(null,colSumHeight));
                })
            }
        }
        return waterFall
    })()


    water($('#pic-ct'));
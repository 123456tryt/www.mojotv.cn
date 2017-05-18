//在基本模板中已近加载了jq可以在任意的房使用jq
//有些方法需要在bootstrap.js 运行之后在运行
//所有页面都需要执行该js



//设置left side bar 高亮
let current_url = window.location.href;
let menus = $('body > div > aside.main-sidebar > section > ul > li').not('.header');
jQuery.each(menus, function (i, dom) {
    //在html data-uri设置uri
    //根据网站设置高亮菜单
    let node_uri = $(dom).data('uri');
    if (current_url.indexOf(node_uri)) {
        $(dom).toggleClass('active')
    }
});

//设置left side bar 二级菜单高亮
let sub_menus = $('body > div > aside.main-sidebar > section > ul > li > ul > li');
jQuery.each(sub_menus, function (i, sub_dom) {
    //在html data-uri设置uri
    //根据网站设置高亮菜单
    let sub_uri = $(sub_dom).find('a').attr('href');
    if (current_url.indexOf(sub_uri)) {
        $(sub_dom).toggleClass('active')
    }
});
//设置面包屑高亮


//去掉html tag 得到 plain string
function stripHtml(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

//资讯列表页面就执行以下js
let pageIdentifier = $('span#identifier').data('name')

if (pageIdentifier == "article-index-page") {
    //后去dom 里面的xsrf值
    $(function () {
        let token = $('span#identifier').data('xsrf')
        var pageIndex = 1;
        var tatalCount = $('span#identifier').data('offset')

        // dropload
        //https://github.com/ximan/dropload
        $('section.content').dropload({
            scrollArea: window,
            domUp: {
                domClass: 'dropload-up',
                domRefresh: '<div class="dropload-refresh">↓下拉刷新-了解更多美剧资讯学习更多潮流英语</div>',
                domUpdate: '<div class="dropload-update">↑释放更新-自定义内容</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中-了解更多美剧资讯学习更多潮流英语...</div>'
            },
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多-了解更多美剧资讯学习更多潮流英语</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中-了解更多美剧资讯学习更多潮流英语...</div>',
                domNoData: '<div class="dropload-noData">暂无数据-了解更多美剧资讯学习更多潮流英语</div>'
            },
            loadUpFn: function (me) {
                
            },
            loadDownFn: function (me) {
                //last time 暂时不需要
                let lastTime = $('section.content > div.well:last > div.media-body > ul > li:nth-child(2) > strong > span').data('time')
                let param = { _xsrf: token, offset: tatalCount }
                // 拼接HTML
                var result = '';
                $.ajax({
                    type: 'POST',
                    url: '/article/load-more',
                    data: param,
                    success: function (data) {
                        var arrLen = data.data.length;
                        //修改偏移量 导致ajax 发送的参数增加
                        tatalCount += arrLen;

                        if (arrLen > 0) {
                            for (var i = 0; i < arrLen; i++) {
                                let item = data.data[i]

                                //html 输出
                                result += '<div class="well-xs well media"><div class="media-left"><a href="/article/' 
                                                + item.ID + '"><img src="'
                                                + item.CoverageUrl + '" alt="'
                                                + item.Title + '" class="img-thumbnail img-circle media-object"></a></div><div class="media-body"><a href="/article/'
                                                + item.ID+'"><h2 class="media-heading text-red text-center lead">'
                                                + item.Title + '</h2></a><p class="text-excerpt">'
                                                + item.Excerpt + '</p><ul class="list-inline text-green"><li><strong><span class="fa fa-calendar" title="发布日期"></span></strong>'
                                                + item.CreatedDate + '</li><li><strong><span class="ion-clock" title="发布时间 publiced time" data-time="2017-05-12 07:21:55"></span></strong>'
                                                + item.CreatedTime + '</li><li><strong><span class="glyphicon glyphicon-eye-open" title="阅读数量 read count"></span></strong>'
                                                + 1999 + '</li><li><strong><span class="ion-heart" title="收藏数量 favarate count"></span></strong>'
                                                + 3123 + '</li><li><strong><span class="fa fa-commenting" title="评论数量 comment count"></span></strong>'
                                                + 3434 + '</li></ul></div></div>';
                            }
                            // 如果没有数据
                        } else {
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                        }
                        //插入dom
                        $('section.content > div.well:last').after(result);
                        // 每次数据插入，必须重置
                        me.resetload();
                    },
                    error: function (xhr, type) {
                        alert('TRY美剧除了一个小错');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
            },
            threshold: 50
        });
    });




}






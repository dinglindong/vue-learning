/**
 * Created by Administrator on 2017/6/2.
 */
$(function(){
    //设置全局ajax
    $.ajaxSetup({
        dataType:"json",
        type:"POST"
    });
    ////----
        $.ajax({  //浏览历史待后台调通
            url:"/mcall/cms/course/getLatestRecord/",
            data: {
                paramJson: $.toJSON({
                    "isValid": 1,
                    "sortType": 2
                })
            },
            success:function(data){
                if (comm.hasResponseData(data)){
                    var newData = data.responseObject.responseData.data_list;
                    var s = comm.getStrLen(newData.videoName,22);
                    newData.videoName = s;
                    $('.banner').append('<p><i></i>浏览历史<span><a href="'+newData.webStoragePath+'">'+newData.videoName+'<a></span></p>');
                    setInterval(function () {
                        $('.banner p').animate({"margin-left": "-100%"}, 500);
                    }, 5000);
                    $('.banner p i').on('click', function () {
                        $('.banner p').animate({"margin-left": "-100%"}, 500);
                    });
                        $('.banner p span').on('click',function(){
                            comm.creatEvent({
                                triggerType:'功能按钮',
                                triggerName:'发现浏览历史',
                                keyword:"系列课-发现浏览历史",
                                actionId:11006
                            });
                        });

                }
            }
        });
    ////----
    if(localStorage.getItem('department')==2) {
        $('.tabtitle li:first-child').siblings('li').hide();
    }

//1.页面初始化课程加载banner+课程+讲师
    var nums = 1,amount = 0,_hbanner= 0,more="";
    var banner=[],adAttUrl="",linkUrl="";//banner图变量。banner(数组)一次请求所有地址,adAttUrl图片地址,linkUrl图片链接
    $.ajax({    //banner图初始化
        url:"/mcall/cms/course/getBannerList/",
        data: {
            paramJson: $.toJSON({
                "isValid": 1,
                "channelId": 149
            })
        },
        success:function(data){
            if(comm.hasResponseData(data)){
                //$.each(data.responseObject.responseData.data_list[0].ad_profile_attachment,function(index,value){
                //    banner.push(value);
                //});
                banner = data.responseObject.responseData.data_list[0].ad_profile_attachment;
                adAttUrl=banner[0].adAttUrl;
                linkUrl=banner[0].linkUrl;
                $('.banner').html('<a href="'+linkUrl+'"><img src="'+adAttUrl+'"></a>');
                _hbanner = $('.banner').outerHeight(); //获取banner的高度
                $('.banner a img').on('click',function(){
                    comm.creatEvent({
                        triggerType:'广告位',
                        triggerName:'广告位-轮播图',
                        keyword:"广告位-轮播图-系列课",
                        actionId:14
                    });
                });
            }
        }
    });

    var _h = $('.al-indexHeader').outerHeight();//获取头部高度
    //var newH= _h+_hbanner;
    $(window).on('touchmove',function() {
        if ($(window).scrollTop() >_hbanner) {
            $('.courseBanner nav').attr('style','position:fixed;top:'+_h+'px;z-index:9;width:100%;');
            $('.al-indexHeader').attr('style','position:fixed;top:0px;z-index:9;border-bottom:solid 1px #fff;width:100%');
            $('.al-indexHeader .al-indexHeaderItem:last-child').attr('style','margin-right:0.8rem');
        } else {
            $('.courseBanner nav').attr('style','');
            $('.al-indexHeader').attr('style','');
            $('.al-indexHeader .al-indexHeaderItem:last-child').attr('style','');
        }
    });
    $.ajax({    //猜你喜欢和医鼎相关课程展示
        url:"/mcall/cms/course/getHotCourseList/",
        data: {
            paramJson: $.toJSON({
                "isValid": 1,
                "pageIndex":nums,
                "pageSize":6,
                "sortType": 4,
                "courseSubjectTeamId": 0,
                "platformId":localStorage.getItem('department')
            })
        },
        beforeSend: function () {
            comm.loading.show();
        },
        success:function(data){
            if(comm.hasResponseData(data)){
                window.onload = Log.createBrowse(202, '系列课-推荐');
                amount = data.responseObject.responseData.data_list.length;
                if(data.responseObject.responseData.data_list.length<6){
                    more='';
                }else{
                    more='<aside class="courseMore down" data-alcode-mod="639" data-alcode="e116">更多好课<i></i></aside>';
                }
                var str="";
                var collect="";
                $.each(data.responseObject.responseData.data_list,function(index,data){
                    //if(data.coursePrice==0.0||data.coursePrice==null){
                    //    data.coursePrice="限时免费";
                    //}
                    if(data.isCollected==1){
                        collect = '<div class="collaged">已收藏</div>';
                    }else{
                        collect = '';
                    }
                    var s = comm.getStrLen(data.courseName, 22);
                    data.courseName = s;
                    str+='<li data-seriesid="'+data.courseId+'" data-href="/pages/discover/series/discover_series_details.html?tId=' + data.courseId +'">' + collect +'<img src="' + data.courseCoverPicUrl + '" /><p style="display:none">' + data.courseName + '</p><p><i></i>' + data.totalLearnNum.toWKH() + '<span>' + data.catalogNum + '节课</span></p></li>';//<b>' + data.coursePrice + '</b><p>' + data.courseName + '</p>
                });
                $(".data_list").prepend('<aside class="title">猜你喜欢</aside><ul class="courseList like" data-alcode-mod="635">'+str+'</ul>'+more+'');
                //此注释为一定相关课程
                //var yidingStr="";
                //var  newArr = data.responseObject.responseData.yiding_list.slice(0,9);
                //$.each(newArr, function (index, data) {
                //    var t = comm.getStrLen(data.seriesTitle, 22);
                //    data.seriesTitle = t;
                //    yidingStr+='<li data-seriesid="'+data.seriesId+'" data-href="'+data.webStoragePath+'"><img src="' + data.seriesPicUrl + '" /><p>' + data.seriesTitle + '</p><p>' + data.classNum + '节课</span></p></li>';
                //});
                //$(".yiding_list").append('<aside class="title">医鼎相关课程</aside><ul class="courseList yiding" data-alcode-mod="642">'+yidingStr+'</ul>');
            }else{
                $('.discoverCourse').empty();
            }
            adToggle();
            $('[data-href]').off("click").on("click", function (e) {
                Log.createBrowse(199, '体系化课程页',"21/"+$(this).attr('data-seriesid'));
                g_sps.jump($(this),$(this).attr("data-href"));
            });
            $('.data_list .courseList li').on('click',function(){
                comm.creatEvent({
                    triggerType:'系列课',
                    triggerName:'猜你喜欢',
                    keyword:"推荐-猜你喜欢",
                    actionId:11002,
                    refId: $(this).attr('data-seriesid'),
                    locationId:$(this).index()+1
                });
            });
            //$('.yiding_list .courseList li').on('click',function(){
            //    comm.creatEvent({
            //        triggerType:'系列课',
            //        triggerName:'医鼎相关课程',
            //        keyword:"推荐-医鼎相关课程",
            //        actionId:11004,
            //        refId: $(this).attr('data-seriesid'),
            //        locationId:$(this).index()+1
            //    });
            //});
        },
        complete: function () {
            comm.loading.hide();
        }
    });
    $.ajax({    //页面讲师初始化加载
        url:"/mcall/cms/course/getHotAuthorList/",
        data: {
            paramJson: $.toJSON({
                "sortType": 4,
                "courseSubjectTeamId":0,
                "platformId":TempCache.getItem('department')
            })
        },
        success: function (data) {
            if(comm.hasResponseData(data)){
                var  newArr = data.responseObject.responseData.data_list.slice(0,30);
                var str="";
                $.each(newArr, function (index, data) {
                    var n = comm.getStrLen(data.name,10);
                    data.name = n;
                    str+='<li class="swiper-slide"><a href="/pages/personal/others_contribution.html?cid=' + data.customerId + '"><img src="' + data.logoUrl + '" alt="" /></a><p>' + data.name + '</p></li>';
                });
                $('.popularLecturer').append('<aside class="title">受欢迎讲师</aside><aside class="list swiper-container swiper-container-horizontal swiper-container-free-mode"><ul class="swiper-wrapper" data-alcode-mod="641" style="transform: translate3d(0px, 0px, 0px);">'+str+'</ul></aside>');
            }else{
                $('.popularLecturer').empty();
            }
            //4.受欢迎讲师start滑动
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: "auto",
                paginationClickable: true,
                freeMode: true,
                observer: true
            });
            //end
        }
    });
//页面初始化结束end

//2.Tab切换分别加载课程和讲师模块start
    $('.tabtitle li').click(function() {
        $(".courseList").attr({"data-alcode-mod":635+$(this).index()});//记录埋点信息
        nums=1;//每次切换分页效果初始化为1
        var arr = [0, 9, 7, 2];  //0代表推荐、9代表创伤、7代表脊椎、2代表关节
        var index = $(this).index();
        var courseSubjectTeamId = arr[index];
        if(courseSubjectTeamId==9 || courseSubjectTeamId==7 || courseSubjectTeamId==2){  //创伤，脊椎，关节页内容加载
            if(courseSubjectTeamId==9) {
                window.onload = Log.createBrowse(203, '系列课-创伤');
            }
            if(courseSubjectTeamId==7){
                window.onload = Log.createBrowse(204, '系列课-脊柱');
            }
            if(courseSubjectTeamId==2){
                window.onload = Log.createBrowse(205, '系列课-关节');
            }

            $.ajax({    //猜你喜欢和医鼎相关课程切换
            url: "/mcall/cms/course/getHotCourseList/",
            data: {
                paramJson: $.toJSON({
                    "isValid": 1,
                    "pageIndex":nums,
                    "pageSize":6,
                    "sortType": 4,
                    "courseSubjectTeamId": courseSubjectTeamId,
                    "platformId":localStorage.getItem('department')
                })
            },
            beforeSend: function () {
                comm.loading.show();
            },
            success: function (data) {
                if(comm.hasResponseData(data)){
                    $(".data_list").empty();
                    if(data.responseObject.responseData.data_list.length<6 || data.responseObject.responseData.data_size == 6){
                        more='';
                    }else{
                        more='<aside class="courseMore down" data-alcode-mod="639" data-alcode="e116">更多好课<i></i></aside>';
                    }
                    var str = "";
                    var collect = "";
                    $.each(data.responseObject.responseData.data_list, function (index, data) {
                        //if (data.coursePrice == 0.0 || data.coursePrice == null) {
                        //    data.coursePrice = "限时免费";
                        //}
                        if (data.isCollected == 1) {
                            collect = '<div class="collaged">已收藏</div>';
                        } else {
                            collect = '';
                        }
                        var s = comm.getStrLen(data.courseName, 22);
                        data.courseName = s;
                        str += '<li data-seriesid="'+data.courseId+'" data-href="/pages/discover/series/discover_series_details.html?tId=' + data.courseId +'">' +
                        '           ' + collect + '' +
                        '               <img src="' + data.courseCoverPicUrl + '" />' +
                        '       <p style="display:none">' + data.courseName + '</p>' +
                        '           <p><i></i>' + data.totalLearnNum.toWKH() + '<span>' + data.catalogNum + '节课</span><b>' + data.coursePrice + '</b></p>' +
                        '       </li>';
                    });
                    //$(".data_list").append(str);
                    $(".data_list").prepend('<aside class="title">猜你喜欢</aside><ul class="courseList like" data-alcode-mod="635">'+str+'</ul>'+more+'');
                    //此注释为医鼎tab切换注释
                    //$(".yiding_list").empty();
                    //var yidingStr = "";
                    //$.each(data.responseObject.responseData.yiding_list, function (index, data) {
                    //    var t = comm.getStrLen(data.seriesTitle, 22);
                    //    data.seriesTitle = t;
                    //    yidingStr += '<li data-seriesid="'+data.seriesId+'" data-href="'+data.webStoragePath+'">' +
                    //    '                   <img src="' + data.seriesPicUrl + '" />' +
                    //    '               <p>' + data.seriesTitle + '</p>' +
                    //    '               <p>' + data.classNum + '节课</span></p>' +
                    //    '             </li>';
                    //});
                    //$(".yiding_list").append('<aside class="title">医鼎相关课程</aside><ul class="courseList yiding" data-alcode-mod="642">'+yidingStr+'</ul>');
                }else{
                    $('.courseList').empty();
                }
                adToggle();
                $('[data-href]').off("click").on("click", function (e) {
                    Log.createBrowse(199, '体系化课程页',"21/"+$(this).attr('data-seriesid'));
                    g_sps.jump($(this),$(this).attr("data-href"));
                    //window.location.href = $(this).attr("data-href");
                });
                if(courseSubjectTeamId==9) {
                    $('.data_list .courseList li').on('click',function(){
                        comm.creatEvent({
                            triggerType:'系列课',
                            triggerName:'猜你喜欢',
                            keyword:"创伤-猜你喜欢",
                            actionId:11002,
                            refId: $(this).attr('data-seriesid'),
                            locationId:$(this).index()+1
                        });
                    });
                    //$('.yiding_list .courseList li').on('click',function(){
                    //    comm.creatEvent({
                    //        triggerType:'系列课',
                    //        triggerName:'医鼎相关课程',
                    //        keyword:"创伤-医鼎相关课程",
                    //        actionId:11004,
                    //        refId: $(this).attr('data-seriesid'),
                    //        locationId:$(this).index()+1
                    //    });
                    //});
                }
                if(courseSubjectTeamId==7) {
                    $('.data_list .courseList li').on('click',function(){
                        comm.creatEvent({
                            triggerType:'系列课',
                            triggerName:'猜你喜欢',
                            keyword:"脊柱-猜你喜欢",
                            actionId:11002,
                            refId: $(this).attr('data-seriesid'),
                            locationId:$(this).index()+1
                        });
                    });
                    //$('.yiding_list .courseList li').on('click',function(){
                    //    comm.creatEvent({
                    //        triggerType:'系列课',
                    //        triggerName:'医鼎相关课程',
                    //        keyword:"脊柱-医鼎相关课程",
                    //        actionId:11004,
                    //        refId: $(this).attr('data-seriesid'),
                    //        locationId:$(this).index()+1
                    //    });
                    //});
                }
                if(courseSubjectTeamId==2) {
                    $('.data_list .courseList li').on('click',function(){
                        comm.creatEvent({
                            triggerType:'系列课',
                            triggerName:'猜你喜欢',
                            keyword:"关节-猜你喜欢",
                            actionId:11002,
                            refId: $(this).attr('data-seriesid'),
                            locationId:$(this).index()+1
                        });
                    });
                    //$('.yiding_list .courseList li').on('click',function(){
                    //    comm.creatEvent({
                    //        triggerType:'系列课',
                    //        triggerName:'医鼎相关课程',
                    //        keyword:"关节-医鼎相关课程",
                    //        actionId:11004,
                    //        refId: $(this).attr('data-seriesid'),
                    //        locationId:$(this).index()+1
                    //    });
                    //});
                }
            },
            complete: function () {
                comm.loading.hide();
            }
        });
        $.ajax({    //讲师切换
            url: "/mcall/cms/course/getHotAuthorList/",
            data: {
                paramJson: $.toJSON({
                    "sortType": 4,
                    "courseSubjectTeamId": courseSubjectTeamId,
                    "platformId":TempCache.getItem('department')
                })
            },
            success: function (data) {
                $(".popularLecturer").empty();
                if(comm.hasResponseData(data)){
                    var str = "";
                    var  newArr = data.responseObject.responseData.data_list.slice(0,15);
                    $.each(newArr, function (index, data) {
                        var n = comm.getStrLen(data.name,10);
                        data.name = n;
                        str += '<li class="swiper-slide"><a href="/pages/personal/others_contribution.html?cid=' + data.customerId + '"><img src="' + data.logoUrl + '" alt="" /></a><p>' + data.name + '</p></li>';
                    });
                    $('.popularLecturer').append('  <aside class="title">受欢迎讲师</aside>' +
                    '                               <aside class="list swiper-container swiper-container-horizontal swiper-container-free-mode">' +
                    '                                   <ul class="swiper-wrapper" data-alcode-mod="641" style="transform: translate3d(0px, 0px, 0px);">'+str+'' +
                    '                                   </ul>' +
                    '                               </aside>');
                }else{
                    $('.popularLecturer').empty();
                }
                //4.受欢迎讲师start滑动
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: "auto",
                    paginationClickable: true,
                    freeMode: true,
                    observer: true
                });
                //end
            }
        });
    }else if(courseSubjectTeamId==0){   //推荐页内容
            window.onload = Log.createBrowse(202, '系列课-推荐');
            $.ajax({    //猜你喜欢和医鼎相关课程切换
                url: "/mcall/cms/course/getHotCourseList/",
                data: {
                    paramJson: $.toJSON({
                        "isValid": 1,
                        "pageIndex":nums,
                        "pageSize":6,
                        "sortType": 4,
                        "courseSubjectTeamId": courseSubjectTeamId,
                        "platformId":localStorage.getItem('department')

                    })
                },
                beforeSend: function () {
                    comm.loading.show();
                },
                success: function (data) {
                    if(comm.hasResponseData(data)){
                        $(".data_list").empty();
                        //var more="";
                        if(data.responseObject.responseData.data_list.length<6 || data.responseObject.responseData.data_size == 6){
                            more='';
                        }else{
                            more='<aside class="courseMore down" data-alcode-mod="639" data-alcode="e116">更多好课<i></i></aside>';
                        }
                        var str = "";
                        var collect = "";
                        $.each(data.responseObject.responseData.data_list, function (index, data) {
                            //if (data.coursePrice == 0.0 || data.coursePrice == null) {
                            //    data.coursePrice = "限时免费";
                            //}
                            if (data.isCollected == 1) {
                                collect = '<div class="collaged">已收藏</div>';
                            } else {
                                collect = '';
                            }
                            var s = comm.getStrLen(data.courseName, 22);
                            data.courseName = s;
                            str += '<li data-seriesid="'+data.courseId+'" data-href="/pages/discover/series/discover_series_details.html?tId=' + data.courseId +'">' +
                            '           ' + collect + '' +
                            '               <img src="' + data.courseCoverPicUrl + '" />' +
                            '       <p style="display:none">' + data.courseName + '</p>' +
                            '           <p><i></i>' + data.totalLearnNum.toWKH() + '<span>' + data.catalogNum + '节课</span><b>' + data.coursePrice + '</b></p>' +
                            '       </li>';
                        });
                        //$(".data_list").append(str);
                        $(".data_list").prepend('<aside class="title">猜你喜欢</aside><ul class="courseList like" data-alcode-mod="635">'+str+'</ul>'+more+'');
                        //此注释为医鼎相关课程
                        //$(".yiding_list").empty();
                        //var yidingStr = "";
                        //var  newArr = data.responseObject.responseData.yiding_list.slice(0,9);
                        //$.each(newArr, function (index, data) {
                        //    var t = comm.getStrLen(data.seriesTitle, 22);
                        //    data.seriesTitle = t;
                        //    yidingStr += '<li data-seriesid="'+data.seriesId+'" data-href="'+data.webStoragePath+'">' +
                        //    '                   <img src="' + data.seriesPicUrl + '" />' +
                        //    '               <p>' + data.seriesTitle + '</p>' +
                        //    '               <p>' + data.classNum + '节课</span></p>' +
                        //    '            </li>';
                        //});
                        //$(".yiding_list").append('<aside class="title">医鼎相关课程</aside><ul class="courseList yiding" data-alcode-mod="642">'+yidingStr+'</ul>');
                    }else{
                        $('.courseList').empty();
                    }
                    adToggle();
                    $('[data-href]').off("click").on("click", function (e) {
                        Log.createBrowse(199, '体系化课程页',"21/"+$(this).attr('data-seriesid'));
                        g_sps.jump($(this),$(this).attr("data-href"));
                    });
                    $('.data_list .courseList li').on('click',function(){
                        comm.creatEvent({
                            triggerType:'系列课',
                            triggerName:'猜你喜欢',
                            keyword:"推荐-猜你喜欢",
                            actionId:11002,
                            refId: $(this).attr('data-seriesid'),
                            locationId:$(this).index()+1
                        });
                    });
                    //$('.yiding_list .courseList li').on('click',function(){
                    //    comm.creatEvent({
                    //        triggerType:'系列课',
                    //        triggerName:'医鼎相关课程',
                    //        keyword:"推荐-医鼎相关课程",
                    //        actionId:11004,
                    //        refId: $(this).attr('data-seriesid'),
                    //        locationId:$(this).index()+1
                    //    });
                    //});
                },
                complete: function () {
                    comm.loading.hide();
                }
            });
            $.ajax({    //讲师切换
                url: "/mcall/cms/course/getHotAuthorList/",
                data: {
                    paramJson: $.toJSON({
                        "sortType": 4,
                        "courseSubjectTeamId": courseSubjectTeamId,
                        "platformId":TempCache.getItem('department')
                    })
                },
                success: function (data) {
                    $(".popularLecturer").empty();
                    if(comm.hasResponseData(data)){
                        var str = "";
                        var  newArr = data.responseObject.responseData.data_list.slice(0,30);
                        $.each(newArr, function (index, data) {
                            var n = comm.getStrLen(data.name,10);
                            data.name = n;
                            str += '<li class="swiper-slide">' +
                            '           <a href="/pages/personal/others_contribution.html?cid=' + data.customerId + '">' +
                            '               <img src="' + data.logoUrl + '" alt="" />' +
                            '           </a>' +
                            '           <p>' + data.name + '</p>' +
                            '       </li>';
                        });
                        $('.popularLecturer').append('  <aside class="title">受欢迎讲师</aside>' +
                        '                               <aside class="list swiper-container swiper-container-horizontal swiper-container-free-mode">' +
                        '                                   <ul class="swiper-wrapper " data-alcode-mod="641" style="transform: translate3d(0px, 0px, 0px);">'+str+'' +
                        '                                   </ul>' +
                        '                               </aside>');
                    }else{
                        $('.popularLecturer').empty();
                    }
                    //4.受欢迎讲师start滑动
                    var swiper = new Swiper('.swiper-container', {
                        slidesPerView: "auto",
                        paginationClickable: true,
                        freeMode: true,
                        observer: true
                    });
                    //end
                }
            });
        }
        $(this).addClass('active').siblings().removeClass('active');
    });
//Tab切换加载结束end

//3.点击加载更多start
    function adToggle() {
        $(".courseMore").click(function () {
            if ($(".courseMore").hasClass("down")) {
                nums++;
                var arr = [0, 9, 7, 2];
                var index = $('.tabtitle .active').index();
                var courseSubjectTeamId = arr[index];
                switch (courseSubjectTeamId){
                    case 0:
                        comm.creatEvent({
                            triggerType:'系列课',
                            triggerName:'更多好课',
                            keyword:"推荐-更多好课",
                            actionId:11003
                        });
                        break;
                    case 9:
                        comm.creatEvent({
                            triggerType:'系列课',
                            triggerName:'更多好课',
                            keyword:"创伤-更多好课",
                            actionId:11003
                        });
                        break;
                    case 7:
                        comm.creatEvent({
                            triggerType:'系列课',
                            triggerName:'更多好课',
                            keyword:"脊椎-更多好课",
                            actionId:11003
                        });
                        break;
                    case 2:
                        comm.creatEvent({
                            triggerType:'系列课',
                            triggerName:'更多好课',
                            keyword:"关节-更多好课",
                            actionId:11003
                        });
                        break;
                }
                if (courseSubjectTeamId == 9 || courseSubjectTeamId == 7 || courseSubjectTeamId == 2) {
                    if (!$(this).hasClass("up")) {
                        $.ajax({
                            url: "/mcall/cms/course/getHotCourseList/",
                            data: {
                                paramJson: $.toJSON({
                                    "isValid": 1,
                                    "sortType": 4,
                                    "courseSubjectTeamId": courseSubjectTeamId,
                                    "pageIndex": nums,
                                    "pageSize": 6,
                                    "platformId":localStorage.getItem('department')
                                })
                            },
                            beforeSend: function () {
                                comm.loading.show();
                            },
                            success: function (data) {
                                if(comm.hasResponseData(data)){
                                    var mydata = data.responseObject.responseData.data_list;
                                    amount += mydata.length;
                                    if (mydata.length < 6) {
                                        amount = 6;
                                        $('.courseMore').removeClass('down').addClass("up").html("收起课程<i></i>");
                                        nums = 1;
                                    }
                                    var str = "";
                                    var collect = "";
                                    if (data.responseObject.responseData.data_list) {
                                        $.each(mydata, function (index, data) {
                                            if (data.isCollected == 1) {
                                                collect = '<div class="collaged">已收藏</div>';
                                            } else {
                                                collect = '';
                                            }
                                            var s = comm.getStrLen(data.courseName, 22);
                                            data.courseName = s;
                                            str += '<li data-seriesid="'+data.courseId+'" class="pageHide" data-href="/pages/discover/series/discover_series_details.html?tId=' + data.courseId +'">' +
                                            '       ' + collect + '' +
                                            '           <img src="' + data.courseCoverPicUrl + '" />' +
                                            '       <p style="display:none">' + data.courseName + '</p>' +
                                            '       <p><i></i>' + data.totalLearnNum.toWKH() + '<span>' + data.catalogNum + '节课</span><b>' + data.coursePrice + '</b></p>' +
                                            '     </li>';
                                        });
                                        $(".like").append(str);
                                    }
                                }
                                $('[data-href]').off("click").on("click", function (e) {
                                    Log.createBrowse(199, '体系化课程页',"21/"+$(this).attr('data-seriesid'));
                                    g_sps.jump($(this),$(this).attr("data-href"));
                                });
                                if(courseSubjectTeamId==9) {
                                    $('.data_list .courseList li').on('click',function(){
                                        comm.creatEvent({
                                            triggerType:'系列课',
                                            triggerName:'猜你喜欢',
                                            keyword:"创伤-猜你喜欢",
                                            actionId:11002,
                                            refId: $(this).attr('data-seriesid'),
                                            locationId:$(this).index()+1
                                        });
                                    });
                                }
                                if(courseSubjectTeamId==7) {
                                    $('.data_list .courseList li').on('click',function(){
                                        comm.creatEvent({
                                            triggerType:'系列课',
                                            triggerName:'猜你喜欢',
                                            keyword:"脊柱-猜你喜欢",
                                            actionId:11002,
                                            refId: $(this).attr('data-seriesid'),
                                            locationId:$(this).index()+1
                                        });
                                    });
                                }
                                if(courseSubjectTeamId==2) {
                                    $('.data_list .courseList li').on('click',function(){
                                        comm.creatEvent({
                                            triggerType:'系列课',
                                            triggerName:'猜你喜欢',
                                            keyword:"关节-猜你喜欢",
                                            actionId:11002,
                                            refId: $(this).attr('data-seriesid'),
                                            locationId:$(this).index()+1
                                        });
                                    });
                                }
                            },
                            complete: function () {
                                comm.loading.hide();
                            }
                        });
                    }
                } else if (courseSubjectTeamId == 0) {
                    $.ajax({
                        url: "/mcall/cms/course/getHotCourseList/",
                        data: {
                            paramJson: $.toJSON({
                                "isValid": 1,
                                "sortType": 4,
                                "courseSubjectTeamId": courseSubjectTeamId,
                                "pageIndex": nums,
                                "pageSize": 6,
                                "platformId":localStorage.getItem('department')
                            })
                        },
                        beforeSend: function () {
                            comm.loading.show();
                        },
                        success: function (data) {
                            if(comm.hasResponseData(data)){
                                var mydata = data.responseObject.responseData.data_list;
                                amount += mydata.length;
                                if (amount >= 30 || data.responseObject.responseData.data_list.length < 6) {
                                    amount = 6;
                                    $('.courseMore').removeClass('down').addClass("up").html("收起课程<i></i>");
                                    nums = 1;
                                }
                                var str = "";
                                var collect = "";
                                if (data.responseObject.responseData.data_list) {
                                    $.each(mydata, function (index, data) {
                                        if (data.isCollected == 1) {
                                            collect = '<div class="collaged">已收藏</div>';
                                        } else {
                                            collect = '';
                                        }
                                        var s = comm.getStrLen(data.courseName, 22);
                                        data.courseName = s;
                                        str += '<li data-seriesid="'+data.courseId+'" class="pageHide" data-href="/pages/discover/series/discover_series_details.html?tId=' + data.courseId +'">' +
                                        '       ' + collect + '' +
                                        '           <img src="' + data.courseCoverPicUrl + '" />' +
                                        '       <p style="display:none">' + data.courseName + '</p>' +
                                        '       <p><i></i>' + data.totalLearnNum.toWKH() + '<span>' + data.catalogNum + '节课</span><b>' + data.coursePrice + '</b></p>' +
                                        '     </li>';

                                    });
                                    $(".like").append(str);
                                }
                            }
                            $('[data-href]').off("click").on("click", function (e) {
                                Log.createBrowse(199, '体系化课程页',"21/"+$(this).attr('data-seriesid'));
                                g_sps.jump($(this),$(this).attr("data-href"));
                                //window.location.href = $(this).attr("data-href");
                            });
                            $('.data_list .courseList li').on('click',function(){
                                comm.creatEvent({
                                    triggerType:'系列课',
                                    triggerName:'猜你喜欢',
                                    keyword:"推荐-猜你喜欢",
                                    actionId:11002,
                                    refId: $(this).attr('data-seriesid'),
                                    locationId:$(this).index()+1
                                });
                            });
                        },
                        complete: function () {
                            comm.loading.hide();
                        }
                    });
                }
            } else {
                if ($('.courseMore').hasClass("up")) {
                    $('.courseList').find('li[class=pageHide]').attr('style', 'display:none');
                    $(this).removeClass("up").html("更多好课<i></i>");
                } else {
                    $('.courseList').find('li[style]').attr("style", "display:block");
                    $('.courseMore').addClass("up").html("收起课程<i></i>");
                }
            }
        });
    }
//点击加载更多结束end

//4.点击返回
    $('.ev_backBtn').click(function(){
        comm.creatEvent({
            triggerType:'全站功能按钮点击',
            keyword:"返回",
            actionId:41,
            async:false
        });
        history.back();
    });
//

//5.分享功能start
    var shareObj ={};
    shareAll({
        fnMessageSuc: function () {
            comm.shareLog({
                shareType: "",
                resourceId: "",
                resourceType: "",
                refId: "",
                isValid: 1,
                shareSence:"",
                shareChannel: 4,
                shareContent: shareObj.wxTitle
            });
        },
        fnTimelineSuc: function () {
            comm.shareLog({
                shareType: "",
                resourceId: "",
                resourceType: "",
                refId: "",
                isValid: 1,
                shareSence: "",
                shareChannel: 5,
                shareContent: shareObj.timeLineTitle
            });
        },
        qShareLog: function (x) {
            if (x === 'qzone') {
                comm.shareLog({
                    shareType: "",
                    resourceId: "",
                    resourceType: "",
                    refId: "",
                    isValid: 1,
                    shareSence: "",
                    shareChannel: 1,
                    shareContent: shareObj.summary
                });
            } else if (x === 'sina') {
                comm.shareLog({
                    shareType: "",
                    resourceId: "",
                    resourceType: "",
                    refId: "",
                    isValid: 1,
                    shareSence: "",
                    shareChannel: 3,
                    shareContent: shareObj.sinaTitle
                });
            }
        },
        triggerRequest:function(){
            $.ajax({
                url:"/mcall/comm/data/share/getMapList3/",
                data: {
                    paramJson: $.toJSON({
                        "sceneType": "71",          // 171代表列表页分享，172代表详情页分享
                        //"cmsCourseUrl": window.location.href,                           //链接url
                        "resourceType": 0,                               //资源类型传0，代表所有类型
                        "platformId":TempCache.getItem('department')
                    })
                },
                async:false,
                dataType:"json",
                success:function(data){
                    if(comm.hasResponseData(data)){
                        var sList = data.responseObject.responseData.data_list[0].share_channel;
                        shareObj = {
                            title: '',
                            summary: '',
                            sinaTitle: '',
                            wxTitle: '',
                            wxDesc: '',
                        };
                        shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                        $(sList).each(function (index, element) {
                            if (element.shareChannel === 'QZone') {
                                shareObj.title = element.shareTitle;
                                shareObj.summary = element.shareDesc;
                            }
                            if (element.shareChannel === 'Sina') {
                                shareObj.sinaTitle = element.shareDesc;
                            }
                            if (element.shareChannel === 'WechatFriend') {
                                shareObj.wxTitle = element.shareTitle;
                                shareObj.wxDesc = element.shareDesc;
                            }
                            if (element.shareChannel === 'WechatTimeline') {
                                shareObj.timeLineTitle = element.shareTitle;
                            }

                        });

                    }
                }
            });
            return shareObj;
        }
    }, false, $('.share'));

// 分享结束end
});






























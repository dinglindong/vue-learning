/**
 * Created by Administrator on 2017/6/6.
 */
$(function(){
    //设置全局ajax
    $.ajaxSetup({
        dataType:"json",
        type:"POST"
    });

//1.点击收藏start
        $('.collection').click(function () {
            var t = $(this);
            user.privExecute({
                operateType: 'auth',
                callback: function () {
                    if (TempCache.getItem("customerRole") == 2 || TempCache.getItem("customerRole") == 3 || TempCache.getItem("customerRole") == 4) {

                    } else {
                        if (t.attr('class') == "collection") {
                            $.ajax({
                                url: "/mcall/customer/collection/create/",
                                data: {
                                    paramJson: $.toJSON({
                                        "collectionType": "18",
                                        "refId": getpara().tId,
                                        "customerId": TempCache.getItem("userId")
                                    })
                                },
                                success: function (data) {
                                    if (data.responseObject.responseStatus == true) {
                                        popupFn("收藏成功", 1500);
                                        $(".collection").attr('class', 'collectioned').html("已收藏");
                                    }
                                }
                            });
                        } else if (t.attr('class') == "collectioned") {
                            $.ajax({
                                url: "/mcall/customer/collection/delete/",
                                data: {
                                    paramJson: $.toJSON({
                                        "collectionType": "18",
                                        "refId": getpara().tId,
                                        "customerId": TempCache.getItem("userId")
                                    })
                                },
                                success: function (data) {
                                    if (data.responseObject.responseStatus == true) {
                                        popupFn("取消收藏成功", 1500);
                                        $(".collectioned").attr('class', 'collection').html("收藏");
                                    }
                                }
                            });
                        }
                    }
                }
            });
        });
//收藏结束end

//2.页面初始化加载banner+内容介绍
    $.ajax({     //介绍内容初始化加载start
        url:"/mcall/cms/course/getCourseAuthorList/",
        data: { paramJson: $.toJSON({
            "courseId": getpara().tId,
            "customerId": TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
            "isValid": 1
        })
        },
        beforeSend: function () {
            comm.loading.show();
        },success:function(data){
            var newDate = data.responseObject.responseData.courseCoverPicUrl;
            $('.courseBanner').prepend('<img src="'+newDate+'">');
            if(comm.hasResponseData(data)){
                var str="";
                var nameStr= "";

                $.each(data.responseObject.responseData.data_list,function(index,data){
                    nameStr +=data.name+'、';
                    var s = comm.getStrLen(data.company,30);
                    data.company = s;
                    var name = comm.getStrLen(data.name, 30);
                    data.name = name;
                    var ocutStr = data.medicalTitle.split(/[,]|[，]|[\s]/)[0];
                    var cutStr = "";
                    if(ocutStr.indexOf("_")>-1){
                        cutStr = ocutStr.split('_')[1];
                    }else{
                        cutStr =  ocutStr;
                    }
                    str+= '  <li data-href="/pages/personal/others_contribution.html?cid=' + data.customerId + '">' +
                    '           <a href="/pages/personal/others_contribution.html?cid=' + data.customerId + '"><img src="'+data.logoUrl+'" alt="">' +
                    '               <aside>' +
                    '                   <p>'+data.name+'</p>' +
                    '                   <p><span>'+cutStr+'</span><span>'+data.company+'</span></p>' +
                    '               </aside>' +
                    '           </a>' +
                    '       </li>';
                });
                $(".introductionCont").append('<section class="taecherIntroduction"><aside class="title">讲师简介</aside><ul>'+str+'</ul></section>');
                //if(data.responseObject.responseData.coursePrice==0.0||data.responseObject.responseData.coursePrice==null){
                //    data.responseObject.responseData.coursePrice="限时免费";
                //}
                var n = comm.getStrLen(data.responseObject.responseData.courseName, 32);
                data.responseObject.responseData.courseName = n;
                $('.introductionCont').prepend('<section class="introductionText">' +
                '                                   <p>'+data.responseObject.responseData.courseName+'</p>' +
                '                                   <p>浏览：'+data.responseObject.responseData.totalLearnNum.toWKH()+'<span>共'+data.responseObject.responseData.catalogNum+'节课</span></p>' +
                '                               </section>');
                if(data.responseObject.responseData.isCollected==1){
                    $(".collection").attr('class','collectioned').html("已收藏");
                }else{
                    $(".collection").html("收藏");
                }
                $('.taecherIntroduction ul li').on('click',function(){
                    g_sps.jump($(this),$(this).attr("data-href"));
                });
                document.title=data.responseObject.responseData.courseName+'体系化课程-唯医,allinmd';
                $("[name='keywords']").attr({"content":""+data.responseObject.responseData.courseName+"、"+nameStr+"、医学系列课、专业课程"})
            }
        },
        complete: function () {
            comm.loading.hide();
        }
    });
    var _hbanner = $('.courseBanner img').outerHeight();
    var _h = $('.al-indexHeader').outerHeight();
    var newH= _h+_hbanner;
    $(window).on('touchmove',function() {
        if ($(window).scrollTop() >newH) {
            $('.courseBanner nav').attr('style','position:fixed;top:'+_h+'px;z-index:9;width:100%');
            $('.al-indexHeader').attr('style','position:fixed;top:0px;z-index:9;border-bottom:solid 1px #fff;width:100%');
            $('.al-indexHeader figure:last-child').attr('style','margin-right:0.8rem');
        } else {
            $('.courseBanner nav').attr('style','');
            $('.al-indexHeader').attr('style','');
            $('.al-indexHeader figure:last-child').attr('style','');
        }
    });
    $.ajax({  //目录内容
        url:"/mcall/cms/course/getCatalogList/",
        data: { paramJson: $.toJSON({
            "courseId":getpara().tId,
            "isValid": 1,
            "firstResult": 0,
            "maxResult": 6
        })
        },
        beforeSend: function () {
            comm.loading.show();
        },
        success:function(data){
            if(comm.hasResponseData(data)){
                var videoNum = data.responseObject.responseData.videoNum;
                var caseNum = data.responseObject.responseData.caseNum;
                var docNum = data.responseObject.responseData.docNum;
                var bookNum = data.responseObject.responseData.bookNum;
                var vid="",cas="",doc="",book="";
                if(videoNum==0){
                    vid = '';
                }else{
                    vid = '视频('+videoNum+')';
                }
                if(caseNum==0){
                    cas = '';
                }else{
                    cas = '病例('+caseNum+')';
                }
                if(docNum==0){
                    doc = '';
                }else{
                    doc = '文库('+docNum+')';
                }
                if(bookNum==0){
                    book = '';
                }else{
                    book = '电子书('+bookNum+')';
                }
                var way = '<aside class="type">授课方式：<span>'+vid+'</span><span>'+cas+'</span><span>'+doc+'</span><span>'+book+'</span></aside>';
                var catalogList = "";
              //var newArr=[];
                var dataList = data.responseObject.responseData.data_list;
                //var dataLen = dataList.length;
              //for(var i=0;i<dataLen;i++){
              //    if(!dataList[i].resourceList.length==0) {
              //        newArr.push(dataList[i]);
              //    }
              //}
                $.each(dataList,function(index,value){
                    var innerStr = "";
                    if(value.resourceList.length == 0){
                        innerStr+= '<div class="active">精彩内容敬请期待</div>' ;
                    }
                    $.each(value.resourceList,function(i,tttt){
                        switch(parseInt(tttt.resourceType)){
                            case 1:
                                value.msg="视频";
                                break;
                            case 2:
                                value.msg="文库";
                                break;
                            case 7:
                                value.msg="病例";
                                break;
                            case 17:
                                value.msg="电子书";
                                break;
                            case 18:
                                value.msg="文章";
                                break;
                        }
                        var n = comm.getStrLen(tttt.resourceName, 30);
                        tttt.resourceName = n;
                        if(tttt.isNew==1){
                            innerStr+=
                                '               <div data-href="//'+tttt.webStoragePath+'" data-resource="'+tttt.resourceId+'">' +
                                '                   <span>'+value.msg+'</span>'+tttt.resourceName+'<b></b>' +
                                '               </div>' ;
                        }else{
                            innerStr+=
                                '               <div data-href="//'+tttt.webStoragePath+'">' +
                                '                   <span>'+value.msg+'</span>'+tttt.resourceName+'' +
                                '               </div>' ;
                        }

                    });

                        var W = comm.getStrLen(value.catalogName, 30);
                        value.catalogName = W;
                        var sort = parseInt(index)+1;
                        if(value.hasNew==1){
                            catalogList+='  <li data-flag="1" data-seriesid="'+value.catalogId+'"> <div class="catalogText">'+sort+'.'+value.catalogName+'<b></b><i></i></div>' +
                            '                   <aside style="">'+innerStr+'</aside>' +
                            '               </li>';
                        }else{
                            catalogList+='  <li data-flag="1" data-seriesid="'+value.catalogId+'"><div class="catalogText"> '+sort+'.'+value.catalogName+'<i></i></div>' +
                            '                   <aside style="">'+innerStr+'</aside>' +
                            '               </li>';
                        }
                });
                $('.catalogCont').prepend(way);
                $(".catalogList ul").append(catalogList);

                //...........
                function ana(data){
                    var returnData = {};
                    returnData.isLatestWatch = false;
                    returnData.isData = false;
                    $.each(data,function(i,v){
                        if(parseInt(v.isLatestWatch)==1){
                            returnData.isLatestWatch = true;
                            returnData.index = i;
                        }
                    });
                    return returnData;
                }
                function anaa(data){
                    var returnData = {};
                    returnData.isData = false;
                    $.each(data,function(i,v){
                        if(v.resourceList.length>0){
                            returnData.isData = true;
                            returnData.ind = i;
                            return false;
                        }
                    });
                    return returnData;
                }
                var anaData = ana(dataList);
                var anaDataa = anaa(dataList);
                if(anaData.isLatestWatch){
                    $('.catalogList ul li:eq('+anaData.index+')').attr('data-flag','2').addClass('up').find('aside').show();
                }else{
                    if(anaDataa.isData){
                        $('.catalogList ul li:eq('+anaDataa.ind+')').attr('data-flag','2').addClass('up').find('aside').show();
                    }
                }
                //...........

                $('[data-href]').off("click").on("click", function (e) {
                    e.stopPropagation();
                    Log.createBrowse(200, '体系化课程资源页',"21/"+$(this).parents('li').attr('data-seriesid'));
                    $(this).addClass('click');
                    g_sps.jump($(this),$(this).attr("data-href"));
                    return false;
                });
            }

        },
        complete: function () {
            comm.loading.hide();
        }
    });
    $.ajax({  //相关课程
        url:"/mcall/cms/course/getThisTeamPreferList/",
        data: {
            paramJson: $.toJSON({
                "courseId":getpara().tId,
                "isValid":1,
                "customerId": 1,
                "sortType":5,
                "pageIndex":1,
                "pageSize":6
            })
        },
        beforeSend: function () {
            comm.loading.show();
        },
        success:function(data){
            if(comm.hasResponseData(data)){
                if(data.responseObject.responseData.data_list){
                    var str="";
                    $.each(data.responseObject.responseData.data_list,function(index,data){
                        //if(data.coursePrice==0.0||data.coursePrice==null){
                        //    data.coursePrice="限时免费";
                        //}
                        var n = comm.cutstr(data.courseName, 36);
                        data.courseName = n;
                        str+= '     <li>' +
                        '               <a href="/pages/discover/series/discover_series_details.html?tId=' + data.courseId +'"><img src="'+data.courseCoverPicUrl+'"></a>' +
                        '               <aside>' +
                        '                   <p>' +
                        '                       <a href="/pages/discover/series/discover_series_details.html?tId=' + data.courseId +'">'+data.courseName+'</a>' +
                        '                   </p>' +
                        '                   <p><i></i>'+data.totalLearnNum.toWKH()+'<span>'+data.catalogNum+'节课</span></p>' +
                        '               </aside>' +
                        '           </li>';//<p>'+data.coursePrice+'</p>
                    });
                    $(".courseCont").append('<ul data-alcode-mod="646">'+str+'</ul>');
                }
            }
            //相关课程已注释
            //if (data && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.yiding_list.length) {
            //        var string="";
            //        $.each(data.responseObject.responseData.yiding_list,function(index,data){
            //            //if(data.coursePrice==0.0||data.coursePrice==null){
            //            //    data.coursePrice="限时免费";
            //            //}
            //            string+= '     <li>' +
            //            '                   <a href='+data.webStoragePath+'><img src="'+data.seriesPicUrl+'"></a>' +
            //            '                   <aside>' +
            //            '                       <p>' +
            //            '                           <a href="/pages/discover/series/discover_series_details.html?tId=' + data.seriesId +'">'+data.seriesTitle+'</a>' +
            //            '                       </p>' +
            //            '                       <p><i></i>'+data.browseNum.toWKH()+'<span>'+data.classNum+'节课</span></p>' +
            //            '                   </aside>' +
            //            '               </li>' ;//<p>'+data.coursePrice+'</p>
            //
            //
            //        });
            //        $(".courseCont").append('<ul data-alcode-mod="646">'+string+'</ul>');
            //}
        },
        complete: function () {
            comm.loading.hide();
        }
    });
//页面初始化结束

//tab切换开始
    $('.introduction ul li').on('click',function(){
        var index = $(this).index();
        switch(index){
            case 0:
                window.onload = Log.createBrowse(206, '课程介绍');
                $('.introductionCont').show();
                $('.catalogCont').hide();
                $('.courseCont').hide();
                $(this).addClass('active').siblings().removeClass('active');
                break;
            case 1:
                window.onload = Log.createBrowse(207, '课程目录');
                $('.introductionCont').hide();
                $('.catalogCont').show();
                $('.courseCont').hide();
                $(this).addClass('active').siblings().removeClass('active');
                break;
            case 2:
                window.onload = Log.createBrowse(208, '课程相关课程');
                $('.introductionCont').hide();
                $('.catalogCont').hide();
                $('.courseCont').show();
                $(this).addClass('active').siblings().removeClass('active');
                break;
        }
    });
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
//end

//5.分享页面start
    var shareObj = {
        title: '',
        summary: '',
        sinaTitle: '',
        wxTitle: '',
        wxDesc: '',
    };
    shareAll({
        fnMessageSuc: function () {
            comm.shareLog({
                shareType: "",
                resourceId: "",
                resourceType: "",
                refId: "",
                isValid: 1,
                shareSence: "",
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
                        "sceneType": "72",          // 71代表列表页分享，72代表详情页分享
                        //"cmsCourseUrl": window.location.href,                           //链接url
                        "resourceType": 0,                               //资源类型传0，代表所有类型
                        "courseId":getpara().tId
                    })
                },
                async:false,
                success:function(data){

                    if(comm.hasResponseData(data)){
                        var sList = data.responseObject.responseData.data_list[0].share_channel;
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

//end

//6.系列课详情页课程点击展开
    $('.catalogList ul').on('click','li',function(){
        if($(this).attr('data-flag')==1){
            $(this).attr('data-flag','2');
            $(this).find('aside').show();
            $(this).addClass('up');
        }else{
            $(this).attr('data-flag','1');
            $(this).find('aside').hide();
            $(this).removeClass('up');
        }
    });
//end
    //7.事件埋点
    function feed(name,word,action){
        comm.creatEvent({
            triggerType:name,
            triggerName:name,
            keyword:word,
            actionId:action
        });
    }

    var type,keyword;
    $('.collection').click(function(){
        type = $(this).text();
        keyword = $('.introduction ul li.active').text();
        feed(type,keyword,82);
    });
    //end
    $('.feedback').click(function(){
        type = $(this).text();
        keyword = $('.introduction ul li.active').text();
        feed(type,keyword,11005);

    });
});

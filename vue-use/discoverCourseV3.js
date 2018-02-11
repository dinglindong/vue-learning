Vue.filter("resourceType",function(v){
    var value = "";
    switch(parseInt(v,10)){
        case 1:
            value="视频";
            break;
        case 2:
            value="文库";
            break;
        case 7:
            value="病例";
            break;
        case 17:
            value="电子书";
            break;
        case 18:
            value="文章";
            break;
    }
    return value;
});
var seriesDetail = new Vue({
    el: ".al-mainInner",
    data: {
        seriesId:comm.getpara().tId,
        courseCoverPicUrl:"",
        teacherList:[],
        courseName:"",
        totalLearnNum:0,
        catalogNum:0,
        index:0,
        catalogList:[],
        catalogIndex:0,
        videoNum:0,
        caseNum:0,
        docNum:0,
        bookNum:0,
        courseList:[],
        toggleList:[],
        collectDes:"",
        indexDes:""
    },
    methods: {
        showIndex:function(index,des){
          var t = this;
          t.index = index;
          t.indexDes = des;
        },
        toggleSlide:function(index){
          var t = this;
          t.catalogList[index].toggleOnOff = !JSON.parse(JSON.stringify(t.catalogList[index].toggleOnOff));
        },
        showBanner:function(){
            var t = this;

            axios({
                url: '/mcall/cms/course/getCourseAuthorList/',
                method: "POST",
                data: {
                    "courseId": t.seriesId,
                    "customerId": TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
                    "isValid": 1
                },
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                timeout: 30000
            }).then(function(res){
                t.courseCoverPicUrl =res.data.responseObject.responseData.courseCoverPicUrl;
                t.courseName = res.data.responseObject.responseData.courseName;
                t.totalLearnNum = res.data.responseObject.responseData.totalLearnNum;
                t.catalogNum = res.data.responseObject.responseData.catalogNum;
                t.collectDes = (parseInt(res.data.responseObject.responseData.isCollected,10)===1)?"已收藏":"收藏";
                t.teacherList = res.data.responseObject.responseData.data_list;
            });
            return t;
        },
        showCatalog:function(){
            var t = this;
            axios({
                url: '/mcall/cms/course/getCatalogList/',
                method: "POST",
                data: {
                    "courseId":t.seriesId,
                    "isValid": 1,
                    "firstResult": 0,
                    "maxResult": 6
                },
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                timeout: 30000
            }).then(function(res) {
                var list = res.data.responseObject.responseData.data_list;

                list.forEach(function(v,i){
                   if(i===0){
                       v.toggleOnOff = true;
                   }else{
                       v.toggleOnOff = false;
                   }
                });
                t.catalogList = list;
                t.videoNum = res.data.responseObject.responseData.videoNum;
                t.caseNum = res.data.responseObject.responseData.caseNum;
                t.docNum = res.data.responseObject.responseData.docNum;
                t.bookNum = res.data.responseObject.responseData.bookNum;
            });
            return t;
        },
        logFeed:function(){
          var t = this;
            comm.creatEvent({
                triggerType:"反馈",
                keyword:t.indexDes,
                actionId:11005,
                async:false
            });
          return t;
        },
        collect:function(){
          var t = this;
            comm.creatEvent({
                triggerType:t.collectDes,
                keyword:t.indexDes,
                actionId:82,
                async:false
            });
            user.privExecute({
                operateType: 'auth',
                callback: function () {
                    if (TempCache.getItem("customerRole") == 2 || TempCache.getItem("customerRole") == 3 || TempCache.getItem("customerRole") == 4) {

                    } else {
                        if (t.collectDes == "收藏") {
                            $.ajax({
                                url: "/mcall/customer/collection/create/",
                                data: {
                                    paramJson: $.toJSON({
                                        "collectionType": "18",
                                        "refId": t.seriesId,
                                        "customerId": TempCache.getItem("userId")
                                    })
                                },
                                success: function (data) {
                                    if (data.responseObject.responseStatus == true) {
                                        popupFn("收藏成功", 1500);
                                        t.collectDes ="已收藏";
                                    }
                                }
                            });
                        } else {
                            $.ajax({
                                url: "/mcall/customer/collection/delete/",
                                data: {
                                    paramJson: $.toJSON({
                                        "collectionType": "18",
                                        "refId": t.seriesId,
                                        "customerId": TempCache.getItem("userId")
                                    })
                                },
                                success: function (data) {
                                    if (data.responseObject.responseStatus == true) {
                                        popupFn("取消收藏成功", 1500);
                                        t.collectDes ="收藏";
                                    }
                                }
                            });
                        }
                    }
                }
            });
        },
        returnBack:function(){
            comm.creatEvent({
                triggerType:'全站功能按钮点击',
                keyword:"返回",
                actionId:41,
                async:false
            });
            history.back();
        },
        showCourseList:function(){
            var t = this;
            axios({
                url: '/mcall/cms/course/getThisTeamPreferList/',
                method: "POST",
                data: {
                    "courseId":t.seriesId,
                    "isValid":1,
                    "customerId": 1,
                    "sortType":5,
                    "pageIndex":1,
                    "pageSize":6
                },
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                timeout: 30000
            }).then(function(res) {
                t.courseList = res.data.responseObject.responseData.data_list;
            });
            return t;
        },
        share:function(){
            var t = this;
            var shareObj = {
                title: '',
                summary: '',
                sinaTitle: '',
                wxTitle: '',
                wxDesc: '',
            };
            var options = {
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

                    axios({
                        url: '/mcall/comm/data/share/getMapList3/',
                        method: "POST",
                        data: {
                            "sceneType": "72",          // 71代表列表页分享，72代表详情页分享
                            "resourceType": 0                            //资源类型传0，代表所有类型
                        },
                        transformRequest: [function(data) {
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        timeout: 30000
                    }).then(function(res) {
                        var data = res.data;
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
                    });
                    return shareObj;
                }
            };
            shareAll(options, false, $('.share'))
            return t;
        },
        moveContent:function(){
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
        }
    },
    mounted:function(){
        var t = this;
        t.showBanner().showCatalog().showCourseList().share().moveContent();
    }
});
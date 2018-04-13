/**
 * 功能描述：  发现——系列课
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：系列课vue重构
 *
 * Created by Ding on 2017/11/06.
 */
var vm = new Vue({
    data:{
        isshowtab:true,     //判断平台类型
        path:{
            history:'/mcall/cms/course/getLatestRecord/',   //历史观看
            banner:'/mcall/cms/course/getBannerList/',      //banner
            list:'/mcall/cms/course/getHotCourseList/',     //系列课列表
            lecturer:'/mcall/cms/course/getHotAuthorList/', //推荐讲师
            share:"/mcall/comm/data/share/getMapList3/"     //分享
        },  //存储所有请求
        params:{
            customerId:TempCache.getItem('userId')||'',
            platformId : TempCache.getItem('department')||1,
            sceneType:71
        },  //公共变量
        listParams:{
            "isValid": 1,
            "pageIndex":1,
            "pageSize":6,
            "sortType": 4,
            "courseSubjectTeamId": 0,
            "platformId":TempCache.getItem('department')||1
        },  //系列课请求参数
        lecturerParams:{
            "sortType": 4,
            "courseSubjectTeamId":0,
            "platformId":TempCache.getItem('department')||1
        },   //讲师请求参数
        listData:[],    //存储系列课数据
        lecturerData:[],    //存储讲师数据
        listNum:0,      //存储系列课数量1
        moreNum:6,      //存储系列课数量2
        tab:false,      //滑动固定判断[这快沿用原来的方法]
        tabs:["推荐","创伤","脊柱","关节"],     //tab标签动态添加
        num: 0,     //tab切换记录下标
        bannerShow:false,   //请求成功为true
        attrUrl:'',     //banner图连接
        linkUrl:'',     //banner跳转连接
        highBanner:'',      //banner高度
        historyShow:false,  //请求成功为true
        historyPath:'',     //观看历史跳转
        historyName:''      //观看历史名称
    },
    methods:{
        //主方法
        init:function(){
            this.loader();
            this.bannerLoad();
            this.courseList();
            this.popularLecturer();
        },
        loader:function(){
            var t = this;
            if(this.params.platformId == 2){
                this.isshowtab = false;
            }
            axios({
                url:this.path.history,
                method:"post",
                data:{
                    "isValid": 1,
                    "sortType": 2
                },
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                timeout: 30000
            }).then(function(data){
                if (comm.hasResponseData(data.data)){
                    var newData = data.data.responseObject.responseData.data_list;
                    t.historyShow = true;
                    t.historyPath = newData.webStoragePath;
                    t.historyName = comm.getStrLen(newData.videoName,22);
                    setTimeout(function () {
                        $('.banner p').animate({"margin-left": "-100%"}, 500);
                    }, 5000);
                   document.getElementById('close').addEventListener('click',function () {
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
            });
        },
        bannerLoad:function(){
            var t = this;
            axios({
                url:this.path.banner,
                method:"post",
                data:{
                    "isValid": 1,
                    "channelId": 149
                },
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                timeout: 30000
            }).then(function(data){
                if(comm.hasResponseData(data.data)){
                    var banner = data.data.responseObject.responseData.data_list[0].ad_profile_attachment;
                    t.bannerShow = true;
                    t.attrUrl = banner[0].adAttUrl;
                    t.linkUrl = banner[0].linkUrl ? banner[0].linkUrl : 'javascript:;';
                    $('.banner a img').on('click',function(){
                        comm.creatEvent({
                            triggerType:'广告位',
                            triggerName:'广告位-轮播图',
                            keyword:"广告位-轮播图-系列课",
                            actionId:14
                        });
                    });
                }
            },function(res){
                //console.log('数据请求失败');
            });
        },
        courseList:function(){
            var t = this;
            comm.loading.show();
            axios({
                url:this.path.list,
                method:"post",
                data:t.listParams,
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                timeout: 30000
            }).then(function(data){
                comm.loading.hide();
                if(comm.hasResponseData(data.data)){
                    if(t.listNum==0){
                        window.onload = Log.createBrowse(202, '系列课-推荐');
                    }
                    var item =  data.data.responseObject.responseData.data_list;
                    t.listData = item;
                    t.listNum = item.length;
                }else{
                    t.listData = '';
                }
            },function(res){
                //console.log('数据请求失败[数据]');
            });
        },
        popularLecturer:function(){
            var t = this;
            comm.loading.show();
            axios({
                url:this.path.lecturer,
                method:"post",
                data:t.lecturerParams,
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                timeout: 30000
            }).then(function(data){
                comm.loading.hide();
                if(comm.hasResponseData(data.data)){
                    t.lecturerData = data.data.responseObject.responseData.data_list.slice(0,30);
                }else{
                    t.lecturerData = '';
                }
                //4.受欢迎讲师start滑动
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: "auto",
                    paginationClickable: true,
                    freeMode: true,
                    observer: true
                });
                //end
            },function(res){
                //console.log('数据请求失败[讲师]');
            });
        },
        handleScroll:function(){
            //var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            //var offsetTop = document.querySelector('.tabtitle').offsetTop;
            //if (scrollTop > offsetTop) {
            //    this.tab = true;
            //} else {
            //    this.tab = false;
            //}
            var t = this;
            var _h = $('.al-indexHeader').outerHeight();//获取头部高度
            var _n = $('.nav').offset().top;//获取头部高度

            $(window).on('touchmove scroll',function() {
                if ($(window).scrollTop() > 0) {
                    $('.al-indexHeader').addClass('isFixedTab');
                    $('.al-indexHeader .al-indexHeaderItem:last-child').attr('style','margin-right:0.8rem');
                } else {
                    $('.al-indexHeader').removeClass('isFixedTab');
                    $('.al-indexHeader .al-indexHeaderItem:last-child').attr('style','');
                }
                if($(window).scrollTop()>_n){
                    $('.courseBanner nav').attr('style','position:fixed;top:'+_h+'px;z-index:9;width:100%;');
                }else{
                    $('.courseBanner nav').attr('style','');
                }

            });
        },  //浮动
        //页面点击方法
        backBtn:function(){
            comm.creatEvent({
                triggerType:'全站功能按钮点击',
                keyword:"返回",
                actionId:41,
                async:false
            });
            history.back();
        },  //返回
        loadMore:function(){
            var t = this;
            t.listParams.pageIndex++;
            comm.loading.show();
            axios({
                url: t.path.list,
                method:"post",
                data:t.listParams,
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                timeout: 30000
            }).then(function(data){
                comm.loading.hide();
                if(comm.hasResponseData(data.data)){
                    var item = data.data.responseObject.responseData.data_list;
                    for(var i= 0,lg=item.length;i<lg;i++){
                        t.listData.push(item[i]);
                    }
                    t.listNum = item.length;
                    t.moreNum = item.length;
                    switch(t.listParams.courseSubjectTeamId){
                        case 0:
                            t.publicClick('推荐-猜你喜欢');
                            break;
                        case 9:
                            t.publicClick('创伤-猜你喜欢');
                            break;
                        case 7:
                            t.publicClick('脊柱-猜你喜欢');
                            break;
                        case 2:
                            t.publicClick('关节-猜你喜欢');
                            break;
                    }
                }
            });
        },  //展开->埋点1↓
        packUp:function(){
            this.listData = this.listData.slice(0,6);
            this.moreNum = 6;
            this.listNum = 6;
            this.listParams.pageIndex = 1;
        },  //收起
        tabControl:function(index){
            var t = this;
            t.num = index;
            t.moreNum = 6;
            t.listParams.pageIndex=1;
            switch(parseInt(index)){
                case 0:
                    t.listParams.courseSubjectTeamId=0;
                    t.lecturerParams.courseSubjectTeamId=0;
                    window.onload = Log.createBrowse(202, '系列课-推荐');
                    break;
                case 1:
                    t.listParams.courseSubjectTeamId=9;
                    t.lecturerParams.courseSubjectTeamId=9;
                    window.onload = Log.createBrowse(203, '系列课-创伤');
                    break;
                case 2:
                    t.listParams.courseSubjectTeamId=7;
                    t.lecturerParams.courseSubjectTeamId=7;
                    window.onload = Log.createBrowse(204, '系列课-脊柱');
                    break;
                case 3:
                    t.listParams.courseSubjectTeamId=2;
                    t.lecturerParams.courseSubjectTeamId=2;
                    window.onload = Log.createBrowse(205, '系列课-关节');
                    break;
            }
            this.courseList();
            this.popularLecturer();
        },  //tab切换
        create:function(id,index){
            var t = this;
            Log.createBrowse(199, '体系化课程页',"21/"+$(this).attr('data-seriesid'));
            switch(t.listParams.courseSubjectTeamId){
                case 0:
                    t.publicData('推荐-猜你喜欢',id,index);
                    break;
                case 9:
                    t.publicData('创伤-猜你喜欢',id,index);
                    break;
                case 7:
                    t.publicData('脊柱-猜你喜欢',id,index);
                    break;
                case 2:
                    t.publicData('关节-猜你喜欢',id,index);
                    break;
            }
        },  //埋点2↓
        publicClick:function(value){
            comm.creatEvent({
                triggerType:'系列课',
                triggerName:'更多好课',
                keyword:value,
                actionId:11003
            });
        },  //埋点1
        publicData:function(value,id,index){
            comm.creatEvent({
                triggerType:'系列课',
                triggerName:'猜你喜欢',
                keyword:value,
                actionId:11002,
                refId: id,
                locationId:index+1
            });
        },  //埋点2
        share:function() {
            var t = this;
            var shareObj = {};
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
                triggerRequest: function () {
                    $.ajax({
                        url: "/mcall/comm/data/share/getMapList3/",
                        data: {
                            paramJson: $.toJSON({
                                "sceneType": "71",          // 171代表列表页分享，172代表详情页分享
                                //"cmsCourseUrl": window.location.href,                           //链接url
                                "resourceType": 0,                               //资源类型传0，代表所有类型
                                "platformId": TempCache.getItem('department')
                            })
                        },
                        async: false,
                        dataType: "json",
                        success: function (data) {
                            if (comm.hasResponseData(data)) {
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
        }   //分享
    },
    mounted:function(){
        this.init();
        this.share();
        window.addEventListener('scroll',this.handleScroll);
    },
    destroyed:function(){
        window.removeEventListener('scroll', this.handleScroll);
    }
}).$mount('#box');






























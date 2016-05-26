window.onload = function(){
/**
 * ajax函数说明
 * @param  {obj} option :{
 *          method: 'GET', 通过ajax的方法
			data: {
				'pageNo': 1,  当前页码
				'psize':20,	  每页返回个数
				'type':10     返回当前页面的类型 产品设计type=10 编程语言type=20
			},
			url: 'http://study.163.com/webDev/couresByCategory.htm', 请求数据的地址
			callback: bulidCourseContent   回调函数
 * }
 * 
 */
var ajax = function(option){
	var xhr = new XMLHttpRequest();
	var urlContent,
		method = option.method;
		if(option.data !== null){
			askData = option.data;
			var arr = []
			for(var i in askData){
				arr.push(encodeURIComponent(i) + '=' +encodeURIComponent(askData[i]));
			}
				urlContent = option.url + arr.join('&');
		}else{
				urlContent = option.url;
		}
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)
				
              		option.callback(xhr.responseText);
              	
			}
		}
	

	xhr.open(method, urlContent, true);
	xhr.send();
}

/**
 * 构建课程列表卡片 及添加onmouseover事件
 * ---------------------------------------------------
 * 默认样式如下：
 * 		<li class="courseList">	
			<img src="#" class="course-img "alt="课程图片"/>
			<div class="li_say">
				<a href="#">混音全揭秘 舞曲实战篇 揭秘音乐揭秘音乐揭秘音乐</a>
				<p>音频帮</p>
				<p class="tab_pic"></p>
				<div class="de_price">&yen;800.00
				</div>
			</div>
			<div class="cover">
				<img src="#" class="course-img "alt="课程图片"/>
				<p class="cover-name"></p>
				<p class="cover-student"></p>
				<p class="cover-provide"></p>
				<p class="cover-category"></p>
				<div class="cover-describe">
					<p class="cover-describe-content"></p>
				</div>
			</div>
		</li>
 */

var bulidCourseContent = function(backText){
	var courseDetail = document.getElementById('courseDetail');
	var courseList = JSON.parse(backText);
	var numItem = courseList.pagination.pageSize;
	var html = '';
	
	
	for(var i=0 ;i < numItem ; i++){

		html += '<li class="courseList">';
		html += '<img class="course-img" alt="课程图片" src=' + courseList.list[i].bigPhotoUrl  + '>';
		html += '<div class="li_say">';
		html += '<a href="#">' + courseList.list[i].name + '</a>';
		html += '<p>' + courseList.list[i].provider + '</p>';
		html += '<p class="tab_pic">' + courseList.list[i].learnerCount + '</p>';
		if(courseList.list[i].price !== 0){
			html += '<div class="de_price">&yen;' + courseList.list[i].price + '</div>';				
		}else{
			html += '<div class="de_price">免费</div>';
		}
		html += '</div>';
		html += '<div class="cover">';
		html += '<img class="course-img" alt="课程图片" src=' + courseList.list[i].bigPhotoUrl  + '>';
		html += '<p class="cover-name">' + courseList.list[i].name + '</p>';
		html += '<p class="cover-student">' + courseList.list[i].learnerCount + '人在学</p>';
		html += '<p class="cover-provide">发布者：' + courseList.list[i].provider + '</p>';
		if(courseList.list[i].categoryName === null){
			html += '<p class="cover-category">分类：无</p>';
		}else{		
			html += '<p class="cover-category">分类：' + courseList.list[i].categoryName + '</p>';
		}
		html += '<div class="cover-describe"><p class="cover-describe-content">'+ courseList.list[i].description  +'</p></div>';
		html += '</div>';
		html += '</li>';
	
	}
	courseDetail.innerHTML = html;
	
	//添加事件 hover出现浮出卡片
	var courseLi = courseDetail.querySelectorAll('.courseList');
	for(var i =0 ;i < courseLi.length; i++){
		courseLi[i].index = i;
		
		
		courseLi[i].onmouseover = function(){
			this.querySelector('.cover').style.display = 'block';
		}
		
		courseLi[i].onmouseout = function(){
			this.querySelector('.cover').style.display = 'none';
		}
	}

}

//调用ajax获取列表 并显示在页面 当前页面为默认页面

//默认选项
var defaultCourseOption={
				method: 'GET',
				data: {
					'pageNo': 1,
					'psize':20,
					'type':10
				},
				url: 'https://study.163.com/webDev/couresByCategory.htm?',
				callback: bulidCourseContent
			};
var curPagePlay = function(){
		
		ajax(defaultCourseOption);

	};
curPagePlay();

//获得两个按钮并未两个按钮添加事件
var tabDesign = document.getElementById('tab_design');
var tabProgram = document.getElementById('tab_program');

tabDesign.onmousedown = function(){
	tabDesign.className = 'choose';
	tabProgram.className = '';
	defaultCourseOption.data.type = 10;
	defaultCourseOption.data.pageNo = 1;
	curPagePlay();
	defaultCourseList.data.pageNo = 1;
	pageListplay();
}
tabProgram.onmousedown = function(){
	tabDesign.className = '';
	tabProgram.className = 'choose';
	defaultCourseOption.data.type = 20;
	defaultCourseOption.data.pageNo = 1;
	curPagePlay();
	defaultCourseList.data.pageNo = 1;
	pageListplay();
}

/*
--分页器模块-
-----------------
分页器结构
	<div class="pageList" id="pageList"> //已经存在部分
		<span class="edge left">&lt;</span>
			<ul class="tab_foot">	
				<li class="choose">1</li>
				<li>2</li>
				<li>3</li>
				<li>4</li>
				<li>5</li>
				<li>6</li>
				<li>7</li>
				<li>8</li>
			</ul>
		<span class="edge right">&gt;</span>
	</div> //已经存在部分
	--------------------------------------------------
		var curPage = courseList.pagination.pageIndex; 当前页面，默认为1
		var totalPages = courseList.totalPage; 页面的总数
		var playLength = 8;分页器每次要显示的页面数量
 
*/
var bulidPageList = function(backText){
		var pagesId = document.getElementById('pageList');
		var html = "";
		var courseList = JSON.parse(backText);
		//由于从第五页开始courseList.pagination.pageIndex的数值都为4 导致页码块无法更新
		//找这个问题找了一天 结果发现问题在这儿 真是揪心
		var curPage = courseList.pagination.pageIndex;
		var totalPages = courseList.totalPage;
		var playLength = 8;

		html += '<span class="edge left">&lt;</span>';
		
		html += '<ul class="tab_foot">';
		//调整页码表 实现页码的更新
		var midPoint = Math.ceil(playLength / 2);
		var isMidPage = curPage - midPoint > 0 && curPage <= (totalPages - midPoint); 
		var isEndPage = curPage > (totalPages - midPoint);
		
		var startPage,
		 	pos=0;
		if(isMidPage){
			startPage = curPage - midPoint +1 ;
			pos = midPoint - 1;
		}else if(isEndPage){
			startPage = totalPages - playLength + 1;
			pos = playLength - (totalPages - curPage) -1 ;
		}else{
			startPage = 1;
			pos = curPage - 1;
		}
		
		for(var i = 0; i < playLength ; i++, startPage++){
			if(i === pos){
				html += '<li class="choose">' + startPage + '</li>';
			}else{
			html += '<li>' + startPage + '</li>';
			}
		}
		html += '<span class="edge right">&gt;</span>';
		html += '</div>';

		pagesId.innerHTML = html;

		//给页码表板块添加事件
		var li = pagesId.getElementsByTagName('li');
		var left = pagesId.querySelectorAll('.left')[0];
		var right = pagesId.querySelectorAll('.right')[0];

		left.onmouseover =function(){
			this.style.cursor = 'pointer';
			this.style.background = '#39a030';
		}
		left.onmouseout = function(){
			this.style.background = '#9dd8b1';
		}
		right.onmouseover =function(){
			this.style.cursor = 'pointer';
			this.style.background = '#39a030';
		}
		right.onmouseout = function(){
			this.style.background = '#9dd8b1';
		}
		listEvent(li,left,right,curPage,totalPages);
		
}
//初始化页码表
var defaultCourseList = {
				method: 'GET',
				data: {
					'pageNo': 1,
					'psize':20,
					'type':10
				},
				url: 'https://study.163.com/webDev/couresByCategory.htm?',
				callback: bulidPageList
			};
var pageListplay = function(){
	ajax(defaultCourseList);
};
pageListplay();

//页码表板块事件
var listEvent = function(li,left,right,curPage,totalPages){
		
		for(var i=0; i < li.length; i++){
			li[i].onmouseover = function(){
				this.style.cursor = 'pointer';
				this.style.color = '#39a030';
			}
			li[i].onmouseout = function(){
				this.style.color = '#666';
			}
			li[i].index = i;
			li[i].onmouseup = function(){
				if(parseInt(this.innerHTML) !== curPage){
					
					curPage = parseInt(this.innerHTML);
					defaultCourseList.data.pageNo = curPage;
					defaultCourseOption.data.pageNo = curPage;
					curPagePlay();
					pageListplay();
					
				}
			
			}
		}
		left.onmouseup = function(){
			if(curPage !== 1){
				curPage -=1;
				defaultCourseList.data.pageNo = curPage;
				defaultCourseOption.data.pageNo = curPage;
				curPagePlay();
				pageListplay();
			}
		}
		right.onmouseup = function(){
			if(curPage !== totalPages){
				curPage +=1;
				defaultCourseList.data.pageNo = curPage;
				defaultCourseOption.data.pageNo = curPage;
				curPagePlay();
				pageListplay();
			}
		}
	}

/**
 * 右侧最热排行模块
 * -------------------------
 * 结构
	 	<li class="hotlist-item">
			<img src="#" alt="" class="li_left">
			<a href="#">舞曲揭秘音乐揭秘音乐揭秘</a>
			<div class="li_right"></div>
		</li>
 */
var nextPage = 0;
var listId = document.getElementById('hotlist');

var buildHotList = function(hotList){
	
	var hotList = JSON.parse(hotList);	
	var html = '';
	
	for(var i = nextPage + 10; i > nextPage ; i--){
			html += '<li class="hotlist-item">';
			html += '<img src="'+ hotList[i].smallPhotoUrl +'" alt="" class="li_left"/>';
			html += '<a href="#">' + hotList[i].name + '</a>';
			html +=  '<p class="li_right">'+ hotList[i].learnerCount  +'</p>'
		}
	listId.innerHTML = html;

	//给最热排行添加时间	
	var timmer = setInterval(function(){
		clearInterval(timmer);
		nextPage++;
		if(nextPage === hotList.length - 10){
		nextPage = 0;
		}
		hotListPlay();
		},5000);
}
//初始化最热排行
var defaultHotList = {
		method: 'GET',
		url: 'https://study.163.com/webDev/hotcouresByCategory.htm',
		callback: buildHotList
	}
var hotListPlay = function(){
	ajax(defaultHotList);
}
hotListPlay();

//视频弹窗
var videoId = document.getElementById('video');
var video = videoId.getElementsByTagName('video')[0];
var videoGate = document.getElementById('video_gate');
var videoClose = videoId.querySelectorAll('.video_close')[0];
var mask = document.getElementById('mask');
videoGate.onmouseup = function(){
	mask.style.display = 'block';
	videoId.style.display = 'block';
}
videoClose.onmouseup = function(){
	videoId.style.display = 'none';
	mask.style.display = 'none';
	video.pause();
}

//获取对应的cookie的值
// function getCookie(name){
// 	if(document.cookie.length > 0){
// 		var first = document.cookie.indexOf(name);
// 		if(start !== -1){
// 			var start = first + name.length + 1;
// 			var end = document.cookie.indexOf(";", start);
// 			if(end !== -1){
// 				end = document.cookie.length;
// 			}
// 			return (document.cookie.substring(start,end));
// 		}
// 	}
// 	return "";
// }
//顶部通知条事件 通过查看设置的本地cookie实现
//设置cookie值的失效时间
var oDate = new Date();
	oDate.setDate(oDate.getDate() + 30);
var tip = document.getElementById('tip');
var tipClose = tip.querySelectorAll('.tip_right')[0];
var isClose = document.cookie.indexOf('isClose');
//判断cookie中是否有isClose
if(isClose !== -1){
	tip.style.display = 'none';
}else{
	tip.style.display = 'block';
}
tipClose.onmousedown = function(){
	tip.style.display = 'none';
	//添加cookie
	document.cookie += "isClose=close;expire=" + oDate;
}

//给关注按钮添加事件
var follow_btn = document.getElementById('follow_btn');
var login = document.getElementById('login_block');
var loginSuc0 = document.cookie.indexOf('loginSuc=0');
var loginSuc1 = document.cookie.indexOf('loginSuc=1');
var followSuc = document.cookie.indexOf('followSuc');
follow_btn.onmouseover = function(){
	this.src = "images/top_little1-2.png";
}
follow_btn.onmouseout = function(){
	this.src = "images/top_little1-1.png";
}
follow_btn.onmousedown = function(){
	if(followSuc === -1){
		if(loginSuc1 === -1){
			userName.value = "";
			password.value = "";
			mask.style.display = 'block';
			login.style.display = 'block';
			//表单提交处理
			
		}else{
			this.src = "images/top_little1-3.png";
			follow_btn.onmouseover = function(){
				this.src = "images/top_little1-4.png";
			}
			follow_btn.onmouseout = function(){
				this.src = "images/top_little1-3.png";
			}
		}
	}else{
		this.src = "images/top_little1-3.png";
		follow_btn.onmouseover = function(){
			this.src = "images/top_little1-4.png";
		}
		follow_btn.onmouseout = function(){
			this.src = "images/top_little1-3.png";
		}
	}
}

//获取导航关注的cookie
var followCookieData = {
		method: 'GEt',
		url:'https://study.163.com/webDev/attention.htm',
		callback:followSuccess
}

function followSuccess(data){
	var data = JSON.parse(data);
	document.cookie += "followSuc=" + data;
	
}


//表单事件处理
var userName = document.getElementById('username');
var password = document.getElementById('password'); 
var warnShow = document.getElementById('warnshow');
var loginBtn = document.getElementById('login');
var loginClose = document.getElementById('login_close');
// var md5name = calcMD5(userName.value);
// var md5pass = calcMD5(password.value);
// var askMd5N = calcMD5('studyOnline');
// var askMd5P = calcMD5('study.163.com');
loginBtn.onmousedown = function(){
		var md5name = calcMD5(userName.value);
		var md5pass = calcMD5(password.value);
		var loginCookieData = {
				method: 'GEt',
				url: 'https://study.163.com/webDev/login.htm?',
				data: {
					'userName' : md5name,
					'password' : md5pass
				},
				callback: loginRespons
			};
		ajax(loginCookieData);
		
		function loginRespons(data){
			var data = JSON.parse(data);
			console.log(data);
			if(data === 0){
				warnShow.style.display = 'block';
				userName.value = "";
				password.value = "";
				// cookie += "loginSuc=" + data; 
			}else if(data === 1){
				follow_btn.src = "images/top_little1-3.png";
				follow_btn.onmouseover = function(){
					this.src = "images/top_little1-4.png";
				}
				follow_btn.onmouseout = function(){
					this.src = "images/top_little1-3.png";
				}
				warnShow.style.display = 'none';
				document.cookie += "loginSuc=" + data;
				
				login.style.display = 'none';
				mask.style.display = 'none';
				ajax(followCookieData);
				
			}else{
				warnShow.style.display = 'block';
			}
		}
}

loginClose.onmousedown = function(){
		login.style.display = 'none';
		mask.style.display = 'none';
		warnShow.style.display = 'none';
		userName.value = "";
		password.value = "";
	}


//轮播图
var topBanner = document.getElementById('banner'),
			aElement = document.getElementById('b_pic').getElementsByTagName('a'),
			button = document.getElementById('b_pointer').getElementsByTagName('i'),
			prev = document.getElementById('prev'),
			next = document.getElementById('next'),
			timmer = null,
			flag=false,//检测是否正在切换图片
			index = 0;
		
		//自动播放
		function play(){
			clearInterval(timmer);
			timmer = setInterval(function(){
				next.onmousedown();
			}, 5000);
		}
		//停止播放
		function stop(){
			clearInterval(timmer);
		}

		//向前切换
		prev.onmousedown = function(){
			if(flag){
				return;
			}
			if(index === 0){
				index = 2;
			}else{
				index--;
			}
			
			change();
		}

		//向后切换
		next.onmousedown = function(){
			if(flag){
				return;
			}
			if(index === 2){
				index = 0;
			}else{
				index++;
			}
			
			change();
		}

		//图片切换动画
		function change(){
			for(var i= 0 ;i < aElement.length; i++){
				aElement[i].style.opacity = 0;
				if(aElement[i].className === 'run'){
					aElement[i].className = '';
					break;
				}
			}

			var cTime = 500;//图片切换完毕需要的时间
			var eTime = 50;//每次增加数值的时间间隔
			var speed = 1/(cTime/eTime);//每次增加的透明度数值
			var alpha = 0;//透明度参考数值

			function go(){
				if(alpha < 1){
					flag = true;
					alpha += speed;
					aElement[index].style.opacity = alpha;
					showButton();
					setTimeout(go, eTime);
				}else{
					flag = false;
					aElement[index].style.opacity = 1;
					aElement[index].className = 'run';
					alpha = 0;
					
				}
			}

			go();
			
		}

		//没有过度动画的图片切换
		// function change(){
		// 	for(var i= 0 ;i < aElement.length; i++){
		// 		if(aElement[i].className === 'run'){
		// 			aElement[i].className = '';
		// 			break;
		// 		}
		// 	}
			
		// 	aElement[index].className = 'run';
		// 	showButton();
		// }

		//小圆点的样式切换
		function showButton(){
			for(var i = 0; i < button.length; i++){
				if(button[i].className === 'active'){
					button[i].className = '';
					break;
				}
			}
			button[index].className = 'active';
		}

		

		//小圆点点击图片切换
		for(var i = 0; i < button.length; i++){
			button[i].index = i;
			button[i].onmousedown = function(){
				index = this.index;
				change();
			}
		}

	topBanner.onmouseover = stop;
	topBanner.onmouseout = play;

	play();

	
}
(function($){
	$.fn.extend({
		calandar:function(options){
			var param = {
				dateFormat:null,
				StartYear:null,     //下拉列表的开始年份
				EndYear:null,      //下拉列表的结束年份
				callbackFunc:null
			};
			$.extend(param,options);

			// 初始化
			var ele = $("#"+$(this).attr('id')+"");
			var result = ele.find('.result');
			var dateFormat = param.dateFormat;
			var StartYear = param.StartYear;
			var EndYear = param.EndYear;
			var date = new Date();
			var currentYear = date.getFullYear();   //结束年份确定为现今年份
			var currentMonth = date.getMonth();
			var currentDay = date.getDate();
			var monthBox = "";
			var yearBox = "";
			var monthArray = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
			var month1 = [1,3,5,7,8,10,12];
			var month2 = [4,6,9,11];
			var api = {
				init:function(year,month){
					
					var firstDay = api.weekDay(year,month,1);
					var tBody = ele.find('.cl-body tbody');
					
					// 根据月份判断
					if( $.inArray(month,month1) > -1 ){
						api.fillTab(tBody,firstDay,31);
					}else if( $.inArray(month,month2) > -1 ){
						api.fillTab(tBody,firstDay,30);
					}else{
						if( api.leapYear(year) ){
							api.fillTab(tBody,firstDay,29);
						}else{
							api.fillTab(tBody,firstDay,28);
						}
					}
				},
				// 确定表格并且填充数据
				fillTab:function(tBody,firstDay,dayNum){

					tBody.html(" ");

					var rowNum = Math.ceil((dayNum + firstDay)/7);
					var rowTd = "<td></td><td></td><td></td><td></td><td></td><td></td><td></td>";

					for( var i = 0; i < rowNum; i++ ){
						tBody.append("<tr></tr>");
					}
					tBody.find("tr").append(rowTd);

					// 填充表格
					for( var i = firstDay; i < rowNum*7 ; i++ ){
						var day = "<a href='javascript:void(0);'>"+(i-firstDay+1)+"</a>";
						if( i < (dayNum + firstDay) ){
							tBody.find("td").eq(i).append(day);
						}
					}

					tBody.find("td").eq(currentDay-1+firstDay).addClass('active');
				},
				// 闰年计算
				leapYear:function(year){
					if( (year%4===0 && year%100!==0)||(year%100===0 && year%400===0) ){
						return true;
					}else {
						return false;
					}
				},
				// 由年月日确定星期
				weekDay:function(year,month,day){
					var Mydate = new Date(""+year+"/"+month+"/"+day+"");
	 				return Mydate.getDay();
				},
				// 通过毫秒数确定年月日
				getDate:function(millsec){
					var y = new Date(millsec).getFullYear();
					var m = api.addZero(new Date(millsec).getMonth()+1);
					var d = api.addZero(new Date(millsec).getDate());
					return y + "-" + m + "-" + d;
				},
				// 前进后退按钮控制
				controlFun:function(flag,EndYear,StartYear){

					var oIndex = ele.find('.month option:selected').index();
					var yearVal = ele.find('.year option:selected').val();

					// 左右按钮判断情况
					if( flag == 0 ) {
						if( oIndex == 0 && yearVal == StartYear ){
							api.init(StartYear,1);
							return false;
						}else{
							oIndex--;
							if( oIndex < 0 ){
								if( yearVal > StartYear ){
									yearVal--;
								}
								oIndex = 11;
							}
						}
					}else{
						if( oIndex == 11 && yearVal == EndYear ){
							api.init(EndYear,12);
							return false;
						}else{
							oIndex++;
							if( oIndex > 11 ){
								if( yearVal < EndYear ){
									yearVal++;
								}
								oIndex = 0;
							}
						}
					}
					ele.find('.month select').val(ele.find('.month select option').eq(oIndex).val());
					ele.find('.year select').val(yearVal);
					api.init(yearVal,ele.find('.month option:selected').index() + 1);
				},
				// 日期显示格式
				dateFormat:function(year,month,day,i){
					switch(i){
						case 0:
						dateFormat = year+"-"+api.addZero(month)+"-"+api.addZero(day);
						break;
						case 1:
						dateFormat = year+"/"+api.addZero(month)+"/"+api.addZero(day);
						break;
						default:
						dateFormat = year+"//"+api.addZero(month)+"//"+api.addZero(day);
					}
					return dateFormat;
				},
				//1-01转换
				addZero:function(num){
					if( num > 0 && num < 10 ) {
						return "0" + num;
					}else{
						return num;
					}
				}
			}

			// ------------------- 日历UI控件+数据初始化 -----------------

			ele.append("<div class='calandar hide'><div class='cl-head'><div class='ui-select month'><select></select></div><div class='ui-select year'><select></select></div><div class='control-btn'><a href='javascript:void(0);' class='prev'></a><a href='javascript:void(0);' class='next'></a></div></div><div class='cl-body'><table><thead><tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr></thead><tbody></tbody></table></div></div>");
			ele.find('.cl-body tbody').html("");

			// 月份、年下拉列表 
			for( var i = 0; i < 12; i ++ ){
				monthBox += "<option>"+monthArray[i]+"月"+"</option>";
			}
			for( var i = StartYear; i < EndYear+1; i ++ ){
				yearBox += "<option>"+i+"</option>";
			}
			ele.find('.month select').append(monthBox);
			ele.find('.year select').append(yearBox);

			// 初始化
			ele.find('.month select').val(ele.find('.month select option').eq(currentMonth).val());
			ele.find('.year select').val(currentYear);
			api.init(currentYear,currentMonth+1);	


			//------------------- 日历控件功能 -----------------

			//下拉选择
			ele.find('.year select').bind('change',function(){
				api.init($(this).find('option:selected').val(),$(this).parents('.year').siblings('.month').find('option:selected').index() + 1);
			});
			ele.find('.month select').bind('change',function(){
				api.init($(this).parents('.month').siblings('.year').find('option:selected').val(),$(this).find('option:selected').index() + 1);
			});

			// 左右按钮
			ele.find('.control-btn .next').bind('click',function(){
				api.controlFun(1,EndYear,StartYear);
			});
			ele.find('.control-btn .prev').bind('click',function(){
				api.controlFun(0,EndYear,StartYear);
			});

			//------------------- 输入框结果 -----------------
			result.val(api.dateFormat(currentYear,currentMonth+1,currentDay,0));

			result.bind('focus',function(){
				ele.find('.calandar').removeClass('hide');
				ele.siblings().find('.calandar').addClass('hide');
			});
			
			ele.find('.cl-body tbody td').live('click',function(){

				if( $(this).text() !== "" ){
					$(this).parents('tbody').find('td').removeClass('active');
					$(this).addClass('active');
					result.val(
						api.dateFormat(
						$(this).parents('.calandar').find('.year option:selected').val(),
						$(this).parents('.calandar').find('.month option:selected').index() + 1,
						$(this).find('a').text(),0)
					); 

					// 移除日历
					ele.find('.calandar').addClass('hide');
				}
			});


			//------------------- 点击页面其他地方移除日历 -----------------
			$(document).bind('click',function(e){
				var target = $(e.target);
				if( target.closest(".chooseDate").length == 0 ){
					$(".calandar").addClass("hide");
				}
			});

			//------------------- 打印出周末 -----------------
			$('.btn').bind('click',function(){
				$('.weekBox').html(" ");
				var date1 = $('#result1').val();
				var date2 = $('#result2').val();
				var date = new Date();
				var d1 = date.setFullYear(date1.substr(0,4),parseInt(date1.substr(5,2))-1,date1.substr(8));
				var d2 = date.setFullYear(date2.substr(0,4),parseInt(date2.substr(5,2))-1,date2.substr(8));
				var dis = 24*3600*1000;
				var arr = []; 
				var html = ""; 
				var oHtml = "";
				if( d2 <= d1 ) {
					oHtml += "<h3>无周末</h3>";
				}else {
					for( var i = d1; i < d2; i += dis ){
						// 获取增加一天之后的星期数
						var Day = parseInt(new Date(i).getDay());
						if( Day === 6 ) {
							arr.push(i);
						}
					}
					// 打印周六的日期
					for( var i = 0,len = arr.length; i < len; i++ ){
						html += "<span>" + api.getDate(arr[i]) + "</span>";
					}
					oHtml += "<h3>一共有<strong>"+arr.length+"</strong>个周末:</h3>" + "<p class='num-lis'>" + html + "</p>";
				}

				$('.weekBox').append(oHtml);
			});
		}
	});
})(jQuery);
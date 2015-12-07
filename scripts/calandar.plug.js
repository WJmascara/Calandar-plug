(function($){
	$.fn.extend({
		calandar:function(options){
			var param = {
				result:"#result",
				resultFormat:null,
				StartYear:null,     //下拉列表的开始年份
				EndYear:null,      //下拉列表的结束年份
				callbackFunc:null
			};
			$.extend(param,options);

			// 初始化
			var result = $(param.result);
			var resultFormat = param.resultFormat;
			var StartYear = param.StartYear;
			var EndYear = param.EndYear;
			var date = new Date();
			var currentYear = parseInt(date.getFullYear());   //结束年份确定为现今年份
			var currentMonth = date.getMonth();
			var currentDay = date.getDate();
			var firstDayIndex = "";
			var monthBox = "";
			var yearBox = "";
			var monthArray = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
			var month1 = [1,3,5,7,8,10,12];
			var month2 = [4,6,9,11];
			var api = {
				init:function(year,month){
					var firstDay = api.weekDay(year,month,1);
					// 根据月份判断
					if( $.inArray(month,month1) > -1 ){
						api.fillTab(firstDay,31);
					}else if( $.inArray(month,month2) > -1 ){
						api.fillTab(firstDay,30);
					}else{
						if( api.leapYear(year) ){
							api.fillTab(firstDay,29);
						}else{
							api.fillTab(firstDay,28);
						}
					}
					$('.cl-body tbody td').eq(currentDay-1+firstDay).addClass('active');
				},
				// 确定表格并且填充数据
				fillTab:function(firstDay,dayNum){

					$('.cl-body tbody').html("");
					var rowNum = Math.ceil((dayNum + firstDay)/7);
					var rowTd = "<td></td><td></td><td></td><td></td><td></td><td></td><td></td>";

					for( var i = 0; i < rowNum; i++ ){
						$('.cl-body tbody').append("<tr></tr>");
					}
					$('.cl-body tbody tr').append(rowTd);

					// 填充表格
					for( var i = firstDay; i < rowNum*7 ; i++ ){
						var day = "<a href='javascript:void(0);'>"+(i-firstDay+1)+"</a>";
						if( i < (dayNum + firstDay) ){
							$('.cl-body tbody td').eq(i).append(day);
						}
					}
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
				// 前进后退按钮控制
				controlFun:function(flag,EndYear,StartYear){

					var oIndex = $('.month select').find('option:selected').index();
					var yearVal = $('.year select').find('option:selected').val();

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
					$('.month select').val($('.month select').find('option').eq(oIndex).val());
					$('.year select').val(yearVal);
					api.init(yearVal,$('.month select').find('option:selected').index() + 1);
				},
				// 日期显示格式
				dateFormat:function(year,month,day,i){
					switch(i){
						case 0:
						resultFormat = year+"-"+api.addZero(month)+"-"+api.addZero(day);
						break;
						case 1:
						resultFormat = year+"/"+api.addZero(month)+"/"+api.addZero(day);
						break;
						default:
						resultFormat = year+"//"+api.addZero(month)+"//"+api.addZero(day);
					}
					return resultFormat;
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
			
			//------------------- 日历控件UI -----------------

			$('.chooseDate').append("<div class='calandar' id='calandar'></div>");
			$("#calandar").append("<div class='cl-head'></div><div class='cl-body'></div>");
			$('.cl-head').append("<div class='ui-select month'><select></select></div><div class='ui-select year'><select></select></div><div class='control-btn'><a href='javascript:void(0);' class='prev'></a><a href='javascript:void(0);' class='next'></a></div>");
			$('.cl-body').append("<table><thead><tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr></thead><tbody></tbody></table>");

			// 月份、年下拉列表 
			for( var i = 0; i < 12; i ++ ){
				monthBox += "<option>"+monthArray[i]+"月"+"</option>";
			}
			for( var i = StartYear; i < EndYear+1; i ++ ){
				yearBox += "<option>"+i+"</option>";
			}
			$('.month select').append(monthBox);
			$('.year select').append(yearBox);
			
			

			//------------------- 日历控件功能 -----------------

			//下拉选择
			$('.year select').bind('change',function(){
				api.init($(this).find('option:selected').val(),$('.month select').find('option:selected').index() + 1);
			});
			$('.month select').bind('change',function(){
				api.init($('.year select').find('option:selected').val(),$(this).find('option:selected').index() + 1);
			});

			// 左右按钮
			$('.control-btn .next').bind('click',function(){
				api.controlFun(1,EndYear,StartYear);
			});
			$('.control-btn .prev').bind('click',function(){
				api.controlFun(0,EndYear,StartYear);
			});

			// 初始化数据
			result.bind('focus',function(){
					
				$('#calandar').show();

				// 初始化
				$('.month select').val($('.month select').find('option').eq(currentMonth).val());
				$('.year select').val(currentYear);
				api.init(currentYear,currentMonth+1);

			});

			//------------------- 输入框结果 -----------------

			result.val(api.dateFormat(currentYear,currentMonth+1,currentDay,0));
			$('.cl-body tbody td').live('click',function(){

				if( $(this).text() !== "" ){
					$(this).parents('tbody').find('td').removeClass('active');
					$(this).addClass('active');
					$('#result').val(
						api.dateFormat(
						$(this).parents('#calandar').find('.ui-select.year option:selected').val(),
						$(this).parents('#calandar').find('.ui-select.month option:selected').index() + 1,
						$(this).find('a').text(),0)
					); 

					// 移除日历
					$('#calandar').hide();
				}
			});

		}
	});
})(jQuery);
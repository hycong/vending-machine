;(function($,window,document,undefined){var clndrTemplate="<div class='clndr-controls'>"+
"<div class='clndr-control-button'><span class='clndr-previous-button'><i class='fa fa-chevron-left'></i></span></div><div class='month'><span><%= month %></span> <%= year %></div><div class='clndr-control-button leftalign'><span class='clndr-next-button'><i class='fa fa-chevron-right'></i></span></div>"+
"</div>"+
"<table class='clndr-table' border='0' cellspacing='0' cellpadding='0'>"+
"<thead>"+
"<tr class='header-days'>"+
"<% for(var i = 0; i < daysOfTheWeek.length; i++) { %>"+
"<td class='header-day'><%= daysOfTheWeek[i] %></td>"+
"<% } %>"+
"</tr>"+
"</thead>"+
"<tbody>"+
"<% for(var i = 0; i < numberOfRows; i++){ %>"+
"<tr>"+
"<% for(var j = 0; j < 7; j++){ %>"+
"<% var d = j + i * 7; %>"+
"<td class='<%= days[d].classes %>'><div class='day-contents'><%= days[d].day %>"+
"</div></td>"+
"<% } %>"+
"</tr>"+
"<% } %>"+
"</tbody>"+
"</table>";var pluginName='clndr';var defaults={template:clndrTemplate,weekOffset:0,startWithMonth:null,clickEvents:{click:null,nextMonth:null,previousMonth:null,nextYear:null,previousYear:null,today:null,onMonthChange:null,onYearChange:null},targets:{nextButton:'clndr-next-button',previousButton:'clndr-previous-button',nextYearButton:'clndr-next-year-button',previousYearButton:'clndr-previous-year-button',todayButton:'clndr-today-button',day:'day',empty:'empty'},events:[],extras:null,dateParameter:'date',multiDayEvents:null,doneRendering:null,render:null,daysOfTheWeek:null,showAdjacentMonths:true,adjacentDaysChangeMonth:false,ready:null,constraints:null,forceSixRows:null,};function Clndr(element,options){this.element=element;this.options=$.extend(true,{},defaults,options);if(this.options.events.length){if(this.options.multiDayEvents){this.options.events=this.addMultiDayMomentObjectsToEvents(this.options.events);}else{this.options.events=this.addMomentObjectToEvents(this.options.events);}}
if(this.options.startWithMonth){this.month=moment(this.options.startWithMonth).startOf('month');}else{this.month=moment().startOf('month');}
if(this.options.constraints){if(this.options.constraints.startDate){var startMoment=moment(this.options.constraints.startDate);if(this.month.isBefore(startMoment,'month')){this.month.set('month',startMoment.month());this.month.set('year',startMoment.year());}}
if(this.options.constraints.endDate){var endMoment=moment(this.options.constraints.endDate);if(this.month.isAfter(endMoment,'month')){this.month.set('month',endMoment.month()).set('year',endMoment.year());}}}
this._defaults=defaults;this._name=pluginName;this.init();}
Clndr.prototype.init=function(){this.daysOfTheWeek=this.options.daysOfTheWeek||[];if(!this.options.daysOfTheWeek){this.daysOfTheWeek=[];for(var i=0;i<7;i++){this.daysOfTheWeek.push(moment().weekday(i).format('dd').charAt(0));}}
if(this.options.weekOffset){this.daysOfTheWeek=this.shiftWeekdayLabels(this.options.weekOffset);}
if(!$.isFunction(this.options.render)){this.options.render=null;if(typeof _==='undefined'){throw new Error("Underscore was not found. Please include underscore.js OR provide a custom render function.");}
else{this.compiledClndrTemplate=_.template(this.options.template);}}
$(this.element).html("<div class='clndr'></div>");this.calendarContainer=$('.clndr',this.element);this.bindEvents();this.render();if(this.options.ready){this.options.ready.apply(this,[]);}};Clndr.prototype.shiftWeekdayLabels=function(offset){var days=this.daysOfTheWeek;for(var i=0;i<offset;i++){days.push(days.shift());}
return days;};Clndr.prototype.createDaysObject=function(currentMonth){daysArray=[];var date=currentMonth.startOf('month');this.eventsLastMonth=[];this.eventsThisMonth=[];this.eventsNextMonth=[];if(this.options.events.length){if(this.options.multiDayEvents){this.eventsThisMonth=$(this.options.events).filter(function(){return this._clndrStartDateObject.format("YYYY-MM")==currentMonth.format("YYYY-MM")||this._clndrEndDateObject.format("YYYY-MM")==currentMonth.format("YYYY-MM");}).toArray();if(this.options.showAdjacentMonths){var lastMonth=currentMonth.clone().subtract('months',1);var nextMonth=currentMonth.clone().add('months',1);this.eventsLastMonth=$(this.options.events).filter(function(){return this._clndrStartDateObject.format("YYYY-MM")==lastMonth.format("YYYY-MM")||this._clndrEndDateObject.format("YYYY-MM")==lastMonth.format("YYYY-MM");}).toArray();this.eventsNextMonth=$(this.options.events).filter(function(){return this._clndrStartDateObject.format("YYYY-MM")==nextMonth.format("YYYY-MM")||this._clndrEndDateObject.format("YYYY-MM")==nextMonth.format("YYYY-MM");}).toArray();}}
else{this.eventsThisMonth=$(this.options.events).filter(function(){return this._clndrDateObject.format("YYYY-MM")==currentMonth.format("YYYY-MM");}).toArray();if(this.options.showAdjacentMonths){var lastMonth=currentMonth.clone().subtract('months',1);var nextMonth=currentMonth.clone().add('months',1);this.eventsLastMonth=$(this.options.events).filter(function(){return this._clndrDateObject.format("YYYY-MM")==lastMonth.format("YYYY-MM");}).toArray();this.eventsNextMonth=$(this.options.events).filter(function(){return this._clndrDateObject.format("YYYY-MM")==nextMonth.format("YYYY-MM");}).toArray();}}}
var diff=date.weekday()-this.options.weekOffset;if(diff<0)diff+=7;if(this.options.showAdjacentMonths){for(var i=0;i<diff;i++){var day=moment([currentMonth.year(),currentMonth.month(),i-diff+1]);daysArray.push(this.createDayObject(day,this.eventsLastMonth));}}else{for(var i=0;i<diff;i++){daysArray.push(this.calendarDay({classes:this.options.targets.empty+" last-month"}));}}
var numOfDays=date.daysInMonth();for(var i=1;i<=numOfDays;i++){var day=moment([currentMonth.year(),currentMonth.month(),i]);daysArray.push(this.createDayObject(day,this.eventsThisMonth))}
var i=1;while(daysArray.length%7!==0){if(this.options.showAdjacentMonths){var day=moment([currentMonth.year(),currentMonth.month(),numOfDays+i]);daysArray.push(this.createDayObject(day,this.eventsNextMonth));}else{daysArray.push(this.calendarDay({classes:this.options.targets.empty+" next-month"}));}
i++;}
if(this.options.forceSixRows&&daysArray.length!==42){var start=moment(daysArray[daysArray.length-1].date).add('days',1);while(daysArray.length<42){if(this.options.showAdjacentMonths){daysArray.push(this.createDayObject(moment(start),this.eventsNextMonth));start.add('days',1);}else{daysArray.push(this.calendarDay({classes:this.options.targets.empty+" next-month"}));}}}
return daysArray;};Clndr.prototype.createDayObject=function(day,monthEvents){var eventsToday=[];var now=moment();var self=this;var j=0,l=monthEvents.length;for(j;j<l;j++){if(self.options.multiDayEvents){var start=monthEvents[j]._clndrStartDateObject;var end=monthEvents[j]._clndrEndDateObject;if((day.isSame(start,'day')||day.isAfter(start,'day'))&&(day.isSame(end,'day')||day.isBefore(end,'day'))){eventsToday.push(monthEvents[j]);}}else{if(monthEvents[j]._clndrDateObject.date()==day.date()){eventsToday.push(monthEvents[j]);}}}
var extraClasses="";if(now.format("YYYY-MM-DD")==day.format("YYYY-MM-DD")){extraClasses+=" today";}
if(day.isBefore(now,'day')){extraClasses+=" past";}
if(eventsToday.length){extraClasses+=" event";}
if(this.month.month()>day.month()){extraClasses+=" adjacent-month";this.month.year()===day.year()?extraClasses+=" last-month":extraClasses+=" next-month";}else if(this.month.month()<day.month()){extraClasses+=" adjacent-month";this.month.year()===day.year()?extraClasses+=" next-month":extraClasses+=" last-month";}
if(this.options.constraints){if(this.options.constraints.startDate&&day.isBefore(moment(this.options.constraints.startDate))){extraClasses+=" inactive";}
if(this.options.constraints.endDate&&day.isAfter(moment(this.options.constraints.endDate))){extraClasses+=" inactive";}}
if(!day.isValid()&&day.hasOwnProperty('_d')&&day._d!=undefined){day=moment(day._d);}
extraClasses+=" calendar-day-"+day.format("YYYY-MM-DD");return this.calendarDay({day:day.date(),classes:this.options.targets.day+extraClasses,events:eventsToday,date:day});};Clndr.prototype.render=function(){this.calendarContainer.children().remove();var days=this.createDaysObject(this.month);var currentMonth=this.month;var data={daysOfTheWeek:this.daysOfTheWeek,numberOfRows:Math.ceil(days.length/7),days:days,month:this.month.format('MMMM'),year:this.month.year(),eventsThisMonth:this.eventsThisMonth,eventsLastMonth:this.eventsLastMonth,eventsNextMonth:this.eventsNextMonth,extras:this.options.extras};if(!this.options.render){this.calendarContainer.html(this.compiledClndrTemplate(data));}else{this.calendarContainer.html(this.options.render.apply(this,[data]));}
if(this.options.constraints){for(target in this.options.targets){if(target!=this.options.targets.day){this.element.find('.'+this.options.targets[target]).toggleClass('inactive',false);}}
var start=null;var end=null;if(this.options.constraints.startDate){start=moment(this.options.constraints.startDate);}
if(this.options.constraints.endDate){end=moment(this.options.constraints.endDate);}
if(start&&this.month.isSame(start,'month')){this.element.find('.'+this.options.targets.previousButton).toggleClass('inactive',true);}
if(end&&this.month.isSame(end,'month')){this.element.find('.'+this.options.targets.nextButton).toggleClass('inactive',true);}
if(start&&moment(start).subtract('years',1).isBefore(moment(this.month).subtract('years',1))){this.element.find('.'+this.options.targets.previousYearButton).toggleClass('inactive',true);}
if(end&&moment(end).add('years',1).isAfter(moment(this.month).add('years',1))){this.element.find('.'+this.options.targets.nextYearButton).toggleClass('inactive',true);}
if((start&&start.isAfter(moment(),'month'))||(end&&end.isBefore(moment(),'month'))){this.element.find('.'+this.options.targets.today).toggleClass('inactive',true);}}
if(this.options.doneRendering){this.options.doneRendering.apply(this,[]);}};Clndr.prototype.bindEvents=function(){var $container=$(this.element);var self=this;$container.on('click','.'+this.options.targets.day,function(event){if(self.options.clickEvents.click){var target=self.buildTargetObject(event.currentTarget,true);self.options.clickEvents.click.apply(self,[target]);}
if(self.options.adjacentDaysChangeMonth){if($(event.currentTarget).is(".last-month")){self.backActionWithContext(self);}else if($(event.currentTarget).is(".next-month")){self.forwardActionWithContext(self);}}});$container.on('click','.'+this.options.targets.empty,function(event){if(self.options.clickEvents.click){var target=self.buildTargetObject(event.currentTarget,false);self.options.clickEvents.click.apply(self,[target]);}
if(self.options.adjacentDaysChangeMonth){if($(event.currentTarget).is(".last-month")){self.backActionWithContext(self);}else if($(event.currentTarget).is(".next-month")){self.forwardActionWithContext(self);}}});$container.on('click','.'+this.options.targets.previousButton,{context:this},this.backAction).on('click','.'+this.options.targets.nextButton,{context:this},this.forwardAction).on('click','.'+this.options.targets.todayButton,{context:this},this.todayAction).on('click','.'+this.options.targets.nextYearButton,{context:this},this.nextYearAction).on('click','.'+this.options.targets.previousYearButton,{context:this},this.previousYearAction);}
Clndr.prototype.buildTargetObject=function(currentTarget,targetWasDay){var target={element:currentTarget,events:[],date:null};if(targetWasDay){var dateString;var classNameIndex=currentTarget.className.indexOf('calendar-day-');if(classNameIndex!==0){dateString=currentTarget.className.substring(classNameIndex+13,classNameIndex+23);target.date=moment(dateString);}else{target.date=null;}
if(this.options.events){if(this.options.multiDayEvents){target.events=$.makeArray($(this.options.events).filter(function(){return((target.date.isSame(this._clndrStartDateObject,'day')||target.date.isAfter(this._clndrStartDateObject,'day'))&&(target.date.isSame(this._clndrEndDateObject,'day')||target.date.isBefore(this._clndrEndDateObject,'day')));}));}else{target.events=$.makeArray($(this.options.events).filter(function(){return this._clndrDateObject.format('YYYY-MM-DD')==dateString;}));}}}
return target;}
Clndr.prototype.forwardAction=function(event){var self=event.data.context;self.forwardActionWithContext(self);};Clndr.prototype.backAction=function(event){var self=event.data.context;self.backActionWithContext(self);};Clndr.prototype.backActionWithContext=function(self){if(self.element.find('.'+self.options.targets.previousButton).hasClass('inactive')){return;}
var yearChanged=!self.month.isSame(moment(self.month).subtract('months',1),'year');self.month.subtract('months',1);self.render();if(self.options.clickEvents.previousMonth){self.options.clickEvents.previousMonth.apply(self,[moment(self.month)]);}
if(self.options.clickEvents.onMonthChange){self.options.clickEvents.onMonthChange.apply(self,[moment(self.month)]);}
if(yearChanged){if(self.options.clickEvents.onYearChange){self.options.clickEvents.onYearChange.apply(self,[moment(self.month)]);}}};Clndr.prototype.forwardActionWithContext=function(self){if(self.element.find('.'+self.options.targets.nextButton).hasClass('inactive')){return;}
var yearChanged=!self.month.isSame(moment(self.month).add('months',1),'year');self.month.add('months',1);self.render();if(self.options.clickEvents.nextMonth){self.options.clickEvents.nextMonth.apply(self,[moment(self.month)]);}
if(self.options.clickEvents.onMonthChange){self.options.clickEvents.onMonthChange.apply(self,[moment(self.month)]);}
if(yearChanged){if(self.options.clickEvents.onYearChange){self.options.clickEvents.onYearChange.apply(self,[moment(self.month)]);}}};Clndr.prototype.todayAction=function(event){var self=event.data.context;var monthChanged=!self.month.isSame(moment(),'month');var yearChanged=!self.month.isSame(moment(),'year');self.month=moment().startOf('month');if(self.options.clickEvents.today){self.options.clickEvents.today.apply(self,[moment(self.month)]);}
if(monthChanged){self.render();self.month=moment();if(self.options.clickEvents.onMonthChange){self.options.clickEvents.onMonthChange.apply(self,[moment(self.month)]);}
if(yearChanged){if(self.options.clickEvents.onYearChange){self.options.clickEvents.onYearChange.apply(self,[moment(self.month)]);}}}};Clndr.prototype.nextYearAction=function(event){var self=event.data.context;if(self.element.find('.'+self.options.targets.nextYearButton).hasClass('inactive')){return;}
self.month.add('years',1);self.render();if(self.options.clickEvents.nextYear){self.options.clickEvents.nextYear.apply(self,[moment(self.month)]);}
if(self.options.clickEvents.onMonthChange){self.options.clickEvents.onMonthChange.apply(self,[moment(self.month)]);}
if(self.options.clickEvents.onYearChange){self.options.clickEvents.onYearChange.apply(self,[moment(self.month)]);}};Clndr.prototype.previousYearAction=function(event){var self=event.data.context;if(self.element.find('.'+self.options.targets.previousYear).hasClass('inactive')){return;}
self.month.subtract('years',1);self.render();if(self.options.clickEvents.previousYear){self.options.clickEvents.previousYear.apply(self,[moment(self.month)]);}
if(self.options.clickEvents.onMonthChange){self.options.clickEvents.onMonthChange.apply(self,[moment(self.month)]);}
if(self.options.clickEvents.onYearChange){self.options.clickEvents.onYearChange.apply(self,[moment(self.month)]);}};Clndr.prototype.forward=function(options){this.month.add('months',1);this.render();if(options&&options.withCallbacks){if(this.options.clickEvents.onMonthChange){this.options.clickEvents.onMonthChange.apply(this,[moment(this.month)]);}
if(this.month.month()===0&&this.options.clickEvents.onYearChange){this.options.clickEvents.onYearChange.apply(this,[moment(this.month)]);}}
return this;}
Clndr.prototype.back=function(options){this.month.subtract('months',1);this.render();if(options&&options.withCallbacks){if(this.options.clickEvents.onMonthChange){this.options.clickEvents.onMonthChange.apply(this,[moment(this.month)]);}
if(this.month.month()===11&&this.options.clickEvents.onYearChange){this.options.clickEvents.onYearChange.apply(this,[moment(this.month)]);}}
return this;}
Clndr.prototype.next=function(options){this.forward(options);return this;}
Clndr.prototype.previous=function(options){this.back(options);return this;}
Clndr.prototype.setMonth=function(newMonth,options){this.month.month(newMonth);this.render();if(options&&options.withCallbacks){if(this.options.clickEvents.onMonthChange){this.options.clickEvents.onMonthChange.apply(this,[moment(this.month)]);}}
return this;}
Clndr.prototype.nextYear=function(options){this.month.add('year',1);this.render();if(options&&options.withCallbacks){if(this.options.clickEvents.onYearChange){this.options.clickEvents.onYearChange.apply(this,[moment(this.month)]);}}
return this;}
Clndr.prototype.previousYear=function(options){this.month.subtract('year',1);this.render();if(options&&options.withCallbacks){if(this.options.clickEvents.onYearChange){this.options.clickEvents.onYearChange.apply(this,[moment(this.month)]);}}
return this;}
Clndr.prototype.setYear=function(newYear,options){this.month.year(newYear);this.render();if(options&&options.withCallbacks){if(this.options.clickEvents.onYearChange){this.options.clickEvents.onYearChange.apply(this,[moment(this.month)]);}}
return this;}
Clndr.prototype.setEvents=function(events){if(this.options.multiDayEvents){this.options.events=this.addMultiDayMomentObjectsToEvents(events);}else{this.options.events=this.addMomentObjectToEvents(events);}
this.render();return this;};Clndr.prototype.addEvents=function(events){if(this.options.multiDayEvents){this.options.events=$.merge(this.options.events,this.addMultiDayMomentObjectsToEvents(events));}else{this.options.events=$.merge(this.options.events,this.addMomentObjectToEvents(events));}
this.render();return this;};Clndr.prototype.addMomentObjectToEvents=function(events){var self=this;var i=0,l=events.length;for(i;i<l;i++){events[i]._clndrDateObject=moment(events[i][self.options.dateParameter]);}
return events;}
Clndr.prototype.addMultiDayMomentObjectsToEvents=function(events){var self=this;var i=0,l=events.length;for(i;i<l;i++){events[i]._clndrStartDateObject=moment(events[i][self.options.multiDayEvents.startDate]);events[i]._clndrEndDateObject=moment(events[i][self.options.multiDayEvents.endDate]);}
return events;}
Clndr.prototype.calendarDay=function(options){var defaults={day:"",classes:this.options.targets.empty,events:[],date:null};return $.extend({},defaults,options);}
$.fn.clndr=function(options){if(this.length===1){if(!this.data('plugin_clndr')){var clndr_instance=new Clndr(this,options);this.data('plugin_clndr',clndr_instance);return clndr_instance;}}else if(this.length>1){throw new Error("CLNDR does not support multiple elements yet. Make sure your clndr selector returns only one element.");}}})(jQuery,window,document);
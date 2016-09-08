 //构造一个日期对象：
  var  day = new Date(2014,4,0); 
  //获取天数：
  var daycount = day.getDate();
  
  //方法二
function DayNumOfMonth(Year,Month)
{
    Month--;
    var d = new Date(Year,Month,1);
    d.setDate(d.getDate()+32-d.getDate());
    return (32-d.getDate());
}
//方法三
function DayNumOfMonth(Year,Month)
{
    return 32-new Data(year,month,32).getData();
}

require(['config'],function(){
    require(['axio','vue','main'],function (axio,Vue,ygg) {

    	var vm = new Vue({
            el : "#app",
            data : {
                tDate : [ygg.getDefaultDate(0,-2),ygg.getDefaultDate()]
            },
            methods : {
                
            }
        }),minDate = ygg.getDateArray(),maxDate=minDate,curDate=ygg.getDefaultDate(0,-2);

        $("#totalDate").picker({
            toolbarTemplate: '<header class="bar bar-nav">\
                                  <button class="button button-link pull-right close-picker">确定</button>\
                                  <h1 class="title">请选择时间段</h1>\
                              </header>',
            onChange : function(p){

                if(curDate != p.cols[0].value){
                    clearTimeout(st);
                    var st = setTimeout(function(){
                        curDate = p.cols[0].value;
                        p.cols[2].replaceValues(p.cols[0].values.slice(p.cols[0].activeIndex));
                        p.updateValue();
                    },200);
                }
                return;
            },
            cols: [
                {
                    textAlign: 'center',
                    values: minDate
                },
                {
                    textAlign: 'center',
                    values: ['  ~  ']
                },
                {
                    textAlign: 'center',
                    values: maxDate
                }
            ]
        });

    });
});
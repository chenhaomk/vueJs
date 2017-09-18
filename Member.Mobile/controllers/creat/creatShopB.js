require(['config'], function () {
    require(['axio', 'vue', 'main'], function (axio, Vue, ygg) {

        var vm = new Vue({
            el: "#app",
            data: {
               
            },
            methods: {
               
            },
            components: {
                getVercode: ygg.template.getVercode
            }
        });


    });
});
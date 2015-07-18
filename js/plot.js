function graph() {
    this.instance = null;
    this.width = 500;
    this.height = 500;
    this.target = "";
    this.xLabel = null;
    this.yLabel = null;
    this.title = "";
    this.plot = function(data) {
        this.xLabel = typeof data.xLabel !== 'undefined' ? data.xLabel : "x";
        this.yLabel = typeof data.yLabel !== 'undefined' ? data.yLabel : "y";
        title = typeof title !== 'undefined' ? title : null;
        this.title = title;
        this.target = data.target;
        this.height = typeof data.height !== 'undefined' ? data.height : this.height;
        this.width = typeof data.width !== 'undefined' ? data.width : this.width;

        this.instance = functionPlot({
            tip: {
                xLine: true,
                yLine: true
            },
            target: data.target,
            title: data.title,
            xLabel: this.xLabel,
            yLabel: this.yLabel,
            width : this.width,
            height : this.height,
            data: data.data
        });
    }
    this.refresh = function(data){
        $(this.target + " svg.function-plot").remove();
        this.plot({
            target: this.target,
            title: this.title,
            xLabel: this.xLabel,
            yLabel: this.yLabel,
            width : this.width,
            height : this.height,
            data: data
        });
    }
    this.setSize = function(width,height){
        this.width = width;
        this.height = height;
    }
}
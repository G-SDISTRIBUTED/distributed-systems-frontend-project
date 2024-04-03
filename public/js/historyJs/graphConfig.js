
var dates=[],objLatLng=[],anglesPoints=[],speeds = [], altitude = [],contact=[],dataTableHistory=[],dataHistory=[], odometers=[];
var unityGraphics="kph";
var option = {
    series: {
        lines: {show: true, fill: true}
    },
    points: {
        show: false
    },
    crosshair: {
        mode: "x"
    },
    grid: {
        hoverable: true,
        clickable: true
    },

    xaxis: {
        mode: "time"
    },

    selection: {
        mode: "xy"
    }


};

var data = [
    {
        data: speeds,
        label: "Velocidad"
    }
];


var dataSets = [speeds, contact,altitude];
var plot;
var legends = $("#placeholder .legendLabel");

legends.each(function () {
    // fix the widths so they don't jump around
    $(this).css('width', $(this).width());
});

var updateLegendTimeout = null;
var latestPosition = null;
var dataSetIndex=0;
var indexHistory = 0;
var indexDataSet=0;
var t;//
var timer_is_on = 0;
var speedHistory = 1500;



// Datatable configuration and history graph panel
function getContentBottomHistory() {

    var movilInfo='<div style="float: left; width: 250px;" class="visible-xs"><label style="margin-left: 10px;font-size-adjust: inherit" for="" id="InfoGrahpMovil">Info</label>' +
        '<a href="#" onclick="graphPanLeft();" title="">' +
        '    <img src="FlotJS/arrow-left.svg" width="10px" border="0"/>' +
        '</a>' +
        '<a href="#" onclick="graphPanRight();" title="">' +
        '    <img src="FlotJS/arrow-right.svg" width="10px" border="0"/>' +
        '</a>' +

        '<a href="#" onclick="graphZoomIn();">' +
        '    <img src="FlotJS/plus.svg" width="10px" border="0"/>' +
        '</a>' +
        '<a href="#" onclick="graphZoomOut();">' +
        '    <img src="FlotJS/minus.svg" width="10px" border="0"/>' +
        '</a></div>';

    var graphTab='<div style="float: left;"  class="form-inline">' +

        '<div style="width: 800px;" class="form-group">' +
        '<div style="float: left;width: 200px;"><select  onchange="updateDataset(this.value)" class="" id="bottom_panel_graph_perspective">' +
        ' <option value=0>Velocidad</option>' +
        '<option value=1>Contacto</option>' +
        '<option value=2>Altitud</option>' +
        ' </select>'   +
        '<a  style="margin-left: 7px;" href="#" onclick="PlayHistory()"> <img src="img/play.svg" width="10px" border="0"/></a>' +
        '<a  style="margin-left: 7px" href="#"  onclick="PauseHistory()"><img src="img/pause.svg" width="10px" border="0"/></a>' +
        '<a style="margin-left: 7px" href="#" onclick="stopHistory()"><img src="img/stop.svg" width="10px" border="0"/></a>' +
        '<select style="margin-left: 7px" onchange="updateSpeed(this.value)" class="" id="bottom_panel_graph_play_speed">' +
        '    <option value=1500>x1</option>' +
        '    <option value=1000>x2</option>' +
        '    <option value=500>x3</option>' +
        '    <option value=250>x4</option>' +
        '    <option value=125>x5</option>' +
        '    <option value=65>x6</option>' +
        '</select></div>' +movilInfo+
        '  <div class="hidden-xs" style="float: right;width: 250px;">  <label style="margin-left: 10px;font-size-adjust: inherit" for="" id="InfoGrahp">Info</label>' +
        '<a href="#" onclick="graphPanLeft();" title="">' +
        '    <img src="FlotJS/arrow-left.svg" width="10px" border="0"/>' +
        '</a>' +
        '<a href="#" onclick="graphPanRight();" title="">' +
        '    <img src="FlotJS/arrow-right.svg" width="10px" border="0"/>' +
        '</a>' +

        '<a href="#" onclick="graphZoomIn();">' +
        '    <img src="FlotJS/plus.svg" width="10px" border="0"/>' +
        '</a>' +
        '<a href="#" onclick="graphZoomOut();">' +
        '    <img src="FlotJS/minus.svg" width="10px" border="0"/>' +
        '</a></div><br>' +
        '<div style="float: left" id="placeholder" class="demo-plot "></div></div></div>';

    return '<div id="bottom_history" align="center" class="tabs-container ui-widget-content slimScrollDiv">'
        + '<ul id="tabs_history" class="nav nav-tabs">'
        + '<li class="active"><a data-toggle="tab" href="#Graphic"> '+plotGraphicMsg+'</a></li>'
        + '<li class=""><a data-toggle="tab" href="#table_history">  '+messagesGraphic+'  </a>'
        + '</li>'
        + '</ul>'
        + '<div id="tab_container_history" class="tab-content scroll_content">'
        + '<div id="Graphic" class="tab-pane active">'+graphTab+'</div>'
        + '<div id="table_history" class="tab-pane">'
        + '<table id="dt_history" class="table table-striped table-bordered table-hover">'
        + '<thead>'
        + '<tr>'

        + '<th>'+graphMsg1+'</th>'
        + '<th>'+graphMsg2+'</th>'
        + '<th>'+graphMsg3+'</th>'
        + '<th>'+graphMsg4+'</th>'
        + '<th>'+graphMsg5+'</th>'
        + '<th>'+graphMsg6+'</th>'
        + '<th>'+graphMsg7+'</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody></tbody>'
        + '</table>'
        + '</div>'
        + '</div>'
        + '</div>';
}



function getData(x1, x2) {
    var  dataSetSelect = dataSets[dataSetIndex];
    return [
        {color: '#004c8c',  data: dataSetSelect }
    ];
}



function updateLegend() {
    updateLegendTimeout = null;
    var pos = latestPosition;
    var axes = plot.getAxes();
    if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
        pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
        return;
    }
    var i, j, dataset = plot.getData();
    for (i = 0; i < dataset.length; ++i) {
        var series = dataset[i];
        // Find the nearest points, x-wise
        for (j = 0; j < series.data.length; ++j) {
            if (series.data[j][0] > pos.x) {
                break;
            }
        }
        // Now Interpolate
        var y,
            p1 = series.data[j - 1],
            p2 = series.data[j];
        if (p1 == null) {
            y = p2[1];
        } else if (p2 == null) {
            y = p1[1];
        } else {
            y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
        }
        legends.eq(i).text(series.label.replace(/=.*/, "= " + y.toFixed(2)));
    }


}




function updateSpeed(speed) {
    speedHistory = speed;
}






function graphPanTop() {
    plot.pan({
        top: -30
    })
}



function graphPanBottom() {
    plot.pan({
        top: 30
    })
}



function graphPanLeft() {

    plot.pan({
        left: -100
    });


}



function graphPanRight() {
    plot.pan({
        left: 100
    })
}



function graphZoomIn() {
    plot.zoom()

}



function graphZoomOut() {
    plot.zoomOut()
}



function loadGraphicData(dataGraphic){
    var count=0;
    let odometerLength = dataGraphic.odometers.length;
    dataGraphic.time.forEach(function (row) {
        var parts =processDateString(row);
        var speed=dataGraphic.speeds[count];
        var altitudeData=dataGraphic.Altitudes[count];
        var contactData=dataGraphic.Contact[count];
        var latLng=dataGraphic.latLngs[count];
        var angleP=dataGraphic.anglePoint[count];

        if(odometerLength > 0){
            odometers.push(dataGraphic.odometers[count]);
        }
        speeds.push([Date.UTC(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5]),speed]);
        altitude.push([Date.UTC(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5]),altitudeData]);
        contact.push([Date.UTC(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5]),contactData]);

        dates.push(row);
        objLatLng.push(latLng);
        anglesPoints.push(angleP);
        count++;
    });

}



function processDateString(DateString){
    var  dateFormat =DateString.split('-');
    var timeF=dateFormat[2];
    timeF=timeF.split(' ');
    var time=timeF[1].split(':');
    var dateF=[dateFormat[0],dateFormat[1],timeF[0],time[0],time[1],time[2]];
    return dateF

}



function PlayHistory() {
    if (!timer_is_on) {
        timer_is_on = 1;
        timedCount();
    }
}//the recursive function is called first


function stopHistory() {
    map.closePopup();
    removeHistoryMarker();
    clearTimeout(t);
    timer_is_on = 0;
    indexHistory = 0;
    if(plot){
        plot.setCrosshair({
            x: 0,
            y: 0
        })
    }
}//pause the recursion and initialize the array data index index to 0


function PauseHistory() {
    clearTimeout(t);
    timer_is_on = 0;
}// recursion pause
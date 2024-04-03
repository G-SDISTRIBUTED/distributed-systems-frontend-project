//----------------------------Vars History----------------------------------------------------------------------------------------

$('#select_gps').select2({
    allowClear: true,
    placeholder: 'Seleccione el vehiculo'
});

$('#time').select2({
    allowClear: true,
    placeholder: 'Seleccione el rango'
});


$(function () {

    $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'bottom'
        },
    });


    $('#datetimepicker2').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'bottom'
        },

        useCurrent: false //Important! See issue #1075
    });

});


$('#history-table tbody').on('click', 'tr', function () {
    tableHistory.$('tr.selected').removeClass('selected');
    $(this).addClass('selected');
    var id = tableHistory.row(this).index();
    var data = tableHistory.row(id).data();
    DisplayDataMap(data, id);
});


$('#history-table tbody').on('mouseover', 'tr', function () {

    tableHistory.$('tr.selected').removeClass('selected');
    $(this).addClass('selected');
    var id = tableHistory.row(this).index();
    var data = tableHistory.row(id).data();
    displayTippy(data, id);
});


var graphicData = [];


var MarkersBegin = new L.LayerGroup();
var MarkersEnd = new L.LayerGroup();
var MarkersEvents = new L.LayerGroup();
var PointsData = new L.LayerGroup();


var BeginSectionLayer = new L.LayerGroup();
var EndSectionLayer = new L.LayerGroup();
var routeSection = new L.LayerGroup();
var ArrowLineRouteSection = new L.LayerGroup();


var ControlLayer;
var ControlSection;
var loadHistory = 0;
var loadSection = 0;
var emptyPreviousResult = 0;
var idDatatableHistory = 0;
var speedsHistory = [];
var timeHistory = [];
var latLngsHistory = [];
var anglePointHistory = [];


$(".sidebar-close").click(function () {
    if (mapLayers.graphics.dialog !== undefined) {
        clearTimeout(mapLayers.timeouts.resizeHistory);
        mapLayers.timeouts.resizeHistory = setTimeout(resizeBottom, 500);
    }
});

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    /*let tab = $(e.target);
     let contentId = tab.attr("href");*/
    resizeBottom();
});


var icon = {
    play: {
        'width': 300,
        'path': 'M61.792,2.588C64.771,0.864,68.105,0,71.444,0c3.33,0,6.663,0.864,9.655,2.588l230.116,167.2c5.963,3.445,9.656,9.823,9.656,16.719c0,6.895-3.683,13.272-9.656,16.713L81.099,370.427c-5.972,3.441-13.334,3.441-19.302,0c-5.973-3.453-9.66-9.833-9.66-16.724V19.305C52.137,12.413,55.818,6.036,61.792,2.588z',
        'ascent': 450,
        'descent': -50
    },
    pause: {
        'width': 35,
        'path': 'M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26',
        'ascent': 35,
        'descent': 5

    },
    close: {
        'width': 45,
        'path': 'M14.1,11.3c-0.2-0.2-0.2-0.5,0-0.7l7.5-7.5c0.2-0.2,0.3-0.5,0.3-0.7s-0.1-0.5-0.3-0.7l-1.4-1.4C20,0.1,19.7,0,19.5,0  c-0.3,0-0.5,0.1-0.7,0.3l-7.5,7.5c-0.2,0.2-0.5,0.2-0.7,0L3.1,0.3C2.9,0.1,2.6,0,2.4,0S1.9,0.1,1.7,0.3L0.3,1.7C0.1,1.9,0,2.2,0,2.4  s0.1,0.5,0.3,0.7l7.5,7.5c0.2,0.2,0.2,0.5,0,0.7l-7.5,7.5C0.1,19,0,19.3,0,19.5s0.1,0.5,0.3,0.7l1.4,1.4c0.2,0.2,0.5,0.3,0.7,0.3  s0.5-0.1,0.7-0.3l7.5-7.5c0.2-0.2,0.5-0.2,0.7,0l7.5,7.5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l1.4-1.4c0.2-0.2,0.3-0.5,0.3-0.7  s-0.1-0.5-0.3-0.7L14.1,11.3z',
        'ascent': 30,
        'descent': -10
    },
    stop: {
        'width': 70,
        'path': 'M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M44,44H16V16h28V44z',
        'ascent': 70,
        'descent': -10

    },
    forward: {
        'width': 1850,
        'path': 'm 45,-115 q -19,-19 -32,-13 -13,6 -13,32 v 1472 q 0,26 13,32 13,6 32,-13 L 755,685 q 8,-8 13,-19 v 710 q 0,26 13,32 13,6 32,-13 l 710,-710 q 8,-8 13,-19 v 678 q 0,26 19,45 19,19 45,19 h 128 q 26,0 45,-19 19,-19 19,-45 V -64 q 0,-26 -19,-45 -19,-19 -45,-19 h -128 q -26,0 -45,19 -19,19 -19,45 v 678 q -5,-10 -13,-19 L 813,-115 q -19,-19 -32,-13 -13,6 -13,32 v 710 q -5,-10 -13,-19 z',
        'ascent': 1800,
        'descent': -50

    }
};

//------------------------------------------------------------------------------------------------------------------------------


function DateFormatResultIni(date) {

    var Day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var time = date.toLocaleTimeString('pt-PT', {hour12: false});


    if (Day < 10) {
        Day = '0' + Day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    var result = year + "-" + month + "-" + Day + " " + "00:00:00";


    return result;

}


function MinDateHistory() {

    var idVehicle = $("#select_gps").val();

    $.ajaxSetup({headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}});
    $.ajax({
            dataType: 'json',
            type: 'POST',
            url: 'MinDate',
            data: {idVehicle: idVehicle},
            success: function (data) {

                try {

                    var Now = new Date();
                    Now.setHours(23, 59, 59, 0);
                    //    $('#datetimepicker1').data("DateTimePicker").minDate(data.mindate);
                    $('#datetimepicker1').data("DateTimePicker").maxDate(Now);
                    $('#datetimepicker2').data("DateTimePicker").maxDate(Now);

                } catch (err) {
                    console.log(err)

                }//fin try catch

            }
        }
    )

}


var tableHistory;
var collapsedGroups = {};
var checksGroups = {};
var initTable = 0;
var indexDay = 0;
var loadGroups = 0;
var dataHistory = -1;

function historisearch() {

    collapsedGroups = {};

    if (initTable === 0) {
        tableHistory = $('#history-table').DataTable({
            "displayStart": 0,
            "searching": false,
            "pagingType": "simple",
            "info": false,
            "paging": false,
            "orderFixed": [[5, "asc"],[1, "asc"]],
            "columnDefs": [
                {"orderable": false, "targets": 0},
                {"orderable": false, "targets": 1,"type":"date-eu"},
                {"orderable": false, "targets": 2},
                {
                    "targets": [3],
                    "visible": false,
                    "searchable": false,
                    "type":"date-eu"
                },
                {
                    "targets": [4],
                    "visible": false,
                    "searchable": false,
                },
                {
                    "targets": [5],
                    "visible": false,
                    "searchable": false,
                }
            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    className: 'custom-button-history btn btn-default dim',
                    text: '<i class="fa fa-check"></i>',
                    action: function (e, dt, node, config) {

                        this.text('<i class="fa fa-check"></i>');
                        if (checkDays) {
                            this.text('<i class="fa fa-square-o"></i>');
                        }
                        checkToogle();
                    }
                },
                {
                    name: "sendMessage",
                    className: 'custom-button-history btn  btn-default dim',
                    text: '<i  class="fa fa-minus"></i>',
                    action: function (e, dt, node, config) {

                        this.text('<i  class="fa fa-minus"></i>');
                        if (collapse) {
                            this.text('<i  class="fa fa-plus"></i>');
                        }
                        collapseToogle();
                    }
                }
            ],
            rowGroup: {
                // Uses the 'row group' plugin
                dataSrc: 3,
                startRender: function (rows, group) {

                    var collapsed = !!collapsedGroups[group];
                    var checked = checksGroups[group];
                    rows.nodes().each(function (r) {
                        r.style.display = collapsed ? 'none' : '';
                    });

                    var icon = '<i data-name="' + group + '" class="fa fa-plus"></i>';

                    if (!collapsedGroups[group]) {
                        icon = '<i data-name="' + group + '" class="fa fa-minus"></i>';
                    }

                    var checkInput = "";
                    if (checked) {
                        checkInput = "checked";
                    }
                    var groupStr = "'" + group + "'";
                    return $('<tr/>')
                        .append('<td colspan="8"> <div class="form-inline">  ' +
                            ' <div class="form-group"> <input onclick="checkEventDay(' + groupStr + ')" id="check_' + group + '" ' + checkInput + ' class="filter-check" type="checkbox"> </div> ' +
                            '<div class="form-group"><div style="cursor: pointer" data-name="' + group + '" class="collapse-group">' + group + '(' + rows.count() + ') ' +
                            icon +
                            '</div> </div> </div>  ' +
                            '  </td>')
                        .attr('data-name', group)
                        .toggleClass('collapsed', collapsed);
                }
            },


        });


        $('#history-table tbody').on('click', 'div.collapse-group', function () {
            var name = $(this).data('name');
            collapsedGroups[name] = !collapsedGroups[name];
            tableHistory.draw(false);
        });


    }


    initTable++;
    var selec_gps = $("#select_gps").val();
    var time_begin = $("#time_begin").val();
    var time_finish = $("#time_end").val();
    var time_wait = $("#stt").val();
    var fecha1 = moment($("#time_begin").val());
    var fecha2 = moment($("#time_end").val());
    var daysDiff = fecha2.diff(fecha1, 'days');


    if (time_begin == "") {
        showToast(validation1, 'Notificacion', 'error');
        return;
    }

    if (time_finish == "") {
        showToast(validation2, 'Notificacion', 'error');
        return;
    }


    if (daysDiff > 31) {
        showToast(validation3, 'Notificacion', 'error');
        return;
    }


    $.ajaxSetup({headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}});
    $.ajax({
        dataType: 'json',
        type: 'POST',
        url: historyRouteRefactor,
        data: {idVehicle: selec_gps, tb: time_begin, tf: time_finish, tw: time_wait},
        success: function (data) {
            if (loadHistory > 0) {
                clearAllHistory();
            }
            routeSection.clearLayers();
            ArrowLineRouteSection.clearLayers();
            dates = [];
            objLatLng = [];
            anglesPoints = [];
            speeds = [];
            altitude = [];
            contact = [];
            dataTableHistory = [];
            dataHistory = [];
            odometers=[];
            dayLayerStop = [];
            dayLayerRoute = [];
            dayLayerArrows = [];
            dayLayerEvents = [];
            dayLayerPoints=[];
            ConfigHistory();
            daysRange=[];
            var index=0;
            var indexFilterDays=0;

            data.data.forEach(function (row) {

                let myPromise = new Promise(function(myResolve, myReject) {
                    daysRange[indexFilterDays]=[row.date,true,true];
                    checksGroups[row.date]=true;
                    indexFilterDays++;
                    try{
                        begin_end(row,row.date);
                        processStops(row.stop_details,row.date);
                        processRoutes(row.mov_details,row.date);
                        processEvents(row.events_details,row.date);
                        paintPoints(row.graphic,row.date);
                        loadGraphicData(row.graphic);
                        index = showHistory(row.graphic.route,index);
                        addPointData(row.graphic,row.date, data.vehicles[selec_gps]);
                        myResolve(true);
                    }catch (e) {
                        console.log(e);
                        myReject(false);
                    }


                });

                myPromise.then(
                    function(value) {displayResult(value);},
                    function(error) {displayResult(error);}
                );

            });
            index++;

            daysRange[indexFilterDays]=[data.resume_all.date,true,false];
            indexFilterDays++;
            resumeAll(data.resume_all);
            ControlLayersHistory();
            dataSets = [speeds, contact,altitude];
            updateDataset("0");
            TableMessages.rows.add(dataTableHistory).draw(true);
            tableHistory.page(0).draw(false);
            loadHistory++;
            emptyPreviousResult = 0;
            $('#history-table_previous').prop('style', "#history-table_previous:hover: background-color: white;");
            $('#KML_EXPORT').removeAttr('disabled');
            $('#historyClear').removeAttr('disabled');
            $('#historyDays').removeAttr('style');
            $('#historyCollapse').removeAttr('style');

            window.onresize = function () {
                let a = $('#bottom_history:visible');
                if (a.length > 0) {
                    $('#bottom_history').css('top', '');
                    clearTimeout(mapLayers.timeouts.resizeHistory);
                    mapLayers.timeouts.resizeHistory = setTimeout(resizeBottom, 550);
                }
            };

            $('#bottom_history').on('resize', function (e) {
                clearTimeout(mapLayers.timeouts.resizeHistory);
                mapLayers.timeouts.resizeHistory = setTimeout(resizeBottom, 550);
            });


            if (data.data.length === 0) {
                showToast(NoResult, 'Notificacion', 'info');
                if (loadHistory > 0) {
                    clearAllHistory();
                }
                loadHistory = 0;
            } else {
                dataHistory = data;
            }


        }


    });

}

function displayResult(result){
    if(!result){
        showToast("Ocurrio un error inesperado...intente nuevamente", 'Notificacion', 'error');
    }
}


function addPointData(data, day, vehicle) {

    let count = 0;
    var PointsDataLayer= new L.LayerGroup();
    let odometerLength = data.odometers.length;
    data.latLngs.forEach(function (obj) {

        let point = [obj[0], obj[1]];
        var date = data.time[count];
        var speed = parseFloat(data.speeds[count]).toFixed(0);
        var altitudeData = parseFloat(data.Altitudes[count]).toFixed(0);
        var angleP = parseFloat(data.anglePoint[count]).toFixed(0);
        let odometerHtml = "";
        if (odometerLength > 0){
            odometerHtml = "<tr>" +
                "<th><strong>Odometro : </strong></th>" +
                "<td> " + data.odometers[count] + " km</td>" +
                "</tr>";
        }

        var position='<a href="http://maps.google.com/maps?q=' + obj[0] + ',' + obj[1] + '&amp;t=m" target="_blank">' +obj[0] + ',' + obj[1] + '</a>';


        PointsDataLayer.addLayer(
            addMarkerWithIconforHistory(point, 'img/route-data-point.svg', [10, 10]).on('click', function(e) {
                let address=getGeocodeAddress(obj[0], obj[1]);
                let html = "" +
                    "<table style='width: 100%' class=\"leaflet-popup-custom\">" +
                    "<tr>" +
                    "<th><strong>Vehículo : </strong></th>" +
                    "<td>" + vehicle.name  +" - "+ vehicle.license_plate + "</td>" +
                    "</tr>" +

                    "<tr>" +
                    "<th><strong>Direccion : </strong></th>" +
                    "<td>" + address + "</td>" +
                    "</tr>" +

                    "<tr>" +
                    "<th><strong>Posicion : </strong></th>" +
                    "<td> " + position + "</td>" +
                    "</tr>" +

                    odometerHtml +

                    "<tr>" +
                    "<th><strong>Altitud : </strong></th>" +
                    "<td> " + altitudeData + " m</td>" +
                    "</tr>" +

                    "<tr>" +
                    "<th><strong>Angulo : </strong></th>" +
                    "<td> " + angleP + " °</td>" +
                    "</tr>" +

                    "<tr>" +
                    "<th><strong>Velocidad : </strong> </th>" +
                    "<td>" + speed + " kph</td>" +
                    "</tr>" +

                    "<tr>" +
                    "<th><strong>Tiempo : </strong></th>" +
                    "<td>" + date + "</td>" +
                    "</tr>" +

                    "</table>"
                ;
                L.popup({ maxWidth : 560})
                    .setLatLng(e.latlng)
                    .setContent(html)
                    .openOn(map);
            })
        );
        count++;
    });


    // PointsData.addTo(map);
    dayLayerPoints[day] = PointsDataLayer;
}


function ConfigHistory() {

    contentTabHistory = getContentBottomHistory();
    mapLayers.graphics.dialog = L.control.dialog({
        size: [$(window).width() - ($('#sidebar').width() + 10), 400],
        minSize: [260, 260],
        maxSize: [6000, 6000],
        position: 'bottomleft',
        anchor: [-260, -10],
        initOpen: true
    }).setContent(contentTabHistory).addTo(map);


    mapLayers.graphics.dialog._map.on('dialog:resizeend', function () {
        resizeBottom();
    });


    mapLayers.graphics.dialog._map.on('dialog:closed', function () {
        //mapLayers.graphics.dialog.open();
        console.log("here.........");
        clearAllHistoryGraphics();
    });


    mapLayers.graphics.dialog.freeze();
    $('.nav-tabs a').click(function () {
        $(this).tab('show');
    });


    if (mapLayers.graphics.table !== undefined)
        mapLayers.graphics.table.clear().draw();
    map.closePopup();


    initDataTable();


    $('#bottom_panel_graph_play_speed').on('change', function () {
        speedHistory = $('#bottom_panel_graph_play_speed').val()
    });


    $("<div id='tooltip'></div>").css({
        position: "absolute",
        display: "none",
        border: "1px solid #fdd",
        padding: "2px",
        "background-color": "#fee",
        opacity: 0.80
    }).appendTo("body");


}


function cleardatatable() {
    tableHistory.clear().draw(false);
}


function displayTippy(data, id) {


    if (document.getElementById("I-" + id)) {
        showBeginTippy(data, id);
    }


    if (document.getElementById("E-" + id)) {
        showEndTippy(data, id);
    }

    if (document.getElementById("dth-" + id)) {
        showStopTippy(data, id);
    }

    if (document.getElementById("R-" + id)) {
        showSectionTippy(data, id);
    }

    if (document.getElementById("Resume-" + id)) {
        showResumeTippy(data, id);
    }

    if (document.getElementById("dte-" + id)) {
        showEventTippy(data, id);
    }


}


function showResumeTippy(data, id) {

    var obj = data[4];

    document.getElementById("Resume-" + id).setAttribute("title", "<img src='/img/markers/route-start.svg' height='25' width='25' >------------><img src='/img/markers/route-end.svg' height='25' width='25' >" +
        "<h5 >"
        + "<img src='/img/markers/distance.svg' height='20' width='20' > " + msg1 + " : " + obj.LongKmDrive + " km"
        + "<br><br><img src='/img/markers/time.svg' height='20' width='20' > " + msg2 + ": " + obj.DurationDrive
        + "<br><br><img src='/img/markers/parking.svg' height='25' width='25' > " + msg3 + ": " + obj.DurationStops
        + "<br><br><img src='/img/markers/engine.svg' height='25' width='25' > Motor Inactivo: " + obj.TotalIdle
        + "<br><br><img src='/img/markers/speedmax.svg' height='20' width='20' > " + msg4 + ": " + obj.MaxSpeed + " kph"
        + "<br><br><img src='/img/markers/analytics.svg' height='20' width='20' > " + msg5 + ": " + obj.AvgSpeed + " kph</h5>"


        +

        "</h5>");

    tippy('#Resume-' + id, {
        theme: 'drive',
        delay: delay,
        arrow: arrow,
        arrowType: arrowType,
        size: size,
        duration: duration,
        animation: animation,
        placement: placement,
        trigger: trigger,
        offset: offset,
        followCursor: followCursor
    });
}


function showBeginTippy(data, id) {

    var obj = data[4];

    document.getElementById("I-" + id).setAttribute("title", "<img src='/img/markers/route-start.svg' height='25' width='25' >------------><img src='/img/markers/route-end.svg' height='25' width='25' >" +
        "<h5 >"
        + " " + msg1 + " : " + obj.LongKmDrive + " km"
        + "<br><br> " + msg2 + ": " + obj.DurationDrive
        + "<br><br>" + msg3 + ": " + obj.DurationStops
        + "<br><br>Motor Inactivo: " + obj.DurationIdle
        + "<br><br> " + msg4 + ": " + obj.MaxSpeed + " kph"
        + "<br><br>" + msg5 + ": " + obj.AvgSpeed + " kph</h5>"
        + "</h5>");

    tippy('#I-' + id, {
        theme: 'drive',
        delay: delay,
        arrow: arrow,
        arrowType: arrowType,
        size: size,
        duration: duration,
        animation: animation,
        placement: placement,
        trigger: trigger,
        offset: offset,
        followCursor: followCursor
    });
}


function showEndTippy(data, id) {

    var obj = data[4];


    document.getElementById("E-" + id).setAttribute("title", "<img src='/img/markers/route-start.svg' height='25' width='25' >------------><img src='/img/markers/route-end.svg' height='25' width='25' >" +
        "<h5 >"
        + " " + msg6 + ": " + obj.LongKmDrive + " km"
        + "<br><br> " + msg7 + ": " + obj.DurationDrive
        + "<br><br> " + msg8 + ": " + obj.DurationStops
        + "<br><br>Motor Inactivo: " + obj.DurationIdle
        + "<br><br> " + msg9 + ": " + obj.MaxSpeed + " kph"
        + "<br><br> " + msg10 + ": " + obj.AvgSpeed + " kph</h5>"
        + "</h5>");

    tippy('#E-' + id, {
        theme: 'drive',
        delay: delay,
        arrow: arrow,
        arrowType: arrowType,
        size: size,
        duration: duration,
        animation: animation,
        placement: placement,
        trigger: trigger,
        offset: offset,
        followCursor: followCursor
    });


}


function showStopTippy(data, id) {

    let obj = data[4];

    document.getElementById("dth-" + id).setAttribute("title", "<h4><img src='/img/markers/parking.svg' height='25' width='25' ></h4>" +
        " <h5>  " + msg11 + " : " + obj.begin_stop
        + "<br><br> " + msg12 + ": " + obj.end_stop
        + "<br><br> Motor Inactivo: " + obj.idle_time +
        "<br><br> " + msg13 + ": " + obj.duration_stop + "</h5>");


    tippy('#dth-' + id, {
        theme: 'stop',
        delay: delay,
        arrow: arrow,
        arrowType: arrowType,
        size: size,
        duration: duration,
        animation: animation,
        placement: placement,
        trigger: trigger,
        offset: offset,
        followCursor: followCursor

    });


}

function showSectionTippy(data, id) {

    var objDrive = data[4];
    var ibutton=objDrive.ibutton;
    var driver=objDrive.driver;

    var htmlIbuttom= "<br><br> Llave : " + ibutton;
    var htmlDriver= "<br><br> Conductor : " + driver;

    if(ibutton=="0" || ibutton==0){
        htmlIbuttom= " " ;
        htmlDriver= "  ";
    }

    document.getElementById("R-" + id).setAttribute("title", "<img src='/img/markers/route-drive.svg' height='40' width='40' >" +
        "<h5 >" +
        " " + msg14 + ": " + objDrive.date_e
        + "<br><br> " + msg15 + ": " + objDrive.date_endR
        + htmlIbuttom
        + htmlDriver
        + "<br><br> " + msg16 + " : " + objDrive.info
        + "<br><br> Recorrido : " + objDrive.distance_travel + " km"
        + "<br><br>" + msg18 + ": " + objDrive.max_speed + " kph"
        + "<br><br>" + msg19 + ": " + objDrive.avg_speed + " kph</h5>"
        +
        "</h5>");


    tippy('#R-' + id, {
        theme: 'drive',
        delay: delay,
        arrow: arrow,
        arrowType: arrowType,
        size: size,
        duration: duration,
        animation: animation,
        placement: placement,
        trigger: trigger,
        offset: offset,
        followCursor: followCursor
    });


}

function showEventTippy(data, id) {

    let obj = data[4];
    document.getElementById("dte-" + id).setAttribute("title", "<h4><img src='/img/info.svg' height='40' width='40' ></h4>" +
        " <h5> Fecha:  " + obj.date
        + "<br><br> Evento: " + obj.event_name
        + "<br><br>Descripcion:" + obj.event_desc + "</h5>");


    tippy('#dte-' + id, {
        theme: 'eventHistory',
        delay: delay,
        arrow: arrow,
        arrowType: arrowType,
        size: size,
        duration: duration,
        animation: animation,
        placement: placement,
        trigger: trigger,
        offset: offset,
        followCursor: followCursor

    });


}


function begin_end(rowData, day) {




    let begin = rowData.init_latLong.split(",");
    let end = rowData.end_latLong.split(",");
    let latLngBegin = begin[0] + "," + begin[1];
    let latLngEnd = end[0] + "," + end[1];

    let icon_begin ="/img/markers/route-start.svg";

    let icon_end ="/img/markers/route-end.svg";




    let DurationStops = rowData.total_stop;
    let MaxSpeed = rowData.max_speed_day;
    let AvgSpeed = rowData.avg_speed_day;
    let DurationDrive = rowData.total_mov;
    let LongKmDrive = rowData.total_odometer;
    let total_idle = rowData.total_idle;
    LongKmDrive = LongKmDrive.toFixed(2);
    MarkersBegin.clearLayers();
    MarkersEnd.clearLayers();


    var ubi = '<a href="http://maps.google.com/maps?q=' + begin[1] + ',' + begin[2] + '&amp;t=m" target="_blank">' + begin[1] + ',' + begin[2] + '</a>';
    var ubi2 = '<a href="http://maps.google.com/maps?q=' + end[1] + ',' + end[2] + '&amp;t=m" target="_blank">' + end[1] + ',' + end[2] + '</a>';


    let coordsB = [begin[0], begin[1]];
    let coordsE = [end[0], end[1]];



    var objInit = {
        day: day,
        date_end: rowData.init_date,
        DurationStops: DurationStops,
        MaxSpeed: MaxSpeed,
        AvgSpeed: AvgSpeed,
        DurationDrive: DurationDrive,
        DurationIdle: total_idle,
        LongKmDrive: LongKmDrive,
        latLngBegin: latLngBegin,
        latLngEnd: latLngEnd,
        coordsB: coordsB,
        coordsE: coordsE,
        ubi: ubi
    };


    tableHistory.row.add([
        "<img src='"+ icon_begin+"' height='20' width='20' >",
        rowData.init_date,
        " ",
        day,
        objInit,
        rowData.date_order_init
    ]).node().id = "I-" + idDatatableHistory;


    idDatatableHistory++;


    var objEnd = {
        day: day,
        date_end: rowData.end_date,
        DurationStops: DurationStops,
        DurationIdle: total_idle,
        MaxSpeed: MaxSpeed,
        AvgSpeed: AvgSpeed,
        DurationDrive: DurationDrive,
        LongKmDrive: LongKmDrive,
        latLngBegin: latLngBegin,
        latLngEnd: latLngEnd,
        coordsB: coordsB,
        coordsE: coordsE,
        ubi: ubi2
    };

    tableHistory.row.add([
        "<img src='"+ icon_end+"' height='20' width='20' >",
        rowData.end_date,
        " ",
        day,
        objEnd,
        rowData.date_order_end
    ]).node().id = "E-" + idDatatableHistory;


    idDatatableHistory++;

    console.log(rowData.date_order_init,rowData.date_order_end);
}


function resumeAll(resume) {


    var day = resume.day;
    var date = resume.date;
    var route_total = resume.total_odometer;
    var stops_total = resume.total_time_stop;
    var drives_total = resume.total_time_mov;
    var total_avg_speed = resume.avg_speed;
    var max_speed = resume.max_speed;
    var total_time_idle = resume.total_time_idle;

    checksGroups[date]=true;

    //  total_time_idle

    var objInit = {
        day: day,
        TotalIdle: total_time_idle,
        DurationStops: stops_total,
        MaxSpeed: max_speed,
        AvgSpeed: total_avg_speed,
        DurationDrive: drives_total,
        LongKmDrive: route_total
    };
    var path = "/img/markers/analisis.svg";
    var icon = "<img src='" + path + "' height='20' width='20' >";
    tableHistory.row.add([
        icon,
        date,
        objInit.LongKmDrive + " km",
        day,
        objInit,
        resume.date_order
    ]).node().id = "Resume-" + idDatatableHistory;


}


function processStops(stops_process, day) {

    if (stops_process.length == 0) {
        return;
    }
    var MarkersStops = new L.LayerGroup();

    stops_process.forEach(function (stop) {
        var objStop = {
            lat: stop.latitude_init,
            lng: stop.longitude_init,
            begin_stop: stop.init_range,
            end_stop: stop.end_range,
            duration_stop: stop.timer,
            idle_time: stop.idle,
            altitude: stop.altitude_init,
            angle:  stop.angle_init,
            date_order:  stop.date_order,
            icon: '/img/markers/route-stop.svg',
            ubi: '<a href="http://maps.google.com/maps?q=' + stop.latitude_init + ',' + stop.longitude_init + '&amp;t=m" target="_blank">' + stop.latitude_init + ',' + stop.longitude_init + '</a>',
            odometer: stop.odometer
        };


        tableHistory.row.add([
            "<img src='"+objStop.icon+"' height='20' width='20' >",
            stop.init_range,
            objStop.duration_stop,
            day,
            objStop,
            objStop.date_order
        ]).node().id = "dth-" + idDatatableHistory;


        let point = [stop.latitude_init, stop.longitude_init];
        MarkersStops.addLayer(addMarkerWithIconforHistory(point).on('click', function(e) {

                let odometerHtml = "";
                if(objStop.odometer != ODOMETER_DEFAULT_VALUE){
                    odometerHtml = "<tr>"+
                        "<th><strong>Odometro </strong></th>" +
                        "<td>  " + objStop.odometer + " Km</td>" +
                        "</tr>";
                }
                let html = "" +
                    "<table style='width: 100%' class=\"leaflet-popup-custom\">" +


                    "<tr>" +
                    "<th><strong>" + msg29 + ":</strong></th>" +
                    "<td> " + objStop.begin_stop + "</td>" +
                    "</tr>" +


                    "<tr>" +
                    "<th><strong>" + msg30 + ": </strong> </th>" +
                    "<td>" + objStop.end_stop + " </td>" +
                    "</tr>" +


                    "<tr>" +
                    "<th><strong>" + msg31 + ":</strong></th>" +
                    "<td> " + objStop.duration_stop + "</td>" +
                    "</tr>" +

                    "<tr>" +
                    "<th><strong>Motor Inactivo:</strong></th>" +
                    "<td> " + objStop.idle_time + "</td>" +
                    "</tr>" +

                    "<tr>" +
                    "<th><strong> Ubicacion </strong></th>" +
                    "<td>" + objStop.ubi + "</td>" +
                    "</tr>" +


                    /*      "<tr>" +
                          "<th><strong>Direccion:</strong></th>" +
                          "<td>" + address + "</td>" +
                          "</tr>" +*/



                    "<tr>" +
                    "<th><strong>" + msg27 + ":</strong></th>" +
                    "<td> " + parseFloat(objStop.altitude).toFixed(0) + " m</td>" +
                    "</tr>" +

                    "<tr>" +
                    "<th><strong>" + msg28 + ":</strong></th>" +
                    "<td>  " + parseFloat(objStop.angle).toFixed(0) + " °</td>" +
                    "</tr>" +
                    odometerHtml +

                    "</table>"
                ;

                L.popup({ maxWidth : 560})
                    .setLatLng(e.latlng)
                    .setContent(html)
                    .openOn(map);


            })

        );


        idDatatableHistory++;
    });


    MarkersStops.addTo(map);
    dayLayerStop[day] = MarkersStops;
}

function processEvents(events_process, day) {

    if (events_process.length == 0) {
        return;
    }
    var MarkersEvents = new L.LayerGroup();
    events_process.forEach(function (event) {

        var objEvent = {
            date: event.date,
            event_name: event.event_name,
            event_desc: event.event_desc,
            latitude: event.latitude,
            longitude: event.longitude,
            altitude: event.altitude,
            angle: event.angle,
            speed: event.speed,
            date_order:  event.date_order,
            ubi: '<a href="http://maps.google.com/maps?q=' + event.latitude + ',' + event.longitude + '&amp;t=m" target="_blank">' + event.latitude + ',' + event.longitude + '</a>'
        };


        tableHistory.row.add([
            "<img src='/img/markers/route-event.svg' height='20' width='20' >",
            objEvent.date,
            objEvent.event_name,
            day,
            objEvent,
            objEvent.date_order
        ]).node().id = "dte-" + idDatatableHistory;


        let point = [objEvent.latitude, objEvent.longitude];

        MarkersEvents.addLayer(addMarkerWithIconforHistoryEvent(point).on('click', function(e) {

            var address=getGeocodeAddress(objEvent.latitude, objEvent.longitude);

            let html = "" +
                "<table style='width: 100%' class=\"leaflet-popup-custom\">" +

                "<tr>" +
                "<th><strong>Fecha :</strong></th>" +
                "<td> " + objEvent.date+ "</td>" +
                "</tr>" +

                "<tr>" +
                "<th><strong>Evento:</strong></th>" +
                "<td> " + objEvent.event_name + "</td>" +
                "</tr>" +


                "<tr>" +
                "<th><strong>Descripcion: </strong> </th>" +
                "<td>" + objEvent.event_desc + " </td>" +
                "</tr>" +

                "<tr>" +
                "<th><strong>" + msg38 + ":</strong> </th>" +
                "<td>" + objEvent.ubi + " </td>" +
                "</tr>" +


                /*   "<tr>" +
                   "<th><strong> Direccion </strong></th>" +
                   "<td>" + address + "</td>" +
                   "</tr>" +*/

                "<tr>" +
                "<th><strong>Velocidad: </strong></th>" +
                "<td>" + parseFloat(objEvent.speed).toFixed(0)  + " kph</td>" +
                "</tr>" +

                "<tr>" +
                "<th><strong>" + msg39 + ":</strong></th>" +
                "<td> " +  parseFloat(objEvent.altitude).toFixed(0) + " m</td>" +
                "</tr>" +

                "<tr>" +
                "<th><strong>" + msg40 + ":</strong></th>" +
                "<td>  " + parseFloat(objEvent.angle).toFixed(0) + "°</td>" +
                "</tr>" +
                "</table>";

            L.popup({ maxWidth : 560})
                .setLatLng(e.latlng)
                .setContent(html)
                .openOn(map);




        }));

        idDatatableHistory++;
    });


    MarkersEvents.addTo(map);
    dayLayerEvents[day] = MarkersEvents;
}

function processRoutes(routes, day) {


    if (routes.length == 0) {
        return;
    }


    routes.forEach(function (row) {

        var objDrive = {
            icon: "<img src='/img/markers/route-drive.svg' height='20' width='20' >",
            date_e: row.init_range,
            date_endR: row.end_range,
            info: row.timer,
            max_speed: row.max_speed,
            avg_speed: row.avg_speed,
            points: row.points_state,
            distance_travel: row.odometer,
            ibutton:row.ibutton,
            driver:row.driver,
            date_order:  row.date_order,
        };

        tableHistory.row.add([
            objDrive.icon,
            objDrive.date_e,
            objDrive.info,
            day,
            objDrive,
            objDrive.date_order
        ]).node().id = "R-" + idDatatableHistory;


        idDatatableHistory++;


    });


}

function DisplayDataMap(data, id) {


    if (document.getElementById("I-" + id)) {

        var objInit = data[4];

        var popup = L.popup()
            .setLatLng(objInit.coordsB)
            .setContent("" +
                "<strong>" + msg32 + "  :</strong>  " + objInit.ubi + "<br><br>" +
                "<strong>" + msg33 + ":</strong>          " + objInit.LongKmDrive + " km<br><br>" +
                "<strong>" + msg34 + ":</strong>           " + objInit.DurationDrive + "<br><br>" +
                "<strong>" + msg35 + ":</strong>            " + objInit.DurationStops + "<br><br>" +
                "<strong>" + msg36 + ":</strong>            " + objInit.MaxSpeed + " kph<br><br>" +
                "<strong>" + msg37 + ":</strong>               " + objInit.AvgSpeed + " kph<br><br>"
            )
            .openOn(map);

        map.setView(objInit.coordsB, 17);

    }


    if (document.getElementById("E-" + id)) {

        var objEnd = data[4];

        var popup = L.popup()
            .setLatLng(objEnd.coordsE)
            .setContent("" +
                "<strong>" + msg32 + " :</strong>  " + objEnd.ubi + "<br><br>" +
                "<strong>" + msg33 + " :</strong>          " + objEnd.LongKmDrive + " km<br><br>" +
                "<strong>" + msg34 + " :</strong>           " + objEnd.DurationDrive + "<br><br>" +
                "<strong>" + msg35 + " :</strong>            " + objEnd.DurationStops + "<br><br>" +
                "<strong>" + msg36 + " :</strong>            " + objEnd.MaxSpeed + " kph<br><br>" +
                "<strong>" + msg37 + " :</strong>               " + objEnd.AvgSpeed + " kph<br><br>"
            )
            .openOn(map);

        map.setView(objEnd.coordsE, 17);
    }


    if (document.getElementById("dth-" + id)) {

        var objStop = data[4];
        var point = [objStop.lat, objStop.lng];
        var position = '<a href="http://maps.google.com/maps?q=' + objStop.lat + ',' + objStop.lng + '&amp;t=m" target="_blank">' + objStop.lat + ',' + objStop.lng + '</a>';
        let odometerHtml = "";
        if(objStop.odometer != ODOMETER_DEFAULT_VALUE){
            odometerHtml = "<tr>"+
                "<th><strong>Odometro </strong></th>" +
                "<td>  " + objStop.odometer + " Km</td>" +
                "</tr>";
        }
        let html = "" +
            "<table style='width: 100%' class=\"leaflet-popup-custom\">" +


            "<tr>" +
            "<th><strong>" + msg29 + ":</strong></th>" +
            "<td> " + objStop.begin_stop + "</td>" +
            "</tr>" +


            "<tr>" +
            "<th><strong>" + msg30 + ": </strong> </th>" +
            "<td>" + objStop.end_stop + " </td>" +
            "</tr>" +


            "<tr>" +
            "<th><strong>" + msg31 + ":</strong></th>" +
            "<td> " + objStop.duration_stop + "</td>" +
            "</tr>" +

            "<tr>" +
            "<th><strong>Motor Inactivo:</strong></th>" +
            "<td> " + objStop.idle_time + "</td>" +
            "</tr>" +

            "<tr>" +
            "<th><strong> Ubicacion </strong></th>" +
            "<td>" + objStop.ubi + "</td>" +
            "</tr>" +

            "<tr>" +
            "<th><strong>" + msg27 + ":</strong></th>" +
            "<td> " + parseFloat(objStop.altitude).toFixed(0) + " m</td>" +
            "</tr>" +

            "<tr>" +
            "<th><strong>" + msg28 + ":</strong></th>" +
            "<td>  " + parseFloat(objStop.angle).toFixed(0) + " °</td>" +
            "</tr>" +
            odometerHtml +

            "</table>"
        ;

        L.popup({ maxWidth : 560})
            .setLatLng(point)
            .setContent(html)
            .openOn(map);


        map.setView(point, 17);

    }


    if (document.getElementById("R-" + id)) {
        var objStop = data[4];
        var points = [];

        if(objStop.points!=null){
            var res = objStop.points.replace('{', '[');
            res = res.replace('}', ']');
            var pointsTemp= JSON.parse(res);

            pointsTemp.forEach(function (row) {
                var latLng = row.split(",");
                points.push(latLng);
            });

        }
        DisplaySection(points);
    }

    if (document.getElementById("dte-" + id)) {
        var points = data[4];
        DisplayEvent(points);

    }


}

function DisplayEvent(obj) {
    var point = [obj.latitude, obj.longitude];
    var position = '<a href="http://maps.google.com/maps?q=' + obj.latitude + ',' + obj.longitude + '&amp;t=m" target="_blank">' + obj.latitude + ',' + obj.longitude + '</a>';
    var popup = L.popup()
        .setLatLng(point)
        .setContent("<strong>" + msg38 + ":</strong>  " + position + "<br><br>" +
            "<strong>Fecha :</strong>            " + obj.date + "<br><br>" +
            "<strong>Evento:</strong>               " + obj.event_name + "<br><br>" +
            "<strong>Descripcion:</strong>          " + obj.event_desc + "<br><br>" +
            "<strong>Velocidad:</strong>           " + obj.speed + " kph<br><br>" +
            "<strong>" + msg39 + ":</strong>           " + obj.altitude + "<br><br>" +
            "<strong>" + msg40 + ":</strong>            " + obj.angle + "<br><br>"
        )
        .openOn(map);


    map.setView(point, 17);

}

function DisplaySection(points) {
    if (loadSection > 0) {
        map.removeControl(ControlSection);
        routeSection.clearLayers();
        ArrowLineRouteSection.clearLayers();
        BeginSectionLayer.clearLayers();
        EndSectionLayer.clearLayers();
    }


    BeginSectionLayer.addLayer(addMarkerWithIconforHistory(points[0], "/img/markers/iniciar.svg"));

    EndSectionLayer.addLayer(addMarkerWithIconforHistory(points[points.length - 1], "/img/markers/racing-flag.svg"));


    map.addLayer(BeginSectionLayer);
    map.addLayer(EndSectionLayer);


    let polylineRoute = new L.Polyline(points);

    polylineRoute.setStyle({
        color: 'black'
    });
    map.fitBounds(polylineRoute.getBounds());
    routeSection.addLayer(polylineRoute);
    map.addLayer(routeSection);
    let arrowsSection = L.polylineDecorator(polylineRoute, {
        patterns: [
            {
                offset: 7,
                repeat: 80,
                symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {fillOpacity: 1, weight: 0}})
            }
        ]
    });
    ArrowLineRouteSection.addLayer(arrowsSection);
    map.addLayer(ArrowLineRouteSection);


    controlLayerSection();
    loadSection++;

}

var contentTabHistory = '';

function ControlLayersHistory() {

    controlGraphic = 1;

    var HistoryLayer = '<div class="map-layer-control">' +
        '<div class="row4">' +
        '<div class="margin-right-3">' +
        '<input type="checkbox" checked=true class="checkbox" onclick="ControlStops()">' +
        '</div>' +
        '<div class="margin-right-3">' + stopsSTR + ' </div>' +

        '<div class="margin-right-3">' +

        '<input  type="checkbox" checked=true class="checkbox" onclick="ControlRoute()">' +
        '</div>' +
        '<div class="margin-right-3">' + routesStr + ' </div>' +

        '<div class="margin-right-3">' +
        '<input   checked=true type="checkbox" class="checkbox" onclick="ControlGraphic();">' +
        '</div>' +
        '<div class="margin-right-3">Grafico</div>' +

        '<div class="margin-right-3">' +

        '<input  type="checkbox" checked=true class="checkbox" onclick="ControlEvents()">' +
        '</div>' +
        '<div class="margin-right-3">Eventos </div>' +

        '<div class="margin-right-3">' +
        '<input  type="checkbox"  class="checkbox" onclick="ControlDirection()">' +
        '</div>' +
        '<div class="margin-right-3">' + directions + ' </div>' +

        '<div class="margin-right-3">' +
        '<input  type="checkbox"  class="checkbox" onclick="PointsSection()">' +
        '</div>' +
        '<div class="margin-right-3"> Puntos De Datos </div>' +





        '</div></div>';


    ControlLayer = L.control.custom({
        position: 'topright',
        content: HistoryLayer,
        classes: '',

    });


    map.addControl(ControlLayer);
}

function ControlGraphic() {

    if (controlGraphic == 1) {
        controlGraphic = 0;
        mapLayers.graphics.dialog.close();
        $('#bottom_history').hide();
    } else {
        controlGraphic = 1;
        mapLayers.graphics.dialog.open();
        $('#bottom_history').show();
    }


}


function controlLayerSection() {

    var SectionLayer = '<div class="map-layer-control">' +
        '<div class="row4">' +
        '<div class="margin-right-3">' +
        '<input   checked=true type="checkbox" class="checkbox" onclick="BeginSection();">' +
        '</div>' +
        '<div class="margin-right-3">  <img height="20" width="20" src="/img/markers/iniciar.svg" alt="">  </div>' +
        '<div class="margin-right-3">' +
        '<input  type="checkbox" checked=true class="checkbox" onclick="EndSection()">' +
        '</div>' +
        '<div class="margin-right-3"> <img height="20" width="20" src="/img/markers/racing-flag.svg" alt=""> </div>' +

        '<div class="margin-right-3">' +

        '<input  type="checkbox" checked=true class="checkbox" onclick="RouteSection()">' +
        '</div>' +
        '<div class="margin-right-3">   <img height="20" width="20" src="/img/markers/route-drive.svg" alt="">  </div>' +

        '<div class="margin-right-3">' +
        '<input  type="checkbox" checked=true  class="checkbox" onclick="DirectionSection()">' +
        '</div>' +
        '<div class="margin-right-3"><img height="20" width="20" src="/img/markers/direction.png" alt=""> </div>' +

        '</div></div>';


    ControlSection = L.control.custom({
        position: 'topright',
        content: SectionLayer,
        classes: '',

    });


    map.addControl(ControlSection);
}


///-----------------------------------------------------------------------------------------------------------------------------------


function clearAllHistory() {
    stopHistory();
    removeHistoryMarker();
    cleardatatable();
    speeds = [];
    altitude = [];
    contact = [];
    $("#placeholder").remove();
    $('#placeholder').empty();
    if (loadHistory == 0) {
        return;
    }
    idDatatableHistory = 0;
    MarkersBegin.clearLayers();
    MarkersEnd.clearLayers();
    PointsData.clearLayers();

    if (mapLayers.graphics.dialog != undefined) {
        mapLayers.graphics.dialog.setContent("");
        mapLayers.graphics.dialog.destroy();
        mapLayers.graphics.dialog = undefined;
    }
    panToDevice(mapLayers.graphics.idDevice);
    map.removeControl(ControlLayer);
    if (loadSection > 0) {
        map.removeControl(ControlSection);
        routeSection.clearLayers();
        ArrowLineRouteSection.clearLayers();
        BeginSectionLayer.clearLayers();
        EndSectionLayer.clearLayers();

    }
    loadSection = 0;
    $('#KML_EXPORT').attr('disabled', 'disabled');
    $('#historyClear').attr('disabled', 'disabled');
    $('#historyDays').attr('style', 'display:none');
    $('#historyCollapse').attr('style', 'display:none');
    $('#historyToogleCollapse').html('<i  class="fa fa-minus"></i>');


    $.each(daysRange, function (key, data) {
        var stopLayer = dayLayerStop[data[0]];
        var routeLayer = dayLayerRoute[data[0]];
        var routeArrowsLayer = dayLayerArrows[data[0]];
        var EventLayer = dayLayerEvents[data[0]];
        var PointLayer = dayLayerPoints[data[0]];

        if (stopLayer != undefined && data[2]) {
            stopLayer.clearLayers();
            map.removeLayer(stopLayer);
        }
        if (routeLayer != undefined && data[2]) {
            routeLayer.clearLayers();
            map.removeLayer(routeLayer);
        }
        if (routeArrowsLayer != undefined && data[2]) {
            routeArrowsLayer.clearLayers();
            map.removeLayer(routeArrowsLayer);
        }
        if (EventLayer != undefined && data[2]) {
            EventLayer.clearLayers();
            map.removeLayer(EventLayer);
        }


        if(PointLayer != undefined && data[2]){
            PointLayer.clearLayers();
            map.removeLayer(PointLayer);
        }


    });

    dayLayerStop = [];
    dayLayerRoute = [];
    dayLayerArrows = [];
    dayLayerEvents = [];
    dayLayerPoints = [];
    controlStops = 1;
    controlRoute = 1;
    controlDirection = 0;
    controlPoints=0;
    checkDays = false;
    collapse = false;
    $("[class='dt-button custom-button-history btn btn-default dim']").click();

    dataHistory = -1;

}

function clearAllHistoryGraphics() {
    if (mapLayers.graphics.dialog != undefined) {
        mapLayers.graphics.dialog.setContent("");
        controlGraphic = 0;
        mapLayers.graphics.dialog.destroy();
        mapLayers.graphics.dialog = undefined;
    }
}

function fechaIF() {

    var x = document.getElementById("time").value;
    var f = new Date();
    var iniDate = new Date();
    var endDate = new Date();


    switch (x) {
        case "1":
            //1 hour before
            iniDate.setHours(f.getHours() - 1);
            break;
        case "2":
            //this day
            iniDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            endDate.setDate(iniDate.getDate() + 1);
            break;
        case "3":
            // yesterday
            iniDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            iniDate.setDate(f.getDate() - 1);
            break;
        case "4":
            //2 days before
            iniDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            iniDate.setDate(iniDate.getDate() - 2);
            break;
        case "5":
            //3 days before
            iniDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            iniDate.setDate(iniDate.getDate() - 3);
            endDate.setDate(iniDate.getDate() + 1);
            break;
        case  "6":
            //this week
            var dayWeek=iniDate.getDay()-1;
            iniDate.setDate(iniDate.getDate() - dayWeek);
            iniDate.setHours(0, 0, 0, 0);


            endDate.setHours(0, 0, 0, 0);
            endDate.setDate(endDate.getDate()+1);
            break;
        case "7":
            //last week

            iniDate.setHours(0, 0, 0, 0);

            var sum = 0;
            if (iniDate.getDay() > 1) {
                sum = -1;
            } else {
                sum = 1;
            }
            while (iniDate.getDay() != 1) {
                iniDate.setDate(iniDate.getDate() - 1);
            }
            iniDate.setDate(iniDate.getDate() - 7);

            var d = new Date(iniDate.getFullYear(), iniDate.getMonth(), iniDate.getDate() + 7, 00, 00, 00, 0);

            endDate = d;

            break;
        case "8":
            //this month
            iniDate.setHours(0, 0, 0, 0);
            iniDate.setHours(0, 0, 0, 0);
            iniDate.setDate(1);
            endDate.setDate(1);
            endDate = new Date();
            endDate.setHours(0, 0, 0, 0);
            endDate.setDate(endDate.getDate() + 1);
            break;
        case  "9":
            //last month
            iniDate.setHours(0, 0, 0, 0);
            iniDate.setHours(0, 0, 0, 0);
            iniDate.setMonth(f.getMonth() - 1);
            iniDate.setDate(1);

            endDate.setDate(1);
            endDate.setHours(00, 00, 00);
    }


    var dateIni = DateFormatResult(iniDate);

    var dateEnd = DateFormatResult(endDate);


    document.getElementById("time_begin").value = dateIni;
    document.getElementById("time_end").value = dateEnd;
}


function DateFormatResult(date) {

    var Day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var time = date.toLocaleTimeString('pt-PT', {hour12: false});


    if (Day < 10) {
        Day = '0' + Day
    }
    if (month < 10) {
        month = '0' + month
    }

    var result = year + "-" + month + "-" + Day + " " + time;


    return result;

}


function addMarkerWithIconforHistory(latlng, icon) {

    myIconRoute = "/img/markers/route-stop.svg"
    sizeMarkers = [35, 25];
    if (icon != null) {
        myIconRoute = icon;
        sizeMarkers = [35, 75];
    }
    myIcon = L.icon({
        iconUrl: myIconRoute,
        iconSize: sizeMarkers
    });
    return L.marker(latlng, {icon: myIcon});
}


function paintPoints(graphic, day) {

    var points = graphic.latLngs;
    if (points.length < 2) return;
    let polyline = new L.Polyline(points);

    polyline.setStyle({
        color: 'red'
    });


    var LinesLayer = new L.LayerGroup();
    var ArrowLines = new L.LayerGroup();

    map.fitBounds(polyline.getBounds());
    LinesLayer.addLayer(polyline);
    map.addLayer(LinesLayer);


    //aqui se anadio el sentido de la ruta
    let arrows = L.polylineDecorator(polyline, {
        patterns: [{
            offset: 25,
            repeat: 250,
            symbol: L.Symbol.arrowHead({
                pixelSize: 14,
                headAngle: 40,
                pathOptions: {
                    fillOpacity: 1,
                    weight: 0
                }
            })
        }]
    });
    ArrowLines.addLayer(arrows);


    dayLayerRoute[day] = LinesLayer;
    dayLayerArrows[day] = ArrowLines;

}


function showHistory(routes, index) {

    if (routes.length == 0) {
        return index;
    }


    routes.forEach(function (row) {
        let time = dates[index];
        dataTableHistory.push([time, row.latitude, row.longitude, row.altitude, row.angle, row.speed, JSON.stringify(row.params).replace(/,/g, " ") + index + 1]);
        index++;
    });


    return index;

}


function heightDataTable() {
    return $('#bottom_history').height() - 100;
}


function removeHistoryMarker() {
    if (mapLayers.graphics.markHistory !== undefined)
        map.removeLayer(mapLayers.graphics.markHistory);
}


function addHistoryMarker(obj, key = undefined, angle) {
    if (mapLayers.graphics.markHistory !== undefined)
        removeHistoryMarker();


    let d = "/img/markers/arrow-red.svg";
    let myIcon = L.icon({
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        iconUrl: d,
        popupAnchor: [0, 0]
    });


    // iconAngle: angle

    mapLayers.graphics.markHistory = L.marker([obj[0], obj[1]], {
        icon: myIcon,
        iconAngle: angle
    });
    mapLayers.graphics.markHistory.key = key;
    panToZoom(obj[0], obj[1], 20);
    map.addLayer(mapLayers.graphics.markHistory);
}


function resizeBottom() {
    let w = $(window).width() - ($('#sidebar').width() + 20);

    mapLayers.graphics.dialog.setSize([w, 260]);

    if ($('#tabs_history').find('.active').children().attr('href') === '#plot') {
        //  let myPlot = document.getElementById('plot');
        //  Plotly.Plots.resize(myPlot);
    } else {
        //$('div.dataTables_scrollBody').height( heightDataTable());
        TableMessages.columns.adjust();
    }


}


function addMarkerWithIconforHistory(latlng, icon, size) {

    myIconRoute = "/img/markers/route-stop.svg";
    sizeMarkers = [35, 25];
    if (icon != null) {
        myIconRoute = icon;
        sizeMarkers = [35, 25];
    }

    if (size != null) {
        sizeMarkers = size;
    }

    myIcon = L.icon({
        iconUrl: myIconRoute,
        iconSize: sizeMarkers
    });
    return L.marker(latlng, {icon: myIcon});
}

function addMarkerWithIconforHistoryEvent(latlng, icon) {

    myIconRoute = "/img/markers/route-event.svg";
    sizeMarkers = [35, 25];
    if (icon != null) {
        myIconRoute = icon;
        sizeMarkers = [35, 75];
    }
    myIcon = L.icon({
        iconUrl: myIconRoute,
        iconSize: sizeMarkers
    });
    return L.marker(latlng, {icon: myIcon});
}

/*
function sleep(ms) {
    return new Promise(resolve = > setTimeout(resolve, ms)
)
    ;
}
*/

function noHilo() {
    var sw = true;
    var cnt = 0;
    while (sw) {
        sleep(2000);

        cnt++;
        if (cnt > 30) {
            sw = false;
        }
    }
}


function generateHTML(array) {

    let str = "<table> ";
    for (let key in array) {


        if (key == speedSTR) {
            str += "<tr> <td> <strong>" + key + ": </strong> </td>";
            let value = array[key];
            str += "<td>" + value + " kph</td> </tr>"
        } else {
            str += "<tr> <td> <strong>" + key + ": </strong> </td>";
            let value = array[key];
            str += "<td>" + value + "</td> </tr>"
        }


    }
    return str + "</table>";
}


function addPopupToMap(lat, lng, html) {
    mapPopup = L.popup({
        offset: [0, -14]
    }).setLatLng([lat, lng]).setContent(html).openOn(map)
}


function panToDevice(id, e) {
    if (id > 0) {
        let device = findDevice(id);
        if (e === undefined || e.target.tagName == 'IMG') {
            panToZoom(device.position.lat, device.position.lng, maxZoom);
        } else if (e.target.tagName == 'SPAN') {
            panTo(device.position.lat, device.position.lng);
        }
    }
}


var controlBegin = 1;
var controlEnd = 1;
var controlStops = 1;
var controlRoute = 1;
var controlEvents = 1;
var controlDirection = 0;
var controlPoints = 0;
var controlGraphic = 1;

function ControlEvents() {

    if (controlEvents == 1) {
        controlEvents = 0;
    } else {
        controlEvents = 1;
    }

    toogleEvents();

}

function ControlStops() {


    if (controlStops == 1) {
        controlStops = 0;
    } else {
        controlStops = 1;
    }

    toogleStops();


}

function ControlRoute() {
    if (controlRoute == 1) {
        controlRoute = 0;
    } else {
        controlRoute = 1;
    }
    toogleRoute();
}

function ControlDirection() {
    if (controlDirection == 1) {
        controlDirection = 0;
    } else {
        controlDirection = 1;
    }
    toogleArrowsRoute();
}


var controlBeginSection = 1;
var controlEndSection = 1;
var controlRouteSection = 1;
var controlDirectionSection = 1;


function BeginSection() {

    if (controlBeginSection == 1) {
        map.removeLayer(BeginSectionLayer);
        controlBeginSection = 0;
    } else {

        map.addLayer(BeginSectionLayer);
        controlBeginSection = 1;
    }


}

function EndSection() {

    if (controlEndSection == 1) {
        map.removeLayer(EndSectionLayer);
        controlEndSection = 0;
    } else {

        map.addLayer(EndSectionLayer);
        controlEndSection = 1;
    }

}

function RouteSection() {

    if (controlRouteSection == 1) {
        map.removeLayer(routeSection);
        controlRouteSection = 0;
    } else {
        map.addLayer(routeSection);
        controlRouteSection = 1;
    }
}

function DirectionSection() {
    if (controlDirectionSection == 1) {
        map.removeLayer(ArrowLineRouteSection);
        controlDirectionSection = 0;
    } else {

        map.addLayer(ArrowLineRouteSection);
        controlDirectionSection = 1;
    }
}


function PointsSection() {
    if (controlPoints == 1) {
        map.removeLayer(PointsData);
        controlPoints = 0;
    } else {
        map.addLayer(PointsData);
        controlPoints = 1;
    }
    tooglePoints();
}


function toogleStops() {
    $.each(daysRange, function (key, data) {
        var layer = dayLayerStop[data[0]];

        if (data[2] && layer != undefined) {

            if (1 === controlStops && data[1]) {
                map.addLayer(layer);
            } else {
                map.removeLayer(layer);
            }


        }

    });

}


function toogleEvents() {
    $.each(daysRange, function (key, data) {
        var layer = dayLayerEvents[data[0]];

        if (data[2] && layer != undefined) {

            if (1 === controlEvents && data[1]) {
                map.addLayer(layer);
            } else {
                map.removeLayer(layer);
            }


        }

    });

}


function toogleRoute() {

    $.each(daysRange, function (key, data) {
        var layer = dayLayerRoute[data[0]];

        if (data[2] && layer != undefined) {

            if (controlRoute && data[1]) {
                map.addLayer(layer);
            } else {
                map.removeLayer(layer);
            }


        }

    });

}

function toogleArrowsRoute() {

    $.each(daysRange, function (key, data) {
        var layer = dayLayerArrows[data[0]];

        if (data[2] && layer != undefined) {

            if (controlDirection && data[1]) {
                map.addLayer(layer);
            } else {
                map.removeLayer(layer);
            }


        }

    });

}

function tooglePoints() {

    $.each(daysRange, function (key, data) {
        var layer = dayLayerPoints[data[0]];

        if (data[2] && layer != undefined) {

            if (controlPoints && data[1]) {
                map.addLayer(layer);
            } else {
                map.removeLayer(layer);
            }


        }

    });

}


var checkDays = true;

function checkToogle() {
    $.each(daysRange, function (key, data) {
        checksGroups[data[0]] = !checkDays;
        daysRange[key] = [data[0], !checkDays, daysRange[key][2]];
    });

    checkDays = !checkDays;
    tableHistory.draw(false);
    toogleStops();
    toogleRoute();
    toogleEvents();
    toogleArrowsRoute();
    tooglePoints();
}

function checkEventDay(day) {
    checksGroups[day] = !checksGroups[day];
    var id = "check_" + day;
    var e = document.getElementById(id);
    var flag;

    if (1 == e.checked) {
        flag = true;
    } else {
        flag = false;
    }


    var index = -1;

    for (var i = 0, len = daysRange.length; i < len; i++) {
        if (daysRange[i][0] === day) {
            index = i;
            break;
        }
    }

    daysRange[index] = [day, flag, daysRange[index][2]];


    toogleStops();
    toogleRoute();
    toogleEvents();
    toogleArrowsRoute();
    tooglePoints();
}

var collapse = true;

function collapseToogle() {
    $.each(daysRange, function (key, data) {
        console.log(data);
        collapsedGroups[data[0]] = collapse;
    });
    collapse = !collapse;
    tableHistory.draw(false);
}

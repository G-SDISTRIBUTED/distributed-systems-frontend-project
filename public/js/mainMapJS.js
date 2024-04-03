// map config
var map;
var mapLayers = [];

mapLayers.graphics = [];

mapLayers.timeouts = [];



var deviceMarkers = [];
const deviceLeafletMarkers = [];
var placeMarkers = [];
var lat = -17.78424, lng = -63.18087;
var index_mapLayer = 5; // 5 Google Map Hybrid
var zoom = 13;
var minZoom = 1.2;
var maxZoom = 18;
var pointsRouteLine = 3;
var editable = true;
var zoomControl = false;
var leafletDevicesView = new PruneClusterForLeaflet();
var leafletPlacesView = new PruneClusterForLeaflet();

// datatables for main panel side
var deviceTable = null;
var zoneTable = null;
var placeTable = null;
var routeTable = null;
var refreshTables=false;
// options of draw
var zoneWeight = 2;
var placeWeight = 1;
var routeWeight = 3;
// polyline decorator
var routeLineWeight = 4;
var routeLineWeightDecorator = 4;
var routeLineColor = '#B0E57C';// '#00f719'; '#3388ff'; '#0080f7';
var routeLineOpacityShow = 1;
var routeLineOpacityHide = 0;
var routeLinePixelSize = 7;
var routeLineRepeat = 50;
var routeLineDash = [15, 5];

var coverPlaceOpacity = 0.2;
var coverRouteOpacity = 0.2;

// visible elements
var devicesVisible = true;
var zonesVisible = true;
var placesVisible = true;
var routesVisible = true;

// current objects
var currentMarker = null;
var currentPlace = null;
var currentRoute = null;


var RefreshDevice;
var timeOpenMenuContext=null;
var timeCloseMenuContext=null;


var MarkerPulse= new L.LayerGroup();

var buttonTraffic="hide-traffic-active";



var clickDevice=0;
var idTableDevice;
var dataDevice;
var idDeviceSelected=-1;
var markerDeviceFollow;
/**
 * INIT
 * */
var latFollow=-1;
var lngFollow=-1;
var directionFollow="";

function getVehicleState( vehicle ){

    var iconArrow = "arrow-blue.svg";
    var argb=convertToRGB(vehicle.e1);
    var  color = "rgba("+argb[0]+", "+argb[1]+", "+argb[2]+", 0.6)";
    if(vehicle.acc == '1' && vehicle.speed > 5){
        iconArrow="arrow-green.svg";
        argb=convertToRGB(vehicle.e2);
        color = "rgba("+argb[0]+", "+argb[1]+", "+argb[2]+", 0.6)";
    }
    if(vehicle.acc == '1' && vehicle.speed <= 5 ){
        iconArrow="arrow-yellow.svg";
        argb=convertToRGB(vehicle.e3);
        color = "rgba("+argb[0]+", "+argb[1]+", "+argb[2]+", 0.6)";
    }
    if(vehicle.signal == '0'){
        iconArrow= "arrow-red.svg";
        argb=convertToRGB(vehicle.e4);
        color = "rgba("+argb[0]+", "+argb[1]+", "+argb[2]+", 0.6)";
    }

    if(vehicle.signal == '-1'){
        iconArrow ="arrow-black.svg";
        argb=convertToRGB(vehicle.e5);
        color = "rgba("+argb[0]+", "+argb[1]+", "+argb[2]+", 0.6)";
    }

    return { color, iconArrow };
}

function convertToRGB(hex){
    if (!hex) return [0,0,0] // TODO check this condition
    var shex=String(hex);
    shex=shex.substring(1,shex.length);
    var aRgbHex = shex.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
}

function followMainMapDevice(){

    if(clickDevice!=0){

        dataDevice = deviceTable.row(idTableDevice).data();
        idDeviceSelected=dataDevice.id;
        const device = devices.find(d => d.id === idDeviceSelected)

        var lat=dataDevice.latitude;
        var lng=dataDevice.longitude;

        MarkerPulse.clearLayers();

        var pulsingIcon = L.icon.pulse({iconSize:[20,20],color:'#676a6c'});
        markerDeviceFollow = L.marker([lat, lng],{icon: pulsingIcon}).on('click', function(e) {
            var address=latFollow===dataDevice.latitude && lngFollow===dataDevice.longitude ? directionFollow:getGeocodeAddress(dataDevice.latitude, dataDevice.longitude);
            var ubi='<a href="http://maps.google.com/maps?q=' + dataDevice.latitude + ',' + dataDevice.longitude + '&amp;t=m" target="_blank">' + dataDevice.latitude + ',' + dataDevice.longitude + '</a>'
            var altitude=Math.round(dataDevice.altitude);
            var angle=Math.round(dataDevice.angle);
            var speed=Math.round(dataDevice.speed);
            var state=dataDevice.time_state;
            var stateLabel=dataDevice.vehicle_state;
            var odo=dataDevice.odo;
            var temp1=dataDevice.temp1;
            var temp2=dataDevice.temp2;
            var temp3=dataDevice.temp3;
            var temp4=dataDevice.temp4;
            var stateHmtl='';
            var odoHtml='';
            var temp1Html ='';
            var temp2Html ='';
            var temp3Html ='';
            var temp4Html ='';

            if (odo != ODOMETER_DEFAULT_VALUE) odoHtml = '<tr><th>'+deviceOdo+' :</th><td>' + odo + 'km<td></tr>';

            if (temp1 != TEMPERATURE_DEFAULT_VALUE) temp1Html = '<tr><th>Temperatura 1:</th><td>' + temp1 + '°C<td></tr>';

            if (temp2 != TEMPERATURE_DEFAULT_VALUE) temp2Html = '<tr><th>Temperatura 2:</th><td>' + temp2 + '°C<td></tr>';

            if (temp3 != TEMPERATURE_DEFAULT_VALUE) temp3Html = '<tr><th>Temperatura 3:</th><td>' + temp3 + '°C<td></tr>';

            if (temp4 != TEMPERATURE_DEFAULT_VALUE) temp4Html = '<tr><th>Temperatura 4:</th><td>' + temp4 + '°C<td></tr>';

            if(state!=null && state!=""){
                stateHmtl = '<tr><th>'+stateLabel+':</th><td>' + state + '<td></tr>';
            }
            let html = "" +
                "<table style='width: 100%' class=\"leaflet-popup-custom\">" +

                "<tr>" +
                "<th><strong>Equipo :</strong></th>" +
                "<td> " + dataDevice.NameElement+ "</td>" +
                "</tr>" +

                "<tr>" +
                "<th><strong>Posicion :</strong></th>" +
                "<td> " + ubi+ "</td>" +
                "</tr>" +

                "<tr>" +
                "<th><strong>Altitud :</strong></th>" +
                "<td> " + altitude + " m</td>" +
                "</tr>" +

                "<tr>" +
                "<th><strong>Angulo:</strong></th>" +
                "<td> " + angle + "° </td>" +
                "</tr>" +


                "<tr>" +
                "<th><strong>Velocidad: </strong> </th>" +
                "<td>" + speed + " kph </td>" +
                "</tr>" +

                "<tr>" +
                "<th><strong>"+deviceTimeAt+":</strong> </th>" +
                "<td>" + dataDevice.device_time_at + " </td>" +
                "</tr>" +

                "<tr>" +
                "<th><strong>"+deviceUpdatedAt+":</strong> </th>" +
                "<td>" + dataDevice.updated_at + " </td>" +
                "</tr>" +

                odoHtml+
                stateHmtl +
                temp1Html +
                temp2Html +
                temp3Html +
                temp4Html +

                "<tr>" +
                "<th><strong> Direccion </strong></th>" +
                "<td>" + address + "</td>" +
                "</tr>" +
                "</table>";

            L.popup({ maxWidth : 560})
                .setLatLng(e.latlng)
                .setContent(html)
                .openOn(map);
        });

        if (device.visible) {
            MarkerPulse.addLayer(markerDeviceFollow);
            map.addLayer(MarkerPulse);
        }

    }



}



initMapComponents();
$('.loading-modal').show();


// load map elements
function initMapComponents() {
    initMap();
}
// load datatables main panel
function initDataTables() {
    loadDevicesDatatable();
    loadEventDatatable();
    loadCmdDatatable();
    loadZonesDatatable();
    loadPlacesDatatable();
    loadRoutesDatatable();
}
// load jquery functions
function initJQuery() {
    // panel side events
    $('.sidebar-tabs > ul > li > a').click(function (e) {
        e.preventDefault();
        deviceTable.responsive.recalc();
        zoneTable.responsive.recalc();
        placeTable.responsive.recalc();
        routeTable.responsive.recalc();

        if (mapLayers.graphics.dialog !== undefined) {
            clearTimeout(mapLayers.timeouts.resizeHistory);
            mapLayers.timeouts.resizeHistory = setTimeout(resizeBottom, 500);
        }
    });

    // map events
    // popup events
    map.on('popupclose', function (e) {
        currentMarker = null;
    });
    // fullscreen events
    map.on('fullscreenchange', function () {
        if (map.isFullscreen()) {
            var h = $('.leaflet-top.leaflet-right').outerHeight();
            $('.leaflet-control-container div:first').removeClass('leaflet-top leaflet-left');
            $('.leaflet-control-container div:first').addClass('leaflet-top leaflet-right leaflet-fullscreen');
            $('.leaflet-fullscreen').css('margin-top', h + 'px');
        } else {
            $('.leaflet-control-container div:first').removeClass('leaflet-top leaflet-right leaflet-fullscreen');
            $('.leaflet-control-container div:first').addClass('leaflet-top leaflet-left');
            $('.leaflet-top.leaflet-left').css('margin-top', '0px');
        }
        setSidebarBody();
    });


    // pan to device
    $('#devices-table tbody').on('click', 'tr', function (e) {

        deviceTable.$('tr.selected').removeClass('selected');
        deviceTable.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        if(deviceTable.row(this).index()!==undefined) {
            idTableDevice = deviceTable.row(this).index();
        }
        dataDevice = deviceTable.row(idTableDevice).data();
        idDeviceSelected=dataDevice.id;
        var lat=dataDevice.latitude;
        var lng=dataDevice.longitude;
        MarkerPulse.clearLayers();
        const device = devices.find(d => d.id === idDeviceSelected)
        if (device.visible) {
            var pulsingIcon = L.icon.pulse({iconSize: [20, 20], color: '#676a6c'});
            markerDeviceFollow = L.marker([lat, lng], {icon: pulsingIcon});
            MarkerPulse.addLayer(markerDeviceFollow);
            map.addLayer(MarkerPulse);
        }
        clickDevice=1;
        if(lat==0 || lng==0){
            showToast("Aun no se han recibido datos de este dispositivo", 'Notificacion', 'info');
            return;
        }
        panToZoom(dataDevice.latitude,dataDevice.longitude, maxZoom);
    });



    $('#devices-table tbody').on('dblclick', 'tr', function (e) {
        deviceTable.$('tr.selected').removeClass('selected');
        MarkerPulse.clearLayers();
        clickDevice=0;
    });



    $('#devices-table tbody').on('change', 'input[type="checkbox"]', function () {

        var id = $(this).val();
        var device = devices.find(obj => obj.id == id);
        var marker = deviceMarkers.find(obj => obj.data.id == id);
        if (this.checked) {
            marker.data.visible = 1
            registerDeviceMarker(marker); // leafletDevicesView.RegisterMarker(maker);
            device.visible = 1;
        } else {
            marker.data.visible = 0
            removeDeviceMarker(marker); // leafletDevicesView.RemoveMarker([maker]);
            device.visible = 0;

            var el = $('#device-select-all').get(0);
            if (el && el.checked && ('indeterminate' in el)) {
                el.indeterminate = true;
            }
        }
        leafletDevicesView.ProcessView();
    });

    // pan to zone
    $('#zones-table tbody').on('click', 'tr', function (e) {
        var id = parseInt($(this).attr('id'));
        if (id > 0 && e.target.tagName == 'SPAN') {
            mapLayers.zones.eachLayer(function (layer) {
                if (layer.id == id) {
                    map.fitBounds(layer.getBounds());
                }
            });
        }
    });


    $('#zones-table tbody').on('change', 'input[type="checkbox"]', function () {
        var id = $(this).val();
        var zone = zones.find(function (obj) {
            return obj.id == id;
        });
        if (this.checked) { // checked
            loadZone(zone);
        } else { // unchecked
            mapLayers.zones.eachLayer(function (layer) {
                if (layer.id == id) {
                    mapLayers.zones.removeLayer(layer);
                    zone.visible = 0;
                }
            });

            var el = $('#zone-select-all').get(0);
            if (el && el.checked && ('indeterminate' in el)) {
                el.indeterminate = true;
            }
        }
        var name = $(this).data('name');
        collapsedGroupsZones[name] = !collapsedGroupsZones[name];
        zoneTable.draw(false);
    });


    // pan to places
    $('#places-table tbody').on('click', 'tr', function (e) {
        var id = parseInt($(this).attr('id'));
        if (id > 0) {
            let place = findPlace(id);
            if ($(e.target).hasClass('fa')) {
                panToZoom(place.position.lat, place.position.lng, maxZoom);
            } else if (e.target.tagName == 'SPAN') {
                panTo(place.position.lat, place.position.lng);
            }
        }
        var name = $(this).data('name');
        collapsedGroupsPlaces[name] = !collapsedGroupsPlaces[name];
        placeTable.draw(false);
    });



    $('#places-table tbody').on('change', 'input[type="checkbox"]', function () {
        var id = $(this).val();
        var place = places.find(obj => obj.id == id);
        var marker = placeMarkers.find(obj => obj.data.id == id);
        if (this.checked) { // checked
            leafletPlacesView.RegisterMarker(marker);
            place.visible = 1;
        } else { // unchecked
            leafletPlacesView.RemoveMarkers([marker]);
            place.visible = 0;

            var el = $('#place-select-all').get(0);
            if (el && el.checked && ('indeterminate' in el)) {
                el.indeterminate = true;
            }
        }
        leafletPlacesView.ProcessView();
    });

    // pan to route
    $('#routes-table tbody').on('click', 'tr', function (e) {
        var id = parseInt($(this).attr('id'));
        if (id > 0 && e.target.tagName == 'SPAN') {
            mapLayers.routes.eachLayer(function (layer) {
                if (layer.id == id) {
                    map.fitBounds(layer.getBounds());
                }
            });
        }
        var name = $(this).data('name');
        collapsedGroupsRoutes[name] = !collapsedGroupsRoutes[name];
        routeTable.draw(false);
    });




    $('#routes-table tbody').on('change', 'input[type="checkbox"]', function () {
        var id = $(this).val();
        var obj = routes.find(function (route) {
            return route.id == id;
        });
        if (this.checked) { // checked
            loadRoute(obj);
        } else { // unchecked
            mapLayers.routes.eachLayer(function (layer) {
                if (layer.id == id) {
                    mapLayers.routes.removeLayer(layer);
                    obj.visible = 0;
                }
            });

            var el = $('#route-select-all').get(0);
            if (el && el.checked && ('indeterminate' in el)) {
                el.indeterminate = true;
            }
        }
    });


    mapLayers.linesRoutes = new L.LayerGroup();
    mapLayers.markersRoutes = new L.LayerGroup();


}




function delayMapF() {
    var ajaxTime = new Date().getTime();

    try {
        $.ajax({
            global: false,
            type: 'GET',
            url: urlDeviceAjax,
            dataType: 'json',
            success: function (devs, status, xhr) {


                var auxMarkers = [], oldMarkers = deviceMarkers, hasNew = false;
                var size = devs.length;

                for (var i = 0; i < size; ++i) {
                    ////////////////////////////////
                    changeValueDevice(devs[i].id);
//                    debugger;
                    ////////////////////////////
                    // update device marker of map
                    var mkr = deviceMarkers.find(function (m) {
                        return m.data.idElement == devs[i].idElement;
                    });

                    if (mkr != undefined) {

                        let lat = devs[i].latitude * 1;
                        let lng = devs[i].longitude * 1;

                        var altitude=Math.round(devs[i].altitude);
                        var angle=Math.round(devs[i].angle);
                        var speed=Math.round(devs[i].speed);
                        mkr.data.dt_last_stop=devs[i].dt_last_stop;
                        mkr.data.dt_last_idle=devs[i].dt_last_idle;
                        mkr.data.dt_last_mov=devs[i].dt_last_mov;
                        mkr.data.label_state=devs[i].label_state;
                        mkr.data.time_state=devs[i].time_state;
                        mkr.data.vehicle_state=devs[i].vehicle_state;
                        mkr.data.signal=devs[i].signal;
                        mkr.data.acc=devs[i].acc;
                        mkr.data.name = devs[i].name;
                        mkr.data.altitude = altitude;
                        mkr.data.speed = speed;
                        mkr.data.angle = angle;
                        mkr.data.device_time_at = devs[i].device_time_at != null ? devs[i].device_time_at : '';
                        mkr.data.updated_at = devs[i].updated_at != null ? devs[i].updated_at : '';
                        mkr.data.image = devs[i].icon != null ? devs[i].icon : '';
                        mkr.data.original_device_time_at = devs[i].original_device_time_at;

                        if (lat != mkr.position.lat || lng != mkr.position.lng) {
                            mkr.position.lat = lat;
                            mkr.position.lng = lng;

                            if (mkr.data.route.length > pointsRouteLine) {
                                mkr.data.route.shift(); // take the first of the queue
                            }
                            if (mkr.position.lat != '0.00000000' && mkr.position.lng != '0.00000000') {
                                mkr.data.route.push([lat, lng]); // push in the queue
                            }
                        }

                        mkr.data.position = lat + '&deg;, ' + lng + '&deg;';
                        mkr.data.forceIconRedraw = true;
                        auxMarkers.push(mkr);


                    } else { // if no exists then it is new item
                        var newDev = createDeviceMarker(devs[i]);
                        devices.push(newDev);
                        deviceTable.row.add(devs[i]).draw().node();
                        hasNew = true;
                    }
                    // update device table of main side panel
                    var dTable = deviceTable.data();



                    dTable.each(function (dev) {

                        if (dev.idElement == devs[i].idElement) {

                            dev.altitude = altitude;
                            dev.angle =  angle;
                            dev.device_time_at = devs[i].device_time_at;
                            dev.updated_at = devs[i].updated_at;
                            dev.original_device_time_at = devs[i].original_device_time_at;
                            dev.time_state=devs[i].time_state;
                            dev.label_state=devs[i].label_state;
                            dev.vehicle_state=devs[i].vehicle_state;
                            dev.acc=devs[i].acc;
                            dev.ibutton=devs[i].ibutton;
                            dev.driver=devs[i].driver;
                            dev.icon = devs[i].icon;
                            dev.id = devs[i].id;
                            dev.idElement = devs[i].idElement;
                            dev.imei = devs[i].imei;
                            dev.latitude = devs[i].latitude;
                            dev.longitude = devs[i].longitude;
                            dev.name = devs[i].name;
                            dev.sim_card_number = devs[i].sim_card_number;
                            dev.speed = speed;
                            dev.state = devs[i].state;
                            dev.type = devs[i].type;
                            dev.device_time_at = devs[i].device_time_at;
                            dev.updated_at = devs[i].updated_at;
                            dev.signal = devs[i].signal;
                        }
                    });

                }


                followMainMapDevice();
                leafletDevicesView.ProcessView();
                if (!hasNew && auxMarkers.length < oldMarkers.length) {
                    let removeMarkers = oldMarkers.filter(item => !auxMarkers.includes(item));
                    removeDeviceMarker(removeMarkers);
                    leafletDevicesView.ProcessView();
                    deviceMarkers = auxMarkers;
                    deviceTable.ajax.reload();
                }
                if(refreshTables){
                    deviceTable.ajax.reload();
                    placeTable.ajax.reload();
                    routeTable.ajax.reload();
                    zoneTable.ajax.reload();
                    refreshTables=false;
                }
                var totalTime = Math.abs((new Date().getTime() - ajaxTime));
                var difTimeEjecution = 5000 - totalTime;



                if (difTimeEjecution > 0) {
                    RefreshDevice=setTimeout(delayMapF, difTimeEjecution);
                } else {
                    RefreshDevice= setTimeout(delayMapF, 6000);
                }
            },
            error: function () {
                RefreshDevice=  setTimeout(delayMapF, 6000);
            }
        });
    }
    catch (err) {
        RefreshDevice=  setTimeout(delayMapF, 6000);
    }

}

/**
 * COMMON FUNCTIONS
 * **/




function initMap() {

    map = L.map('map', {
        minZoom: minZoom,
        maxZoom: maxZoom,
        editable: editable,
        zoomControl: zoomControl
    });

    defineMapLayersV2();
    map.addLayer(mapLayers.layers[index_mapLayer]);
    map.addControl(new L.Control.Fullscreen({
        title: {
            'false': screenFullIn,
            'true': screenFullOut,
        }
    }));

    map.addControl(
        L.control.zoom({
            zoomInText: "+",
            zoomOutText: "-",
            zoomInTitle: addZoom,
            zoomOutTitle: minusZoom,
        })
    );

    // sidebar control
    map.addControl(L.control.sidebar('sidebar'));

    // add devices
    mapLayers.devicesRoutes = new L.FeatureGroup();
    mapLayers.devicesRoutes.addTo(map);
    mapLayers.devicesRoutesDecorator = new L.FeatureGroup();
    mapLayers.devicesRoutesDecorator.addTo(map);


    mapLayers.devices = createCluster('devices');
    map.addLayer(mapLayers.devices);



    // add zones
    if(privilege_geofence){
        mapLayers.zones = new L.FeatureGroup();
        mapLayers.zones.addTo(map);
    }


    // add places
    if(privilege_places) {
        mapLayers.coverPlaces = new L.FeatureGroup();
        mapLayers.coverPlaces.addTo(map);
        mapLayers.places = createCluster('places');
        map.addLayer(mapLayers.places);
    }

    // add routes
    if(privilege_places) {
        mapLayers.routes = new L.FeatureGroup();
        mapLayers.routes.addTo(map);
        mapLayers.coverRoutes = new L.FeatureGroup();
        mapLayers.coverRoutes.addTo(map);
    }

    // add toolbars
    mapLayers.toolbarControls = createToolbar();
    mapLayers.toolbarControls.addTo(map);

    if(!isMobile.any()){
        L.control.sidebar('sidebar').open('devices');
    }

}


function panToZoom(lt, lg, zoom) {
    map.setView([lt, lg], zoom);
}


function panTo(lt, lg) {
    map.panTo({
        lat: lt,
        lng: lg
    });
}


function createToolbar() {


    var ctrlHome = L.easyButton({
        states: [{
            icon: 'glyphicon glyphicon-home',
            title: ctrlHome,
            onClick: function (control) {
                map.setView([lat, lng], zoom);
            }
        }]
    });
    var ctrlDevices = L.easyButton({
        states: [{
            stateName: 'show-devices',
            icon: '<i class="control-button devices"></i>',
            title: ctrlDeviceHide,
            onClick: function (control) {
                map.removeLayer(mapLayers.devices);
                map.removeLayer(mapLayers.devicesRoutes);
                map.removeLayer(mapLayers.devicesRoutesDecorator);
                devicesVisible = false;
                control.state('hide-devices');
            }
        }, {
            stateName: 'hide-devices',
            icon: '<i class="control-button devices disabled"></i>',
            title: ctrlDeviceShow,
            onClick: function (control) {
                map.addLayer(mapLayers.devices);
                map.addLayer(mapLayers.devicesRoutes);
                map.addLayer(mapLayers.devicesRoutesDecorator);
                devicesVisible = true;
                control.state('show-devices')
            }
        }]
    });
    var ctrlMarkers = L.easyButton({
        states: [{
            stateName: 'show-places',
            icon: '<i class="control-button markers"></i>',
            title: ctrlMarkerHide,
            onClick: function (control) {
                map.removeLayer(mapLayers.places);
                placesVisible = false;
                control.state('hide-places');
            }
        }, {
            stateName: 'hide-places',
            icon: '<i class="control-button markers disabled"></i>',
            title: ctrlMarkerShow,
            onClick: function (control) {
                map.addLayer(mapLayers.places);
                placesVisible = true;
                control.state('show-places')
            }
        }]
    });
    var ctrlRoutes = L.easyButton({
        states: [{
            stateName: 'show-routes',
            icon: '<i class="control-button routes"></i>',
            title: ctrlRouteHide,
            onClick: function (control) {
                map.removeLayer(mapLayers.routes);
                routesVisible = false;
                control.state('hide-routes');
            }
        }, {
            stateName: 'hide-routes',
            icon: '<i class="control-button routes disabled"></i>',
            title: ctrlRouteShow,
            onClick: function (control) {
                map.addLayer(mapLayers.routes);
                routesVisible = true;
                control.state('show-routes')
            }
        }]
    });
    var ctrlZones = L.easyButton({
        states: [{
            stateName: 'show-zones',
            icon: '<i class="control-button zones"></i>',
            title: ctrlZoneHide,
            onClick: function (control) {
                map.removeLayer(mapLayers.zones);
                zonesVisible = false;
                control.state('hide-zones');
            }
        }, {
            stateName: 'hide-zones',
            icon: '<i class="control-button zones disabled"></i>',
            title: ctrlZoneShow,
            onClick: function (control) {
                map.addLayer(mapLayers.zones);
                zonesVisible = true;
                control.state('show-zones')
            }
        }]
    });

    var ctrlClusters = L.easyButton({
        states: [{
            stateName: 'show-clusters',
            icon: '<i class="control-button clusters"></i>',
            title: ctrlClausterHide,
            onClick: function (control) {
                //leafletDevicesView.Cluster.Size =0.00000000000000001;
                leafletDevicesView.Cluster.Size =35;
                leafletDevicesView.ProcessView();
                control.state('hide-clusters');
            }
        }, {
            stateName: 'hide-clusters',
            icon: '<i class="control-button clusters disabled"></i>',
            title: ctrlClausterShow,
            onClick: function (control) {
                leafletDevicesView.Cluster.Size =120;
                leafletDevicesView.ProcessView();
                control.state('show-clusters')
            }
        }]
    })


    var ctrlTraffic= L.easyButton({
        states: [
            {
                stateName: 'hide-traffic',
                icon: '<i class="control-button traffic disabled"></i>',
                title: ctrlTrafficShow,
                onClick: function (control) {
                    if(index_mapLayer<4 || index_mapLayer>6){
                        showToast(messageNoneTraffic, 'Notificacion', 'error');
                        return;
                    }
                    var TrafficLayer=mapLayers.layers[4];
                    TrafficLayer.addGoogleLayer('TrafficLayer');
                    var TrafficLayer=mapLayers.layers[5];
                    TrafficLayer.addGoogleLayer('TrafficLayer');
                    var TrafficLayer=mapLayers.layers[6];
                    TrafficLayer.addGoogleLayer('TrafficLayer');
                    buttonTraffic='show-traffic-active';
                    control.state('show-traffic')
                }
            },

            {
                stateName: 'show-traffic',
                icon: '<i class="control-button traffic"></i>',
                title: ctrlTrafficHide,
                onClick: function (control) {
                    var TrafficLayer=mapLayers.layers[4];
                    TrafficLayer.removeGoogleLayer('TrafficLayer');
                    var TrafficLayer=mapLayers.layers[5];
                    TrafficLayer.removeGoogleLayer('TrafficLayer');
                    var TrafficLayer=mapLayers.layers[6];
                    TrafficLayer.removeGoogleLayer('TrafficLayer');
                    buttonTraffic='hide-traffic-active';
                    control.state('hide-traffic');
                }
            }]
    });

    var tool_bar=[];

    tool_bar.push(ctrlHome);
    tool_bar.push(ctrlDevices)
    if(privilege_places){tool_bar.push(ctrlMarkers);}
    if(privilege_routes){tool_bar.push(ctrlRoutes);}
    if(privilege_geofence){tool_bar.push(ctrlZones);}
    if(privilege_read_devices){tool_bar.push(ctrlClusters)}
    if(privilege_tools){tool_bar.push(ctrlTraffic);}


    return L.easyBar(tool_bar);
}



function createCluster(type) {
    switch (type) {
        case 'devices':
            // build cluster
            PruneCluster.Cluster.ENABLE_MARKERS_LIST = true;
            // when the markers are in a cluster
            leafletDevicesView.BuildLeafletClusterIcon = function (cluster) {
                var e = new L.Icon.MarkerCluster();
                e.stats = cluster.stats;
                e.population = cluster.population;
                // hide route line
                var markers = cluster.GetClusterMarkers();
                for (var i = 0, size = markers.length; i < size; ++i) {
                    mapLayers.devicesRoutes.getLayer(markers[i].data.route_id)
                        .setStyle({opacity: routeLineOpacityHide});
                    mapLayers.devicesRoutesDecorator.getLayer(markers[i].data.decorator_id)
                        .setStyle({opacity: routeLineOpacityHide});
                }
                return e;
            };
            // build and load markers for clustering
            for (let i = 0, size = devices.length; i < size; ++i) {
                createDeviceMarker(devices[i]);
            }
            // prepare popup markers
            return prepareLeafletDeviceMarker();
        case 'places':
            // build cluster
            leafletPlacesView.BuildLeafletClusterIcon = function (cluster) {
                var e = new L.Icon.MarkerCluster();
                e.stats = cluster.stats;
                e.population = cluster.population;

                mapLayers.coverPlaces.clearLayers();

                return e;
            };
            //load markers
            for (let i = 0, size = places.length; i < size; ++i) {
                createPlaceMarker(places[i]);
            }
            //prepare popup markers
            return prepareLeafletPlaceMarker();
    }
}

/**
 * Create, Register and Push a new marker to PruneCluster and array of markers
 * @param device
 */




function createDeviceMarker(device) {
    // add route line
    var rl = new L.Polyline([[device.latitude, device.longitude], [device.latitude, device.longitude]], {
        id: device.id,
        color: routeLineColor,
        weight: routeLineWeight,
        dashArray: routeLineDash
    });



    mapLayers.devicesRoutes.addLayer(rl);



    // add route line decarator
    var rld = L.polylineDecorator(rl, {
        patterns: [
            {
                offset: 7,
                repeat: routeLineRepeat,
                symbol: L.Symbol.arrowHead({
                    pixelSize: routeLinePixelSize,
                    polygon: false,
                    pathOptions: {
                        stroke: true,
                        weight: routeLineWeightDecorator,
                        color: routeLineColor,
                        opacity: routeLineOpacityHide
                    }
                })
            }
        ]
    });




    mapLayers.devicesRoutesDecorator.addLayer(rld);
    // add marker to prunecluster
    let marker = new PruneCluster.Marker(device.latitude, device.longitude, {
        id: device.id,
        name: device.name,
        acc: device.acc,
        original_device_time_at:device.original_device_time_at,
        dt_last_stop:device.dt_last_stop,
        dt_last_idle:device.dt_last_idle,
        dt_last_mov:device.dt_last_mov,
        time_state:device.time_state,
        label_state:device.label_state,
        vehicle_state:device.vehicle_state,
        ibutton:device.ibutton,
        driver:device.driver,
        position: device.latitude + '&deg;, ' + device.longitude + '&deg;',
        address: addressLoading,
        altitude: device.altitude,
        speed: device.speed,
        angle: device.angle,
        signal: device.signal,
        device_time_at: device.device_time_at != null ? device.device_time_at : '',
        updated_at: device.updated_at != null ? device.updated_at : '',
        image: device.icon != null ? device.icon : '',
        route: [[device.latitude, device.longitude]],
        route_id: rl._leaflet_id,
        decorator_id: rld._leaflet_id,
        odo:device.odo,
        temp1:device.temp1,
        temp2:device.temp2,
        temp3:device.temp3,
        temp4:device.temp4,
        temp_sensor_enabled: device.temp_sensor_enabled,
        latitude: device.latitude,
        longitude: device.longitude,
        visible: device.visible,
        idElement: device.idElement
    });
    marker.category = 0;
    deviceMarkers.push(marker);
    leafletDevicesView.RegisterMarker(marker);

    device.visible = 1;

    return device;
}

function registerDeviceMarker(marker) {
    leafletDevicesView.RegisterMarker(marker);
    mapLayers.devicesRoutes.getLayer(marker.data.route_id)
        .setStyle({opacity: routeLineOpacityShow});
    mapLayers.devicesRoutesDecorator.getLayer(marker.data.decorator_id)
        .setStyle({opacity: routeLineOpacityShow});
}

function removeDeviceMarker(marker) {
    const markerLabel = deviceLeafletMarkers.find(m => m.id === marker.data.id);
    if (markerLabel) {
        markerLabel.unbindLabel();
    }
    if (Array.isArray(marker)) {
        for (var i = 0, size = marker.length; i < size; ++i) {
            leafletDevicesView.RemoveMarkers([marker[i]]);
            mapLayers.devicesRoutes.getLayer(marker[i].data.route_id)
                .setStyle({opacity: routeLineOpacityHide});
            mapLayers.devicesRoutesDecorator.getLayer(marker[i].data.decorator_id)
                .setStyle({opacity: routeLineOpacityHide});
        }
    } else {
        leafletDevicesView.RemoveMarkers([marker]);
        mapLayers.devicesRoutes.getLayer(marker.data.route_id)
            .setStyle({opacity: routeLineOpacityHide});
        mapLayers.devicesRoutesDecorator.getLayer(marker.data.decorator_id)
            .setStyle({opacity: routeLineOpacityHide});
    }
}

function createPlaceMarker(place) {

    var feature = $.parseJSON(place.geojson);
    let marker = new PruneCluster.Marker(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        {
            id: place.id,
            name: place.name + ' (R:' + place.geofence + 'm)',
            imgicon: place.icon,
            color: place.color,
            radius: place.geofence
        }
    );
    marker.category = 1;
    placeMarkers.push(marker);
    leafletPlacesView.RegisterMarker(marker);

    place.visible = 1;
}

/**
 * Prepare the leaflet marker of device
 */
function prepareLeafletDeviceMarker() {



    leafletDevicesView.PrepareLeafletMarker = function (leafletMarker, data) {
        var vehicleState =  getVehicleState(data);

        if(data.image==''){
            var uicon=iconUrlArrows+vehicleState.iconArrow;
        }else{
            var uicon=iconUrlDevices+data.image;
        }
        let myIcon = L.icon({
            iconUrl: uicon,
            iconSize: [26, 26],
            popupAnchor: [10, 10],
        });


        leafletMarker.setRotationAngle(data.angle);
        leafletMarker.setRotationOrigin('center center');
        leafletMarker.setIcon(myIcon);

        // update route line
        mapLayers.devicesRoutes.getLayer(data.route_id).setLatLngs(data.route).setStyle({opacity: routeLineOpacityShow});
        // update route line decorator
        if (data.route.length > 1) {
            var rr = mapLayers.devicesRoutesDecorator.getLayer(data.decorator_id);
            rr.setPaths([data.route]);
            rr.setStyle({opacity: routeLineOpacityShow});
        }

        // mouse events
        leafletMarker.on('click', function () {
            currentMarker = data.id;
        });


        var state=data.time_state;
        var stateLabel=data.vehicle_state;
        var odo=data.odo;
        var temp1=data.temp1;
        var temp2=data.temp2;
        var temp3=data.temp3;
        var temp4=data.temp4;
        var odoHtml ='';
        var temp1Html ='';
        var temp2Html ='';
        var temp3Html ='';
        var temp4Html ='';
        if(odo!=ODOMETER_DEFAULT_VALUE){
            odoHtml = '<tr><th>'+deviceOdo+':</th><td>' + odo + 'km<td></tr>';
        }
        if(data.temp_sensor_enabled){
            temp1Html = '<tr><th>'+deviceTemp1+':</th><td>' + temp1 + '°C<td></tr>';
            temp2Html = '<tr><th>'+deviceTemp2+':</th><td>' + temp2 + '°C<td></tr>';
            temp3Html = '<tr><th>'+deviceTemp3+':</th><td>' + temp3 + '°C<td></tr>';
            temp4Html = '<tr><th>'+deviceTemp4+':</th><td>' + temp4 + '°C<td></tr>';
        }

        // prepare popup content
        var lat = leafletMarker.getLatLng().lat.toFixed(6), lng = leafletMarker.getLatLng().lng.toFixed(6);
        var popup = '<table class="leaflet-popup-custom">';
        popup += '<tr><th>'+deviceDev+':</th><td><b>' + data.name + '</b><td></tr>';
        popup += '<tr><th>'+devicePosition+':</th><td><a href="https://www.google.com/maps/place/'
            + lat + '+' + lng + '/@' + lat + ',' + lng + ',12.75z"'
            + 'target="_blank">' + data.position + '</a><td></tr>';
        popup += '<tr><th>'+deviceAltitude+':</th><td>' + parseFloat(data.altitude).toFixed(0) + ' m<td></tr>';
        popup += '<tr><th>'+deviceAngle+':</th><td>' + parseFloat(data.angle).toFixed(0) + ' &deg;<td></tr>';
        popup += '<tr><th>'+deviceSpeed+':</th><td>' + parseFloat(data.speed).toFixed(0) + ' kph<td></tr>';
        popup += '<tr><th>'+deviceTimeAt+':</th><td>' + data.device_time_at + '<td></tr>';
        popup += '<tr><th>'+deviceUpdatedAt+':</th><td>' + data.updated_at + '<td></tr>';
        popup += odoHtml;
        popup += temp1Html;
        popup += temp2Html;
        popup += temp3Html;
        popup += temp4Html;
        if(state!=null && state!=""){
            popup += '<tr><th>'+stateLabel+':</th><td>' + state + '<td></tr>';
        }

        popup += '</table>';

        if (!leafletMarker.label) {
            leafletMarker.bindLabel(data.name, {noHide: true});
        }

        if (leafletMarker.getPopup()) {
            leafletMarker.setPopupContent(popup);
        } else {
            leafletMarker.bindPopup(popup, {closePopupOnClick: true});
        }
        leafletMarker.id = data.id
        deviceLeafletMarkers.push(leafletMarker);

    };
    return leafletDevicesView;
}

function prepareLeafletPlaceMarker() {
    leafletPlacesView.PrepareLeafletMarker = function (leafletMarker, data) {
        leafletMarker.setIcon(
            L.AwesomeMarkers.icon({

                icon: data.imgicon,
                prefix: 'fa',
                markerColor: 'white',
                iconColor: data.color,
                spin: false
            })
        );

        leafletMarker.on('mouseover', function () {
            if (currentPlace == null) {
                currentPlace = data.id;
                mapLayers.coverPlaces.addLayer(L.circle(leafletMarker.getLatLng(), {
                    radius: data.radius,
                    weight: 0,
                    fillOpacity: coverPlaceOpacity
                }));
            }
        });

        leafletMarker.on('mouseout', function () {
            if (currentPlace != null) {
                currentPlace = null;
                mapLayers.coverPlaces.clearLayers();
            }
        });

        leafletMarker.unbindLabel();
        leafletMarker.bindLabel(data.name);
    };
    return leafletPlacesView;
}

function loadZones() {
    for (let i = 0, size = zones.length; i < size; ++i) {
        loadZone(zones[i]);
    }
}

function loadZone(zone) {
    var lyr = null;
    L.geoJSON($.parseJSON(zone.geojson), {
        style: {color: zone.color, weight: zoneWeight},
        onEachFeature: function (feature, layer) {
            layer.id = zone.id;
            layer.unbindLabel();
            layer.bindLabel(zone.name);
            mapLayers.zones.addLayer(layer);

            lyr = layer;
        }
    });



    zone.visible = 1;
    return lyr;
}

function loadRoutes() {
    for (let i = 0, size = routes.length; i < size; ++i) {
        loadRoute(routes[i]);
    }
}

function loadRoute(route, hover = true) {
    var lyr = null;
    L.geoJSON($.parseJSON(route.geojson), {
        style: {color: route.color, weight: routeWeight},
        onEachFeature: function (feature, layer) {
            layer.id = route.id;
            layer.unbindLabel();
            layer.bindLabel(route.name);
            if (hover) {
                layer.addEventListener('mouseover', function (e) {
                    if (currentRoute == null) {
                        var options = {
                            corridor: route.geofence, // meters
                            className: 'route-corridor',
                            color: route.color,
                            opacity: coverRouteOpacity,
                            id: route.id
                        };
                        mapLayers.coverRoutes.addLayer(L.corridor(layer.getLatLngs(), options));
                        currentRoute = route.id;
                    }
                });
                layer.addEventListener('mouseout', function (e) {
                    if (currentRoute != null) {
                        mapLayers.coverRoutes.clearLayers();
                        currentRoute = null;
                    }
                });
            }
            mapLayers.routes.addLayer(layer);
            lyr = layer;
        }
    });
    route.visible = 1;
    return lyr;
}



var removeLayer;

function switchMapLayer(val) {
    map.addLayer(mapLayers.layers[val]);
    removeLayer = index_mapLayer;
    index_mapLayer = val;
    setTimeout(removeLayerMap, 1000)

}

function removeLayerMap() {
    map.removeLayer(mapLayers.layers[removeLayer]);
}


function defineMapLayersV2() {

    var map_bing_key = "AqvR08UH6bIkQztTIbudVPZZkkxPQ-SRJmjHMfrLZHKoPXDJ4JJ40wZfxkGo4K2O";
    var map_google_key = "AIzaSyCfz2cwCOSQ4SxYM75yHpi1SbgsvzhZ08I";
    var map_mapbox_key = "pk.eyJ1IjoiaWN1ZWxsYXIiLCJhIjoiY2l6c2hhaDN3MDNmMzJ4cWd4aWY4d29tcCJ9.jVneQPCSXHTXiWunyfIZ7w";
    // OpenStreet Map
    var osm = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    // Bing Map
    var broad = new L.BingLayer(map_bing_key, {type: 'Road'});
    var baer = new L.BingLayer(map_bing_key, {type: 'Aerial'});
    var bhyb = new L.BingLayer(map_bing_key, {type: 'AerialWithLabels'});


    // Google Map

    var gmap = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'roadmap'
    });


    var gsat = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'satellite'
    });
    var ghyb = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'hybrid'
    });
    var gter = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'terrain'
    });


    // Mapbox
    L.mapbox.accessToken = map_mapbox_key;
    var mbmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
        attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    var mbsat = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
        attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    // Yandex
    var yandex = new L.Yandex();


    mapLayers.baseMaps = {
        'OMS Map': osm,
        'Bing Road': broad,
        'Bing Aerial': baer,
        'Bing Hybrid': bhyb,
        'Google Streets': gmap,
        'Google Hybrid': ghyb,
        'Google Terrain': gter,
        'Google Satellite': gsat,
        'Mapbox Streets': mbmap,
        'Mapbox Satellite': mbsat,
        'Yandex': yandex,
    };


    mapLayers.layers = {
        '0': osm,
        '1': broad,
        '2': baer,
        '3': bhyb,
        '4': gmap,
        '5': ghyb,
        '6': gter,
        '7': gsat,
        '8': mbmap,
        '9': mbsat,
        '10': yandex,
    };



    var selectLayer = '<div class="map-layer-control">' +
        '<div class="row4">' +
        '<div class="margin-left-3"><select id="map_layer" style="height: 25px"  onchange="switchMapLayer($(this).val());">'
    $.ajax({
        headers: '',
        global: false,
        async: false,
        type: 'GET',
        url: typesMapRoute,
        dataType: 'json',
    }).done(function (data, textStatus, jqXHR) {
        var size = data.length;
        var i=0;
        data.forEach(function(dataNames) {
            selectLayer=selectLayer+'<option value="'+dataNames.id+'">'+dataNames.name+'</option>'
            i=i+1;
        });
    });
    selectLayer=selectLayer + '</select> </div></div></div>'

    var  customControl = L.control.custom({
        position: 'topright',
        content: selectLayer,
        classes: '',

    });




    map.addControl(customControl)



}



// geocode google
function getGeocodeAddress(lat, lng) {
    var address = '';

    $.ajax({
        headers: '',
        global: false,
        async: false,
        type: 'GET',
        url: geocoderRoute,
        data: {lat:lat,lng:lng},
        dataType: 'json',
    }).done(function (data, textStatus, jqXHR) {
        address = data;
    });

    return address;
}

function findDevice(id) {
    for (var i = 0, size = deviceMarkers.length; i < size; ++i) {
        if (deviceMarkers[i].data.id == id) {
            return deviceMarkers[i];
        }
    }
    return null;
}

function findPlace(id) {
    for (var i = 0, size = placeMarkers.length; i < size; ++i) {
        if (placeMarkers[i].data.id == id) {
            return placeMarkers[i];
        }
    }
    return null;
}

$(document).ready(function(){

    $('#example').DataTable();

    $('#time').val(null).trigger('change');
    $('#select_gps').val(null).trigger('change');


    $( "#time" ).change(function() {
        fechaIF();
    });


    $( "#time" ).blur(function() {
        fechaIF();
    });


    $( "#select_gps" ).change(function() {
        $('#time').val(0).trigger('change');
        document.getElementById('time_begin').value="";
        document.getElementById('time_end').value="";
        MinDateHistory();
    });




});




map.on('load', onMapLoad).setView([lat, lng], zoom);
function onMapLoad(){

    if( isMobile.any()){
        leafletDevicesView.Cluster.Size =200;
        leafletDevicesView.ProcessView();
    }



    initDataTables();
    initJQuery();
    loadZones();
    loadRoutes();
    $('.loading-modal').hide();



    setTimeout(delayMapF,6000)






}



function modalCoords(){

    var id=-1;
    var modal = '<div id="dialog_'+id+'" title="'+coordsDialog+'" class="dialog container">' +

        ' <label  for="">'+latCoords+'</label>  <input class="form-control" id="LatitudeCoords"   type="number" step="any"><br>'+
        ' <label  for="">'+lngCoords+'</label>  <input class="form-control" id="LongitudeCoords"  type="number" step="any">'+
        '<center>' +
        '<button style="margin-top: 15px" class="btn btn-default" type="button" onclick="utilsShowPoint();" > <i class="fa fa-eye"></i> </button>' +
        '</center>'+
        '</div>'


    $("#Dialogs").append(modal);

    $("#dialog_"+id).dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },

        position: {
            my: "center top",
            at: "center top",
            of: $("#map")
        },

        height: 250,
        width: 300,
        resizable: false,
        id: id

    });



    $("#dialog_"+id).dialog("open");
}


function utilsShowPoint(){
    var  LatitudeCoords=$('#LatitudeCoords').val();
    var  LongitudeCoords=$('#LongitudeCoords').val();

    if(LatitudeCoords.length==0 || LongitudeCoords.length==0){
        return;
    }
    map.setView([LatitudeCoords,LongitudeCoords])
}


function centerMap(){
    map.setView([lat, lng], zoom);
}




var clickRule = 0;
var drawnRouteItems = new L.FeatureGroup();
var utilsRulerData = new Array;

// color picker
var colorPolyline = '#0033ff';
var colorpickerRoute = $('#color-route-create').colorpicker({
    color: colorPolyline,
    format: "hex",
    colorSelectors: {
        'black': '#000000',
        'white': '#ffffff',
        'red': '#FF0000',
        'default': '#777777',
        'primary': '#337ab7',
        'success': '#5cb85c',
        'info': '#5bc0de',
        'warning': '#f0ad4e',
        'danger': '#d9534f'
    }
});


var polylineDrawHandler = new L.Draw.Polyline(map, {
    shapeOptions: {color: colorPolyline, weight: routeWeight},
    feet: false
});

var layer;
var modeRule = 0;

function utilsRule() {

    if ($('a.btn-cancel.create')) {
        $('a.btn-cancel.create').click();
    }

    if ($('a.btn-cancel.edit')) {
        $('a.btn-cancel.edit').click();
    }


    resetActionRuleZone();
    modeRule = 1;
    controlRule = 1;
    // draw feature polyline on map
    var DIAM_MIN = 5; // constant value
    var DIAM_MAX = 1000; // constant value
    var diameter = DIAM_MIN;


    L.drawLocal.draw.handlers.polyline.tooltip.start = ruleLine;

    polylineDrawHandler.enable();

    var coverPolyline = null;

    // on create draw
    map.on(L.Draw.Event.CREATED, function (e) {

        layer = e.layer;
        drawnRouteItems.clearLayers();
        if (layer instanceof L.Polyline && controlRule != 0) {
            // add corredor
            var options = {
                corridor: diameter, // meters
                className: 'route-corridor',
                color: colorPolyline,
                opacity: coverRouteOpacity,
            };
            coverPolyline = L.corridor(layer.getLatLngs(), options);
            drawnRouteItems.addLayer(coverPolyline);

            layer.setStyle({color: colorPolyline});
            layer.editing.enable();
            layer.addTo(map);
            layer.showMeasurements();

            layer.on('edit', function () {
                map.removeLayer(layer)

                layer.addTo(map)
                    .showMeasurements();
            });


        }
    });


    if (modeRule == 1) {


        if (clickRule != 0) {
            resetActionRule();
        } else {
            clickRule++;
        }


    }


}


function processRule(LatsLngs) {
    var arrayCoords = [];
    for (var i = 0; i < LatsLngs.length - 1; i++) {
        var lat = LatsLngs[i].lat;
        var lng = LatsLngs[i].lng;
        arrayCoords.push([lat, lng]);
    }
    return arrayCoords;
}

var drawnZoneItems = new L.FeatureGroup();
map.addLayer(drawnZoneItems)
var colorDraw = '#676a6c';
var polygonDrawHandler = new L.Draw.Polygon(map, {shapeOptions: {color: colorDraw, weight: zoneWeight}});
var polygon;

var clickRuleZone = 0;
var modeRuleZone = 0;
var polygon;


function utilsRuleZone() {

    L.drawLocal.draw.handlers.polygon.tooltip.start = ruleZone1;
    L.drawLocal.draw.handlers.polygon.tooltip.cont = ruleZone2;
    L.drawLocal.draw.handlers.polygon.tooltip.end = ruleZone3;

    if ($('a.btn-cancel.create')) {
        $('a.btn-cancel.create').click();
    }

    if ($('a.btn-cancel.edit')) {
        $('a.btn-cancel.edit').click();
    }


    resetActionRule()
    drawnZoneItems.clearLayers();
    modeRuleZone = 1;
    controlRuleZone = 1;
    // Start drawing
    polygonDrawHandler.enable();


    map.on(L.Draw.Event.CREATED, function (e) {
        drawnZoneItems.clearLayers()
        var layer = e.layer;

        if (layer instanceof L.Polygon && clickRuleZone != 0) {

            layer.setStyle({color: colorDraw});


            var coords = processGeoFormLayer(layer.getLatLngs()[0])
            polygon = L.polygon(coords);
            drawnZoneItems.addLayer(layer);
            drawnZoneItems.addLayer(polygon);
            polygon.editing.enable()
            polygon.showMeasurements();


            polygon.on('edit', function () {
                drawnZoneItems.clearLayers();
                drawnZoneItems.addLayer(polygon);
                polygon.showMeasurements();
            });


        }
    });


    if (clickRuleZone != 0) {
        resetActionRuleZone()
    } else {
        clickRuleZone++;
    }


}


function processGeoFormLayer(LatLngs) {
    var arrayCoords = [];
    LatLngs.forEach(function (row) {

        arrayCoords.push([row.lat, row.lng])
    })


    return [arrayCoords];
}


function deleteLastPoint() {
    polylineDrawHandler.deleteLastVertex();
}


function deletePointPolygon() {
    polygonDrawHandler.deleteLastVertex();
}


function utilsArea(layer) {
    var t;
    var s;
    if (layer.getLatLngs()[0].length > 3) {
        var e = getAreaFromLatLngs(layer.getLatLngs()[0]);
        if (true) {
            t = 1e-6 * e;
            t = Math.round(100 * t) / 100, t = t + " km2"
        } else {
            t = 1e-6 * e * .386102;
            t = Math.round(100 * t) / 100, t = t + " millas"
        }
        var a = 1e-4 * e;
        a = Math.round(100 * a) / 100, a = a + " hectareas";
        s = t + "</br>" + a,
            o = layer.getBounds().getCenter();

    }
    return s;
}


function getAreaFromLatLngs(latlngs) {

    var pointsCount = latlngs.length,
        area = 0.0,
        d2r = 0.017453292519943295,
        p1, p2;


    if (pointsCount > 2) {
        for (var i = 0; i < pointsCount; i++) {
            p1 = latlngs[i];
            p2 = latlngs[(i + 1) % pointsCount];
            area += ((p2.lng - p1.lng) * d2r) *
                (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
        }
        area = area * 6378137.0 * 6378137.0 / 2.0;
    }

    return Math.abs(area); // sq meters
}


function resetActionRule() {
    polylineDrawHandler.disable();
    clickRule = 0;
    controlRule = 0;
    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    }

    modeRule = 0;
}


function resetActionRuleZone() {
    polygonDrawHandler.disable();
    clickRuleZone = 0;
    controlRule = 0;
    drawnZoneItems.clearLayers();
    modeRule = 0;
}


function deleteLastPointRoute() {
    polylineDrawHandler.deleteLastVertex();
}


function deletePointPolygon() {
    polygonDrawHandler.deleteLastVertex();
}

function CompanyModal() {


    var idModal=-9;
    var modal = '<div id="dialog_' + idModal + '" title="'+companyName+'" class="dialog" >' +
        '<iframe scrolling="yes"  id="frame_' + idModal +'" src="'+companyRouteMap+'"></iframe>'+ '</div>'

    var height= $(window).height()-100;
    var width= 1010;

    if( isMobile.any()){
        height=$(window).height()-2;
        width=$(window).width()-8;
        modal = '<div id="dialog_' + idModal + '" title="Empresa" class="dialog">' +
            '<iframe  id="frame_' + idModal +'" src="'+companyRouteMap+'"></iframe>'+ '</div>'
    }


    $("#Dialogs").append(modal);


    $("#dialog_"+idModal).dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },

        position: {
            my: "center top",
            at: "center top",
            of: $("#topNavMap")
        },

        height: height,
        width: width,

        id: idModal,
        resizable: true,
    });
    $("#dialog_" + idModal).dialog("open");


    $('#ButtonTopNav').click();

}

function ReportModal() {

    var idModal=-2;
    var modal = '<div id="dialog_' + idModal + '" title="Reportes" class="dialog" style="style="overflow-y: hidden;"">' +
        '<iframe  scrolling="no" id="frame_' + idModal +'" src="'+reportRouteMap+'"></iframe>'+ '</div>'

    var height= $(window).height()-50;
    var width= 810;

    if( isMobile.any()){
        height=$(window).height()-2;
        width=$(window).width()-8;
        modal = '<div id="dialog_' + idModal + '" title="Reportes" class="dialog">' +
            '<iframe  id="frame_' + idModal +'" src="'+reportRouteMap+'"></iframe>'+ '</div>'
    }


    $("#Dialogs").append(modal);


    $("#dialog_"+idModal).dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },

        position: {
            my: "center top",
            at: "center top",
            of: $("#topNavMap")
        },

        height: height,
        width: width,

        id: idModal,
        resizable: false,
        beforeClose:function (event,ui) {
            document.getElementById("frame_"+idModal).contentDocument.location.reload(true);
        }
    });
    $("#dialog_" + idModal).dialog("open");


    $('#ButtonTopNav').click();

}

function BasicDriverModal(){

    var idModal=-7;


    var modal = '<div id="dialog_' + idModal + '" title="Conductores" class="dialog" style="style="overflow-y: hidden;"">' +
        '<iframe  scrolling="yes" id="frame_' + idModal +'" src="'+driverRouteMap+'"></iframe>'+ '</div>'

    var height= $(window).height()-50;
    var width= 810;

    if( isMobile.any()){
        height=$(window).height()-2;
        width=$(window).width()-8;
        modal = '<div id="dialog_' + idModal + '" title="Conductores" class="dialog">' +
            '<iframe  id="frame_' + idModal +'" src="'+userRouteMap+'"></iframe>'+ '</div>'
    }


    $("#Dialogs").append(modal);


    $("#dialog_"+idModal).dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },

        position: {
            my: "center top",
            at: "center top",
            of: $("#topNavMap")
        },

        height: height,
        width: width,
        id: idModal,
        resizable: false,
    });
    $("#dialog_" + idModal).dialog("open");


    $('#ButtonTopNav').click();


}

function BasicUserModal() {

    var idModal=-5;


    var modal = '<div id="dialog_' + idModal + '" title="Usuarios" class="dialog" style="style="overflow-y: hidden;"">' +
        '<iframe  scrolling="yes" id="frame_' + idModal +'" src="'+userRouteMap+'"></iframe>'+ '</div>'

    var height= $(window).height()-50;
    var width= $(window).width()-300;

    if( isMobile.any()){
        height=$(window).height()-2;
        width=$(window).width()-8;
        modal = '<div id="dialog_' + idModal + '" title="Usuarios" class="dialog">' +
            '<iframe  id="frame_' + idModal +'" src="'+userRouteMap+'"></iframe>'+ '</div>'
    }


    $("#Dialogs").append(modal);


    $("#dialog_"+idModal).dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },

        position: {
            my: "center top",
            at: "center top",
            of: $("#topNavMap")
        },

        height: height,
        width: width,
        id: idModal,
        resizable: false,
    });
    $("#dialog_" + idModal).dialog("open");


    $('#ButtonTopNav').click();

}
function BasicLocalGroupModal() {

    var idModal=-4;


    var modal = '<div id="dialog_' + idModal + '" title="Grupos" class="dialog" style="style="overflow-y: hidden;"">' +
        '<iframe  scrolling="yes" id="frame_' + idModal +'" src="'+localGroupMap+'"></iframe>'+ '</div>'

    var height= $(window).height()-50;
    var width= $(window).width()-300;

    if( isMobile.any()){
        height=$(window).height()-2;
        width=$(window).width()-8;
        modal = '<div id="dialog_' + idModal + '" title="Grupos" class="dialog">' +
            '<iframe  id="frame_' + idModal +'" src="'+localGroupMap+'"></iframe>'+ '</div>'
    }


    $("#Dialogs").append(modal);


    $("#dialog_"+idModal).dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },

        position: {
            my: "center top",
            at: "center top",
            of: $("#topNavMap")
        },

        height: height,
        width: width,
        id: idModal,
        resizable: false,
        beforeClose:function (event,ui) {
            refreshTables=true;
        }
    });

    $("#dialog_" + idModal).dialog("open");


    $('#ButtonTopNav').click();

}

function BasicEventModal() {

    var idModal= -6;


    var modal = '<div id="dialog_' + idModal + '" title="Eventos" class="dialog" style="style="overflow-y: hidden;"">' +
        '<iframe  scrolling="yes" id="frame_' + idModal +'" src="'+eventRouteMap+'"></iframe>'+ '</div>'

    var height= $(window).height()-50;
    var width= 810;

    if( isMobile.any()){
        height=$(window).height()-2;
        width=$(window).width()-8;
        modal = '<div id="dialog_' + idModal + '" title="Eventos" class="dialog">' +
            '<iframe  id="frame_' + idModal +'" src="'+eventRouteMap+'"></iframe>'+ '</div>'
    }


    $("#Dialogs").append(modal);


    $("#dialog_"+idModal).dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },

        position: {
            my: "center top",
            at: "center top",
            of: $("#topNavMap")
        },

        height: height,
        width: width,
        id: idModal,
        resizable: false,
    });
    $("#dialog_" + idModal).dialog("open");


    $('#ButtonTopNav').click();

}





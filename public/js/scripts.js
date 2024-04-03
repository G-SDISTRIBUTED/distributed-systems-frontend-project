/**
 * Created by empresa on 4/17/2017.
 */
var modalShowScripts = true;
function ajaxLoading() {
    $(document).on({
        ajaxStart: function () {
            if(modalShowScripts){
                $('.loading-modal').show();
            }
        },
        ajaxStop: function () {
            if(modalShowScripts) {
                $('.loading-modal').hide();
            }
        }
    });
}
/**
 * Get current time
 * @returns {*|number}
 */
function getTimeNow() {
    return performance.now();
}

/**
 *
 * @param title
 * @param message
 * @param type [success, info, warning, danger, error]
 */
function showToast(title, message, type) {
    type = type || 'success';
    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 4000
    };
    toastr[type](title, message);
}



function zoomMap(lat,lon,description,date,device){

    var position='<a href="http://maps.google.com/maps?q=' + lat + ',' + lon + '&amp;t=m" target="_blank"> ' + lat + ',' + lon + ' </a>';

    var template = '<table >' +
        '<tbody>' +
        '<tr><th><strong>Equipo: </strong></th><td> <strong> '+device+' </strong> </td></tr>' +
        '<tr> <th><strong>Zona: </strong></th>  <td> <strong> '+description+' </strong> </td></tr>' +
        '<tr><th><strong>Posicion: </strong></th><td> '+position+ '</td></tr>' +
        '<tr><th><strong>Tiempo: </strong></th><td> '+date+'</td></tr>' +
        '</tbody>' +
        '</table>';


    var popup = L.popup()
        .setLatLng([lat, lon])
        .setContent(template)
        .openOn(map);
    map.setView([lat, lon], 1000);


}

function showToastEvent(notification,type){
    var template = '<table><tbody><tr><td><strong>Detalle:</strong></td><td>'+notification.GeographicalName+'</td></tr><tr><td><strong>Posicion:</strong></td><td>'+notification.Latitude+','+notification.Longitude+ '</td></tr><tr><td><strong>Tiempo:</strong></td><td>'+notification.EventDate+'</td></tr></tbody></table>';
    type = type || 'success';
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "0",
        "hideDuration": "1000",
        "timeOut": 0,
        "extendedTimeOut": 0,
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false,
    }
    toastr[type](template,notification.EventName);
}

function showToastEventMap(notification,type) {

    var position='<a href="http://maps.google.com/maps?q=' + notification.Latitude + ',' + notification.Longitude + '&amp;t=m" target="_blank"> ' + notification.Latitude + ',' + notification.Longitude + ' </a>';

    var template = '<table >' +
        '<tbody>' +
        '<tr><th><strong>Equipo: </strong></th><td> <strong> '+notification.Device+' </strong> </td></tr>' +
        '<tr><th><strong>Zona: </strong></th><td> <strong> '+notification.GeographicalName+' </strong> </td></tr>' +
        '<tr><th><strong>Posicion: </strong></th><td> '+position+ '</td></tr>' +
        '<tr><th><strong>Tiempo: </strong></th><td> '+notification.EventDate+'</td></tr>' +
        '</tbody>' +
        '</table>';


    type = type || 'success';
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "0",
        "hideDuration": "1000",
        "timeOut": 0,
        "extendedTimeOut": 0,
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false,
    }

    var ff='zoomMap('+notification.Latitude+','+notification.Longitude+',"'+notification.GeographicalName+'","'+notification.EventDate+'","'+notification.Device+'")';

    var fun="onclick='"+ff+"'";

    toastr[type](template+'<button '+fun+' type="button" class="btn btn-default">Detalles</button>',notification.EventName);

  //  eventTable.ajax.reload();


}





// math
// Truncate value based on number of decimals
var _round = function (num, len) {
    return Math.round(num * (Math.pow(10, len))) / (Math.pow(10, len));
};

/**
 * Resize map height
 */
function setMapHeight() {
    var w_height = $(window).height();
    var topmenubar = $('.top-menu-bar').outerHeight();
    var map_height = w_height - topmenubar;
    $('#map').height(map_height);

}

/**
 *
 * @param container
 * @param element
 */
function setCenterVertically(container, element) {
    var a = $(container).height();
    var b = $(element).outerHeight();
    $(element).css('padding-top', ((a - b) / 2) + 'px')
}

function setSidebarBody() {
    var sidebar_header = $('.sidebar-header').outerHeight();
    var sidebar_content = $('.sidebar-content').outerHeight();
    var sidebar_body = sidebar_content - sidebar_header;
    $('.sidebar-body').height(sidebar_body).css('padding', '10px');

    $('.sidebar-body').slimScroll({
        height: sidebar_body.toString() + 'px'
    });
}

function checkDirtyForm() {
    $('.sidebar-tabs > ul > li > a, .sidebar-content .sidebar-close').click(function (ev) {
        if ($('form').dirtyForms('isDirty')) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
        }
    });
}

/**
 * Capitalize first letter of text
 * @param text
 * @returns {string}
 */
function capitalizeString(text) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}
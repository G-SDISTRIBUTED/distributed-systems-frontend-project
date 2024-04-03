$("#KML_EXPORT").click(function () {

    var selec_gps = $("#select_gps").val();
    var name = $("#select2-select_gps-container").attr('title');
    var time_begin = $("#time_begin").val();
    var time_finish = $("#time_end").val();
    var time_wait = $("#stt").val();
    var format = "kml";


    if (time_begin == "") {
        showToast(msgh1, 'Notificacion', 'error');
        return;
    }
    if (time_finish == "") {
        showToast(msgh1, 'Notificacion', 'error');
        return;
    }



    $.ajaxSetup({headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}});
    $.ajax({
        dataType: 'json',
        type: 'POST',
        url: msgh2,
        data:
            {
                idVehicle: selec_gps, tb: time_begin, tf: time_finish, tw: time_wait, name: name, format: format

            },

        success: function (data) {

            location.href = data.url;

        },

        complete: function (data) {

        },


        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }


    })


});


$("#GPX_EXPORT").click(function () {

    var selec_gps = $("#select_gps").val();
    var name = $("#select2-select_gps-container").attr('title');
    var time_begin = $("#time_begin").val();
    var time_finish = $("#time_end").val();
    var time_wait = $("#stt").val();
    var format = "gpx";


    if (time_begin == "") {
        showToast(msgh1, 'Notificacion', 'error');
        return;
    }
    if (time_finish == "") {
        showToast(msgh1, 'Notificacion', 'error');
        return;
    }


    $.ajaxSetup({headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}});
    $.ajax({
        dataType: 'json',
        type: 'POST',
        url: msgh2,
        data:
            {
                idVehicle: selec_gps, tb: time_begin, tf: time_finish, tw: time_wait, name: name, format: format

            },

        success: function (data) {

            location.href = data.url;

        },

        complete: function (data) {

        },


        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
            console.log(textStatus)
            console.log(errorThrown)
        }


    })


});


$("#CSV_EXPORT").click(function () {

    var selec_gps = $("#select_gps").val();
    var name = $("#select2-select_gps-container").attr('title');
    var time_begin = $("#time_begin").val();
    var time_finish = $("#time_end").val();
    var time_wait = $("#stt").val();
    var format = "csv";


    if (time_begin == "") {
        showToast(msgh1, 'Notificacion', 'error');
        return;
    }
    if (time_finish == "") {
        showToast(msgh1, 'Notificacion', 'error');
        return;
    }


    $.ajaxSetup({headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}});
    $.ajax({
        dataType: 'json',
        type: 'POST',
        url: msgh2,
        data:
            {
                idVehicle: selec_gps, tb: time_begin, tf: time_finish, tw: time_wait, name: name, format: format

            },

        success: function (data) {

            location.href = data.url;

        },

        complete: function (data) {

        },


        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
            console.log(textStatus)
            console.log(errorThrown)
        }


    })


});


$("#GSR_EXPORT").click(function () {

    var selec_gps = $("#select_gps").val();
    var name = $("#select2-select_gps-container").attr('title');
    var time_begin = $("#time_begin").val();
    var time_finish = $("#time_end").val();
    var time_wait = $("#stt").val();
    var format = "gsr";


    if (time_begin == "") {
        showToast(msgh1, 'Notificacion', 'error');
        return;
    }
    if (time_finish == "") {
        showToast(msgh1, 'Notificacion', 'error');
        return;
    }


    $.ajaxSetup({headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}});
    $.ajax({
        dataType: 'json',
        type: 'POST',
        url: msgh2,
        data:
            {
                idVehicle: selec_gps, tb: time_begin, tf: time_finish, tw: time_wait, name: name, format: format

            },

        success: function (data) {
            var url = data.url;
            $('#DownloadGSR').attr('href', data.url);
            var lnk = document.getElementById('DownloadGSR');
            if (lnk) {
                lnk.click();
            }
        },
        complete: function (data) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
            console.log(textStatus)
            console.log(errorThrown)
        }
    })


});
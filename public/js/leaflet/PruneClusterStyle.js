/**
 * Created by empresa on 5/27/2017.
 */
var colors = ['#ff4b00', '#bac900', '#EC1813', '#55BCBE', '#D2204C', '#FF0000', '#ada59a', '#3e647e'];
var pi2 = Math.PI * 2;

L.Icon.MarkerCluster = L.Icon.extend({
    options: {
        iconSize: new L.Point(44, 44),
        className: 'prunecluster leaflet-markercluster-icon'
    },

    createIcon: function () {
        // based on L.Icon.Canvas from shramov/leaflet-plugins (BSD licence)
        var e = document.createElement('canvas');
        this._setIconStyles(e, 'icon');
        var s = this.options.iconSize;
        e.width = s.x;
        e.height = s.y;
        this.draw(e.getContext('2d'), s.x, s.y);
        return e;
    },

    createShadow: function () {
        return null;
    },

    draw: function (canvas, width, height) {
        var lol = 0;
        var start = 0;
        for (var i = 0, l = colors.length; i < l; ++i) {
            var size = this.stats[i] / this.population;
            if (size > 0) {
                canvas.beginPath();
                canvas.moveTo(22, 22);
                canvas.fillStyle = colors[i];
                var from = start + 0.14, to = start + size * pi2;
                if (to < from) {
                    from = start;
                }
                canvas.arc(22, 22, 22, from, to);
                start = start + size * pi2;
                canvas.lineTo(22, 22);
                canvas.fill();
                canvas.closePath();
            }
        }
        canvas.beginPath();
        canvas.fillStyle = 'white';
        canvas.arc(22, 22, 18, 0, Math.PI * 2);
        canvas.fill();
        canvas.closePath();
        canvas.fillStyle = '#555';
        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';
        canvas.font = 'bold 12px sans-serif';

        canvas.fillText(this.population, 22, 22, 40);
    }
});

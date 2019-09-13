/**
 * Created by zac on 17-6-20.
 */
$(document).ready(function () {
    var hit = 0;
    var images = [
        'R01427633.jpg',
        'R01442521.jpg',
        'R01586924.jpg',
        'R01769494.jpg',
        'R01812637.jpg',
        'R01841463.jpg',
        'R01872011.jpg',
        'R01876153.jpg',
        'R01911693.jpg',
        'R01924098.jpg',
        // 'R01968407.jpg',
        // 'R01970771.jpg',
        // 'R01975914.jpg',
        // 'R01976356.jpg',
        // 'R02035305.jpg',
        // 'R02039941.jpg',
        // 'R02059281.jpg',
        // 'R02064703.jpg',
        // 'R02085621.jpg',
        // 'R02175885.jpg',
        // 'R02177296.jpg',
        // 'R02223641.jpg',
        // 'R02252523.jpg'
    ];
    var originalWidth;
    var originalHeight;
    var currentFraction = 1;
    var coords = {
        0: {xmin: 398, ymin: 1224, xmax: 758, ymax: 1560},
        1: {xmin: 907, ymin: 988, xmax: 1253, ymax: 1293},
        2: {xmin: 876, ymin: 932, xmax: 1156, ymax: 1170},
        3: {xmin: 396, ymin: 1802, xmax: 559, ymax: 1981},
        4: {xmin: 800, ymin: 728, xmax: 1042, ymax: 924},
        5: {xmin: 1179, ymin: 1071, xmax: 1379, ymax: 1300},
        6: {xmin: 771, ymin: 600, xmax: 974, ymax: 804},
        7: {xmin: 603, ymin: 1434, xmax: 769, ymax: 1601},
        8: {xmin: 763, ymin: 1219, xmax: 967, ymax: 1394},
        9: {xmin: 700, ymin: 1268, xmax: 956, ymax: 1528},
        10: {xmin: 1149, ymin: 1946, xmax: 1358, ymax: 2163},
        // 11: { xmin: 967, ymin: 677, xmax: 1111, ymax: 837 },
        // 12: { xmin: 1955, ymin: 1676, xmax: 2255, ymax: 1947 },
        // 13: { xmin: 736, ymin: 1229, xmax: 1145, ymax: 1654 },
        // 14: { xmin: 1707, ymin: 1345, xmax: 2052, ymax: 1804 },
        // 15: { xmin: 1966, ymin: 1701, xmax: 2271, ymax: 2001 },
        // 16: { xmin: 1837, ymin: 1013, xmax: 2008, ymax: 1184 },
        // 17: { xmin: 1849, ymin: 1707, xmax: 2233, ymax: 2111 },
        // 18: { xmin: 439, ymin: 1522, xmax: 785, ymax: 1876 },
        // 19: { xmin: 1092, ymin: 556, xmax: 1363, ymax: 823 },
        // 20: { xmin: 1899, ymin: 524, xmax: 2141, ymax: 761 },
        // 21: { xmin: 1783, ymin: 823, xmax: 2070, ymax: 1106 },
        // 22: { xmin: 527, ymin: 1315, xmax: 697, ymax: 1478 }
    };
    var count = 0;
    // $("#infoSlider").text('100%').text('100%');
    function updateCoords(fraction) {
        for (i in coords) {
            coords[i]['xmin'] /= currentFraction;
            coords[i]['ymin'] /= currentFraction;
            coords[i]['xmax'] /= currentFraction;
            coords[i]['ymax'] /= currentFraction;
            coords[i]['xmin'] *= fraction;
            coords[i]['ymin'] *= fraction;
            coords[i]['xmax'] *= fraction;
            coords[i]['ymax'] *= fraction;
        }
        currentFraction = fraction;
    }

    $("#slider").slider({
        value: 0,
        min: -95,
        max: 0,
        step: 5,
        orientation: 'vertical',
        slide: function (event, ui) {
            var fraction = (1 + ui.value / 100),
                newWidth = originalWidth * fraction,
                newHeight = originalHeight * fraction;
            // $("#infoSlider").text('Zoom: ' + Math.floor(fraction * 100) + '%');
            $("#image").width(newWidth).height(newHeight);
            $("#myCanvas").width(newWidth).height(newHeight);
            updateCoords(fraction)
        }
    });
    $('#drag').draggable();
    var getNextImage = function () {
        $('#wrapper').css('display','none');
        var $body = $('body');
        $body.append("<div id='loader'><h2 style='display: block; margin: auto; text-align: center'>Loading...</h2><img src='/resource/2.gif' style='display: block; margin:auto'/></div>");
        if (images.length > 0) {
            // $("#infoSlider").text('Zoom: 100%');
            $('#image').attr('src', '/resource/' + images.shift()).on('load', function () {
                $('#loader').remove();

                $('#wrapper').css('display', 'block');
                $("#image").width(originalWidth).height(originalHeight);
                $("#myCanvas").width(originalWidth).height(originalHeight);
                originalWidth = $(this).width();
                originalHeight = $(this).height();
            });
            updateCoords(1);
            if (paper.project) {
                paper.project.activeLayer.removeChildren();
                paper.view.draw();
            }
            count++;
        } else {
            swal({
                title: 'Your final score: ' + hit,
                width: 600,
                padding: 100,
                background: '#fff url(//bit.ly/1Nqn9HU)'
            }).then(function () {
                $.ajax({
                    url: '/score',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        scorebuttons: hit
                    }),
                    dataType: 'json',
                    success: function (data) {
                        if (data.result === 'success') {
                            console.log('score sent')
                        }
                    },
                    error: function () {
                        swal('request error!')
                    },
                    cache: false,
                    timeout: 2000
                });
                $('#form_container').css('display', 'inline');
            });
        }
    };
    getNextImage();
    var drawBox = function (xmin, ymin, xmax, ymax) {
        var canvas = document.getElementById('myCanvas');
        paper.setup(canvas);
        var path = new paper.Path();
        path.strokeColor = 'red';
        path.strokeWidth = 2;
        path.moveTo(new paper.Point(xmin, ymin));
        path.lineTo(new paper.Point(xmax, ymin));
        path.lineTo(new paper.Point(xmax, ymax));
        path.lineTo(new paper.Point(xmin, ymax));
        path.lineTo(new paper.Point(xmin, ymin));
        paper.view.draw();
    };

    $('#myCanvas').click(function (e) {
        var offset = $(this).offset();
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            width: 1000,
            padding: 50,
            confirmButtonColor: '#394dff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            confirmButtonClass: 'btn-confirm',
            cancelButtonClass: 'btn-cancel'
        }).then(function () {
            if (coords[count]['xmin'] < e.clientX - offset.left &&
                e.clientX - offset.left < coords[count]['xmax'] &&
                coords[count]['ymin'] < e.clientY - offset.top &&
                e.clientY - offset.top < coords[count]['ymax']) {
                swal({
                    title: 'Okay!',
                    text: 'You are right!',
                    type: 'success',
                    width: 800,
                    padding: 100,
                    confirmButtonClass: 'btn-confirm'
                });
                hit++;
            } else {
                swal({
                    title: 'Oops..',
                    text: 'You missed!',
                    type: 'error',
                    width: 800,
                    padding: 100,
                    confirmButtonClass: 'btn-confirm'
                })
            }
            //drawing the correct bounding box
            drawBox(coords[count]['xmin'], coords[count]['ymin'],
                coords[count]['xmax'], coords[count]['ymax']);
        });
    });
    $('#next_button').click(getNextImage);
    var displayScores = function (data) {
        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                var $tr = $('<tr>');
                var $td = $('<td>');
                $td.text(data[i].name);
                $tr.append($td);
                $td = $('<td>');
                $td.text(data[i].email);
                $tr.append($td);
                $td = $('<td>');
                $td.text(data[i].phone);
                $tr.append($td);
                $td = $('<td>');
                $td.text(data[i].message);
                $tr.append($td);
                $td = $('<td>');
                $td.text(data[i].created_at);
                $tr.append($td);
                $td = $('<td>');
                $td.text(data[i].score);
                $tr.append($td);
                var $scoreboard = $('#scoreboard');
                $scoreboard.find('table tbody').append($tr);
                $('body').append($('<link rel="stylesheet"/>').attr('href', '/css/scoreboard.css'));
            }
            $scoreboard.css('display', 'inline')
        }
    };
    var getDoctorData = function () {
        $.ajax({
            url: '/scoreboard',
            type: 'GET',
            dataType: 'json',
            success: displayScores,
            error: function () {
                swal('Scoreboard failed!', null, 'error')
            }
        })
    };
    $('#display_button').click(getDoctorData);
    $('#contact-submit').click(function () {
        console.log('trying to submit');
        $('#contact').ajaxSubmit({
            url: '/',
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                swal({title: data.result, type: data.status, timer: 1000, showConfirmButton: false});
            },
            error: function () {
                swal({title: 'Ajax error!',type: 'error', timer: 1000, showConfirmButton: false});
            }
        })
    });
    $('#clear_button').click(function () {
        $.ajax({
            url: '/clear',
            type: 'POST',
            dataType: 'json',
            success: function (err) {
                if (!err.err) {
                    swal('Database Cleared!', null, 'success');
                    $('#scoreboard').css('display', 'none')
                } else {
                    swal({title: err.err, type: 'error', showConfirmButton: false, timer: 2000})
                }
            },
            error: function () {
                swal({title: 'Ajax Error!', type: 'error', showConfirmButton: false, timer: 2000})
            }
        })
    })
});
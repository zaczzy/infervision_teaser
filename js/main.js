/**
 * Created by zac on 17-6-20.
 */
$(document).ready(function () {
    var hit = 0;
    var images = ['1812010641.jpg', '1812061213.jpg'];
    var originalWidth;
    var originalHeight;
    var currentFraction = 1;
    var coords = {1: {xmin: 100, ymin: 520, xmax: 130, ymax: 554}, 0: {xmin: 80, ymin: 422, xmax: 99, ymax: 442}};
    $("#infoSlider").text('100%').text('100%');
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
        min: -20,
        max: 150,
        step: 10,
        slide: function (event, ui) {
            var fraction = (1 + ui.value / 100),
                newWidth = originalWidth * fraction,
                newHeight = originalHeight * fraction;
            $("#infoSlider").text(Math.floor(fraction * 100) + '%').text(Math.floor(fraction * 100) + '%');
            $("#image").width(newWidth).height(newHeight);
            $("#myCanvas").width(newWidth).height(newHeight);
            updateCoords(fraction)
        }
    });
    $('#drag').draggable();
    var getNextImage = function () {
        if (images.length > 0) {
            $('#image').attr('src', '/resource/' + images.shift()).on('load', function () {
                originalWidth = $(this).width();
                originalHeight = $(this).height();
            });
            if (paper.project) {
                paper.project.activeLayer.removeChildren();
                paper.view.draw();
            }
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
                        score: hit
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
                    timeout: 5000
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
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(function () {
            if (coords[images.length]['xmin'] < e.clientX - offset.left &&
                e.clientX - offset.left < coords[images.length]['xmax'] &&
                coords[images.length]['ymin'] < e.clientY - offset.top &&
                e.clientY - offset.top < coords[images.length]['ymax']) {
                swal(
                    'Okay!',
                    'You are right!',
                    'success'
                );
                hit++;
            } else {
                swal(
                    'Oops...',
                    'You missed!',
                    'error'
                )
            }
            //drawing the correct bounding box
            drawBox(coords[images.length]['xmin'], coords[images.length]['ymin'],
                coords[images.length]['xmax'], coords[images.length]['ymax']);
            //marking this nodule as found
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
                $('#scoreboard table tbody').append($tr);
                $('body').append($('<link rel="stylesheet"/>').attr('href', '/css/scoreboard.css'));
            }
            $('#scoreboard').css('display', 'inline')
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
                swal(data.result, null, data.status);
            },
            error: function () {
                swal('Ajax error!', null, 'error');
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
                    swal(err.err, null, 'error')
                }
            },
            error: function () {
                swal('Ajax Error!', null, 'error')
            }
        })
    })
});



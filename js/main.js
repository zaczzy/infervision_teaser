/**
 * Created by zac on 17-6-20.
 */
$(document).ready(function () {
    var hit = 0;
    var images = ['1812010641.jpg', '1812061213.jpg'];
    var coords = {1: {xmin: 100, ymin: 520, xmax: 130, ymax: 554}, 0: {xmin: 80, ymin: 422, xmax: 99, ymax: 442}};
    var getNextImage = function () {
        if (images.length > 0) {
            console.log("url('/resource/" + images[0] + "')");
            $('#myCanvas').css('background', "url('/resource/" + images.shift() + "')");
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
                            swal('Your score is sent!')
                        }
                    },
                    error: function () {
                        swal('request error!')
                    },
                    cache: false,
                    timeout: 5000
                });
                $('#form_container').css('display', 'inline');
                }
            );
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
    // $('#display_button').click(getDoctorData);

});



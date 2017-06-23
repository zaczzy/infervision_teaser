/**
 * Created by zac on 17-6-20.
 */
$(document).ready(function () {
    var images = ['1812010641.jpg', '1812061213.jpg'];
    var getNextImage = function () {
        if (images.length > 0){
            images.shift();
            console.log("url('/resource/"+images.first+"')");
            $('#myCanvas').css('background', "url('/resource/"+images[0]+"')")
            paper.project.activeLayer.removeChildren();
            paper.view.draw();
        }
    };

    var drawBox = function () {
        var canvas = document.getElementById('myCanvas');
        paper.setup(canvas);
        var path = new paper.Path();
        path.strokeColor = 'red';
        var start = new paper.Point(50, 50);
        path.moveTo(start);
        path.lineTo(start.add([50, 0]));
        path.lineTo(start.add([50, 50]));
        path.lineTo(start.add([0, 50]));
        path.lineTo(start);
        paper.view.draw();
    }

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
            if (50 < e.clientX - offset.left && e.clientX - offset.left < 100 &&
                50 < e.clientY - offset.top && e.clientY - offset.top < 100){
                swal(
                    'Okay!',
                    'You are right!',
                    'success'
                );
            } else {
                swal(
                    'Oops...',
                    'You missed!',
                    'error'
                )
            }
            //drawing the correct bounding box


            //marking this nodule as found
            $('#nodule').data('clicked', true);
            if ($('#nodule').data('clicked')) {
                $('#form_container').css('display', 'inline');
            }
        });
    });



    $('#next_button').click(getNextImage);
});



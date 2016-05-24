<?php
    require_once 'v1-backend/bin/db.php';
?>
<!DOCTYPE html>
<html lang="en">
<?php
    require_once('landing/header.php');
?>
<body>
<body>
<div class="mask-loading">
    <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    </div>
</div>
<?php
    require_once('landing/footer.php');
?>
<script>
    $(document).ready(function () {
        var mobile_data = searchToObject(),
            data = $.extend(mobile_data, hashToObject(), true);
        socket.emit('auth.oauthDone', data);
        socket.on('vk.needEmail', function () {
            $('.panel').toggleClass('hidden');
        });
    });
</script>
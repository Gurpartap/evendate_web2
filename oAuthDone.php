<?php
    require_once 'v1-backend/bin/db.php';
?>
<!DOCTYPE html>
<html lang="en">
<?php
    require_once('landing/header.php');
?>
<body>
<div class="mask-loading">
    <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    </div>
</div>
</body>
<?php
    require_once('landing/footer.php');
?>
<script>
    $(document).ready(function () {
        var data = $.extend(searchToObject(), hashToObject(), true);
        socket.emit('auth.oauthDone', data);
        socket.on('vk.needEmail', function () {
            $('.panel').toggleClass('hidden');
        });
    });
</script>
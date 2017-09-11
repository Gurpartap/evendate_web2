<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=5d9e280fc3aa5d11e5475010b875bfd9" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=95f4809cdda8cca623bfc8b6e6f0d404" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=2995e2d92eef75209ca18aab9bb28022" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=fce794819ff5181c4f68fcd378ec3cc2" charset="utf-8"></script><?php
} ?>
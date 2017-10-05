<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=f5129054d4ac38839e56923b3cd2f44b" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=be7bc4a10f335d8ab10090832482e66f" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=81628efe12690f90875f5a98df8a095f" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=3b2c5b4b42fd5872dc89a0125847c745" charset="utf-8"></script><?php
} ?>
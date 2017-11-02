<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=2d5572d539a62ade2f87e9809fb45079" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=d6ddeac461ab7d69c8337daa35c2980b" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=23fdef639fe42a6cdbb730677dafbf5f" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=b1fd395b05520ce5adcea2da1d2f5740" charset="utf-8"></script><?php
} ?>
<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=8b7d2e5df03655eed2dd6a9b62fa060d" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=c78a7c3135f74c0da7fda00113a94165" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=9339eb8650c97755aef75268dbe4399e" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=625738b96d25c9aa8e381e2bc9b5729b" charset="utf-8"></script><?php
} ?>
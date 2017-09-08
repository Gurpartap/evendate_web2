<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=786f0420564dee354b7e4273f1465167" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=d6b9214d673697326f0aed4a21e4b318" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=3a78a62fa036a55ad1781b6d07a89851" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=b35eec14d5a539696ae8bd4606de5eec" charset="utf-8"></script><?php
} ?>
<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=3ac6123c49c640080839a6208adfdc9e" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=823caebdf80fd59db1db3ce6e47832d7" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=e8a4a116f181a965ae772986866fbfaa" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=24e268a4f8b91d8861d13d1349f8a5b6" charset="utf-8"></script><?php
} ?>
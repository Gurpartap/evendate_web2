<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=eb3f3df3d84ab8255461617b93d7ca39" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=15bc7e213bc88bfec5d655c86b01e0ec" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=3d0c99c904e482c17af0cc9475211b21" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=b8fab462cb56f1e9b6d16957bc0275a5" charset="utf-8"></script><?php
} ?>
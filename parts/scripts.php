<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=462ee3a85006b26d3c4e8d51d7eb3d42" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=f4578375e57de5555f11798ab6b76762" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=b76f8be2a33395acac21f3cab7e8d037" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=f76c65ff368297ea57deba8363e0da30" charset="utf-8"></script><?php
} ?>
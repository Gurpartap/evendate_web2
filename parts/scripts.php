<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=17ec3f0453231c629885aec13e594f6e" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=bb787dfa421a6a870a9569f272dffc56" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=a79525a09f31170129a4bbcdb216d204" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=7062f435a34581dcedb3e142d52e2d8e" charset="utf-8"></script><?php
} ?>
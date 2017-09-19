<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=c9e36472f6d28bbe3f90404f7e9b3026" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=9853654dc62c629b73dff43292ca75a6" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=52b30729825fc8f9f8f7d906808b89a0" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=01059ade8a850ed624481beafac5e7ec" charset="utf-8"></script><?php
} ?>
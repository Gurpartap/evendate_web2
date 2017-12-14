<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=b00acf70c19fdb7f8ed862e786a86c02" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=eff4c25bb49759685ae673294db5799d" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=96725753500529d076d1f473402158ee" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=5d648090e28c6f6b15835b09a9d2de6b" charset="utf-8"></script><?php
} ?>
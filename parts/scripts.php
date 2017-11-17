<!-- Google MAPS -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKu_xeHhtme8b1awA_rHjpfV3wVg1fZDg&libraries=places" async
        defer type="text/javascript"></script>
<!-- SOCKET.IO -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js" type="text/javascript"></script>

<?php
if($DEBUG_MODE) { ?>
	<script type="text/javascript" src="/dist/vendor.js?rev=db91888284d6537657dea09f53197de4" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.js?rev=5753ce742b35348e51c30018e46108bf" charset="utf-8"></script><?php
} else { ?>
	<script type="text/javascript" src="/dist/vendor.min.js?rev=dbb6c6e80e0dfae8d2eff82bd83f38c7" charset="utf-8"></script>
	<script type="text/javascript" src="/dist/app.min.js?rev=ce248d44d392353b5aad3544b585dffd" charset="utf-8"></script><?php
} ?>
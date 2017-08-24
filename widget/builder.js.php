<?php
header("Content-type: application/javascript");

function wrongInitError() { ?>
	console.error('Widget wrongly initialised'); <?php
	exit();
} ?>
function iFrameReady(iFrame, fn) {
	var timer;
	var fired = false;

	function ready() {
		if (!fired) {
			fired = true;
			clearTimeout(timer);
			fn.call(this);
		}
	}

	function readyState() {
		if (this.readyState === "complete") {
			ready.call(this);
		}
	}

	function addEvent(elem, event, fn) {
		if (elem.addEventListener) {
			return elem.addEventListener(event, fn);
		} else {
			return elem.attachEvent("on" + event, function () {
				return fn.call(elem, window.event);
			});
		}
	}

	addEvent(iFrame, "load", function () {
		ready.call(iFrame.contentDocument || iFrame.contentWindow.document);
	});

	function checkLoaded() {
		var doc = iFrame.contentDocument || iFrame.contentWindow.document;

		if (doc.URL.indexOf("about:") !== 0) {
			if (doc.readyState === "complete") {
				ready.call(doc);
			} else {
				addEvent(doc, "DOMContentLoaded", ready);
				addEvent(doc, "readystatechange", readyState);
			}
		} else {
			timer = setTimeout(checkLoaded, 1);
		}
	}
	checkLoaded();
}

<?php

if (!isset( $_REQUEST['type'] )) {
	wrongInitError();
}

switch ($_REQUEST['type']) {
	case 'order': {
		if (!isset( $_REQUEST['id'])) {
			wrongInitError();
		} ?>
!function appendOrderWidget(id, props) {
	var iframe = document.createElement('iframe'),
		mutation_observer = new MutationObserver(function() {
			setHeight(iframe.contentWindow);
		});

	iframe.setAttribute('src', 'http://dev.evendate.io/widget/order/event/' + id);
	iframe.setAttribute('frameborder', '0');
	iframe.setAttribute('scrolling', 'no');
	iframe.style.display = 'block';
	iframe.style.border = '0';
	iframe.setAttribute('width', props['width'] || '100%');
	iframe.setAttribute('height', props['height'] || '0');

	function setHeight(iframe_window) {
		iframe.style.height = iframe_window.document.scrollingElement.scrollHeight + 'px';
	}

	document.currentScript.parentElement.insertBefore(iframe, document.currentScript);
	iFrameReady(iframe, function() {
		setHeight(iframe.contentWindow);
		mutation_observer.observe(iframe.contentWindow.document.body, {
			childList: true,
			subtree: true
		});
	});
}(<?=$_REQUEST['id']?>, <?=json_encode( $_REQUEST )?>);<?php
		break;
	}
}
?>
<!-- Yandex.Metrika counter --><script type="text/javascript">(function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter32442130 = new Ya.Metrika({id:32442130, webvisor:true, clickmap:true, trackHash:true}); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks");</script><noscript><div><img src="//mc.yandex.ru/watch/32442130" style="position:absolute; left:-9999px;" alt="" /></div></noscript><!-- /Yandex.Metrika counter -->

<script>
	$(document).ready(function(){

		var _oauth_urls = {
			mobile:{
				vk: 'https://oauth.vk.com/authorize?client_id=5029623&scope=friends,email,offline,nohttps&redirect_uri=http://<?=App::$DOMAIN?>/vkOauthDone.php?mobile=true&response_type=code',
				google: 'https://accounts.google.com/o/oauth2/auth?scope=email profile https://www.googleapis.com/auth/plus.login &redirect_uri=http://<?=App::$DOMAIN?>/googleOauthDone.php?mobile=true&response_type=token&client_id=403640417782-lfkpm73j5gqqnq4d3d97vkgfjcoebucv.apps.googleusercontent.com',
				facebook: 'https://www.facebook.com/dialog/oauth?client_id=1692270867652630&response_type=code&scope=public_profile,email,user_friends&display=popup&redirect_uri=http://<?=App::$DOMAIN?>/fbOauthDone.php?mobile=true'
			},
			popup: {
				vk: 'https://oauth.vk.com/authorize?client_id=5029623&scope=friends,email,offline,nohttps&redirect_uri=http://<?=App::$DOMAIN?>/vkOauthDone.php?mobile=false&response_type=code',
				google: 'https://accounts.google.com/o/oauth2/auth?scope=email profile https://www.googleapis.com/auth/plus.login &redirect_uri=http://<?=App::$DOMAIN?>/googleOauthDone.php?mobile=false&response_type=token&client_id=403640417782-lfkpm73j5gqqnq4d3d97vkgfjcoebucv.apps.googleusercontent.com',
				facebook: 'https://www.facebook.com/dialog/oauth?client_id=1692270867652630&response_type=code&scope=public_profile,email,user_friends&display=popup&redirect_uri=http://<?=App::$DOMAIN?>/fbOauthDone.php?mobile=false'
			}
		};

		function openAuthLink(type){
			if (isNotDesktop()){
				window.location.href = _oauth_urls.mobile[type];
			}else{
				window.open(_oauth_urls.popup[type], type.toUpperCase() + '_AUTH_WINDOW',
					'status=1,toolbar=0,menubar=0&height=500,width=700');
			}
		}

		$('.vk-auth-btn').on('click', function(){
			openAuthLink('vk');
		});

		$('.google-plus-btn').on('click', function(){
			openAuthLink('google');
		});

		$('.facebook-btn').on('click', function(){
			openAuthLink('facebook');
		});
	})
</script>
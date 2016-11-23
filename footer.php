<!-- Yandex.Metrika counter -->
<script src="https://mc.yandex.ru/metrika/watch.js" type="text/javascript"></script>
<script type="text/javascript">try {
        var yaCounter32442130 = new Ya.Metrika({
            id: 32442130,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            trackHash: true
        });
    } catch (e) {
    }</script>
<noscript>
    <div><img src="https://mc.yandex.ru/watch/32442130" style="position:absolute; left:-9999px;" alt=""/></div>
</noscript><!-- /Yandex.Metrika counter -->


<script>
    $(document).ready(function () {

        var _oauth_urls = JSON.parse('<?php

            require_once 'v1-backend/bin/db.php';
            require_once 'v1-backend/bin/Class.Result.php';

            echo json_encode(array(
                'mobile' => App::getAuthURLs('mobile')->getData(),
                'popup' => App::getAuthURLs('popup')->getData(),
            ));
            ?>');


        function openAuthLink(type) {
            if (isNotDesktop()) {
                window.location.href = _oauth_urls.mobile[type];
            } else {
                window.open(_oauth_urls.popup[type], type.toUpperCase() + '_AUTH_WINDOW',
                    'status=1,toolbar=0,menubar=0&height=500,width=700');
            }
        }

        $('.vk-auth-btn').on('click', function (e) {
            if (yaCounter32442130){
                yaCounter32442130.reachGoal('VkAuthStart');
            }
            openAuthLink('vk');
            e.preventDefault();
        });

        $('.google-plus-btn').on('click', function (e) {
            if (yaCounter32442130){
                yaCounter32442130.reachGoal('GoogleAuthStart');
            }
            openAuthLink('google');
            e.preventDefault();
        });

        $('.facebook-btn').on('click', function (e) {
            if (yaCounter32442130){
                yaCounter32442130.reachGoal('FacebookAuthStart');
            }
            openAuthLink('facebook');
            e.preventDefault();
        });

    });
</script>
<?php
if (isset($user) && $user instanceof User) {
    echo "<script>
                        window.intercomSettings = {
                        app_id: \"spd4kf55\",
                        name: \"{$user->getFirstName()} {$user->getLastName()}\", // Full name
                        user_id: \"{$user->getId()}\", // User ID
                        email: \"{$user->getEmail()}\", // Email address
                        created_at: \"" . (new DateTime($user->getCreatedAt()))->format('U') . "\", // Signup date as a Unix timestamp
                        user_hash: \"" . hash_hmac('sha256', $user->getEmail(), 'CJlYyVGWDFMPmKZ_fT75tZKlcDMWkrzD0Kni1H0t') . "\"
                        };
                        </script>
                        <script>(function(){var w=window;var ic=w.Intercom;if(typeof ic===\"function\"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/spd4kf55';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()</script>";
} else {
    echo "
<script>
    window.intercomSettings = {
        app_id: \"spd4kf55\"
    };
    (function () {
        var w = window;
        var ic = w.Intercom;
        if (typeof ic === \"function\") {
            ic('reattach_activator');
            ic('update', intercomSettings);
        } else {
            var d = document;
            var i = function () {
                i.c(arguments)
            };
            i.q = [];
            i.c = function (args) {
                i.q.push(args)
            };
            w.Intercom = i;
            function l() {
                var s = d.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://widget.intercom.io/widget/spd4kf55';
                var x = d.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
            }

            if (w.attachEvent) {
                w.attachEvent('onload', l);
            } else {
                w.addEventListener('load', l, false);
            }
        }
    })()
</script>";
}
?>

<script>
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    if (ga){
        ga('create', 'UA-69300084-3', 'auto');
        ga('send', 'pageview');
    }

</script>
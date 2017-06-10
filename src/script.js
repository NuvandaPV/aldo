
/*
 * Bootstrap script.
 */

// Set up the retry button.
window.onload = function() {
    document.getElementById('retry_auth_btn').onclick = function() {
        window.location.reload();
    };
};

/*
 * Facebook initialisation callback.
 *
 * This function will be called after the FacebookSDK is fully set up.
 */
window.fbAsyncInit = function() {
    // Initialize the FacebookSDK with the correct parameters for Aldo.
    FB.init({
        appId: conf.fbAppID,
        autoLogAppEvents: true,
        xfbml: false,
        version: 'v2.9'
    });
    FB.AppEvents.logPageView();

    // Ask the user to log in to Facebook.
    FB.login(function(res) {
        // The user acted in the popup, hide the notice.
        document.getElementById('login_notice').className = 'hidden';

        switch (res.status) {
            case 'connected':
                // User is logged in and authorized the app, check permissions.
                FB.api('/me/permissions', function(res) {
                    var errs = [];
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].status == 'declined') {
                            errs.push(conf.perms[res.data[i].permission]);
                        }
                    }
                    if (errs.length) {
                        // Some permissions were not granted, error out.
                        for (var i = 0; i < errs.length; i++) {
                            // List all denied essential permissions.
                            if (! errs[i].required) { continue; }
                            var li = document.createElement('li');
                            var strong = document.createElement('strong');
                            strong.textContent = errs[i].desc;
                            li.appendChild(strong);
                            if (errs[i].msg) {
                                var br = document.createElement('br');
                                var em = document.createElement('em');
                                em.textContent = errs[i].msg;
                                li.appendChild(br);
                                li.appendChild(em);
                            }
                            document
                                .getElementById('denied_permissions')
                                .appendChild(li);
                        }
                        document
                            .getElementById('permission_denied')
                            .className = '';
                    } else {
                        // Permissions granted, launch aldo.
                        document
                            .getElementById('preload_content')
                            .className = 'hidden';
                        document
                            .getElementById('preload_spinner')
                            .className = '';
                        System.import('main.js').catch(function(err) {
                            console.error(err);
                        });
                    }
                });
                break;
            case 'not_authorized':
                // User is logged in, but has not given permissions, error out.
                document.getElementById('no_auth').className = '';
                break;
           default:
               // User is not logged in, or has aborted, error out.
               document.getElementById('no_login').className = '';
        }
    }, {scope: Object.keys(conf.perms)});
};

// Initialize FacebookSDK and start Aldo.
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/de_DE/sdk/debug.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

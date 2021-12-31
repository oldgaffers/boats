import React from 'react';
import Iframe from 'react-iframe'

const url = 'https://oga.smugmug.com/frame/slideshow'
const queryString = 'autoStart=1&captions=1&navigation=1'
    +'&playButton=1&randomize=1&speed=3&transition=fade&transitionSpeed=2'

const SmugMugGallery = ({ albumKey }) => {
    if (albumKey) {
        return (
            <Iframe
            url={`${url}?key=${albumKey}&${queryString}`}
            width="800" 
            height="600" 
            frameborder="no"
            scrolling="no"
            style={{ border: 'none !important' }}
            />
        );    
    }
    return null
}

export default SmugMugGallery

/*
<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#" class="sm-ua-gecko sm-browser-firefox sm-browser-firefox-76 sm-platform-mac sm-bg-transparent sm-nui">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate">
        <meta name="robots" content="all, index, follow, noodp, noydir">
                <meta http-equiv="imagetoolbar" content="no">
        <meta name="viewport" content="minimal-ui, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>
        <meta property="fb:app_id" content="51756880368"/>
        <title>OGA Boats, etc.</title>
        <script>var SM = {env: {"apiKey":"W0g9oqdOrzuhEpIQ2qaTXimrzsfryKSZ","host":{"api":"oga.smugmug.com","cartOrigin":"https:\/\/oga.smugmug.com","cartUrl":"https:\/\/oga.smugmug.com\/cart\/","cdn":"cdn.smugmug.com","http":"https:\/\/","imgUrl":"https:\/\/cdn.smugmug.com\/img\/","main":"www.smugmug.com","maps":"maps.smugmug.com","photos":"photos.smugmug.com","spacerGif":"https:\/\/cdn.smugmug.com\/img\/spacer.gif","ssl":"secure.smugmug.com","sslImgUrl":"https:\/\/cdn.smugmug.com\/img\/","upload":"upload.smugmug.com","customDomain":false,"session":".smugmug.com"},"js":{"appRoot":"js\/app\/build\/","base":"\/include\/","libRoot":"js\/lib\/build\/","root":"js\/lib\/build\/"},"lightroomPlugin":{"downloadUrl":"https:\/\/files.smugmug.com\/lightroom-plugin\/SmugMug-3.1.9.0.zip"},"windowsAppDownloadUrl":"https:\/\/files.smugmug.com\/windows-app\/SmugMugInstaller-20200504.exe","macAppStoreUrl":"https:\/\/itunes.apple.com\/us\/app\/smugmug\/id1115348888?mt=12","liveChat":{"license":1082622},"md5s":{"icart":"1d382b3c5dd0000b47a20502098a104f"},"ninjaLoader":{"version":"2015050401"},"sentryDsn":"https:\/\/a50725d1f5884564b5c9f506e44fde72@sentry.io\/1729937","slideshow":{"version":"2015060701"},"type":"live","videoPlayer":{"version":"2014100601"},"yui2":{"assets":"assets\/","base":"\/include\/","root":"yui\/2.8.1\/","skin":"skins\/sam\/","version":"2.8.1"},"yui3":{"assets":"assets\/","base":"\/include\/","commit":"13c86319","root":"yui\/3\/","skin":"skins\/sam\/","version":"3"},"limits":{"archiveBytes":3221225472,"nodeMaxChildren":5001,"photoBytes":524288000,"videoBytes":3221225472},"svgUrls":{"cc-logos":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/cc-logos-defs-3f4d8eb6409b6c4c72c5b0d7a5ef3ed6.svg","cropMask":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/cropmask-defs-edace1a334b38aa09095396aecb0e475.svg","flickr-prints":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/flickr-prints-defs-4d04813762d142b8131da1ed9f62149e.svg","help":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/help-defs-cbb4fd95289bb81270c446dd6c0810e7.svg","largeIcons":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/icons-large-defs-f48e3f4115a53b04115c2fbd9303e2fa.svg","smallIcons":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/icons-small-defs-933b2625727f659db0c2bc3fd68b740f.svg"},"enableFirstPartyApiAndCart":true,"buyerCurrency":"GBP","device":"Unknown","facebook":{"appId":"51756880368","version":"v2.9"},"featureFlags":{"apps.android.ab-test-menu":false,"apps.android.auto-backup-gallery-creation-when-full":true,"apps.android.buy-button-chrome-version-threshold":"58","apps.android.buy-button-os-version-threshold":24,"apps.android.buy-button-version-threshold":315,"apps.android.enable-offline-root":true,"apps.android.enable-push-notifications":false,"apps.android.enable-wide-gamut-color":false,"apps.android.min-password-length":12,"apps.android.show-auto-backup-intro":true,"apps.android.show-buy-button":true,"apps.android.supported-autoupload-image-types":"jpg,jpeg,heic","apps.ios.auto-backup-concurrent-uploads":10,"apps.ios.auto-backup-discovery-prompt":true,"apps.ios.auto-backup-discovery-prompt.disable":true,"apps.ios.auto-backup-discovery-prompt.frequency":1209600,"apps.ios.auto-backup-folder-name":"Automatic iOS Uploads","apps.ios.auto-backup-max-media-per-gallery":5000,"apps.ios.auto-backup-min-battery-level":0.2,"apps.ios.auto-backup-show-debug-log":false,"apps.ios.auto-backup-show-settings":true,"apps.ios.auto-backup-video-enabled":false,"apps.ios.auto-backup-video-enabled-background":false,"apps.ios.heic-upload-enabled":true,"apps.ios.logsystem-enabled":true,"apps.mac.auto-upload-show-settings":true,"apps.mac.copy-logs-to-clipboard-on-exit":false,"bfcm-2019-homepage-banner":false,"commerce-lightbox":true,"enable-heif-uploads":true,"enable-hibp-password-checking":false,"enable-marketing-app-homepage":true,"hibp.global-password-checking":true,"hibp.mobile-signup-password-checking":true,"hibp.qa-tool-compromised-credentials":false,"hibp.special-login-handling":true,"iterable.enable-for-gift-receipts":true,"iterable.enable-for-trial-welcome":true,"iterable.enable-for-user-closed":true,"iterable.enable-for-user-events":true,"le.disable-domain-validation":false,"marketing-top-level-templates":true,"marketing.promos.active":[],"marketing.promos.point-of-focus":"2a","marketing.promos.sampleAB":"2a","pay-pal-in-legacy-cart-checkout":true,"test-flag-little-app":false,"web.account-settings.facebook-pixel":false,"web.cart-international-address-price-min":4,"web.digital-river.ph1":true,"web.disable-account-email-change":false,"web.enable-smartystreets-intl-validation":true,"web.enable-smartystreets-us-validation":true,"web.experiment.for-every-click-campaign":false,"web.experiment.homepage.round.2":"6c","web.experiment.homepage.structure":"D","web.experiment.templates-in-top-nav":false,"web.new-gtm-container":true,"web.paypal-checkout":false,"web.pr-pr":false,"web.pr-ti":2012345678,"web.sentry-javascript-sample-rate":"0.25","web.signup-enable-sample-photos-option":true,"web.whcc-card-editor-integration":true},"google":{"apiKey":"AIzaSyDlPfxC2naf0Ifc_tH4HTLQoKJZ60fi0fo","clientId":"797232669904-588vo3bk37fog3id58bkmi7vhnfibs3f.apps.googleusercontent.com"},"jsLevel":"-min","loggedInUser":null,"logoutURL":"https:\/\/secure.smugmug.com\/logout?s=7004\u0026goTo=https%3A%2F%2Foga.smugmug.com%2Fframe%2Fslideshow%3Fkey%3DDscKJR%26autoStart%3D1%26captions%3D1%26navigation%3D1%26playButton%3D1%26randomize%3D1%26speed%3D3%26transition%3Dfade%26transitionSpeed%3D2\u0026goToToken=eyJzdHJpbmciOiJodHRwczovL29nYS5zbXVnbXVnLmNvbS9mcmFtZS9zbGlkZXNob3c%2Fa2V5PURzY0tKUlx1MDAyNmF1dG9TdGFydD0xXHUwMDI2Y2FwdGlvbnM9MVx1MDAyNm5hdmlnYXRpb249MVx1MDAyNnBsYXlCdXR0b249MVx1MDAyNnJhbmRvbWl6ZT0xXHUwMDI2c3BlZWQ9M1x1MDAyNnRyYW5zaXRpb249ZmFkZVx1MDAyNnRyYW5zaXRpb25TcGVlZD0yIiwidGltZSI6MTU4OTM0ODM0Miwic2lnbmF0dXJlIjoiTXpWalpqZzVOV1l6TTJFelpqSTBNR0ZoWmpNelltTTFZV1ZqTmpKbU1XSTBObVUzTkRFNFlnPT0iLCJ2ZXJzaW9uIjoxLCJhbGdvcml0aG0iOiJzaGExIn0%3D","pageOwner":{"homepage":"https:\/\/oga.smugmug.com","isTrial":false,"isPro":false,"mainDomain":"smugmug.com","nickNameHost":"oga.smugmug.com","nickName":"oga","profileName":"OGA Boats, etc.","rootNodeId":"XfKMn9","siteName":""},"pageOwnerFeatures":{"Albums":true,"BasicCustomization":true,"Collect":true,"ContactForm":true,"DownloadsOn":true,"SitePassword":true,"Themes":true,"Upload":true,"Video":true},"platform":"Mac","readOnly":false,"rightClickMessage":"These photos are copyrighted by their respective owners. All rights reserved. Unauthorized use prohibited.","tracking":{"ga":{"domain":"smugmug.com","smugmug":"UA-138402-3","user":null}}}, modules: {}};

        <script>
        var SM = {
            env: {
                "apiKey":"W0g9oqdOrzuhEpIQ2qaTXimrzsfryKSZ",
                "host":{
                    "api":"oga.smugmug.com",
                    "cartOrigin":"https:\/\/oga.smugmug.com",
                    "cartUrl":"https:\/\/oga.smugmug.com\/cart\/",
                    "cdn":"cdn.smugmug.com",
                    "http":"https:\/\/",
                    "imgUrl":"https:\/\/cdn.smugmug.com\/img\/",
                    "main":"www.smugmug.com",
                    "maps":"maps.smugmug.com",
                    "photos":"photos.smugmug.com",
                    "spacerGif":"https:\/\/cdn.smugmug.com\/img\/spacer.gif",
                    "ssl":"secure.smugmug.com",
                    "sslImgUrl":"https:\/\/cdn.smugmug.com\/img\/",
                    "upload":"upload.smugmug.com",
                    "customDomain":false,
                    "session":".smugmug.com"
                },
                "js":
                {
                    "appRoot":"js\/app\/build\/",
                    "base":"\/include\/",
                    "libRoot":"js\/lib\/build\/",
                    "root":"js\/lib\/build\/"},
                    "lightroomPlugin":{
                        "downloadUrl":"https:\/\/files.smugmug.com\/lightroom-plugin\/SmugMug-3.1.9.0.zip"},
                        "windowsAppDownloadUrl":"https:\/\/files.smugmug.com\/windows-app\/SmugMugInstaller-20200504.exe",
                        "macAppStoreUrl":"https:\/\/itunes.apple.com\/us\/app\/smugmug\/id1115348888?mt=12",
                        "liveChat":{
                            "license":1082622
                        },
                        "md5s":{
                            "icart":"1d382b3c5dd0000b47a20502098a104f"
                        },
                        "ninjaLoader":{"version":"2015050401"},
                        "sentryDsn":"https:\/\/a50725d1f5884564b5c9f506e44fde72@sentry.io\/1729937",
                        "slideshow":{"version":"2015060701"},
                        "type":
                        "live",
                        "videoPlayer":{"version":"2014100601"},
                        "yui2":{
                            "assets":"assets\/",
                            "base":"\/include\/",
                            "root":"yui\/2.8.1\/",
                            "skin":"skins\/sam\/",
                            "version":"2.8.1"
                        },
                        "yui3":{
                            "assets":"assets\/",
                            "base":"\/include\/",
                            "commit":"13c86319",
                            "root":"yui\/3\/",
                            "skin":"skins\/sam\/",
                            "version":"3"
                        },
                        "limits":{
                            "archiveBytes":3221225472,"nodeMaxChildren":5001,"photoBytes":524288000,"videoBytes":3221225472},
                            "svgUrls":{"cc-logos":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/cc-logos-defs-3f4d8eb6409b6c4c72c5b0d7a5ef3ed6.svg","cropMask":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/cropmask-defs-edace1a334b38aa09095396aecb0e475.svg","flickr-prints":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/flickr-prints-defs-4d04813762d142b8131da1ed9f62149e.svg","help":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/help-defs-cbb4fd95289bb81270c446dd6c0810e7.svg","largeIcons":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/icons-large-defs-f48e3f4115a53b04115c2fbd9303e2fa.svg","smallIcons":"https:\/\/cdn.smugmug.com\/include\/svg\/build\/icons-small-defs-933b2625727f659db0c2bc3fd68b740f.svg"},
                            "enableFirstPartyApiAndCart":true,
                            "buyerCurrency":"GBP",
                            "device":"Unknown",
                            "facebook":{"appId":"51756880368","version":"v2.9"},
                            "featureFlags":{"apps.android.ab-test-menu":false,"apps.android.auto-backup-gallery-creation-when-full":true,"apps.android.buy-button-chrome-version-threshold":"58","apps.android.buy-button-os-version-threshold":24,"apps.android.buy-button-version-threshold":315,"apps.android.enable-offline-root":true,"apps.android.enable-push-notifications":false,"apps.android.enable-wide-gamut-color":false,"apps.android.min-password-length":12,"apps.android.show-auto-backup-intro":true,"apps.android.show-buy-button":true,"apps.android.supported-autoupload-image-types":"jpg,jpeg,heic","apps.ios.auto-backup-concurrent-uploads":10,"apps.ios.auto-backup-discovery-prompt":true,"apps.ios.auto-backup-discovery-prompt.disable":true,"apps.ios.auto-backup-discovery-prompt.frequency":1209600,"apps.ios.auto-backup-folder-name":"Automatic iOS Uploads","apps.ios.auto-backup-max-media-per-gallery":5000,"apps.ios.auto-backup-min-battery-level":0.2,"apps.ios.auto-backup-show-debug-log":false,"apps.ios.auto-backup-show-settings":true,"apps.ios.auto-backup-video-enabled":false,"apps.ios.auto-backup-video-enabled-background":false,"apps.ios.heic-upload-enabled":true,"apps.ios.logsystem-enabled":true,"apps.mac.auto-upload-show-settings":true,"apps.mac.copy-logs-to-clipboard-on-exit":false,"bfcm-2019-homepage-banner":false,"commerce-lightbox":true,"enable-heif-uploads":true,"enable-hibp-password-checking":false,"enable-marketing-app-homepage":true,"hibp.global-password-checking":true,"hibp.mobile-signup-password-checking":true,"hibp.qa-tool-compromised-credentials":false,"hibp.special-login-handling":true,"iterable.enable-for-gift-receipts":true,"iterable.enable-for-trial-welcome":true,"iterable.enable-for-user-closed":true,"iterable.enable-for-user-events":true,"le.disable-domain-validation":false,"marketing-top-level-templates":true,"marketing.promos.active":[],"marketing.promos.point-of-focus":"2a","marketing.promos.sampleAB":"2a","pay-pal-in-legacy-cart-checkout":true,"test-flag-little-app":false,"web.account-settings.facebook-pixel":false,"web.cart-international-address-price-min":4,"web.digital-river.ph1":true,"web.disable-account-email-change":false,"web.enable-smartystreets-intl-validation":true,"web.enable-smartystreets-us-validation":true,"web.experiment.for-every-click-campaign":false,"web.experiment.homepage.round.2":"6c","web.experiment.homepage.structure":"D","web.experiment.templates-in-top-nav":false,"web.new-gtm-container":true,"web.paypal-checkout":false,"web.pr-pr":false,"web.pr-ti":2012345678,"web.sentry-javascript-sample-rate":"0.25","web.signup-enable-sample-photos-option":true,"web.whcc-card-editor-integration":true},
                            "google":{
                                "apiKey":"AIzaSyDlPfxC2naf0Ifc_tH4HTLQoKJZ60fi0fo",
                                "clientId":"797232669904-588vo3bk37fog3id58bkmi7vhnfibs3f.apps.googleusercontent.com"},
                                "jsLevel":"-min",
                                "loggedInUser":null,
                                "logoutURL":"https:\/\/secure.smugmug.com\/logout?s=7004\u0026goTo=https%3A%2F%2Foga.smugmug.com%2Fframe%2Fslideshow%3Fkey%3DDscKJR%26autoStart%3D1%26captions%3D1%26navigation%3D1%26playButton%3D1%26randomize%3D1%26speed%3D3%26transition%3Dfade%26transitionSpeed%3D2\u0026goToToken=eyJzdHJpbmciOiJodHRwczovL29nYS5zbXVnbXVnLmNvbS9mcmFtZS9zbGlkZXNob3c%2Fa2V5PURzY0tKUlx1MDAyNmF1dG9TdGFydD0xXHUwMDI2Y2FwdGlvbnM9MVx1MDAyNm5hdmlnYXRpb249MVx1MDAyNnBsYXlCdXR0b249MVx1MDAyNnJhbmRvbWl6ZT0xXHUwMDI2c3BlZWQ9M1x1MDAyNnRyYW5zaXRpb249ZmFkZVx1MDAyNnRyYW5zaXRpb25TcGVlZD0yIiwidGltZSI6MTU4OTM0ODM0Miwic2lnbmF0dXJlIjoiTXpWalpqZzVOV1l6TTJFelpqSTBNR0ZoWmpNelltTTFZV1ZqTmpKbU1XSTBObVUzTkRFNFlnPT0iLCJ2ZXJzaW9uIjoxLCJhbGdvcml0aG0iOiJzaGExIn0%3D",
                                "pageOwner":{
                                    "homepage":"https:\/\/oga.smugmug.com",
                                    "isTrial":false,
                                    "isPro":false,
                                    "mainDomain":"smugmug.com",
                                    "nickNameHost":"oga.smugmug.com",
                                    "nickName":"oga",
                                    "profileName":"OGA Boats, etc.",
                                    "rootNodeId":"XfKMn9",
                                    "siteName":""
                                },
                                "pageOwnerFeatures": {"Albums":true,"BasicCustomization":true,"Collect":true,"ContactForm":true,"DownloadsOn":true,"SitePassword":true,"Themes":true,"Upload":true,"Video":true},
                                "platform":"Mac",
                                "readOnly":false,
                                "rightClickMessage":"These photos are copyrighted by their respective owners. All rights reserved. Unauthorized use prohibited.",
                                "tracking":{"ga":{"domain":"smugmug.com","smugmug":"UA-138402-3","user":null}}}, modules: {}
                            };

SM.namespace = function () {
    var a = arguments, o = null, j, d;

    for (var i = 0, len = a.length; i < len; ++i) {
        d = a[i].split(".");
        o = SM; for (j = (d[0] === "SM") ? 1 : 0;
        j < d.length; ++j) { o[d[j]] = o[d[j]] || {}; o = o[d[j]]; }
    }

    return o;
};
</script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?subset=latin-ext&family=Roboto%3A300%2C400%2C500" >
        <link rel="stylesheet" href="https://cdn.smugmug.com/include/css/0/0/0/smugmug/core-451f26858e3dfb8c8603a8282cc9b39e.css" id="sm-css-core" >
        <link rel="stylesheet" href="https://cdn.smugmug.com/include/css/0/0/0/smugmug/widget_bundle-4fc0e9a7bdb74b79e0ce89cc166f8574.css" id="sm-css-widgets" >
        <link rel="stylesheet" href="https://cdn.smugmug.com/include/css/0/0/0/smugmug/gallery_bundle-224ed99c22b3a850f2aa306f284fbb50.css" >
    <link rel="icon" href="https://cdn.smugmug.com/img/favicons/smuggy-green-v1-128px.ico" sizes="16x16 24x24 32x32 48x48 64x64 128x128">
        <script src="https://cdn.smugmug.com/include/js/smugpage/core-top-4aa19fa40887db39d768c6ea423c2d6a.js"></script>
        <script src="https://cdn.smugmug.com/include/js/smugpage/core-config-fff653d5ae32dd91941592709d3d2475.js"></script>
        <script src="https://cdn.smugmug.com/include/js/bundles/smugpage-642ffa58be99a1879299f75c1a2b5946.js"></script>
    </head>
    <body class="sm-page-initialized sm-page-has-cookie-banner">
<script>
    var getSVG = function (path) {
        if (!path) {
            return;
        }

        var xhr = new XMLHttpRequest();

        xhr.open('GET', path, true);

        xhr.responseType = 'document';

        xhr.onload = function (e) {
            try {
                if (this.status >= 200 && (this.status < 300 || this.status === 304)) {
                    xhr.responseXML && document.body.insertBefore(
                        xhr.responseXML.documentElement,
                        document.body.childNodes[0]
                    );
                }
            } catch (e) {
                // In case there's an exception accessing this.status (e.g. CORS
                // headers missing).
            }
        }

        xhr.send();
    };

    var svgUrls;

    // The static error (5xx) page doesn't have a fully bootstrapped JS env.
    if (window.SM) {
        svgUrls = window.SM.env.svgUrls;

        if (svgUrls) {
            
            
            getSVG(svgUrls.largeIcons);
            getSVG(svgUrls.smallIcons);
        }
    }
</script>
<div id="sm-page-content" class="sm-page-content"><div class="sm-page-layout sm-page-layout-full" style="margin: 0;"><div class="sm-page-layout-region sm-page-layout-region-header"></div><div class="sm-page-layout-region sm-page-layout-region-body"><div class="sm-page-layout-region sm-page-layout-region-left" data-layout-region="Left"></div><div class="sm-page-layout-region sm-page-layout-region-right" data-layout-region="Right"></div><div class="sm-page-layout-region sm-page-layout-region-center" data-layout-region="Center"><div class="sm-page-layout-row yui3-g" data-layout-row="main"><div class="sm-page-layout-column yui3-u" style="width: 100%;" data-layout-column="0"><div id="sm-slideshow"></div></div>
</div></div><div class="sm-clear"></div></div><div class="sm-page-layout-region sm-page-layout-region-footer"></div></div>
</div><div class="sm-user-ui sm-user-overlay-container"></div>
<div class="sm-nui sm-overlay-container"></div>
<script>    YUI().use('sm-promise-fix','node','sm-page','sm-page-help','sm-redux-store','sm-dialogs-init','sm-page-background','sm-page-tracking','sm-page-nav-login',function(Y){
        
                    Y.namespace('SM.Resource')._localData = {"initialABUserTestsByAnalyticsID":{"Request":{"Version":"v2","Method":"GET","Uri":"\/api\/v2\/abtest\/analytics\/92a6278d-0680-4040-94db-357eae2e2cb6!tests?_shorturis=\u0026_verbosity=3"},"Options":{"MethodDetails":{"OPTIONS":{"Permissions":["Read"]},"GET":{"Permissions":["Read"]}},"Methods":["OPTIONS","GET"],"MediaTypes":["application\/json"],"Notes":["_multiargs does not work at this endpoint"],"Path":[{"type":"path","text":"api"},{"type":"path","text":"v2"},{"type":"path","text":"abtest"},{"type":"singleparam","param_name":"visitortype","param_value":"analytics"},{"type":"singleparam","param_name":"visitorid","param_value":"92a6278d-0680-4040-94db-357eae2e2cb6"},{"type":"action","text":"tests"}]},"Response":{"Uri":"\/api\/v2\/abtest\/analytics\/92a6278d-0680-4040-94db-357eae2e2cb6!tests?_shorturis=","Locator":"ABUserTest","LocatorType":"Objects","ABUserTest":[{"TestName":"FullStory Selection","TestID":"FullStory Selection 2016-08","Side":2,"AllSides":{"Control - Not Selected":1,"Test - Selected":2},"Uri":"\/api\/v2\/abtest\/analytics\/92a6278d-0680-4040-94db-357eae2e2cb6\/test\/FullStory+Selection","UriDescription":"ABUserTest"},{"TestName":"Marketing Hero Control vs Journey vs Show Off","TestID":"Marketing Hero Control vs Journey vs Show Off 2018-08","Side":0,"AllSides":{"Control - Existing Hero":1,"Test - Journey Series":2,"Test - Show Off Series":3},"Uri":"\/api\/v2\/abtest\/analytics\/92a6278d-0680-4040-94db-357eae2e2cb6\/test\/Marketing+Hero+Control+vs+Journey+vs+Show+Off","UriDescription":"ABUserTest"}],"UriDescription":"ABUserTests","EndpointType":"ABUserTests","Pages":{"Total":2,"Start":1,"Count":2,"RequestedCount":100,"FirstPage":"\/api\/v2\/abtest\/analytics\/92a6278d-0680-4040-94db-357eae2e2cb6!tests?_shorturis=\u0026start=1\u0026count=100","LastPage":"\/api\/v2\/abtest\/analytics\/92a6278d-0680-4040-94db-357eae2e2cb6!tests?_shorturis=\u0026start=1\u0026count=100"}},"Code":200,"Message":"Ok"},"pageOwner":{"Request":{"Version":"v2","Method":"GET","Uri":"\/api\/v2\/user\/oga?_shorturis=\u0026_verbosity=3"},"Options":{"MethodDetails":{"OPTIONS":{"Permissions":["Read"]},"GET":{"Permissions":["Read"]}},"Methods":["OPTIONS","GET"],"MediaTypes":["application\/json"],"Output":[{"Name":"AccountStatus","Type":"Select","OPTIONS":["Active","PastDue","Suspended","Closed"],"MIN_COUNT":1,"MAX_COUNT":1},{"Name":"FirstName","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":20},{"Name":"FriendsView","Type":"Boolean"},{"Name":"ImageCount","Type":"Integer","MIN_VALUE":0,"MAX_VALUE":16777215},{"Name":"IsTrial","Type":"Boolean"},{"Name":"LastName","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":20},{"Name":"NickName","Type":"Varchar","MIN_CHARS":1,"MAX_CHARS":35},{"Name":"SortBy","Type":"Select","OPTIONS":["LastUpdated","Position"],"MIN_COUNT":1,"MAX_COUNT":1},{"Name":"ViewPassHint","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":255},{"Name":"ViewPassword","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":50},{"Name":"Domain","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":50},{"Name":"DomainOnly","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":50},{"Name":"RefTag","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":13},{"Name":"Name","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":"INFINITY"},{"Name":"Plan","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":"INFINITY"},{"Name":"TotalAccountSize","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":"INFINITY"},{"Name":"TotalUploadedSize","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":"INFINITY"},{"Name":"QuickShare","Description":"Toggles the display of social media icons within the sharing UI which allow the user to share a photo to a variety of social networks.","Type":"Boolean"},{"Name":"IsAdmin","Type":"Boolean"},{"Name":"City","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":25},{"Name":"Country","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":20},{"Name":"Email","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":100},{"Name":"PhoneNum","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":15},{"Name":"State","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":20},{"Name":"Street1","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":40},{"Name":"Street2","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":40},{"Name":"Zip","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":10}],"ResponseLevels":["Full","Public","Password","GrantAccess"],"Path":[{"type":"path","text":"api"},{"type":"path","text":"v2"},{"type":"path","text":"user"},{"type":"singleparam","param_name":"nickname","param_value":"oga"}]},"Response":{"Uri":"\/api\/v2\/user\/oga?_shorturis=","Locator":"User","LocatorType":"Object","User":{"NickName":"oga","ViewPassHint":"","RefTag":"z6g4w7","Name":"OGA Boats, etc.","QuickShare":true,"Uri":"\/api\/v2\/user\/oga","WebUri":"https:\/\/oga.smugmug.com","UriDescription":"User By Nickname","Uris":{"BioImage":{"Uri":"\/api\/v2\/user\/oga!bioimage","Locator":"BioImage","LocatorType":"Object","UriDescription":"User BioImage","EndpointType":"BioImage"},"CoverImage":{"Uri":"\/api\/v2\/user\/oga!coverimage","Locator":"CoverImage","LocatorType":"Object","UriDescription":"User CoverImage","EndpointType":"CoverImage"},"UserProfile":{"Uri":"\/api\/v2\/user\/oga!profile","Locator":"UserProfile","LocatorType":"Object","UriDescription":"User\u0027s profile information","EndpointType":"UserProfile"},"Node":{"Uri":"\/api\/v2\/node\/XfKMn9","Locator":"Node","LocatorType":"Object","UriDescription":"Node with the given id.","EndpointType":"Node"},"Folder":{"Uri":"\/api\/v2\/folder\/user\/oga","Locator":"Folder","LocatorType":"Object","UriDescription":"A folder or legacy (sub)category by UrlPath","EndpointType":"Folder"},"Features":{"Uri":"\/api\/v2\/user\/oga!features","Locator":"Features","LocatorType":"Object","UriDescription":"User\u0027s account features information","EndpointType":"Features"},"SiteSettings":{"Uri":"\/api\/v2\/user\/oga!sitesettings","Locator":"SiteSettings","LocatorType":"Object","UriDescription":"User site settings","EndpointType":"SiteSettings"},"UserAlbums":{"Uri":"\/api\/v2\/user\/oga!albums","Locator":"Album","LocatorType":"Objects","UriDescription":"All of user\u0027s albums","EndpointType":"UserAlbums"},"UserGeoMedia":{"Uri":"\/api\/v2\/user\/oga!geomedia","Locator":"Image","LocatorType":"Objects","UriDescription":"Geotagged images for user","EndpointType":"UserGeoMedia"},"UserPopularMedia":{"Uri":"\/api\/v2\/user\/oga!popularmedia","Locator":"Image","LocatorType":"Objects","UriDescription":"User\u0027s popular images","EndpointType":"UserPopularMedia"},"UserFeaturedAlbums":{"Uri":"\/api\/v2\/user\/oga!featuredalbums","Locator":"Album","LocatorType":"Objects","UriDescription":"User\u0027s featured albums","EndpointType":"UserFeaturedAlbums"},"UserRecentImages":{"Uri":"\/api\/v2\/user\/oga!recentimages","Locator":"Image","LocatorType":"Objects","UriDescription":"User\u0027s recent images","EndpointType":"UserRecentImages"},"UserImageSearch":{"Uri":"\/api\/v2\/user\/oga!imagesearch","Locator":"Image","LocatorType":"Objects","UriDescription":"Search for user images","EndpointType":"UserImageSearch"},"UserTopKeywords":{"Uri":"\/api\/v2\/user\/oga!topkeywords","Locator":"UserTopKeywords","LocatorType":"Object","UriDescription":"User\u0027s top keywords","EndpointType":"UserTopKeywords"},"UrlPathLookup":{"Uri":"\/api\/v2\/user\/oga!urlpathlookup","Locator":"Folder,Album,Page","LocatorType":"Object","UriDescription":"Lookup user\u0027s folder, album, or page by path","EndpointType":"UrlPathLookup"}},"ResponseLevel":"Public"},"UriDescription":"User By Nickname","EndpointType":"User","DocUri":"https:\/\/api.smugmug.com\/api\/v2\/doc\/reference\/user.html"},"Code":200,"Message":"Ok","Expansions":{"\/api\/v2\/node\/XfKMn9":{"Uri":"\/api\/v2\/node\/XfKMn9","Locator":"Node","LocatorType":"Object","Node":{"Description":"","Name":"","Keywords":[],"PasswordHint":"","SecurityType":"None","ShowCoverImage":true,"SortDirection":"Descending","SortMethod":"DateModified","Type":"Folder","UrlName":"","DateAdded":"2020-02-15T13:10:50+00:00","DateModified":"2020-02-15T13:10:50+00:00","EffectiveSecurityType":"None","FormattedValues":{"Name":{"html":""},"Description":{"html":"","text":""}},"HasChildren":true,"IsRoot":true,"NodeID":"XfKMn9","UrlPath":"\/","Uri":"\/api\/v2\/node\/XfKMn9","WebUri":"https:\/\/oga.smugmug.com","UriDescription":"Node with the given id.","Uris":{"FolderByID":{"Uri":"\/api\/v2\/folder\/id\/XfKMn9","Locator":"Folder","LocatorType":"Object","UriDescription":"Get folder by its ID","EndpointType":"FolderByID"},"ParentNodes":{"Uri":"\/api\/v2\/node\/XfKMn9!parents","Locator":"Node","LocatorType":"Objects","UriDescription":"Hierarchy of nodes from the given node (inclusive) to the root node.","EndpointType":"ParentNodes"},"User":{"Uri":"\/api\/v2\/user\/oga","Locator":"User","LocatorType":"Object","UriDescription":"User By Nickname","EndpointType":"User"},"NodeCoverImage":{"Uri":"\/api\/v2\/node\/XfKMn9!cover","Locator":"Image","LocatorType":"Object","UriDescription":"Cover image for a folder, album, or page","EndpointType":"NodeCoverImage"},"HighlightImage":{"Uri":"\/api\/v2\/highlight\/node\/XfKMn9","Locator":"Image","LocatorType":"Object","UriDescription":"Highlight image for a folder, album, or page","EndpointType":"HighlightImage"},"NodeComments":{"Uri":"\/api\/v2\/node\/XfKMn9!comments","Locator":"Comment","LocatorType":"Objects","UriDescription":"Comments on a Node","EndpointType":"NodeComments"},"ChildNodes":{"Uri":"\/api\/v2\/node\/XfKMn9!children","Locator":"Node","LocatorType":"Objects","UriDescription":"Child nodes of the given node.","EndpointType":"ChildNodes"}},"ResponseLevel":"Public"},"UriDescription":"Node with the given id.","EndpointType":"Node"},"\/api\/v2\/user\/oga!features":{"Uri":"\/api\/v2\/user\/oga!features","Locator":"Features","LocatorType":"Object","Features":{"Backprinting":false,"BasicCustomization":true,"CSS":false,"CustomPackaging":false,"Directory":false,"GrantAccess":false,"Printmarks":false,"RightClickProtection":false,"Sales":false,"SiteCustomization":false,"Sharpening":false,"Video":true,"Watermarks":false,"Uri":"\/api\/v2\/user\/oga!features","UriDescription":"User\u0027s account features information"},"UriDescription":"User\u0027s account features information","EndpointType":"Features"},"\/api\/v2\/user\/oga!sitesettings":{"Uri":"\/api\/v2\/user\/oga!sitesettings","Locator":"SiteSettings","LocatorType":"Object","SiteSettings":{"Uri":"\/api\/v2\/user\/oga!sitesettings","UriDescription":"User site settings"},"UriDescription":"User site settings","EndpointType":"SiteSettings"}},"RequestedExpansions":["Node","SiteSettings","Features"]},"featureFlags":{"Request":{"Version":"v2","Method":"GET","Uri":"\/api\/v2\/featureflags?_shorturis=\u0026_verbosity=3"},"Options":{"MethodDetails":{"OPTIONS":{"Permissions":["Read"]},"GET":{"Permissions":["Read"]}},"Methods":["OPTIONS","GET"],"ParameterDescription":{"Varchar":"Variable length text from MIN_CHARS to MAX_CHARS (MAX_CHARS = INFINITY meaning arbitrary length)"},"Parameters":{"GET":[{"Name":"id","Required":false,"ReadOnly":false,"Default":null,"Description":"Feature flag override id","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":50},{"Name":"prefix","Required":false,"ReadOnly":false,"Default":null,"Description":"Key filter prefix","Type":"Varchar","MIN_CHARS":0,"MAX_CHARS":50}]},"MediaTypes":["application\/json"],"Output":[{"Name":"Flags","Type":"Hash"}]},"Response":{"Uri":"\/api\/v2\/featureflags?_shorturis=","Locator":"FeatureFlagsRoot","LocatorType":"Object","FeatureFlagsRoot":{"Flags":{"apps.android.ab-test-menu":false,"apps.android.auto-backup-gallery-creation-when-full":true,"apps.android.buy-button-chrome-version-threshold":"58","apps.android.buy-button-os-version-threshold":24,"apps.android.buy-button-version-threshold":315,"apps.android.enable-offline-root":true,"apps.android.enable-push-notifications":false,"apps.android.enable-wide-gamut-color":false,"apps.android.min-password-length":12,"apps.android.show-auto-backup-intro":true,"apps.android.show-buy-button":true,"apps.android.supported-autoupload-image-types":"jpg,jpeg,heic","apps.ios.auto-backup-concurrent-uploads":10,"apps.ios.auto-backup-discovery-prompt":true,"apps.ios.auto-backup-discovery-prompt.disable":true,"apps.ios.auto-backup-discovery-prompt.frequency":1209600,"apps.ios.auto-backup-folder-name":"Automatic iOS Uploads","apps.ios.auto-backup-max-media-per-gallery":5000,"apps.ios.auto-backup-min-battery-level":0.2,"apps.ios.auto-backup-show-debug-log":false,"apps.ios.auto-backup-show-settings":true,"apps.ios.auto-backup-video-enabled":false,"apps.ios.auto-backup-video-enabled-background":false,"apps.ios.heic-upload-enabled":true,"apps.ios.logsystem-enabled":true,"apps.mac.auto-upload-show-settings":true,"apps.mac.copy-logs-to-clipboard-on-exit":false,"bfcm-2019-homepage-banner":false,"commerce-lightbox":true,"enable-heif-uploads":true,"enable-hibp-password-checking":false,"enable-marketing-app-homepage":true,"hibp.global-password-checking":true,"hibp.mobile-signup-password-checking":true,"hibp.qa-tool-compromised-credentials":false,"hibp.special-login-handling":true,"iterable.enable-for-gift-receipts":true,"iterable.enable-for-trial-welcome":true,"iterable.enable-for-user-closed":true,"iterable.enable-for-user-events":true,"le.disable-domain-validation":false,"marketing-top-level-templates":true,"marketing.promos.active":[],"marketing.promos.point-of-focus":"2a","marketing.promos.sampleAB":"2a","pay-pal-in-legacy-cart-checkout":true,"test-flag-little-app":false,"web.account-settings.facebook-pixel":false,"web.cart-international-address-price-min":4,"web.digital-river.ph1":true,"web.disable-account-email-change":false,"web.enable-smartystreets-intl-validation":true,"web.enable-smartystreets-us-validation":true,"web.experiment.for-every-click-campaign":false,"web.experiment.homepage.round.2":"6c","web.experiment.homepage.structure":"D","web.experiment.templates-in-top-nav":false,"web.new-gtm-container":true,"web.paypal-checkout":false,"web.pr-pr":false,"web.pr-ti":2012345678,"web.sentry-javascript-sample-rate":"0.25","web.signup-enable-sample-photos-option":true,"web.whcc-card-editor-integration":true},"Uri":"\/api\/v2\/featureflags","UriDescription":"User Feature Flags"},"UriDescription":"User Feature Flags","EndpointType":"FeatureFlagsRoot"},"Code":200,"Message":"Ok"}};
        
        Y.SM.Page.responsiveDesign = {"mobileMaxLandscapeHeight":414,"mobileMaxWidth":736,"tabletMaxWidth":1024,"tabletMinWidth":737,"desktopMinWidth":1025};
        Y.SM.Page.init({"allowCustomDesigns":false,"analyticsId":"92a6278d-0680-4040-94db-357eae2e2cb6","catalogCacheHash":"fe8f51fdbbd3ec12f1bd48e610589ac22c7c4d809c2e40ec6e6fec751e0392c4","cookieMonster":false,"cookieMonsterHost":"","csrfToken":"9cf84ae344f1f1efb03917a450e3bbc9","dataLayer":{"tag_manager_id":"GTM-KQPLTF","host_level":"live","share_a_sale":{"cookie_domain":".smugmug.com","cookie_name":"shareasaleSSCID"},"site_version":"SMN","tracking_enabled":0,"smugmug_ga_config":{"id":"UA-138402-3"},"user_ga_config":{"id":""},"user_id":"4081740","user_reftag":"z6g4w7","track_engaged_trial":false},"defaultTemplateId":1,"features":{"ALBUMS":"Albums","ASSISTANT":"Assistant","BACKPRINTING":"Backprinting","BASIC_CUSTOMIZATION":"BasicCustomization","CART_THEME":"CartTheming","CLIENT_AREA":"ClientArea","COLLECT":"Collect","CONTACT_FORM":"ContactForm","COUPONS":"Coupons","COMMERCE_LIGHTBOX":"CommerceLightbox","CSS":"CSS","CUSTOM_CART":"CustomCart","CUSTOMIZATION":"Customization","DIRECTORY":"Directory","DOMAIN":"Domain","DOWNLOADSON":"DownloadsOn","EVENTS":"Events","GRANT_ACCESS":"GrantAccess","HTML":"HTML","LEGACY_FOOTER":"LegacyFooter","LIMITED_SYSTEM_PAGES":"LimitedAccessSystemPages","MULTIPLE_PRICELISTS":"MultiplePricelists","PACKAGES":"Packages","PACKAGING":"CustomPackaging","PRICING":"Pricing","PRINTMARKS":"Printmarks","PRO_LABS":"ProLab","RCP":"RightClick","SALES":"Sales","SHARPENING":"Sharpening","SITE_PASSWORD":"SitePassword","SUPPORT_CHAT":"SupportChat","THEMES":"Themes","UPLOAD":"Upload","VIDEO":"Video","WATERMARKS":"Watermarks","WHITELABEL":"WhiteLabel"},"feedsConfig":[],"headerConfig":[],"help":{"contextual":false,"liveChat":{"load":false,"closureReason":"Chat is available Monday-Friday 9am\u20138pm EST (excluding holidays)."},"urlSupport":"https://help.smugmug.com"},"isAdmin":false,"loadNuxGuides":false,"loadQuickNews":false,"nextSandbox":false,"showCookieBanner":true,"showNext":true,"snowplowConfig":{"collectorUrl":"stats-new.smugmug.com","cookieDomain":"smugmug.com","scriptUrl":"https://cdn.smugmug.com/include/js/snowplow_2-20200416122412.js"},"tracking":false,"trackingOptions":{"ga":{"customVariables":[{"index":1,"name":"Version","value":"SMN","scope":3}]}},"uploadNodeId":0});

        
        Y.SM.Page.background.renderSlideshow({"SlideshowSource":"album","AlbumID":"206465466","AlbumKey":"DscKJR","Cover":false,"Clickable":false,"AutoStart":true,"ShowCaptions":true,"ShowNavigation":true,"PlayButton":true,"Randomize":true,"Speed":"3","Transition":"fade","TransitionSpeed":"2"});

        if (Y.SM.Page.renderWidgets) {
                    }

        Y.SM.Page.widgets = [];

        
            });
</script></body></html>
*/
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>{{title}}</title>
    <link href="css/bootstrap.css" type="text/css" rel="stylesheet"/>
    <!-- Google Analytics -->
    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-1199722-3']);
        _gaq.push(['_trackPageview']);
        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    </script>
</head>
<body>
<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="brand" href="#"></a>
            <a href="http://travis-ci.org/DimitarChristoff/Epitome" class="travis">
                <img src="https://secure.travis-ci.org/DimitarChristoff/Epitome.png?branch=master"/></a>
        </div>
    </div>
    <a id="github-ribbon" href="https://github.com/DimitarChristoff/Epitome"><img alt="Fork me on GitHub" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>
</div>
<div id="nav">
    <div class="twitter extra">
        <iframe allowtransparency="true" frameborder="0" scrolling="no" style="width: 162px; height: 20px;"
                src="https://platform.twitter.com/widgets/follow_button.html?screen_name=D_mitar&amp;show_count=false"></iframe>
    </div>
    <ul id="sections"></ul>
    <div class="extra" id="github">
        <a href="https://github.com/DimitarChristoff/Epitome">Source on Github</a>
    </div>
    <div class="extra" id="github-issues">
        <a href="https://github.com/DimitarChristoff/Epitome/issues">Issues</a>
    </div>
</div>
<div id="content" class="container">
    {{&body}}
</div>
<script src="js/mootools-yui-compressed.js"></script>
<script src="js/moostrap-scrollspy.js"></script>
<script src="js/prettify.js"></script>
<script src="js/docs.js"></script>
</body>
</html>
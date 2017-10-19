<!DOCTYPE html>
<html class="" lang="en">
<head prefix="og: http://ogp.me/ns#">
<meta charset="utf-8">
<meta content="IE=edge" http-equiv="X-UA-Compatible">
<meta content="object" property="og:type">
<meta content="GitLab" property="og:site_name">
<meta content=".gitlab/issue_templates/Bug.md · 4995af6f1b98ddc91cbc7926c141f659b4db6926 · ingo / ygg_api_server" property="og:title">
<meta content="银个购API Server" property="og:description">
<meta content="https://git.yingegou.com/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png" property="og:image">
<meta content="64" property="og:image:width">
<meta content="64" property="og:image:height">
<meta content="https://git.yingegou.com/ingo/ygg_api/blob/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates/Bug.md" property="og:url">
<meta content="summary" property="twitter:card">
<meta content=".gitlab/issue_templates/Bug.md · 4995af6f1b98ddc91cbc7926c141f659b4db6926 · ingo / ygg_api_server" property="twitter:title">
<meta content="银个购API Server" property="twitter:description">
<meta content="https://git.yingegou.com/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png" property="twitter:image">

<title>.gitlab/issue_templates/Bug.md · 4995af6f1b98ddc91cbc7926c141f659b4db6926 · ingo / ygg_api_server · GitLab</title>
<meta content="银个购API Server" name="description">
<link rel="shortcut icon" type="image/x-icon" href="/assets/favicon-075eba76312e8421991a0c1f89a89ee81678bcde72319dd3e8047e2a47cd3a42.ico" id="favicon" />
<link rel="stylesheet" media="all" href="/assets/application-c713cd7dc8228e6522617974b28ae4b0aaee0c42a7301a1e586d0c82c34f20cd.css" />
<link rel="stylesheet" media="print" href="/assets/print-74b3d49adeaada27337e759b75a34af7cf3d80051de91d60d40570f5a382e132.css" />


<!-- / TODO: Combine these 2 stylesheets into application.scss -->
<link rel="stylesheet" media="all" href="/assets/new_nav-9dc36451d6461185b3c501b73a23f48936cda9ee5b0b8f9b1001c951ce12eabf.css" />
<link rel="stylesheet" media="all" href="/assets/new_sidebar-1f383f3cb338b8ecf8062dab06052141f414f51165f656b97a0930c0d38cd7dc.css" />
<script>
//<![CDATA[
window.gon={};gon.api_version="v4";gon.default_avatar_url="https:\/\/git.yingegou.com\/assets\/no_avatar-849f9c04a3a0d0cea2424ae97b27447dc64a7dbfae83c036c45b403392f0e8ba.png";gon.max_file_size=100;gon.asset_host=null;gon.webpack_public_path="\/assets\/webpack\/";gon.relative_url_root="";gon.shortcuts_path="\/help\/shortcuts";gon.user_color_scheme="white";gon.katex_css_url="\/assets\/katex-dc07578acd203b2dd73a8c78cdb8dcb79144ba11a23749d80904496b7ff8a650.css";gon.katex_js_url="\/assets\/katex-04bcf56379fcda0ee7c7a63f71d0fc15ffd2e014d017cd9d51fd6554dfccf40a.js";gon.gitlab_url="https:\/\/git.yingegou.com";gon.revision="8895150";gon.gitlab_logo="\/assets\/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png";gon.current_user_id=19;gon.current_username="kwj";gon.current_user_fullname="\u67ef\u6587\u4fca";gon.current_user_avatar_url="https:\/\/secure.gravatar.com\/avatar\/63966e1baeb26d11da6e5c7bc3f99cdd?s=80\u0026d=identicon";
//]]>
</script>
<script src="/assets/webpack/webpack_runtime.c6d4a9e825eb10a4eb74.bundle.js" defer="defer"></script>
<script src="/assets/webpack/common.dc477f6ea75f74beebae.bundle.js" defer="defer"></script>
<script src="/assets/webpack/locale.b9a56fbc6e00d576d16c.bundle.js" defer="defer"></script>
<script src="/assets/webpack/main.f525cb1ff9bc68663c4f.bundle.js" defer="defer"></script>



<script src="/assets/webpack/blob.6043bed197eb079db95f.bundle.js" defer="defer"></script>

<script>
  window.uploads_path = "/ingo/ygg_api/uploads";
</script>

<meta name="csrf-param" content="authenticity_token" />
<meta name="csrf-token" content="aAQIGbs+ZhVhrD5vx57yR7p9hCAGpZxbSCZZj0QW4RZhlDk7bGwkG6NFiIiGfsQffXWRnoakigt1LoUvqjboDA==" />
<meta content="origin-when-cross-origin" name="referrer">
<meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport">
<meta content="#474D57" name="theme-color">
<link rel="apple-touch-icon" type="image/x-icon" href="/assets/touch-icon-iphone-5a9cee0e8a51212e70b90c87c12f382c428870c0ff67d1eb034d884b78d2dae7.png" />
<link rel="apple-touch-icon" type="image/x-icon" href="/assets/touch-icon-ipad-a6eec6aeb9da138e507593b464fdac213047e49d3093fc30e90d9a995df83ba3.png" sizes="76x76" />
<link rel="apple-touch-icon" type="image/x-icon" href="/assets/touch-icon-iphone-retina-72e2aadf86513a56e050e7f0f2355deaa19cc17ed97bbe5147847f2748e5a3e3.png" sizes="120x120" />
<link rel="apple-touch-icon" type="image/x-icon" href="/assets/touch-icon-ipad-retina-8ebe416f5313483d9c1bc772b5bbe03ecad52a54eba443e5215a22caed2a16a2.png" sizes="152x152" />
<link color="rgb(226, 67, 41)" href="/assets/logo-d36b5212042cebc89b96df4bf6ac24e43db316143e89926c0db839ff694d2de4.svg" rel="mask-icon">
<meta content="/assets/msapplication-tile-1196ec67452f618d39cdd85e2e3a542f76574c071051ae7effbfde01710eb17d.png" name="msapplication-TileImage">
<meta content="#30353E" name="msapplication-TileColor">




</head>

<body class="ui_indigo " data-find-file="/ingo/ygg_api/find_file/4995af6f1b98ddc91cbc7926c141f659b4db6926" data-group="" data-page="projects:blob:show" data-project="ygg_api">


<header class="navbar navbar-gitlab navbar-gitlab-new">
<a class="sr-only gl-accessibility" href="#content-body" tabindex="1">Skip to content</a>
<div class="container-fluid">
<div class="header-content">
<div class="title-container">
<h1 class="title">
<a title="仪表板" id="logo" href="/"><svg width="24" height="24" class="tanuki-logo" viewBox="0 0 36 36">
  <path class="tanuki-shape tanuki-left-ear" fill="#e24329" d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"/>
  <path class="tanuki-shape tanuki-right-ear" fill="#e24329" d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"/>
  <path class="tanuki-shape tanuki-nose" fill="#e24329" d="M18,34.38 3,14 33,14 Z"/>
  <path class="tanuki-shape tanuki-left-eye" fill="#fc6d26" d="M18,34.38 11.38,14 2,14 6,25Z"/>
  <path class="tanuki-shape tanuki-right-eye" fill="#fc6d26" d="M18,34.38 24.62,14 34,14 30,25Z"/>
  <path class="tanuki-shape tanuki-left-cheek" fill="#fca326" d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"/>
  <path class="tanuki-shape tanuki-right-cheek" fill="#fca326" d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"/>
</svg>

<span class="logo-text hidden-xs">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 617 169"><path d="M315.26 2.97h-21.8l.1 162.5h88.3v-20.1h-66.5l-.1-142.4M465.89 136.95c-5.5 5.7-14.6 11.4-27 11.4-16.6 0-23.3-8.2-23.3-18.9 0-16.1 11.2-23.8 35-23.8 4.5 0 11.7.5 15.4 1.2v30.1h-.1m-22.6-98.5c-17.6 0-33.8 6.2-46.4 16.7l7.7 13.4c8.9-5.2 19.8-10.4 35.5-10.4 17.9 0 25.8 9.2 25.8 24.6v7.9c-3.5-.7-10.7-1.2-15.1-1.2-38.2 0-57.6 13.4-57.6 41.4 0 25.1 15.4 37.7 38.7 37.7 15.7 0 30.8-7.2 36-18.9l4 15.9h15.4v-83.2c-.1-26.3-11.5-43.9-44-43.9M557.63 149.1c-8.2 0-15.4-1-20.8-3.5V70.5c7.4-6.2 16.6-10.7 28.3-10.7 21.1 0 29.2 14.9 29.2 39 0 34.2-13.1 50.3-36.7 50.3m9.2-110.6c-19.5 0-30 13.3-30 13.3v-21l-.1-27.8h-21.3l.1 158.5c10.7 4.5 25.3 6.9 41.2 6.9 40.7 0 60.3-26 60.3-70.9-.1-35.5-18.2-59-50.2-59M77.9 20.6c19.3 0 31.8 6.4 39.9 12.9l9.4-16.3C114.5 6 97.3 0 78.9 0 32.5 0 0 28.3 0 85.4c0 59.8 35.1 83.1 75.2 83.1 20.1 0 37.2-4.7 48.4-9.4l-.5-63.9V75.1H63.6v20.1h38l.5 48.5c-5 2.5-13.6 4.5-25.3 4.5-32.2 0-53.8-20.3-53.8-63-.1-43.5 22.2-64.6 54.9-64.6M231.43 2.95h-21.3l.1 27.3v94.3c0 26.3 11.4 43.9 43.9 43.9 4.5 0 8.9-.4 13.1-1.2v-19.1c-3.1.5-6.4.7-9.9.7-17.9 0-25.8-9.2-25.8-24.6v-65h35.7v-17.8h-35.7l-.1-38.5M155.96 165.47h21.3v-124h-21.3v124M155.96 24.37h21.3V3.07h-21.3v21.3"/></svg>

</span>
</a></h1>
<ul class="list-unstyled navbar-sub-nav">
<li id="nav-projects-dropdown" class="home dropdown header-projects"><a data-toggle="dropdown" href="#">
项目
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="caret-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 10.243l-4.95-4.95a1 1 0 0 0-1.414 1.414l5.657 5.657a.997.997 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0-1.414-1.414L8 10.243z"/></svg>

</a>
<div class="dropdown-menu projects-dropdown-menu">
<div class="projects-dropdown-container">
<div class="project-dropdown-sidebar">
<ul>
<li class=""><a href="/dashboard/projects">Your projects
</a></li><li class=""><a href="/dashboard/projects/starred">Starred projects
</a></li><li class=""><a href="/explore">Explore projects
</a></li></ul>
</div>
<div class="project-dropdown-content">
<div data-project-id="6" data-project-name="ygg_api_server" data-project-namespace="ingo / ygg_api_server" data-project-web-url="https://git.yingegou.com/ingo/ygg_api" data-user-name="kwj" id="js-projects-dropdown"></div>
</div>
</div>

</div>
</li><li class="hidden-xs"><a class="dashboard-shortcuts-groups" title="群组" href="/dashboard/groups">群组
</a></li><li class="visible-lg"><a class="dashboard-shortcuts-activity" title="活动" href="/dashboard/activity">活动
</a></li><li class="visible-lg"><a class="dashboard-shortcuts-milestones" title="里程碑" href="/dashboard/milestones">里程碑
</a></li><li class="visible-lg"><a class="dashboard-shortcuts-snippets" title="代码片段" href="/dashboard/snippets">代码片段
</a></li><li class="header-more dropdown hidden-lg">
<a data-toggle="dropdown" href="#">
更多
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="caret-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 10.243l-4.95-4.95a1 1 0 0 0-1.414 1.414l5.657 5.657a.997.997 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0-1.414-1.414L8 10.243z"/></svg>

</a>
<div class="dropdown-menu">
<ul>
<li class="visible-xs"><a class="dashboard-shortcuts-groups" title="群组" href="/dashboard/groups">群组
</a></li><li class=""><a title="活动" href="/dashboard/activity">活动
</a></li><li class=""><a class="dashboard-shortcuts-milestones" title="里程碑" href="/dashboard/milestones">里程碑
</a></li><li class=""><a class="dashboard-shortcuts-snippets" title="代码片段" href="/dashboard/snippets">代码片段
</a></li></ul>
</div>
</li>
<li class="hidden">
<a title="项目" class="dashboard-shortcuts-projects" href="/dashboard/projects">项目
</a></li>
<li class="line-separator hidden-xs"></li>
<li class=""><a class="admin-icon" title="管理区域" aria-label="管理区域" data-toggle="tooltip" data-placement="bottom" data-container="body" href="/admin"><i aria-hidden="true" data-hidden="true" class="fa fa-wrench fa-fw"></i>
</a></li></ul>

</div>
<div class="navbar-collapse collapse">
<ul class="nav navbar-nav">
<li class="header-new dropdown">
<a class="header-new-dropdown-toggle has-tooltip" title="新建..." ref="tooltip" aria-label="新建..." data-toggle="dropdown" data-placement="bottom" data-container="body" href="/projects/new"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9 7V4c0-.552-.448-1-1-1s-1 .448-1 1v3H4c-.552 0-1 .448-1 1s.448 1 1 1h3v3c0 .552.448 1 1 1s1-.448 1-1V9h3c.552 0 1-.448 1-1s-.448-1-1-1H9zM3 0h10c1.657 0 3 1.343 3 3v10c0 1.657-1.343 3-3 3H3c-1.657 0-3-1.343-3-3V3c0-1.657 1.343-3 3-3z"/></svg>

<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="caret-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 10.243l-4.95-4.95a1 1 0 0 0-1.414 1.414l5.657 5.657a.997.997 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0-1.414-1.414L8 10.243z"/></svg>

</a><div class="dropdown-menu-nav dropdown-menu-align-right">
<ul>
<li class="dropdown-bold-header">This project</li>
<li>
<a href="/ingo/ygg_api/issues/new">新建问题</a>
</li>
<li>
<a href="/ingo/ygg_api/merge_requests/new">新建合并请求</a>
</li>
<li class="header-new-project-snippet">
<a href="/ingo/ygg_api/snippets/new">新建代码片段</a>
</li>
<li class="divider"></li>
<li class="dropdown-bold-header">GitLab</li>
<li>
<a href="/projects/new">新建项目</a>
</li>
<li>
<a href="/groups/new">新建群组</a>
</li>
<li>
<a href="/snippets/new">新建代码片段</a>
</li>
</ul>
</div>
</li>

<li class="hidden-sm hidden-xs">
<div class="has-location-badge search search-form">
<form class="navbar-form" action="/search" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="&#x2713;" /><div class="search-input-container">
<div class="location-badge">当前项目</div>
<div class="search-input-wrap">
<div class="dropdown" data-url="/search/autocomplete">
<input type="search" name="search" id="search" placeholder="搜索" class="search-input dropdown-menu-toggle no-outline js-search-dashboard-options" spellcheck="false" tabindex="1" autocomplete="off" data-toggle="dropdown" data-issues-path="https://git.yingegou.com/dashboard/issues" data-mr-path="https://git.yingegou.com/dashboard/merge_requests" aria-label="搜索" />
<div class="dropdown-menu dropdown-select">
<div class="dropdown-content"><ul>
<li class="dropdown-menu-empty-item">
<a>
正在载入...
</a>
</li>
</ul>
</div><div class="dropdown-loading"><i aria-hidden="true" data-hidden="true" class="fa fa-spinner fa-spin"></i></div>
</div>
<i class="search-icon"></i>
<i class="clear-icon js-clear-input"></i>
</div>
</div>
</div>
<input type="hidden" name="group_id" id="group_id" class="js-search-group-options" />
<input type="hidden" name="project_id" id="search_project_id" value="6" class="js-search-project-options" data-project-path="ygg_api" data-name="ygg_api_server" data-issues-path="/ingo/ygg_api/issues" data-mr-path="/ingo/ygg_api/merge_requests" />
<input type="hidden" name="search_code" id="search_code" value="true" />
<input type="hidden" name="repository_ref" id="repository_ref" value="4995af6f1b98ddc91cbc7926c141f659b4db6926" />

<div class="search-autocomplete-opts hide" data-autocomplete-path="/search/autocomplete" data-autocomplete-project-id="6" data-autocomplete-project-ref="4995af6f1b98ddc91cbc7926c141f659b4db6926"></div>
</form></div>

</li>
<li class="visible-sm-inline-block visible-xs-inline-block">
<a title="搜索" aria-label="搜索" data-toggle="tooltip" data-placement="bottom" data-container="body" href="/search"><i aria-hidden="true" data-hidden="true" class="fa fa-search"></i>
</a></li>
<li class="user-counter">
<a title="问题" class="dashboard-shortcuts-issues" aria-label="问题" data-toggle="tooltip" data-placement="bottom" data-container="body" href="/dashboard/issues?assignee_id=19"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.458 15.012l.311.055a3 3 0 0 0 3.476-2.433l1.389-7.879A3 3 0 0 0 13.2 1.28L11.23.933a3.002 3.002 0 0 0-.824-.031c.364.59.58 1.28.593 2.02l1.854.328a1 1 0 0 1 .811 1.158l-1.389 7.879a1 1 0 0 1-1.158.81l-.118-.02a3.98 3.98 0 0 1-.541 1.935zM3 0h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3z"/></svg>

<span class="badge hidden issues-count">
0
</span>
</a></li>
<li class="user-counter">
<a title="合并请求" class="dashboard-shortcuts-merge_requests" aria-label="合并请求" data-toggle="tooltip" data-placement="bottom" data-container="body" href="/dashboard/merge_requests?assignee_id=19"><svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16"><path d="m5 5.563v4.875c1.024.4 1.75 1.397 1.75 2.563 0 1.519-1.231 2.75-2.75 2.75-1.519 0-2.75-1.231-2.75-2.75 0-1.166.726-2.162 1.75-2.563v-4.875c-1.024-.4-1.75-1.397-1.75-2.563 0-1.519 1.231-2.75 2.75-2.75 1.519 0 2.75 1.231 2.75 2.75 0 1.166-.726 2.162-1.75 2.563m-1 8.687c.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25m0-10c.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25"/><path d="m10.501 2c1.381.001 2.499 1.125 2.499 2.506v5.931c1.024.4 1.75 1.397 1.75 2.563 0 1.519-1.231 2.75-2.75 2.75-1.519 0-2.75-1.231-2.75-2.75 0-1.166.726-2.162 1.75-2.563v-5.931c0-.279-.225-.506-.499-.506v.926c0 .346-.244.474-.569.271l-2.952-1.844c-.314-.196-.325-.507 0-.71l2.952-1.844c.314-.196.569-.081.569.271v.93m1.499 12.25c.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25"/></svg>

<span class="badge hidden merge-requests-count">
0
</span>
</a></li>
<li class="user-counter">
<a title="待办事项" aria-label="待办事项" class="shortcuts-todos" data-toggle="tooltip" data-placement="bottom" data-container="body" href="/dashboard/todos"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M8.243 7.485l4.95-4.95a1 1 0 1 1 1.414 1.415L8.95 9.607a.997.997 0 0 1-1.414 0l-2.83-2.83a1 1 0 0 1 1.415-1.413l2.123 2.12zM12 11a1 1 0 0 1 2 0v2a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h2a1 1 0 1 1 0 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2z"/></svg>

<span class="badge hidden todos-count">
0
</span>
</a></li>
<li class="header-user dropdown">
<a class="header-user-dropdown-toggle" data-toggle="dropdown" href="/kwj"><img width="23" height="23" class="header-user-avatar lazy" data-src="https://secure.gravatar.com/avatar/63966e1baeb26d11da6e5c7bc3f99cdd?s=46&amp;d=identicon" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="caret-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 10.243l-4.95-4.95a1 1 0 0 0-1.414 1.414l5.657 5.657a.997.997 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0-1.414-1.414L8 10.243z"/></svg>

</a><div class="dropdown-menu-nav dropdown-menu-align-right">
<ul>
<li class="current-user">
<div class="user-name bold">
柯文俊
</div>
@kwj
</li>
<li class="divider"></li>
<li>
<a class="profile-link" data-user="kwj" href="/kwj">个人资料</a>
</li>
<li>
<a href="/profile">设置</a>
</li>
<li>
<a href="/help">帮助</a>
</li>
<li class="divider"></li>
<li>
<a class="sign-out-link" rel="nofollow" data-method="delete" href="/users/sign_out">退出</a>
</li>
</ul>
</div>
</li>
</ul>
</div>
<button class="navbar-toggle hidden-sm hidden-md hidden-lg" type="button">
<span class="sr-only">切换导航面板</span>
<i aria-hidden="true" data-hidden="true" class="fa fa-ellipsis-v js-navbar-toggle-right"></i>
<i aria-hidden="true" data-hidden="true" class="fa fa-times js-navbar-toggle-left"></i>
</button>
</div>
</div>
</header>


<div class="page-with-new-sidebar page-with-sidebar">
<div class="nav-sidebar">
<div class="nav-sidebar-inner-scroll">
<div class="context-header">
<a title="ygg_api_server" href="/ingo/ygg_api"><div class="avatar-container s40 project-avatar">
<div class="avatar s40 avatar-tile identicon" style="background-color: #EEEEEE; color: #555">Y</div>
</div>
<div class="sidebar-context-title">
ygg_api_server
</div>
</a></div>
<ul class="sidebar-top-level-items">
<li class="home"><a class="shortcuts-project" aria-label="Project overview" href="/ingo/ygg_api"><div class="nav-icon-container">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M8.462 2.177l-.038.044a.505.505 0 0 0 .038-.044zm-.787 0a.5.5 0 0 0 .038.043l-.038-.043zM3.706 7h8.725L8.069 2.585 3.706 7zM7 13.369V12a1 1 0 0 1 2 0v1.369h3V9H4v4.369h3zM14 9v4.836c0 .833-.657 1.533-1.5 1.533h-9c-.843 0-1.5-.7-1.5-1.533V9h-.448a1.1 1.1 0 0 1-.783-1.873L6.934.887a1.5 1.5 0 0 1 2.269 0l6.165 6.24A1.1 1.1 0 0 1 14.585 9H14z"/></svg>

</div>
<span class="nav-item-name">
概览
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item"><a href="/ingo/ygg_api"><strong class="fly-out-top-item-name">
Overview
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="Project details" class="shortcuts-project" href="/ingo/ygg_api"><span>Details</span>
</a></li><li class=""><a title="Activity" class="shortcuts-project-activity" href="/ingo/ygg_api/activity"><span>Activity</span>
</a></li><li class=""><a title="Cycle Analytics" class="shortcuts-project-cycle-analytics" href="/ingo/ygg_api/cycle_analytics"><span>Cycle Analytics</span>
</a></li></ul>
</li><li class="active"><a class="shortcuts-tree" aria-label="Repository" href="/ingo/ygg_api/tree/4995af6f1b98ddc91cbc7926c141f659b4db6926"><div class="nav-icon-container">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M8 2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7h-3a2 2 0 0 1-2-2V2zm2 .414V5h2.586L10 2.414zM5 0h4.586A2 2 0 0 1 11 .586L14.414 4A2 2 0 0 1 15 5.414V12a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm.5 11h5a.5.5 0 1 1 0 1h-5a.5.5 0 1 1 0-1zm0-2h5a.5.5 0 1 1 0 1h-5a.5.5 0 0 1 0-1zm0-2h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/></svg>

</div>
<span class="nav-item-name">
版本库
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item active"><a href="/ingo/ygg_api/tree/4995af6f1b98ddc91cbc7926c141f659b4db6926"><strong class="fly-out-top-item-name">
Repository
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class="active"><a href="/ingo/ygg_api/tree/4995af6f1b98ddc91cbc7926c141f659b4db6926">Files
</a></li><li class=""><a href="/ingo/ygg_api/commits/4995af6f1b98ddc91cbc7926c141f659b4db6926">Commits
</a></li><li class=""><a href="/ingo/ygg_api/branches">Branches
</a></li><li class=""><a href="/ingo/ygg_api/tags">Tags
</a></li><li class=""><a href="/ingo/ygg_api/graphs/4995af6f1b98ddc91cbc7926c141f659b4db6926">Contributors
</a></li><li class=""><a href="/ingo/ygg_api/network/4995af6f1b98ddc91cbc7926c141f659b4db6926">Graph
</a></li><li class=""><a href="/ingo/ygg_api/compare?from=master&amp;to=4995af6f1b98ddc91cbc7926c141f659b4db6926">Compare
</a></li><li class=""><a href="/ingo/ygg_api/graphs/4995af6f1b98ddc91cbc7926c141f659b4db6926/charts">Charts
</a></li></ul>
</li><li class=""><a class="shortcuts-issues" aria-label="Issues" href="/ingo/ygg_api/issues"><div class="nav-icon-container">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.458 15.012l.311.055a3 3 0 0 0 3.476-2.433l1.389-7.879A3 3 0 0 0 13.2 1.28L11.23.933a3.002 3.002 0 0 0-.824-.031c.364.59.58 1.28.593 2.02l1.854.328a1 1 0 0 1 .811 1.158l-1.389 7.879a1 1 0 0 1-1.158.81l-.118-.02a3.98 3.98 0 0 1-.541 1.935zM3 0h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3z"/></svg>

</div>
<span class="nav-item-name">
问题
</span>
<span class="badge count issue_counter">
3
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item"><a href="/ingo/ygg_api/issues"><strong class="fly-out-top-item-name">
Issues
</strong>
<span class="badge count issue_counter fly-out-badge">
3
</span>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="问题" href="/ingo/ygg_api/issues"><span>
列表
</span>
</a></li><li class=""><a title="Board" href="/ingo/ygg_api/boards"><span>
Board
</span>
</a></li><li class=""><a title="标记" href="/ingo/ygg_api/labels"><span>
标记
</span>
</a></li><li class=""><a title="里程碑" href="/ingo/ygg_api/milestones"><span>
里程碑
</span>
</a></li></ul>
</li><li class=""><a class="shortcuts-merge_requests" aria-label="Merge Requests" href="/ingo/ygg_api/merge_requests"><div class="nav-icon-container">
<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16"><path d="m5 5.563v4.875c1.024.4 1.75 1.397 1.75 2.563 0 1.519-1.231 2.75-2.75 2.75-1.519 0-2.75-1.231-2.75-2.75 0-1.166.726-2.162 1.75-2.563v-4.875c-1.024-.4-1.75-1.397-1.75-2.563 0-1.519 1.231-2.75 2.75-2.75 1.519 0 2.75 1.231 2.75 2.75 0 1.166-.726 2.162-1.75 2.563m-1 8.687c.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25m0-10c.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25"/><path d="m10.501 2c1.381.001 2.499 1.125 2.499 2.506v5.931c1.024.4 1.75 1.397 1.75 2.563 0 1.519-1.231 2.75-2.75 2.75-1.519 0-2.75-1.231-2.75-2.75 0-1.166.726-2.162 1.75-2.563v-5.931c0-.279-.225-.506-.499-.506v.926c0 .346-.244.474-.569.271l-2.952-1.844c-.314-.196-.325-.507 0-.71l2.952-1.844c.314-.196.569-.081.569.271v.93m1.499 12.25c.69 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25-.69 0-1.25.56-1.25 1.25 0 .69.56 1.25 1.25 1.25"/></svg>

</div>
<span class="nav-item-name">
合并请求
</span>
<span class="badge count merge_counter js-merge-counter">
0
</span>
</a><ul class="sidebar-sub-level-items is-fly-out-only">
<li class="fly-out-top-item"><a href="/ingo/ygg_api/merge_requests"><strong class="fly-out-top-item-name">
Merge Requests
</strong>
<span class="badge count merge_counter js-merge-counter fly-out-badge">
0
</span>
</a></li></ul>
</li><li class=""><a class="shortcuts-pipelines" aria-label="CI / CD" href="/ingo/ygg_api/pipelines"><div class="nav-icon-container">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" enable-background="new 0 0 16 16"><path d="m8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8m0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6"/><circle cx="12.5" cy="9.5" r=".5"/><circle cx="12.5" cy="6.5" r=".5"/><circle cx="10.5" cy="12.5" r=".5"/><circle cx="10.5" cy="3.5" r=".5"/><circle cx="5.5" cy="12.5" r=".5"/><circle cx="5.5" cy="3.5" r=".5"/><circle cx="3.5" cy="9.5" r=".5"/><circle cx="3.5" cy="6.5" r=".5"/><path d="m9 7.2c0 0 0-.1 0-.2v-1.9c0-.1 0-.1-.1-.2l-.8-.8c0 0-.1 0-.1 0l-.9.8c-.1.1-.1.1-.1.2v1.9c0 .1 0 .2 0 .2-.6.4-1 1-1 1.8 0 1.1.9 2 2 2s2-.9 2-2c0-.8-.4-1.4-1-1.8m-1 2.8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1"/></svg>

</div>
<span class="nav-item-name">
CI / CD
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item"><a href="/ingo/ygg_api/pipelines"><strong class="fly-out-top-item-name">
CI / CD
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="流水线" class="shortcuts-pipelines" href="/ingo/ygg_api/pipelines"><span>
流水线
</span>
</a></li><li class=""><a title="作业" class="shortcuts-builds" href="/ingo/ygg_api/-/jobs"><span>
作业
</span>
</a></li><li class=""><a title="日程表" class="shortcuts-builds" href="/ingo/ygg_api/pipeline_schedules"><span>
日程表
</span>
</a></li><li class=""><a title="运行环境" class="shortcuts-environments" href="/ingo/ygg_api/environments"><span>
运行环境
</span>
</a></li><li class=""><a title="图表" class="shortcuts-pipelines-charts" href="/ingo/ygg_api/pipelines/charts"><span>
图表
</span>
</a></li></ul>
</li><li class=""><a class="shortcuts-wiki" aria-label="Wiki" href="/ingo/ygg_api/wikis/home"><div class="nav-icon-container">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M8 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1v4.191a.5.5 0 0 1-.724.447l-1.052-.526a.5.5 0 0 0-.448 0l-1.052.526A.5.5 0 0 1 8 6.191V2zM4 0h8a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3z"/></svg>

</div>
<span class="nav-item-name">
维基
</span>
</a><ul class="sidebar-sub-level-items is-fly-out-only">
<li class="fly-out-top-item"><a href="/ingo/ygg_api/wikis/home"><strong class="fly-out-top-item-name">
Wiki
</strong>
</a></li></ul>
</li><li class=""><a class="shortcuts-snippets" aria-label="Snippets" href="/ingo/ygg_api/snippets"><div class="nav-icon-container">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.67 9.31a3.001 3.001 0 0 1 2.062 5.546 3 3 0 0 1-3.771-4.559 1.007 1.007 0 0 1-.095-.137l-4.5-7.794a1 1 0 1 1 1.732-1l4.5 7.794c.028.05.052.1.071.15zm-3.283.35l-.289.5c-.028.05-.06.095-.095.137a3.001 3.001 0 0 1-3.77 4.56A3 3 0 0 1 5.294 9.31c.02-.051.043-.102.071-.15l.866-1.5 1.155 2zm2.31-4l-1.156-2 1.325-2.294a1 1 0 1 1 1.732 1L9.696 5.66zm-5.465 7.464a1 1 0 1 0 1-1.732 1 1 0 0 0-1 1.732zm7.5 0a1 1 0 1 0-1-1.732 1 1 0 0 0 1 1.732z"/></svg>

</div>
<span class="nav-item-name">
代码片段
</span>
</a><ul class="sidebar-sub-level-items is-fly-out-only">
<li class="fly-out-top-item"><a href="/ingo/ygg_api/snippets"><strong class="fly-out-top-item-name">
Snippets
</strong>
</a></li></ul>
</li><li class=""><a class="shortcuts-tree" aria-label="Settings" href="/ingo/ygg_api/edit"><div class="nav-icon-container">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.415 5.803L1.317 4.084A.5.5 0 0 1 1.35 3.5l.805-.994a.5.5 0 0 1 .564-.153l1.878.704a5.975 5.975 0 0 1 1.65-.797L6.885.342A.5.5 0 0 1 7.36 0h1.28a.5.5 0 0 1 .474.342l.639 1.918c.594.181 1.15.452 1.65.797l1.877-.704a.5.5 0 0 1 .565.153l.805.994a.5.5 0 0 1 .032.584l-1.097 1.719c.217.551.354 1.143.399 1.76l1.731 1.058a.5.5 0 0 1 .227.54l-.288 1.246a.5.5 0 0 1-.44.385l-2.008.19a6.026 6.026 0 0 1-1.142 1.431l.265 1.995a.5.5 0 0 1-.277.516l-1.15.56a.5.5 0 0 1-.576-.1l-1.424-1.452a6.047 6.047 0 0 1-1.804 0l-1.425 1.453a.5.5 0 0 1-.576.1l-1.15-.561a.5.5 0 0 1-.276-.516l.265-1.995a6.026 6.026 0 0 1-1.143-1.43l-2.008-.191a.5.5 0 0 1-.44-.385L.058 9.16a.5.5 0 0 1 .226-.539l1.732-1.058a5.968 5.968 0 0 1 .399-1.76zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>

</div>
<span class="nav-item-name">
设置
</span>
</a><ul class="sidebar-sub-level-items">
<li class="fly-out-top-item"><a href="/ingo/ygg_api/edit"><strong class="fly-out-top-item-name">
Settings
</strong>
</a></li><li class="divider fly-out-top-item"></li>
<li class=""><a title="常规" href="/ingo/ygg_api/edit"><span>
常规
</span>
</a></li><li class=""><a title="成员" href="/ingo/ygg_api/project_members"><span>
成员
</span>
</a></li><li class=""><a title="集成" href="/ingo/ygg_api/settings/integrations"><span>
集成
</span>
</a></li><li class=""><a title="版本库" href="/ingo/ygg_api/settings/repository"><span>
版本库
</span>
</a></li><li class=""><a title="CI / CD" href="/ingo/ygg_api/settings/ci_cd"><span>
CI / CD
</span>
</a></li></ul>
</li><a class="toggle-sidebar-button js-toggle-sidebar" role="button" title="Toggle sidebar" type="button">
<i aria-hidden="true" data-hidden="true" class="fa fa-angle-double-left"></i>
<i aria-hidden="true" data-hidden="true" class="fa fa-angle-double-right"></i>
<span class="collapse-text">Collapse sidebar</span>
</a>
<button name="button" type="button" class="close-nav-button"><i aria-hidden="true" data-hidden="true" class="fa fa-times"></i>
<span class="collapse-text">Close sidebar</span>
</button>
<li class="hidden">
<a title="活动" class="shortcuts-project-activity" href="/ingo/ygg_api/activity"><span>
活动
</span>
</a></li>
<li class="hidden">
<a title="网络" class="shortcuts-network" href="/ingo/ygg_api/network/4995af6f1b98ddc91cbc7926c141f659b4db6926">图像
</a></li>
<li class="hidden">
<a title="聊天" class="shortcuts-repository-charts" href="/ingo/ygg_api/graphs/4995af6f1b98ddc91cbc7926c141f659b4db6926/charts">聊天
</a></li>
<li class="hidden">
<a class="shortcuts-new-issue" href="/ingo/ygg_api/issues/new">创建新问题
</a></li>
<li class="hidden">
<a title="作业" class="shortcuts-builds" href="/ingo/ygg_api/-/jobs">作业
</a></li>
<li class="hidden">
<a title="提交" class="shortcuts-commits" href="/ingo/ygg_api/commits/4995af6f1b98ddc91cbc7926c141f659b4db6926">提交
</a></li>
<li class="hidden">
<a title="问题看板" class="shortcuts-issue-boards" href="/ingo/ygg_api/boards">Issue Boards</a>
</li>
</ul>
</div>
</div>

<div class="content-wrapper page-with-new-nav">
<div class="mobile-overlay"></div>
<div class="alert-wrapper">


<nav class="breadcrumbs container-fluid container-limited" role="navigation">
<div class="breadcrumbs-container">
<button name="button" type="button" class="toggle-mobile-nav"><span class="sr-only">Open sidebar</span>
<i aria-hidden="true" data-hidden="true" class="fa fa-bars"></i>
</button><div class="breadcrumbs-links js-title-container">
<ul class="list-unstyled breadcrumbs-list js-breadcrumbs-list">
<li><a class="group-path breadcrumb-item-text js-breadcrumb-item-text " href="/ingo"><img class="avatar-tile lazy" width="15" height="15" data-src="/uploads/-/system/group/avatar/32/Group.png" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />ingo</a><i aria-hidden="true" data-hidden="true" class="fa fa-angle-right breadcrumbs-list-angle"></i></li> <li><a href="/ingo/ygg_api"><span class="breadcrumb-item-text js-breadcrumb-item-text">ygg_api_server</span></a><i aria-hidden="true" data-hidden="true" class="fa fa-angle-right breadcrumbs-list-angle"></i></li>

<li>
<h2 class="breadcrumbs-sub-title">Repository</h2>
</li>
</ul>
</div>

</div>
</nav>

<div class="flash-container flash-container-page">
</div>

</div>
<div class=" ">
<div class="content" id="content-body">


<div class="container-fluid container-limited">
<div class="tree-holder" id="tree-holder">
<div class="nav-block">
<div class="tree-ref-container">
<div class="tree-ref-holder">
<form class="project-refs-form" action="/ingo/ygg_api/refs/switch" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="&#x2713;" /><input type="hidden" name="destination" id="destination" value="blob" />
<input type="hidden" name="path" id="path" value=".gitlab/issue_templates/Bug.md" />
<div class="dropdown">
<button class="dropdown-menu-toggle js-project-refs-dropdown" type="button" data-toggle="dropdown" data-selected="4995af6f1b98ddc91cbc7926c141f659b4db6926" data-ref="4995af6f1b98ddc91cbc7926c141f659b4db6926" data-refs-url="/ingo/ygg_api/refs" data-field-name="ref" data-submit-form-on-click="true" data-visit="true"><span class="dropdown-toggle-text ">4995af6f1b98ddc91cbc7926c141f659b4db6926</span><i aria-hidden="true" data-hidden="true" class="fa fa-chevron-down"></i></button>
<div class="dropdown-menu dropdown-menu-selectable git-revision-dropdown">
<div class="dropdown-title"><span>Switch branch/tag</span><button class="dropdown-title-button dropdown-menu-close" aria-label="关闭" type="button"><i aria-hidden="true" data-hidden="true" class="fa fa-times dropdown-menu-close-icon"></i></button></div>
<div class="dropdown-input"><input type="search" id="" class="dropdown-input-field" placeholder="Search branches and tags" autocomplete="off" /><i aria-hidden="true" data-hidden="true" class="fa fa-search dropdown-input-search"></i><i role="button" aria-hidden="true" data-hidden="true" class="fa fa-times dropdown-input-clear js-dropdown-input-clear"></i></div>
<div class="dropdown-content"></div>
<div class="dropdown-loading"><i aria-hidden="true" data-hidden="true" class="fa fa-spinner fa-spin"></i></div>
</div>
</div>
</form>
</div>
<ul class="breadcrumb repo-breadcrumb">
<li>
<a href="/ingo/ygg_api/tree/4995af6f1b98ddc91cbc7926c141f659b4db6926">ygg_api
</a></li>
<li>
<a href="/ingo/ygg_api/tree/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab">.gitlab</a>
</li>
<li>
<a href="/ingo/ygg_api/tree/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates">issue_templates</a>
</li>
<li>
<a href="/ingo/ygg_api/blob/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates/Bug.md"><strong>Bug.md</strong>
</a></li>
</ul>
</div>
<div class="tree-controls">
<a class="btn shortcuts-find-file" rel="nofollow" href="/ingo/ygg_api/find_file/4995af6f1b98ddc91cbc7926c141f659b4db6926"><i aria-hidden="true" data-hidden="true" class="fa fa-search"></i>
<span>Find file</span>
</a>
<div class="btn-group" role="group"><a class="btn js-blob-blame-link" href="/ingo/ygg_api/blame/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates/Bug.md">Blame</a><a class="btn" href="/ingo/ygg_api/commits/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates/Bug.md">History</a><a class="btn js-data-file-blob-permalink-url" href="/ingo/ygg_api/blob/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates/Bug.md">Permalink</a></div>
</div>
</div>

<div class="info-well hidden-xs">
<div class="well-segment">
<ul class="blob-commit-info">
<li class="commit flex-row js-toggle-container" id="commit-577ff484">
<div class="avatar-cell hidden-xs">
<a href="/sk"><img alt="孙可&#39;s avatar" src="https://secure.gravatar.com/avatar/8fa8a90311f728e77971c82f6db29b1c?s=72&amp;d=identicon" data-container="body" class="avatar s36 hidden-xs has-tooltip" title="孙可" /></a>
</div>
<div class="commit-detail">
<div class="commit-content">
<a class="commit-row-message item-title" href="/ingo/ygg_api/commit/577ff484c23043d677f171ea96715b1504ecb9c9">增加新文件</a>
<span class="commit-row-message visible-xs-inline">
&middot;
577ff484
</span>
<div class="commiter">
<a class="commit-author-link has-tooltip" title="sk@yingougou.com" href="/sk">孙可</a> committed <time class="js-timeago" title="Sep 13, 2017 1:56pm" datetime="2017-09-13T05:56:55Z" data-toggle="tooltip" data-placement="top" data-container="body">Sep 13, 2017</time>
</div>
</div>
<div class="commit-actions hidden-xs">

<a class="commit-sha btn btn-transparent" href="/ingo/ygg_api/commit/577ff484c23043d677f171ea96715b1504ecb9c9">577ff484</a>
<button class="btn btn-clipboard btn-transparent" data-toggle="tooltip" data-placement="bottom" data-container="body" data-title="Copy commit SHA to clipboard" data-clipboard-text="577ff484c23043d677f171ea96715b1504ecb9c9" type="button" title="Copy commit SHA to clipboard" aria-label="Copy commit SHA to clipboard"><i aria-hidden="true" aria-hidden="true" data-hidden="true" class="fa fa-clipboard"></i></button>

</div>
</div>
</li>

</ul>
</div>

</div>
<div class="blob-content-holder" id="blob-content-holder">
<article class="file-holder">
<div class="js-file-title file-title-flex-parent">
<div class="file-header-content">
<i aria-hidden="true" data-hidden="true" class="fa fa-file-text-o fa-fw"></i>
<strong class="file-title-name">
Bug.md
</strong>
<button class="btn btn-clipboard btn-transparent prepend-left-5" data-toggle="tooltip" data-placement="bottom" data-container="body" data-class="btn-clipboard btn-transparent prepend-left-5" data-title="复制文件路径到剪贴板" data-clipboard-text="{&quot;text&quot;:&quot;.gitlab/issue_templates/Bug.md&quot;,&quot;gfm&quot;:&quot;`.gitlab/issue_templates/Bug.md`&quot;}" type="button" title="复制文件路径到剪贴板" aria-label="复制文件路径到剪贴板"><i aria-hidden="true" aria-hidden="true" data-hidden="true" class="fa fa-clipboard"></i></button>
<small>
495 Bytes
</small>
</div>

<div class="file-actions hidden-xs">
<div class="btn-group js-blob-viewer-switcher" role="group">
<button aria-label="Display source" class="btn btn-default btn-sm js-blob-viewer-switch-btn has-tooltip" data-container="body" data-viewer="simple" title="Display source">
<i aria-hidden="true" data-hidden="true" class="fa fa-code"></i>
</button><button aria-label="Display rendered file" class="btn btn-default btn-sm js-blob-viewer-switch-btn has-tooltip" data-container="body" data-viewer="rich" title="Display rendered file">
<i aria-hidden="true" data-hidden="true" class="fa fa-file-text-o"></i>
</button></div>

<div class="btn-group" role="group"><button class="btn btn btn-sm js-copy-blob-source-btn" data-toggle="tooltip" data-placement="bottom" data-container="body" data-class="btn btn-sm js-copy-blob-source-btn" data-title="复制源码到剪贴板" data-clipboard-target=".blob-content[data-blob-id=&#39;518a781905c2a58609a7d15a7d500f3ab9258c64&#39;]" type="button" title="复制源码到剪贴板" aria-label="复制源码到剪贴板"><i aria-hidden="true" aria-hidden="true" data-hidden="true" class="fa fa-clipboard"></i></button><a class="btn btn-sm has-tooltip" target="_blank" rel="noopener noreferrer" title="打开原始文件" data-container="body" href="/ingo/ygg_api/raw/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates/Bug.md"><i aria-hidden="true" data-hidden="true" class="fa fa-file-code-o"></i></a></div>
<div class="btn-group" role="group"><button name="button" type="submit" class="btn js-edit-blob  disabled has-tooltip" title="你只能在分支上修改编辑文件" data-container="body">编辑</button><button name="button" type="submit" class="btn btn-default disabled has-tooltip" title="你只能在分支上替换文件" data-container="body">替换</button><button name="button" type="submit" class="btn btn-remove disabled has-tooltip" title="你只能在分支上删除文件" data-container="body">删除</button></div>
</div>
</div>
<div class="js-file-fork-suggestion-section file-fork-suggestion hidden">
<span class="file-fork-suggestion-note">
您不能直接
<span class="js-file-fork-suggestion-section-action">
编辑
</span>
这个项目的文件。请派生这个项目，
在派生项目上进行修改，并提交合并请求。
</span>
<a class="js-fork-suggestion-button btn btn-grouped btn-inverted btn-new" rel="nofollow" data-method="post" href="/ingo/ygg_api/blob/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates/Bug.md">派生</a>
<button class="js-cancel-fork-suggestion-button btn btn-grouped" type="button">
取消
</button>
</div>


<div class="blob-viewer hidden" data-type="simple" data-url="/ingo/ygg_api/blob/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates/Bug.md?format=json&amp;viewer=simple">
<div class="text-center prepend-top-default append-bottom-default">
<i aria-hidden="true" aria-label="正在载入内容…" class="fa fa-spinner fa-spin fa-2x"></i>
</div>

</div>

<div class="blob-viewer" data-type="rich" data-url="/ingo/ygg_api/blob/4995af6f1b98ddc91cbc7926c141f659b4db6926/.gitlab/issue_templates/Bug.md?format=json&amp;viewer=rich">
<div class="text-center prepend-top-default append-bottom-default">
<i aria-hidden="true" aria-label="正在载入内容…" class="fa fa-spinner fa-spin fa-2x"></i>
</div>

</div>


</article>
</div>

</div>
</div>

</div>
</div>
</div>
</div>


</body>
</html>


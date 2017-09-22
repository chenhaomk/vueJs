## 文件目录说明
1. 整体项目在Project目录下。地址为：\Project\yingogo\FrameWork\FE\Project
2. 项目文件夹下，每个文件夹代表一个项目文件，例如：Member.Mobile等。
3. 目录结合规则如下图：

    `直译名称+下划线+功能名称+”.”+端名称` 端名称分为Mobile和Web

    例:

    `Member.Mobile、Member.Web、Member_Payment.Mobile、Member_Payment.Web`

  - 文档结构如图：

   * `assets`：存放公共资源，如果需要，可自行加入目录，存放原则：1、资源权重性低；2、资源公用性；
   * `controllers`：名为控制器，存放界面行为js文件，index或者login放置此目录更目录下，其他文件按照模块放置。user为样例，开发时删除。
   * `plugins`：插件，存放第三方插件目录，每个插件存放一个文件夹。插件文件夹下按照需要，可存放js，css ，img等需要文件。现阶段都只包含js文件，但为了结构统一整齐，尽量按照结构来放置。
   * `theme`：存放样式，样式结构和控制器相同。
   * `views`：存放界面文件，界面文件夹只允许包含*.html文件存在，并且按模块分类。

       > 统一原则：前期开发阶段可根据需要修改目录名称以及结构，修改完成后需修改此文件。
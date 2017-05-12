// unity.js
// https://build-api.cloud.unity3d.com/docs/1.0.0/index.html#operation-webhooks-intro
// ========
module.exports = {
    parse: function (req, discordPayload) {
        const body = req.body;
        const hookID = body.hookId;

        discordPayload.setEmbedColor(0x222C37);

        if (hookID === null) {
            const projectName = body.projectName;
            const projectTarget = body.buildTargetName;
            const projectVersion = body.buildNumber;
            const share = body.links.share_url;
            const type = body.buildStatus;
            const ref = body.ref;
            let content = "No download available.";
            const user = {
                name: projectTarget,
                icon_url: "https://developer.cloud.unity3d.com/images/icon-default.png"
            };
            let download = "";
            let link = "";
            discordPayload.setUser(projectName + "Buildserver", "https://developer.cloud.unity3d.com/images/icon-default.png");
            switch (type) {
                case "success":
                    if (share !== null) {
                        download = share.href;
                        content = "[`Download it here`](" + download + ")";
                    }
                    link = "";
                    content = "**New build**\n" + content;
                    break;
                case "queued":
                    content = "**In build queue**\nIt will be update to version  #" + projectVersion + "\n";
                    break;
                case "started":
                    content = "**Build is started**\nBuilding version  #" + projectVersion + "\n";
                    break;
                case "failed":
                    content = "**Build failed**\n" + "Latest version is still  #" + (projectVersion - 1) + "\n";
                    break;

            }
            discordPayload.addEmbed({
                title: "[" + projectName + "] " + " version #" + projectVersion,
                url: download,
                author: user,
                description: content
            });
        } else {
            discordPayload.setContent("**Ping from host!**");
        }
    }
};

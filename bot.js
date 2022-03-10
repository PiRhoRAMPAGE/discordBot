// https://pirho.tech/discord

function discordBot(token) {

    this.token=token;
    this.wait=(ms) => new Promise((res) => setTimeout(res, ms));

    this.self={
        get: (optionalParam) => (optionalParam) ? JSON.parse(apiCall("GET", "/users/@me", null, this.token))[optionalParam] : JSON.parse(apiCall("GET", "/users/@me", null, this.token)),
        set: (paramsArray) => apiCall("PATCH", "/users/@me", paramsArray, this.token),
    }

    this.message={
        get: (channelID, limit=50) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/messages?limit=" + limit, null, this.token)),
        send: (channelID, message) => apiCall("POST", "/channels/" + channelID + "/messages", {content: message}, this.token),
        delete: (channelID, messageID) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID, null, this.token),
        edit: (channelID, messageID, message) => apiCall("PATCH", "/channels/" + channelID + "/messages/" + messageID, {content: message}, this.token),
        sendSticker: (channelID, stickerID) => apiCall("POST", "/channels/" + channelID + "/messages", {sticker_ids: [stickerID]}, this.token),
        reply: (guildID, channelID, messageID, message) => apiCall("POST", "/channels/" + channelID + "/messages", {content: message, message_reference: {guild_id: guildID, channel_id: channelID, message_id: messageID}}, this.token),
        reactions: {
            add: (channelID, messageID, emoji) => apiCall("PUT", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji) + "/@me", null, this.token),
            remove: (channelID, messageID, emoji) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji) + "/@me", null, this.token),
            check: (channelID, messageID, emoji) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji), null, this.token)),
            delete: (channelID, messageID, emoji) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji), null, this.token),
            deleteAll: (channelID, messageID) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID + "/reactions/", null, this.token),
        },
    }

    this.user={
        get: (userID) => JSON.parse(apiCall("GET", "/users/" + userID, null, this.token)),
        kick: (guildID, userID) => apiCall("DELETE", "/guilds/" + guildID + "/members/" + userID, null, this.token),
        ban: (guildID, userID, reason) => apiCall("PUT", "/guilds/" + guildID + "/bans/" + userID, {delete_message_days: "7", reason}, this.token),
        unban: (guildID, userID) => apiCall("DELETE", "/guilds/" + guildID + "/bans/" + userID, null, this.token),
        addRole: (guildID, userID, roleID) => apiCall("PUT","/guilds/" + guildID + "/members/" + userID + "/roles/" + roleID, this.token),
        removeRole: (guildID, userID, roleID) => apiCall("DELETE", "/guilds/" + guildID + "/members/" + userID + "/roles/" + roleID, this.token),
        nickname: (guildID, nick) => apiCall("PATCH", "/guilds/" + guildID + "/members/@me/nick", {nick}, this.token),
    }

    this.guild={
        auditLog: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/audit-logs", null, this.token)),
        list: () => JSON.parse(apiCall("GET", "/users/@me/guilds", null, this.token)),
        join: (invite) => apiCall("POST", "/invites/" + inviteCode, {}, this.token),
        leave: (guildID) => apiCall("DELETE", "/users/@me/guilds/" + guildID, null, this.token),
        listBans: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/bans", null, this.token)),
        get: (guildID, optionalParam) => (optionalParam) ? JSON.parse(apiCall("DELETE", "/guilds/" + guildID, null))[optionalParam] : JSON.parse(apiCall("DELETE", "/guilds/" + guildID, null, this.token)),
        set: (guildID, paramsArray) => apiCall("PATCH", "/guilds/" + guildID, paramsArray, this.token),
    }

    this.channel={
        list: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/channels", null, this.token)),
        create: (guildID, name, type) => apiCall("POST", "/guilds/" + guildID + "/channels", {name, type}, this.token),
        delete: (channelID) => apiCall("DELETE", "/channels/" + channelID, null, this.token),
        get: (channelID, optionalParam) => (optionalParam) ? JSON.parse(apiCall("GET", "/channels/" + channelID, null, this.token))[optionalParam] : JSON.parse(apiCall("GET", "/channels/" + channelID, null, this.token)),
        set: (channelID, paramsArray) => apiCall("PATCH", "/channels/" + channelID, paramsArray, this.token),
        thread: {
            startWithoutMessage: (channelID, name) => apiCall("POST", "/channels/" + channelID + "/threads", {name}, this.token),
            startWithMessage: (channelID, messageID, name) => apiCall("POST", "/channels/" + channelID + "/messages/" + messageID + "/threads", {name}, this.token),
            join: (channelID) => apiCall("PUT", "/channels/" + channelID + "/thread-members/@me", null, this.token),
            leave: (channelID) => apiCall("DELETE", "/channels/" + channelID + "/thread-members/@me", null, this.token),
            addMember: (channelID, userID) => apiCall("PUT", "/channels/" + channelID + "/thread-members/" + userID, null, this.token),
            removeMember: (channelID, userID) => apiCall("DELETE", "/channels/" + channelID + "/thread-members/" + userID, null, this.token),
            getMember: (channelID, userID) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/thread-members/" + userID, null, this.token)),
            listMembers: (channelID) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/thread-members", null, this.token)),
            listActiveThreads: (channelID) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/threads/active", null, this.token)),
            listPublicArchivedThreads: (channelID, before, limit) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/threads/archived/public", {before, limit}, this.token)),
            listPrivateArchivedThreads: (channelID, before, limit) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/threads/archived/private", {before, limit}, this.token)),
            listJoinedPrivateArchivedThreads: (channelID, before, limit) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/users/@me/threads/archived/private", {before, limit}, this.token)),
        }
    }

    this.role={
        list: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/roles", null, this.token)),
        create: (guildID, name) => apiCall("POST", "/guilds/" + guildID + "/roles", {name}, this.token),
        delete: (guildID, roleID) => apiCall("DELETE", "/guilds/" + guildID + "/roles/" + roleID, null, this.token),
        get: (guildID, roleID, optionalParam) => (optionalParam) ? JSON.parse(apiCall("GET", "/guilds/" + guildID + "/roles/" + roleID, null))[optionalParam] : JSON.parse(apiCall("GET", "/guilds/" + guildID + "/roles/" + roleID, null, this.token)),
        set: (guildID, roleID, paramsArray) => apiCall("PATCH", "/guilds/" + guildID + "/roles/" + roleID, paramsArray, this.token),
    }

    this.emoji={
        list: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/emojis", null, this.token)),
        create: (guildID, name, image, roles) => apiCall("POST", "/guilds/" + guildID + "/emojis", {name, image, roles}, this.token),
        delete: (guildID, emojiID) => apiCall("DELETE", "/guilds/" + guildID + "/emojis/" + emojiID, null, this.token),
        get: (guildID, emojiID, optionalParam) => (optionalParam) ? JSON.parse(apiCall("GET", "/guilds/" + guildID + "/emojis/" + emojiID, null, this.token))[optionalParam] : JSON.parse(apiCall("GET", "/guilds/" + guildID + "/emojis/" + emojiID, null, this.token)),
        set: (guildID, emojiID, paramsArray) => apiCall("PATCH", "/guilds/" + guildID + "/emojis/" + emojiID, paramsArray, this.token),
    }

    this.sticker={
        list: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/stickers", null, this.token)),
        create: (guildID, name, description, tags, file) => apiCall("POST", "/guilds/" + guildID + "/stickers", {name, description, tags, file}, this.token),
        delete: (guildID, stickerID) => apiCall("DELETE", "/guilds/" + guildID + "/stickers/" + stickerID, null, this.token),
        get: (guildID, stickerID, optionalParam) => (optionalParam) ? JSON.parse(apiCall("GET", "/guilds/" + guildID + "/stickers/" + stickerID, null, this.token))[optionalParam] : JSON.parse(apiCall("GET", "/guilds/" + guildID + "/stickers/" + stickerID, null, this.token)),
        set: (guildID, stickerID, paramsArray) => apiCall("PATCH", "/guilds/" + guildID + "/stickers/" + stickerID, paramsArray, this.token),
    }
    
}

function apiCall(method, endpoint, data, token) {
    let http=new XMLHttpRequest();
    http.withCredentials=true;
    http.open(method, "https://discord.com/api/v9" + endpoint, 0);
    http.setRequestHeader("authorization", token);
    http.setRequestHeader("content-type", "application/json");
    http.send(JSON.stringify(data))
    return http.response;
}


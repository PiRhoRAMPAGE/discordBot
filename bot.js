// https://pirho.tech/discord

function discordBot(token) {

    this.token=token;
    this.guildID=0;
    this.channelID=0;
    this.status=0;
    this.response=null;
    this.responseHeaders=null;

    this.wait=(ms) => new Promise((res) => setTimeout(res, ms));
    this.online=() => {try{return this.self.get("discriminator") <= 9999} catch(e) {return false}};

    this.self={
        get: (optionalParam=null) => (optionalParam) ? JSON.parse(apiCall("GET", "/users/@me", null, this))[optionalParam] : JSON.parse(apiCall("GET", "/users/@me", null, this)),
        set: (paramsArray) => apiCall("PATCH", "/users/@me", paramsArray, this),
        isTyping: (channelID) => apiCall("POST", "/channels/" + channelID + "/typing", null, this),
    }

    this.message={
        list: (channelID, optionalLimit=50) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/messages?limit=" + optionalLimit, null, this)),
        send: (channelID, message) => apiCall("POST", "/channels/" + channelID + "/messages", {content: message}, this),
        delete: (channelID, messageID) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID, null, this),
        edit: (channelID, messageID, message) => apiCall("PATCH", "/channels/" + channelID + "/messages/" + messageID, {content: message}, this),
        sendSticker: (channelID, stickerID) => apiCall("POST", "/channels/" + channelID + "/messages", {sticker_ids: [stickerID]}, this),
        reply: (guildID, channelID, messageID, message) => apiCall("POST", "/channels/" + channelID + "/messages", {content: message, message_reference: {guild_id: guildID, channel_id: channelID, message_id: messageID}}, this),
        reaction: {
            add: (channelID, messageID, emoji) => apiCall("PUT", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji) + "/@me", null, this),
            remove: (channelID, messageID, emoji) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji) + "/@me", null, this),
            check: (channelID, messageID, emoji) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji), null, this)),
            deleteAll: (channelID, messageID) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID + "/reactions", null, this),
            deleteAllByEmoji: (channelID, messageID, emoji) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji), null, this),
            deleteOwnByEmoji: (channelID, messageID, emoji) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji) + "/@me", null, this),
            deleteUserByEmoji: (channelID, messageID, userID, emoji) => apiCall("DELETE", "/channels/" + channelID + "/messages/" + messageID + "/reactions/" + encodeURI(emoji) + "/" + userID, null, this),
        },
    }

    this.user={
        get: (userID, optionalParam=null) => (optionalParam) ? JSON.parse(apiCall("GET", "/users/" + userID, null, this))[optionalParam] : JSON.parse(apiCall("GET", "/users/" + userID, null, this)),
        kick: (guildID, userID) => apiCall("DELETE", "/guilds/" + guildID + "/members/" + userID, null, this),
        ban: (guildID, userID, optionalReason=null) => apiCall("PUT", "/guilds/" + guildID + "/bans/" + userID, {delete_message_days: "7", optionalReason}, this),
        unban: (guildID, userID) => apiCall("DELETE", "/guilds/" + guildID + "/bans/" + userID, null, this),
        addRole: (guildID, userID, roleID) => apiCall("PUT","/guilds/" + guildID + "/members/" + userID + "/roles/" + roleID, this),
        removeRole: (guildID, userID, roleID) => apiCall("DELETE", "/guilds/" + guildID + "/members/" + userID + "/roles/" + roleID, this),
        nickname: (guildID, nick) => apiCall("PATCH", "/guilds/" + guildID + "/members/@me/nick", {nick}, this),
    }

    this.guild={
        auditLog: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/audit-logs", null, this)),
        list: () => JSON.parse(apiCall("GET", "/users/@me/guilds", null, this)),
        join: (inviteCode) => apiCall("POST", "/invites/" + inviteCode, {}, this),
        leave: (guildID) => apiCall("DELETE", "/users/@me/guilds/" + guildID, null, this),
        listBans: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/bans", null, this)),
        get: (guildID, optionalParam=null) => (optionalParam) ? JSON.parse(apiCall("GET", "/guilds/" + guildID, null))[optionalParam] : JSON.parse(apiCall("GET", "/guilds/" + guildID, null, this)),
        set: (guildID, paramsArray) => apiCall("PATCH", "/guilds/" + guildID, paramsArray, this),
    }

    this.channel={
        list: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/channels", null, this)),
        create: (guildID, name, type) => apiCall("POST", "/guilds/" + guildID + "/channels", {name, type}, this),
        delete: (channelID) => apiCall("DELETE", "/channels/" + channelID, null, this),
        get: (channelID, optionalParam=null) => (optionalParam) ? JSON.parse(apiCall("GET", "/channels/" + channelID, null, this))[optionalParam] : JSON.parse(apiCall("GET", "/channels/" + channelID, null, this)),
        set: (channelID, paramsArray) => apiCall("PATCH", "/channels/" + channelID, paramsArray, this),
        pin: {
            list: (channelID) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/pins/", null, this)),
            add: (channelID, messageID) => apiCall("PUT", "/channels/" + channelID + "/pins/" + messageID, null, this),
            remove: (channelID, messageID) => apiCall("DELETE", "/channels/" + channelID + "/pins/" + messageID, null, this),
        },
        thread: {
            startWithoutMessage: (channelID, name) => apiCall("POST", "/channels/" + channelID + "/threads", {name}, this),
            startWithMessage: (channelID, messageID, name) => apiCall("POST", "/channels/" + channelID + "/messages/" + messageID + "/threads", {name}, this),
            join: (channelID) => apiCall("PUT", "/channels/" + channelID + "/thread-members/@me", null, this),
            leave: (channelID) => apiCall("DELETE", "/channels/" + channelID + "/thread-members/@me", null, this),
            addMember: (channelID, userID) => apiCall("PUT", "/channels/" + channelID + "/thread-members/" + userID, null, this),
            removeMember: (channelID, userID) => apiCall("DELETE", "/channels/" + channelID + "/thread-members/" + userID, null, this),
            getMember: (channelID, userID) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/thread-members/" + userID, null, this)),
            listMembers: (channelID) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/thread-members", null, this)),
            listActiveThreads: (channelID) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/threads/active", null, this)),
            listPublicArchivedThreads: (channelID, before, limit) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/threads/archived/public", {before, limit}, this)),
            listPrivateArchivedThreads: (channelID, before, limit) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/threads/archived/private", {before, limit}, this)),
            listJoinedPrivateArchivedThreads: (channelID, before, limit) => JSON.parse(apiCall("GET", "/channels/" + channelID + "/users/@me/threads/archived/private", {before, limit}, this)),
        } 
    }

    this.role={
        list: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/roles", null, this)),
        create: (guildID, name) => apiCall("POST", "/guilds/" + guildID + "/roles", {name}, this),
        delete: (guildID, roleID) => apiCall("DELETE", "/guilds/" + guildID + "/roles/" + roleID, null, this),
        get: (guildID, roleID, optionalParam=null) => (optionalParam) ? JSON.parse(apiCall("GET", "/guilds/" + guildID + "/roles/" + roleID, null))[optionalParam] : JSON.parse(apiCall("GET", "/guilds/" + guildID + "/roles/" + roleID, null, this)),
        set: (guildID, roleID, paramsArray) => apiCall("PATCH", "/guilds/" + guildID + "/roles/" + roleID, paramsArray, this),
    }

    this.emoji={
        list: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/emojis", null, this)),
        create: (guildID, name, image, roles) => apiCall("POST", "/guilds/" + guildID + "/emojis", {name, image, roles}, this),
        delete: (guildID, emojiID) => apiCall("DELETE", "/guilds/" + guildID + "/emojis/" + emojiID, null, this),
        get: (guildID, emojiID, optionalParam=null) => (optionalParam) ? JSON.parse(apiCall("GET", "/guilds/" + guildID + "/emojis/" + emojiID, null, this))[optionalParam] : JSON.parse(apiCall("GET", "/guilds/" + guildID + "/emojis/" + emojiID, null, this)),
        set: (guildID, emojiID, paramsArray) => apiCall("PATCH", "/guilds/" + guildID + "/emojis/" + emojiID, paramsArray, this),
    }

    this.sticker={
        list: (guildID) => JSON.parse(apiCall("GET", "/guilds/" + guildID + "/stickers", null, this)),
        create: (guildID, name, description, tags, file) => apiCall("POST", "/guilds/" + guildID + "/stickers", {name, description, tags, file}, this),
        delete: (guildID, stickerID) => apiCall("DELETE", "/guilds/" + guildID + "/stickers/" + stickerID, null, this),
        get: (guildID, stickerID, optionalParam=null) => (optionalParam) ? JSON.parse(apiCall("GET", "/guilds/" + guildID + "/stickers/" + stickerID, null, this))[optionalParam] : JSON.parse(apiCall("GET", "/guilds/" + guildID + "/stickers/" + stickerID, null, this)),
        set: (guildID, stickerID, paramsArray) => apiCall("PATCH", "/guilds/" + guildID + "/stickers/" + stickerID, paramsArray, this),
    }
    
}

function apiCall(method, endpoint, data, bot) {
    let http=new XMLHttpRequest();
    http.withCredentials=true;
    http.open(method, "https://discord.com/api/v9" + endpoint, 0);
    http.setRequestHeader("authorization", bot.token);
    http.setRequestHeader("content-type", "application/json");
    http.send(JSON.stringify(data))
    bot.status=http.status;
    bot.response=http.response;
    bot.responseHeaders=http.getAllResponseHeaders();
    return http.response;
}

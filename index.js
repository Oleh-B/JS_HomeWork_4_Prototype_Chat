;(function() {
    try {
        if (typeof window.User === 'undefined' 
         && typeof window.ChatHistory === 'undefined'
         && typeof window.Message === 'undefined') { 

                Chat.chats = [];
                
                Chat.allChats = function() {
                    return Chat.chats
                }
         
            function Chat(name) {
                if(!name) throw new Error('Please assign a name to your new chat');
                this.name = name.toString();

                Chat.chats.push(this);
            
                this.logedUsers = [];
                this.history = [];
            }
              
            Chat.prototype.login = function(user) {
                var userName = user.name;
                if(user instanceof User && this.logedUsers.length === 0) {
                    this.logedUsers.push(user)
                } else if(user instanceof User && this.logedUsers.length > 0) {
                    var checkUser = [];
                    this.logedUsers.filter(function(chatUser) {
                        if(userName === chatUser.name) {
                            throw new Error(chatUser.name + ' already exist in this chat')
                        } else {
                            return checkUser.push(user)
                        }
                    })
                    this.logedUsers.push(checkUser[0])
                }    
            }

            Chat.prototype.logout = function() {
                if(arguments.length === 0) throw new Error("User is not specified")
                for(var i = 0; i < arguments.length; i++) {
                    var userName = arguments[i].name;
                    this.logedUsers = this.logedUsers.filter(function(user) {
                        if(userName !== user.name) {
                            return user
                        }
                    })
                }
            }
           
            Chat.prototype.sendMessage = function(user, messageText) {
                if(arguments.length === 0) {
                    throw new Error("User and message are undefined")
                } else if(arguments.length === 1 && user instanceof User) {
                    throw new Error("Type a message")
                } else if(arguments.length === 1 && !(user instanceof User)) {
                    throw new Error("instance of User isnt specified")
                }
                var userName = user.name;
                var connectedUser = this.logedUsers.filter(function(chatUser) {
                    if(chatUser instanceof User && chatUser.name === userName) {
                        return chatUser
                    } else {
                        return false
                    }
                })
                if(connectedUser[0]) {
                    var message = new Message(user,messageText);
                    this.history.push(message);
                    return message
                } else {
                    throw new Error(userName + " need to sign in " + this.name + "-Chat")
                }
            };

            Chat.prototype.checkIfLoged = function(user) {
                if(!user) throw new Error("User is not specified")
                var userName = user.name;
                if(this.logedUsers.length === 0) {
                    throw new Error("User is not log in")
                } else {
                    var checked = this.logedUsers.map(function(chatUser) {
                        if(chatUser instanceof User && chatUser.name === userName) {
                            return chatUser.name
                        } else {
                            return false
                        }
                    })
                    if(checked.indexOf(userName) !== -1) {
                        return true
                    } else {
                        return false
                    }
                }      
            }

            Chat.prototype.showHistory = function(index,amount) {
                if(arguments.length === 2) {
                    index = arguments[0];
                    amount = arguments[1];
                } else if(arguments.length === 1) {
                    amount = arguments[0]
                    index = 0;
                } else if(arguments.length === 0) {
                    amount = 10;
                    index = 0;
                }    
                for (var i = index; i < amount; i++) {
                    if(this.history[i] === undefined) {
                        break
                    }
                    console.log(`User:[${this.history[i].user.name}] {loged: ${this.checkIfLoged(this.history[i].user)}} [${this.history[i].messageCreateTime()}] message: "${this.history[i].message}"`);
                }
            }

            Chat.prototype.unReadMessagesBy = function(user) {
                if(!user) throw new Error("Type User instance");
                if(arguments.length === 1 && this.checkIfLoged(user) === false) throw new Error(`${user.name} need to log in`)
                if(arguments.length === 1 && this.checkIfLoged(user) === true) {
                    var unreadMessages = [];
                    this.user = user;
                    for (var i = 0; i < this.history.length; i++) {
                        var message = this.history[i];
                        if(message.messageWasRead.indexOf(user.name) !== -1) {
                            continue;
                        } else { 
                            unreadMessages.push(message) 
                        }
                        message.messageWasReadBy(user); 
                    }
                    return unreadMessages;
                } else if(arguments.length === 2) {
                    var unreadMessages = [];
                    this.user = arguments[0];
                    var amount = Number(arguments[1]);
                    var checkHistory = [];
                    for(var j = 0; j < this.history.length; j++) {
                        var checkMessage = this.history[j];
                        if(checkMessage.messageWasRead.indexOf(user.name) !== -1) {
                            continue;
                        } else {
                            checkHistory.push(checkMessage)
                        }
                    }
                    var count = checkHistory.length - amount;
                    for (var i = checkHistory.length - 1; i >= count; i--) {
                        var message = checkHistory[i];
                        if(message === undefined) { 
                            break;
                        } else if(message.messageWasRead.indexOf(user.name) !== -1) {
                            continue;
                        } else { 
                            unreadMessages.push(message) 
                        }
                        message.messageWasReadBy(user); 
                    }
                    return unreadMessages;
                } 
            }
            
            function Message(user,messageText) {
                if(!user || !messageText) throw new Error('User or message is undefined');

                for(var j = 0; j < Chat.chats.length; j++) {
                    var chat = Chat.chats[j];
                    if(chat) {
                        for(var i = 0; i <= chat.logedUsers.length; i++) {
                            if( chat.logedUsers.length === 0 || 
                                chat.logedUsers[i].name !== user.name &&
                                chat.logedUsers[chat.logedUsers.length - 1].name !== user.name) {
                                console.error(`"${user.name}" is not login in "${chat.name}-Chat"`);
                                break;
                            } else {
                                console.log(`"${user.name}"is in:"${chat.name}-Chat"`)
                                break;
                            }
                        }
                    }
                }
                this.user = user;
                this.message = messageText;
                this.messageWasRead = [];
                this.messageWasRead.push(this.user.name);
            }

            Message.prototype.messageCreateTime = function() {
                var time = new Date();
                var hours = time.getHours();
                var min = time.getMinutes();
                var sec = time.getSeconds();
                var msec = time.getMilliseconds();
                var date = `${hours}:${min}:${sec}.${msec}`;
                return `Was create at "${date}"`
            }

            Message.prototype.messageWasReadBy = function(user) {
                if(!user) throw new Error('User is undefined');
                    
                var user = user;
                if(this.messageWasRead.length === 0) {
                    this.messageWasRead.push(user.name);
                } else if(this.messageWasRead.length > 0) {
                    for(var i = 0; i < Chat.chats.length; i++) {
                        var chat = Chat.chats[i];
                        if(chat) {
                            var checked = chat.logedUsers.filter(function(chatUser) {
                                if(chatUser instanceof User && chatUser.name === user.name) {
                                    return chatUser
                                }
                            }).map(function(chatUser){ return chatUser.name})
                            if(checked.indexOf(user.name) !== -1) {
                                if(this.messageWasRead.indexOf(user.name) !== -1) {
                                    throw new Error(`${user.name} already read this message`)
                                } else { 
                                    this.messageWasRead.push(user.name) 
                                }
                            } else {
                                throw new Error(`${user.name} is not logged in ${chat.name}-chat`)
                             }
                        }
                    }
                }
            }
            
            
            function User(name) {
                if(!name) throw new Error('User name is undefined');
                this.name = name;
            }

            User.prototype.defaultChat = function(defaultInstanceChat) {
                if(!defaultInstanceChat) throw new Error("Need to choose default chat instance")
                this.defaultInstanceChat = defaultInstanceChat;
            }

            User.prototype.connectUserToChat = function(instanceChat) {
                if(arguments.length === 1) {
                    instanceChat.login(this);
                } else if(arguments.length === 0 && this.defaultInstanceChat) {
                    this.defaultInstanceChat.login(this);
                } else {
                    console.error("Choose default chat")
                }
            }

            User.prototype.disconnectUserFromChat = function(instanceChat) {
                if(arguments.length === 1) {
                    instanceChat.logout(this);
                } else if(arguments.length === 0) {
                    this.defaultInstanceChat.logout(this);
                }
            }
                
            User.prototype.sendMessage = function(instanceChat,message) {
                if(instanceChat instanceof Chat && typeof message === "string") {
                    instanceChat.sendMessage(this,message)
                } else if (arguments.length === 1) {
                    message = arguments[0];
                    instanceChat = this.defaultInstanceChat;
                    if(!this.defaultInstanceChat) throw new Error("Choose your default chat instance")
                    this.defaultInstanceChat.sendMessage(this,message);
                } else {
                    throw new Error('Type a message and set instance of Chat')
                }
            }

            User.prototype.unReadMessages = function(chat,amount) {
                if(arguments.length === 0) { 
                    throw new Error("No chat instance and no amount are indicated")
                } else if(arguments.length === 1) {
                    if(arguments[0] instanceof Chat) {
                        chat = arguments[0];
                        amount = 10;
                    } else {
                        chat =  this.defaultInstanceChat;
                        amount = arguments[0];
                    }
                } else if(arguments.length === 2) {
                    chat = arguments[0];
                    amount = arguments[1]
                }
                
                var messages = chat.unReadMessagesBy(this,amount)

                for (var i = 0; i < messages.length; i++) {
                    console.log(`User:[${chat.history[i].user.name}] {loged: ${chat.checkIfLoged(chat.history[i].user)}} [${chat.history[i].messageCreateTime()}] message: "${chat.history[i].message}"`);
                }
            }
        } else {
            throw new Error('variable you are trying to create already exists in global scope');
        }
    } catch(error) {
        console.error(`${error.name}: ${error.message}`)
    }
    
    Object.defineProperty(window, "User", {
        configurable:false,
        get: function() { return User },
        set: function() { console.error('variable "User" has already been declared') }
    });
    Object.defineProperty(window, "Chat", {
        configurable:false,
        get: function() { return Chat },
        set: function() {console.error('variable "Chat" has already been declared')}
    });
    Object.defineProperty(window, "Message", {
        configurable:false,
        get: function() { return Message },
        set: function() {console.error('variable "Message" has already been declared')}
    });
    
})();

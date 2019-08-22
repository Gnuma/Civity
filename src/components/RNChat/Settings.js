class Settings {
  constructor(defaultSyntax) {
    this.syntaxData = defaultSyntax;
  }

  set syntax({user, message}) {
    if (!user) user = {};
    if (!message) message = {};
    this.syntaxData = {
      user: {...this.syntaxData.user, ...user},
      message: {...this.syntaxData.message, ...message},
    };
  }

  get syntax() {
    return this.syntaxData;
  }

  get MESSAGE_ID() {
    return this.syntaxData.message.id;
  }
  get TIMESTAMP() {
    return this.syntaxData.message.timestamp;
  }
  get TEXT() {
    return this.syntaxData.message.text;
  }
  get SYSTEM() {
    return this.syntaxData.message.system;
  }
  get USER() {
    return this.syntaxData.message.user;
  }
  get USER_ID() {
    return this.syntaxData.user.id;
  }
  get USER_NAME() {
    return this.syntaxData.user.name;
  }
}

export const DEFAULT_SYNTAX = {
  user: {
    id: 'id',
    name: 'name',
  },
  message: {
    id: 'id',
    timestamp: 'timestamp',
    text: 'text',
    system: 'system',
    user: 'user',
  },
};

export default new Settings(DEFAULT_SYNTAX);

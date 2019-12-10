class Settings {
  constructor(defaultSyntax) {
    this.syntaxData = defaultSyntax;
  }

  set syntax({
    user = {},
    message = {},
    months = DEFAULT_MONTHS,
    days = DEFAULT_DAYS
  }) {
    this.syntaxData = {
      user: { ...this.syntaxData.user, ...user },
      message: { ...this.syntaxData.message, ...message },
      months,
      days
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
  get MONTHS() {
    return this.syntaxData.months;
  }
  get DAYS() {
    return this.syntaxData.days;
  }
}

export const DEFAULT_SYNTAX = {
  user: {
    id: "id",
    name: "name"
  },
  message: {
    id: "id",
    timestamp: "timestamp",
    text: "text",
    system: "system",
    user: "user"
  },
  months: DEFAULT_MONTHS,
  days: DEFAULT_DAYS
};

export default new Settings(DEFAULT_SYNTAX);

export const DEFAULT_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const DEFAULT_DAYS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

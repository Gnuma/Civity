import { LEVEL_DATA } from "./constants";

const dayInMilliseconds = 1000 * 60 * 60 * 24;

export const dateDisplay = date => {
  if (!(date instanceof Date)) date = new Date(date);
  if (Math.abs(new Date() - date) < dayInMilliseconds)
    return (
      date.getHours() +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    );
  else if (Math.abs(new Date() - date) < dayInMilliseconds * 2) return "Ieri";
  else
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
};

export const dateHourDisplay = date => {
  if (!(date instanceof Date)) date = new Date(date);
  return (
    date.getHours() +
    ":" +
    date.getMinutes() +
    "  " +
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear()
  );
};

export const formatOffice = course => {
  try {
    const { office, ...courseData } = course;
    office.course = courseData;
    return office;
  } catch (error) {
    console.log("COURSE FORMAT ERROR ->" + course);
    throw "COURSE FORMAT ERROR ->" + course;
  }
};

export const formatUserData = userData => {
  try {
    const {
      quipu_user: { course, ...restUserData },
      ...restDjangoUser
    } = userData;
    return {
      office: formatOffice(course),
      ...restDjangoUser,
      ...restUserData
    };
  } catch (error) {
    console.log("USER FORMAT ERROR ->" + userData);
    throw "USER FORMAT ERROR ->" + userData;
  }
};

export const formatUser = user => {
  try {
    const { course, ...restUser } = user;
    return {
      ...restUser,
      office: formatOffice(course)
    };
  } catch (error) {
    console.log("USER FORMAT ERROR ->" + userData);
    throw "USER FORMAT ERROR ->" + userData;
  }
};

export const getLevel = xp => {
  let exp = 0;
  const levelLength = Object.keys(LEVEL_DATA).length;

  for (let i = 1; i <= levelLength; i++) {
    if (xp < LEVEL_DATA[i]) {
      exp += xp - exp;
      return {
        level: i,
        exp: exp
      };
    } else {
      exp += LEVEL_DATA[i];
    }
  }
  return {
    level: levelLength,
    exp: LEVEL_DATA[levelLength]
  };
};

export default {
  dateDisplay: dateDisplay,
  formatOffice,
  formatUserData
};

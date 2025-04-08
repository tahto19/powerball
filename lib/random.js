import { randomLetters } from "../util/util";

const random = (items) => {
  if (!items) throw new Error("Tickets is need");
  let getLength = items[0]?.length;
  if (getLength == 0) throw new Error("position number 0 in ticket list is 0");
  //   loop length of string
  for (let i = 0; i < getLength; i++) {
    let done = false;
    do {
      let random_ = randomLetters(1);
    } while (done);
  }
};

export default random;

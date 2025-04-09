import { randomLetters } from "../util/util.js";

const random = (items) => {
  if (!items) throw new Error("Tickets is need");
  let getLength = items[0]?.length;
  if (getLength == 0) throw new Error("position number 0 in ticket list is 0");
  //   loop length of string
  let choosenLetters = "";
  let ticketChoosen = items;
  let copyItem = [];
  for (let i = 0; i < getLength; i++) {
    let done = false;
    // random a char
    do {
      let random_ = randomLetters(1);
      copyItem = [];
      ticketChoosen.forEach((v, ii) => {
        if (v[i] === random_) {
          copyItem.push(v);

          if (!choosenLetters[i]) {
            choosenLetters += random_;
          }
        }

        if (ii === ticketChoosen.length - 1) {
          if (copyItem.length !== 0) {
            ticketChoosen = copyItem;
            done = true;
          }
        }
      });
    } while (!done);
  }
  return choosenLetters;
};

export default random;

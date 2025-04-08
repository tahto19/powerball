import { randomLetters } from "../util/util.js";

const random = (items) => {
  if (!items) throw new Error("Tickets is need");
  let getLength = items[0]?.length;
  if (getLength == 0) throw new Error("position number 0 in ticket list is 0");
  //   loop length of string
  let choosenLetters = "";
  let ticketChoosen = items;
  for (let i = 0; i < getLength; i++) {
    let done = false;
    // random a char
    do {
      let random_ = randomLetters(1);
      ticketChoosen.forEach((v, ii) => {
        if (v[i] === random_) {
          ticketChoosen.push(v);
          if (!choosenLetters[i]) choosenLetters += random_;
          done = true;
        }
      });
    } while (!done);
  }
  console.log(choosenLetters);
};

export default random;

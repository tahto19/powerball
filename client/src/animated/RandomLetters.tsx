import React, { useEffect, useState } from "react";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const splitCharacters = characters.split("");

const RandomString = ({
  winner,
  seconds,
}: {
  winner: string;
  seconds: undefined | number;
}) => {
  const waitForMe = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("");
      }, seconds);
    });
  };
  const [letters, setLetters] = useState("abcdef");
  useEffect(() => {
    setLetters((prev) => makeID(winner.length));
    setTimeout(() => {
      runRandom();
    }, 100);
  }, []);

  const makeID = (length: number) => {
    let result = "";

    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const runRandom = async () => {
    let splitWinner = [...winner.split("")];

    for (const [i, v] of splitWinner.entries()) {
      //   await waitforme(100);
      for (const [ii, vv] of splitCharacters.entries()) {
        await waitForMe();
        console.log(vv);
        setLetters((vw) => {
          let lettersSplit = vw.split("");
          lettersSplit[i] = vv;
          return lettersSplit.join("");
        });
        if (v === vv) break;
      }
    }
  };

  return <div>{letters}</div>;
};

export default RandomString;

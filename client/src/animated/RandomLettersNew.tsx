//@ts-nocheck

import React, { useEffect, useRef, useState } from "react";

const characters =
  "A~!@)_BCDELRSTUVWX$%^&(YZabcJKt678defghijklmnopqrsFGHIuvwxyz0123MNOPQ459";
const splitCharacters = characters.split("");
const text = "jg@91&HiJge"
function randomChar2() {
  return characters[Math.floor(Math.random() * characters.length)];
}

const RandomString = ({
  winner,
  seconds,
  onDone
}: {
  winner: string;
  seconds: undefined | number;
  onDone: (value: boolean) => void;
}) => {
  const waitForMe = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("");
      }, 10);
    });
  };
  const [letters, setLetters] = useState("abcdef");
  const myInterval = useRef();
  const myTimeout = useRef();

  useEffect(() => {
    myInterval.current = setInterval(() => {
      setLetters(prev =>
        text
          .split('')
          .map((char, i) =>
            Math.random() > 0.5 ? randomChar2() : char
          )
          .join('')
      );
    }, 100);

    if (winner.trim() !== "") {
      // Stop the interval after x seconds
      myTimeout.current = setTimeout(() => {
        clearInterval(myInterval.current);
        setLetters((prev) => makeID(winner.length));
        onDone(true)
        setTimeout(() => {
          runRandom();
        }, 100);
      }, seconds * 1000);
    }


    // Cleanup both interval and timeout
    return () => {
      clearInterval(myInterval.current);
      clearTimeout(myTimeout.current);
    };
  }, [winner]);


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

        setLetters((vw) => {
          let lettersSplit = vw.split("");
          lettersSplit[i] = vv;
          return lettersSplit.join("");
        });
        if (v === vv) break;
      }
    }
  };

  return <div style={{
    letterSpacing: "10px"
  }}>{letters}</div>;
};

export default RandomString;

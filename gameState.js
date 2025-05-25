export function checkWin(obj) {
  return horizontalMatch(obj) || verticalMatch(obj) || diagonalMatch(obj);
}

export function checkDraw(obj) {
  for (let i in obj) {
    if (obj[i] == null) return false;
  }
  return true;
}

function horizontalMatch(ob) {
  for (let n = 1 ; n <= 3; n++) {
    let a = "a" + n;
    let b = "b" + n;
    let c = "c" + n;
    if (ob[a] && ob[a] === ob[b] && ob[a] === ob[c]) return true;
  }
  return false;
}

function verticalMatch(ob) {
  const abc = ["a", "b", "c"];
  for (let i = 0; i < abc.length; i++) {
    let l1 = abc[i] + "1";
    let l2 = abc[i] + "2";
    let l3 = abc[i] + "3";
    if (ob[l1] && ob[l1] === ob[l2] && ob[l1] === ob[l3]) return true;
  }
  return false;
}

function diagonalMatch(ob) {
  return (
    ob["a1"] && ob["a1"] === ob["b2"] && ob["a1"] === ob["c3"] ||
    ob["a3"] && ob["a3"] === ob["b2"] && ob["a3"] === ob["c1"]
  );
}
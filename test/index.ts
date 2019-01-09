import { assert } from "chai";

import procrustus from "../src";

describe("Procrustus Tests", () => {
  it("Should work with a simple test", done => {
    let input: number[][] = [[1, 1], [2, 2], [3, 3]];
    let target: number[][] = [[1, 1], [1, 2], [1, 3]];
    console.log("bla", procrustus(target, input));
    // assert.equal({}, procrustus(target, input));
    done();
  });
});

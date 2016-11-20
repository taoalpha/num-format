"use strict";

const expect = require("expect.js");
const numF = require("../index");

describe("Different Formatters", () => {
  describe("Smart formatter", () => {
    it("Non Zero Small Numbers", () => {
      expect(numF(12)).to.be("12");
    });

    it("False input", () => {
      expect(numF(0)).to.be("0");
      expect(numF(null)).to.be("0");
      expect(numF(undefined)).to.be("0");
    });

    it("Non Zero Small Numbers", () => {
      expect(numF(123)).to.be("123");
    });

    it("Format large numbers", () => {
      expect(numF(1234)).to.be("1.2k");
      expect(numF(12340)).to.be("12.3k");
      expect(numF(1234567)).to.be("1.2m");
      expect(numF(12000000000)).to.be("12b");
    });
  });
});

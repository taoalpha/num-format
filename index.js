"use strict";

/**
 * Support format a number to anything format you want.
 *
 * @name numFormatter
 * @example
 *
 * numFormatter(10000, ","); // 10, 000
 * numFormatter(10000, '.k'); // 10.0k
 * numFormatter(10000, '.w'); // 0.1w
 * numFormatter(12345, '.2k'); // 12.35k
 */

class NumFormatter {

  /**
   * @name constructor
   * @param {Object} [config] - config for NumFormatter
   */
  constructor(config = {}) {
    Object.assign(this, {
      extendNumber: true
    }, config);

    // if match (.)(number)unit
    // use abbr
    this.abbrRegex = /^([.]{0,1})([1-9]{0,1})([kwmb]{1})$/gi;
    this.scientificRegex = /^s([1-9]{0,1})$/gi;
    this.unitMapper = {
      k: 1000,
      w: 10000,
      m: Math.pow(10, 6),
      b: Math.pow(10, 9)
    };
    this.formatter = {
      ",": this.classic,
      abbr: this.abbr
    };

    // need the access to this context
    return this.fn.bind(this);
  }

  /**
   * the function returned by the class
   *
   * @name fn
   * @param {Number} num - the number you want to format
   * @param {String} num - the format you want to convert to
   *
   */
  fn(num, format) {
    format = format || "";
    if ({}.hasOwnProperty.call(this.formatter, format)) {
      return this.formatter[format](num);
    } else if (format.match(this.abbrRegex)) {
      return this.abbr(num, this.abbrRegex.exec(format));
    } else if (format.match(this.scientificRegex)) {
      return this.scientific(num, this.scientificRegex.exec(format)[1]);
    }
    return this.smart(num);
  }

  /**
   * extend to define custom formatter
   *
   * @name extend
   * @param {String} format - custom format
   * @param {Function} formatter - custom formatter function
   */

  /**
   * classical format which is "000, 000, 000"
   *
   * @name classic
   * @param {Number} num - the number
   * @return {String} str
   *
   */
  classic(num) {
    num = String(num).split("");
    let str = "";
    for (let i = 0; i < num.length; i++) {
      if (i !== 0 && i % 3 === 0) {
        str = ", " + str;
      }
      str = num[num.length - i - 1] + str;
    }
    return str;
  }

  /**
   * scientific
   *
   * @name scientific
   * @param {Number} num
   * @return {String} str
   *
   */
  scientific(num, precision) {
    return num.toPrecision(precision || undefined);
  }

  /**
   * smart
   *
   * basically just use different way according to the length of the number
   *
   * @name smart
   * @param {Number} num
   * @return {String} str
   *
   */
  smart(num) {
    const len = String(num).length;
    if (len > 9) {
      num = this.abbr(num, this.abbrRegex.exec(".1b"));
    } else if (len > 6) {
      num = this.abbr(num, this.abbrRegex.exec(".1m"));
    } else if (len > 3) {
      num = this.abbr(num, this.abbrRegex.exec(".1k"));
    }
    return String(num).replace(".0", "");
  }

  /**
   * abbreviation
   *
   * @example
   *
   * abbr(12300, 'k'); 12k
   * abbr(12300, '1k'); 10k
   * abbr(12300, '2k'); 12k
   * abbr(12300, '10k'); 12k
   * abbr(12300, '.k'); 12.3k
   * abbr(12300, '.2k'); 12.30k
   */
  abbr(num, formatGroup) {
    // step 1: parse the format, try to understand what the format it should be
    const dot = Boolean(formatGroup[1]);
    const fixLimit = formatGroup[2] || 1;
    const unit = this.unitMapper[formatGroup[3]];

    // step 2: convert num to fit the format
    // - if dot: divide and get fixed
    // - if no dot: parseInt(12345 / 1000) -> 12.345 -> toPrecision(1)
    return `${dot ? (num / unit).toFixed(fixLimit) : parseInt(parseInt(num / unit, 10).toPrecision(fixLimit), 10)}${formatGroup[3]}`;
  }

  /**
   * log
   *
   * @param {Any} msg - msg
   * @param {String} type - log type: hint|info|alert...
   *
   */
  log(msg, type) {
    if (type === "info") {
      console.info.call(null, msg);
    }
  }
}

const numF = new NumFormatter();

module.exports = numF;

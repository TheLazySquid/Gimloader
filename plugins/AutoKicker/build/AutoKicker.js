/**
 * @name AutoKicker
 * @description Automatically kicks players from your lobby with a customizable set of rules
 * @author TheLazySquid
 * @version 0.2.2
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/AutoKicker/build/AutoKicker.js
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/autokicker
 */


// node_modules/gimloader/index.js
var api = new GL();
var gimloader_default = api;

// src/styles.scss
var styles_default = `#AutoKick-UI {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
}
#AutoKick-UI .root {
  display: flex;
  flex-direction: column;
  color: white;
  padding: 10px;
}
#AutoKick-UI .checkboxes {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  gap: 5px;
}
#AutoKick-UI .idleDelaySlider {
  display: flex;
  align-items: center;
  gap: 5px;
}
#AutoKick-UI .idleDelaySlider input {
  flex-grow: 1;
}
#AutoKick-UI .idleDelaySlider label {
  font-size: 12px;
}
#AutoKick-UI h2 {
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
}
#AutoKick-UI .blacklist {
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 500px;
  overflow-y: auto;
}
#AutoKick-UI .blacklist .rule {
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid white;
  background-color: rgba(0, 0, 0, 0.5);
}
#AutoKick-UI .blacklist .rule .name {
  flex-grow: 1;
}
#AutoKick-UI .blacklist .rule .exact {
  padding: 3px;
  transition: transform 0.2s;
  background-color: rgba(0, 0, 0, 0.5);
  text-decoration: underline;
  border: none;
}
#AutoKick-UI .blacklist .rule .exact:hover {
  transform: scale(1.05);
}
#AutoKick-UI .blacklist .rule .delete {
  font-size: 20px;
  border: none;
  background-color: transparent;
  transition: transform 0.2s;
}
#AutoKick-UI .blacklist .rule .delete:hover {
  transform: scale(1.05);
}
#AutoKick-UI .blacklist .add {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid white;
  background-color: rgba(0, 0, 0, 0.5);
}`;

// node_modules/out-of-character/builds/out-of-character.mjs
var require$$0 = [
  {
    type: "Line Break",
    name: "LINE FEED",
    code: "U+000A",
    escapeChar: "\\n",
    aka: "LF",
    actualUnicodeChar: "\n",
    codeEscaped: "\\u000A",
    url: "https://www.compart.com/en/unicode/U+000A"
  },
  {
    type: "Separator",
    name: "LINE TABULATION",
    code: "U+000B",
    escapeChar: "\\t",
    aka: "TAB",
    replaceWith: "	",
    actualUnicodeChar: "\v",
    codeEscaped: "\\u000B",
    url: "https://www.compart.com/en/unicode/U+000B"
  },
  {
    type: "Separator",
    name: "FORM FEED",
    code: "U+000C",
    escapeChar: "\\f",
    aka: "FF",
    replaceWith: "",
    actualUnicodeChar: "\f",
    codeEscaped: "\\u000C",
    url: "https://www.compart.com/en/unicode/U+000C"
  },
  {
    type: "Line Break",
    name: "CARRIAGE RETURN",
    code: "U+000D",
    escapeChar: "\\r",
    aka: "CR",
    actualUnicodeChar: "\r",
    codeEscaped: "\\u000D",
    url: "https://www.compart.com/en/unicode/U+000D"
  },
  {
    type: "Separators",
    name: "NEXT LINE",
    code: "U+0085",
    escapeChar: "",
    aka: "NEL",
    replaceWith: "",
    actualUnicodeChar: "\x85",
    codeEscaped: "\\u0085",
    url: "https://www.compart.com/en/unicode/U+0085"
  },
  {
    type: "Whitespace",
    name: "NO-BREAK SPACE",
    code: "U+00A0",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\xA0",
    codeEscaped: "\\u00A0",
    url: "https://www.compart.com/en/unicode/U+00A0"
  },
  {
    type: "Separators",
    name: "LINE SEPARATOR",
    code: "U+2028",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u2028",
    codeEscaped: "\\u2028",
    url: "https://www.compart.com/en/unicode/U+2028"
  },
  {
    type: "Separators",
    name: "PARAGRAPH SEPARATOR",
    code: "U+2029",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u2029",
    codeEscaped: "\\u2029",
    url: "https://www.compart.com/en/unicode/U+2029"
  },
  {
    type: "Whitespace",
    name: "CHARACTER TABULATION",
    code: "U+0009",
    escapeChar: "",
    actualUnicodeChar: "	",
    codeEscaped: "\\u0009",
    url: "https://www.compart.com/en/unicode/U+0009"
  },
  {
    type: "Whitespace",
    name: "SPACE",
    code: "U+0020",
    escapeChar: "",
    actualUnicodeChar: " ",
    codeEscaped: "\\u0020",
    url: "https://www.compart.com/en/unicode/U+0020"
  },
  {
    htmlentity: "&shy;",
    htmlcode: "&#173;",
    csscode: "\\00AD",
    unicode: "U+00AD",
    name: "SOFT HYPHEN",
    type: "Invisible",
    code: "U+00AD",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\xAD",
    codeEscaped: "\\u00AD",
    url: "https://www.compart.com/en/unicode/U+00AD"
  },
  {
    type: "Invisible",
    name: "COMBINING GRAPHEME JOINER",
    code: "U+034F",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u034F",
    codeEscaped: "\\u034F",
    url: "https://www.compart.com/en/unicode/U+034F"
  },
  {
    type: "Invisible",
    name: "ARABIC LETTER MARK",
    code: "U+061C",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u061C",
    codeEscaped: "\\u061C",
    url: "https://www.compart.com/en/unicode/U+061C"
  },
  {
    type: "Visible",
    name: "SYRIAC ABBREVIATION MARK",
    code: "U+070F",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u070F",
    codeEscaped: "\\u070F",
    url: "https://www.compart.com/en/unicode/U+070F"
  },
  {
    type: "Whitespace",
    name: "HANGUL CHOSEONG FILLER",
    code: "U+115F",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u115F",
    codeEscaped: "\\u115F",
    url: "https://www.compart.com/en/unicode/U+115F"
  },
  {
    type: "Whitespace",
    name: "HANGUL JUNGSEONG FILLER",
    code: "U+1160",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u1160",
    codeEscaped: "\\u1160",
    url: "https://www.compart.com/en/unicode/U+1160"
  },
  {
    type: "Visible",
    name: "OGHAM SPACE MARK",
    code: "U+1680",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u1680",
    codeEscaped: "\\u1680",
    url: "https://www.compart.com/en/unicode/U+1680"
  },
  {
    type: "Invisible",
    name: "KHMER VOWEL INHERENT AQ",
    code: "U+17B4",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u17B4",
    codeEscaped: "\\u17B4",
    url: "https://www.compart.com/en/unicode/U+17B4"
  },
  {
    type: "Invisible",
    name: "KHMER VOWEL INHERENT AA",
    code: "U+17B5",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u17B5",
    codeEscaped: "\\u17B5",
    url: "https://www.compart.com/en/unicode/U+17B5"
  },
  {
    type: "Invisible",
    name: "MONGOLIAN VOWEL SEPARATOR",
    code: "U+180E",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u180E",
    codeEscaped: "\\u180E",
    url: "https://www.compart.com/en/unicode/U+180E"
  },
  {
    type: "Whitespace",
    name: "EN QUAD",
    code: "U+2000",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2000",
    codeEscaped: "\\u2000",
    url: "https://www.compart.com/en/unicode/U+2000"
  },
  {
    type: "Whitespace",
    name: "EM QUAD",
    code: "U+2001",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2001",
    codeEscaped: "\\u2001",
    url: "https://www.compart.com/en/unicode/U+2001"
  },
  {
    htmlentity: "&ensp;",
    htmlcode: "&#8194;",
    csscode: "\\2002",
    unicode: "U+2002",
    name: "EN SPACE",
    type: "Whitespace",
    code: "U+2002",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2002",
    codeEscaped: "\\u2002",
    url: "https://www.compart.com/en/unicode/U+2002"
  },
  {
    htmlentity: "&emsp;",
    htmlcode: "&#8195;",
    csscode: "\\2003",
    unicode: "U+2003",
    name: "EM SPACE",
    type: "Whitespace",
    code: "U+2003",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2003",
    codeEscaped: "\\u2003",
    url: "https://www.compart.com/en/unicode/U+2003"
  },
  {
    type: "Whitespace",
    name: "THREE-PER-EM SPACE",
    code: "U+2004",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2004",
    codeEscaped: "\\u2004",
    url: "https://www.compart.com/en/unicode/U+2004"
  },
  {
    type: "Whitespace",
    name: "FOUR-PER-EM SPACE",
    code: "U+2005",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2005",
    codeEscaped: "\\u2005",
    url: "https://www.compart.com/en/unicode/U+2005"
  },
  {
    type: "Whitespace",
    name: "SIX-PER-EM SPACE",
    code: "U+2006",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2006",
    codeEscaped: "\\u2006",
    url: "https://www.compart.com/en/unicode/U+2006"
  },
  {
    type: "Whitespace",
    name: "FIGURE SPACE",
    code: "U+2007",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2007",
    codeEscaped: "\\u2007",
    url: "https://www.compart.com/en/unicode/U+2007"
  },
  {
    type: "Whitespace",
    name: "PUNCTUATION SPACE",
    code: "U+2008",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2008",
    codeEscaped: "\\u2008",
    url: "https://www.compart.com/en/unicode/U+2008"
  },
  {
    htmlentity: "&thinsp;",
    htmlcode: "&#8201;",
    csscode: "\\2009",
    unicode: "U+2009",
    name: "THIN SPACE",
    type: "Whitespace",
    code: "U+2009",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2009",
    codeEscaped: "\\u2009",
    url: "https://www.compart.com/en/unicode/U+2009"
  },
  {
    type: "Whitespace",
    name: "HAIR SPACE",
    code: "U+200A",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u200A",
    codeEscaped: "\\u200A",
    url: "https://www.compart.com/en/unicode/U+200A"
  },
  {
    type: "Invisible",
    name: "ZERO WIDTH SPACE",
    code: "U+200B",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u200B",
    codeEscaped: "\\u200B",
    url: "https://www.compart.com/en/unicode/U+200B"
  },
  {
    htmlentity: "&zwnj;",
    htmlcode: "&#8204;",
    csscode: "\\200C",
    unicode: "U+200C",
    name: "ZERO WIDTH NON-JOINER",
    type: "Invisible",
    code: "U+200C",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u200C",
    codeEscaped: "\\u200C",
    url: "https://www.compart.com/en/unicode/U+200C"
  },
  {
    htmlentity: "&zwj;",
    htmlcode: "&#8205;",
    csscode: "\\200D",
    unicode: "U+200D",
    name: "ZERO WIDTH",
    type: "Invisible",
    code: "U+200D",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u200D",
    codeEscaped: "\\u200D",
    url: "https://www.compart.com/en/unicode/U+200D"
  },
  {
    htmlentity: "&lrm;",
    htmlcode: "&#8206;",
    csscode: "\\200E",
    unicode: "U+200E",
    name: "LEFT-TO-RIGHT MARK",
    type: "Invisible",
    code: "U+200E",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u200E",
    codeEscaped: "\\u200E",
    url: "https://www.compart.com/en/unicode/U+200E"
  },
  {
    htmlentity: "&rlm;",
    htmlcode: "&#8207;",
    csscode: "\\200F",
    unicode: "U+200F",
    name: "RIGHT-TO-LEFT MARK",
    type: "Invisible",
    code: "U+200F",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u200F",
    codeEscaped: "\\u200F",
    url: "https://www.compart.com/en/unicode/U+200F"
  },
  {
    type: "Whitespace",
    name: "NARROW NO-BREAK SPACE",
    code: "U+202F",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u202F",
    codeEscaped: "\\u202F",
    url: "https://www.compart.com/en/unicode/U+202F"
  },
  {
    type: "Whitespace",
    name: "MEDIUM MATHEMATICAL SPACE",
    code: "U+205F",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u205F",
    codeEscaped: "\\u205F",
    url: "https://www.compart.com/en/unicode/U+205F"
  },
  {
    type: "Invisible",
    name: "WORD JOINER",
    code: "U+2060",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u2060",
    codeEscaped: "\\u2060",
    url: "https://www.compart.com/en/unicode/U+2060"
  },
  {
    type: "Invisible",
    name: "FUNCTION APPLICATION",
    code: "U+2061",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u2061",
    codeEscaped: "\\u2061",
    url: "https://www.compart.com/en/unicode/U+2061"
  },
  {
    type: "Invisible",
    name: "INVISIBLE TIMES",
    code: "U+2062",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u2062",
    codeEscaped: "\\u2062",
    url: "https://www.compart.com/en/unicode/U+2062"
  },
  {
    type: "Invisible",
    name: "INVISIBLE SEPARATOR",
    code: "U+2063",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u2063",
    codeEscaped: "\\u2063",
    url: "https://www.compart.com/en/unicode/U+2063"
  },
  {
    type: "Invisible",
    name: "INVISIBLE PLUS",
    code: "U+2064",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u2064",
    codeEscaped: "\\u2064",
    url: "https://www.compart.com/en/unicode/U+2064"
  },
  {
    type: "Invisible",
    name: "INHIBIT SYMMETRIC SWAPPING",
    code: "U+206A",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u206A",
    codeEscaped: "\\u206A",
    url: "https://www.compart.com/en/unicode/U+206A"
  },
  {
    type: "Invisible",
    name: "ACTIVATE SYMMETRIC SWAPPING",
    code: "U+206B",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u206B",
    codeEscaped: "\\u206B",
    url: "https://www.compart.com/en/unicode/U+206B"
  },
  {
    type: "Invisible",
    name: "INHIBIT ARABIC FORM SHAPING",
    code: "U+206C",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u206C",
    codeEscaped: "\\u206C",
    url: "https://www.compart.com/en/unicode/U+206C"
  },
  {
    type: "Invisible",
    name: "ACTIVATE ARABIC FORM SHAPING",
    code: "U+206D",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u206D",
    codeEscaped: "\\u206D",
    url: "https://www.compart.com/en/unicode/U+206D"
  },
  {
    type: "Invisible",
    name: "NATIONAL DIGIT SHAPES",
    code: "U+206E",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u206E",
    codeEscaped: "\\u206E",
    url: "https://www.compart.com/en/unicode/U+206E"
  },
  {
    type: "Invisible",
    name: "NOMINAL DIGIT SHAPES",
    code: "U+206F",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u206F",
    codeEscaped: "\\u206F",
    url: "https://www.compart.com/en/unicode/U+206F"
  },
  {
    type: "Whitespace",
    name: "IDEOGRAPHIC SPACE",
    code: "U+3000",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u3000",
    codeEscaped: "\\u3000",
    url: "https://www.compart.com/en/unicode/U+3000"
  },
  {
    type: "Whitespace",
    name: "BRAILLE PATTERN BLANK",
    code: "U+2800",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u2800",
    codeEscaped: "\\u2800",
    url: "https://www.compart.com/en/unicode/U+2800"
  },
  {
    type: "Whitespace",
    name: "HANGUL FILLER",
    code: "U+3164",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\u3164",
    codeEscaped: "\\u3164",
    url: "https://www.compart.com/en/unicode/U+3164"
  },
  {
    type: "Invisible",
    name: "ZERO WIDTH NO-BREAK SPACE",
    code: "U+FEFF",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\uFEFF",
    codeEscaped: "\\uFEFF",
    url: "https://www.compart.com/en/unicode/U+FEFF"
  },
  {
    type: "Whitespace",
    name: "HALFWIDTH HANGUL FILLER",
    code: "U+FFA0",
    escapeChar: "",
    replaceWith: " ",
    actualUnicodeChar: "\uFFA0",
    codeEscaped: "\\uFFA0",
    url: "https://www.compart.com/en/unicode/U+FFA0"
  },
  {
    type: "Visible",
    name: "KAITHI VOWEL SIGN I",
    code: "U+110B1",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{110B1}",
    codeEscaped: "\\u110B1",
    url: "https://www.compart.com/en/unicode/U+110B1"
  },
  {
    type: "Visible",
    name: "SHORTHAND FORMAT LETTER OVERLAP",
    code: "U+1BCA0",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1BCA0}",
    codeEscaped: "\\u1BCA0",
    url: "https://www.compart.com/en/unicode/U+1BCA0"
  },
  {
    type: "Visible",
    name: "SHORTHAND FORMAT CONTINUING OVERLAP",
    code: "U+1BCA1",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1BCA1}",
    codeEscaped: "\\u1BCA1",
    url: "https://www.compart.com/en/unicode/U+1BCA1"
  },
  {
    type: "Visible",
    name: "SHORTHAND FORMAT DOWN STEP",
    code: "U+1BCA2",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1BCA2}",
    codeEscaped: "\\u1BCA2",
    url: "https://www.compart.com/en/unicode/U+1BCA2"
  },
  {
    type: "Visible",
    name: "SHORTHAND FORMAT UP STEP",
    code: "U+1BCA3",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1BCA3}",
    codeEscaped: "\\u1BCA3",
    url: "https://www.compart.com/en/unicode/U+1BCA3"
  },
  {
    type: "Visible",
    name: "MUSICAL SYMBOL NULL NOTEHEAD",
    code: "U+1D159",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1D159}",
    codeEscaped: "\\u1D159",
    url: "https://www.compart.com/en/unicode/U+1D159"
  },
  {
    type: "Invisible",
    name: "MUSICAL SYMBOL BEGIN BEAM",
    code: "U+1D173",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1D173}",
    codeEscaped: "\\u1D173",
    url: "https://www.compart.com/en/unicode/U+1D173"
  },
  {
    type: "Invisible",
    name: "MUSICAL SYMBOL END BEAM",
    code: "U+1D174",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1D174}",
    codeEscaped: "\\u1D174",
    url: "https://www.compart.com/en/unicode/U+1D174"
  },
  {
    type: "Invisible",
    name: "MUSICAL SYMBOL BEGIN TIE",
    code: "U+1D175",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1D175}",
    codeEscaped: "\\u1D175",
    url: "https://www.compart.com/en/unicode/U+1D175"
  },
  {
    type: "Invisible",
    name: "MUSICAL SYMBOL END TIE",
    code: "U+1D176",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1D176}",
    codeEscaped: "\\u1D176",
    url: "https://www.compart.com/en/unicode/U+1D176"
  },
  {
    type: "Invisible",
    name: "MUSICAL SYMBOL BEGIN SLUR",
    code: "U+1D177",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1D177}",
    codeEscaped: "\\u1D177",
    url: "https://www.compart.com/en/unicode/U+1D177"
  },
  {
    type: "Invisible",
    name: "MUSICAL SYMBOL END SLUR",
    code: "U+1D178",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1D178}",
    codeEscaped: "\\u1D178",
    url: "https://www.compart.com/en/unicode/U+1D178"
  },
  {
    type: "Invisible",
    name: "MUSICAL SYMBOL BEGIN PHRASE",
    code: "U+1D179",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1D179}",
    codeEscaped: "\\u1D179",
    url: "https://www.compart.com/en/unicode/U+1D179"
  },
  {
    type: "Invisible",
    name: "MUSICAL SYMBOL END PHRASE",
    code: "U+1D17A",
    escapeChar: "",
    replaceWith: "",
    actualUnicodeChar: "\u{1D17A}",
    codeEscaped: "\\u1D17A",
    url: "https://www.compart.com/en/unicode/U+1D17A"
  }
];
var isVariationSelector = function isVariationSelector2(num) {
  return num >= 65024 && num <= 65039;
};
var isHighSurrogate = function isHighSurrogate2(num) {
  return num >= 55296 && num <= 56319;
};
var isLowSurrogate = function isLowSurrogate2(num) {
  return num >= 56320 && num <= 57343;
};
var isEmoji$1 = function isEmoji(text, i) {
  if (text[i - 1]) {
    var code = text.charCodeAt(i - 1);
    if (isHighSurrogate(code) || isLowSurrogate(code) || isVariationSelector(code)) {
      return true;
    }
  }
  if (text[i + 1]) {
    var _code = text.charCodeAt(i + 1);
    if (isHighSurrogate(_code) || isLowSurrogate(_code) || isVariationSelector(_code)) {
      return true;
    }
  }
  return false;
};
var isEmoji_1 = isEmoji$1;
var data = require$$0;
var isEmoji2 = isEmoji_1;
var padStr = function padStr2(str, width) {
  while (str.length < width) {
    str = "0" + str;
  }
  return str;
};
var byCode = data.reduce(function(h, obj) {
  h[obj.code] = obj;
  return h;
}, {});
var codes = data.filter(function(obj) {
  return obj.replaceWith !== void 0;
}).map(function(obj) {
  return obj.code.replace(/^U\+/, "\\u");
});
var findAll$1 = function findAll(text) {
  var regEx = new RegExp("(".concat(codes.join("|"), ")"), "g");
  var matches = [];
  text.replace(regEx, function(ch, _b, offset) {
    var code = ch.charCodeAt(0);
    var hex = code.toString(16).toUpperCase();
    hex = "U+" + padStr(hex, 4);
    var found = byCode[hex] || {};
    if (found.code === "U+200D") {
      if (isEmoji2(text, offset)) {
        return ch;
      }
    }
    matches.push({
      name: found.name,
      code: found.code,
      offset,
      replacement: found.replaceWith || ""
    });
    return ch;
  });
  return matches;
};
var match = findAll$1;
var findAll2 = match;
var src = {
  // find invisible or strange unicode characters in the text
  detect: function detect(text) {
    var matches = findAll2(text);
    if (matches.length > 0) {
      return matches;
    }
    return null;
  },
  // remove invisible or strange unicode characters from the text
  replace: function replace(text) {
    var matches = findAll2(text);
    matches.forEach(function(o) {
      var code = o.code.replace(/^U\+/, "\\u");
      var reg = new RegExp(code, "g");
      text = text.replace(reg, o.replacement || "");
    });
    return text;
  }
};
var out_of_character_default = src;

// src/autokicker.ts
var AutoKicker = class {
  myId;
  lastLeaderboard;
  kickDuplicateNames = false;
  kickSkinless = false;
  kickIdle = false;
  kickBlank = false;
  blacklist = [];
  idleDelay = 2e4;
  el;
  UIVisible = true;
  idleKickTimeouts = /* @__PURE__ */ new Map();
  unOnAdd;
  kicked = /* @__PURE__ */ new Set();
  constructor() {
    this.loadSettings();
    gimloader_default.onStop(() => this.dispose());
  }
  loadSettings() {
    let settings = gimloader_default.storage.getValue("Settings", {});
    this.kickDuplicateNames = settings.kickDuplicateNames ?? false;
    this.kickSkinless = settings.kickSkinless ?? false;
    this.blacklist = settings.blacklist ?? [];
    this.kickBlank = settings.kickBlank ?? false;
    this.kickIdle = settings.kickIdle ?? false;
    this.idleDelay = settings.idleDelay ?? 2e4;
  }
  saveSettings() {
    gimloader_default.storage.setValue("Settings", {
      kickDuplicateNames: this.kickDuplicateNames,
      kickSkinless: this.kickSkinless,
      blacklist: this.blacklist,
      kickBlank: this.kickBlank,
      kickIdle: this.kickIdle,
      idleDelay: this.idleDelay
    });
  }
  start() {
    if (gimloader_default.net.type === "Colyseus") {
      this.myId = gimloader_default.stores.phaser.mainCharacter.id;
      let chars = gimloader_default.net.room.serializer.state.characters;
      this.unOnAdd = chars.onAdd((e) => {
        if (!e || e.id === this.myId) return;
        if (this.kickIdle) {
          let timeout = setTimeout(() => {
            this.colyseusKick(e.id, "being idle");
          }, this.idleDelay);
          this.idleKickTimeouts.set(e.id, timeout);
          const onMove = () => {
            clearTimeout(timeout);
            this.idleKickTimeouts.delete(e.id);
          };
          e.listen("completedInitialPlacement", (val) => {
            if (!val) return;
            setTimeout(() => {
              this.watchPlayerForMove(e, onMove);
            }, 2e3);
          });
        }
        this.scanPlayersColyseus();
      });
    } else {
      gimloader_default.net.on("UPDATED_PLAYER_LEADERBOARD", this.boundBlueboatMsg);
    }
  }
  boundBlueboatMsg = this.onBlueboatMsg.bind(this);
  onBlueboatMsg(e) {
    this.lastLeaderboard = e.items;
    this.scanPlayersBlueboat();
  }
  watchPlayerForMove(player, callback) {
    let startX = player.x;
    let startY = player.y;
    let unsubX, unsubY;
    const onMove = () => {
      if (unsubX) unsubX();
      if (unsubY) unsubY();
      callback();
    };
    unsubX = player.listen("x", (x) => {
      if (x !== startX) onMove();
    });
    unsubY = player.listen("y", (y) => {
      if (y !== startY) onMove();
    });
  }
  setKickIdle(value) {
    this.kickIdle = value;
    if (gimloader_default.net.type !== "Colyseus") return;
    if (value) {
      for (let [id, char] of gimloader_default.net.room.serializer.state.characters.entries()) {
        if (id === this.myId) continue;
        if (this.idleKickTimeouts.has(id)) continue;
        let timeout = setTimeout(() => {
          this.colyseusKick(id, "being idle");
        }, this.idleDelay);
        this.idleKickTimeouts.set(id, timeout);
        const onMove = () => {
          clearTimeout(timeout);
          this.idleKickTimeouts.delete(id);
        };
        this.watchPlayerForMove(char, onMove);
      }
    } else {
      for (let [id, timeout] of this.idleKickTimeouts.entries()) {
        clearTimeout(timeout);
        this.idleKickTimeouts.delete(id);
      }
    }
  }
  scanPlayers() {
    if (gimloader_default.net.type === "Colyseus") this.scanPlayersColyseus();
    else this.scanPlayersBlueboat();
  }
  scanPlayersBlueboat() {
    if (!this.lastLeaderboard) return;
    let nameCount = /* @__PURE__ */ new Map();
    if (this.kickDuplicateNames) {
      for (let item of this.lastLeaderboard) {
        let name = this.trimName(item.name);
        if (!nameCount.has(name)) nameCount.set(name, 0);
        nameCount.set(name, nameCount.get(name) + 1);
      }
    }
    for (let item of this.lastLeaderboard) {
      if (nameCount.get(this.trimName(item.name)) >= 3) {
        this.blueboatKick(item.id, "duplicate name");
        continue;
      }
      if (this.checkIfNameBlacklisted(item.name)) {
        this.blueboatKick(item.id, "blacklisted name");
      }
      if (this.kickBlank && this.checkIfNameBlank(item.name)) {
        this.blueboatKick(item.id, "blank name");
      }
    }
  }
  scanPlayersColyseus() {
    let characters = gimloader_default.net.room.state.characters;
    let nameCount = /* @__PURE__ */ new Map();
    if (this.kickDuplicateNames) {
      for (let [_, player] of characters.entries()) {
        let name = this.trimName(player.name);
        if (!nameCount.has(name)) nameCount.set(name, 0);
        nameCount.set(name, nameCount.get(name) + 1);
      }
    }
    for (let [id, player] of characters.entries()) {
      if (id === this.myId) continue;
      let name = this.trimName(player.name);
      if (this.kickDuplicateNames) {
        if (nameCount.get(name) >= 3) {
          this.colyseusKick(id, "duplicate name");
        }
      }
      if (this.checkIfNameBlacklisted(name)) {
        this.colyseusKick(id, "blacklisted name");
      }
      if (this.kickBlank && this.checkIfNameBlank(name)) {
        this.colyseusKick(id, "blank name");
      }
      if (this.kickSkinless) {
        let skin = JSON.parse(player.appearance.skin).id;
        if (skin.startsWith("character_default_")) {
          this.colyseusKick(id, "not having a skin");
        }
      }
    }
  }
  trimName(name) {
    return name.toLowerCase().replace(/\d+$/, "").trim();
  }
  checkIfNameBlacklisted(name) {
    name = this.trimName(name);
    for (let filter of this.blacklist) {
      if (filter.exact) {
        if (name === filter.name.toLowerCase()) {
          return true;
        }
      } else {
        console.log(name, filter.name.toLowerCase(), name.includes(filter.name.toLowerCase()));
        if (name.includes(filter.name.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }
  checkIfNameBlank(name) {
    let newName = out_of_character_default.replace(name).replaceAll(/\s/g, "");
    console.log("name", name.length, "new name", newName.length);
    if (newName.length === 0) return true;
    return false;
  }
  colyseusKick(id, reason) {
    if (this.kicked.has(id)) return;
    this.kicked.add(id);
    let char = gimloader_default.net.room.state.characters.get(id);
    gimloader_default.net.send("KICK_PLAYER", { characterId: id });
    gimloader_default.notification.open({ message: `Kicked ${char.name} for ${reason}` });
  }
  blueboatKick(id, reason) {
    if (this.kicked.has(id)) return;
    this.kicked.add(id);
    let playername = this.lastLeaderboard.find((e) => e.id === id)?.name;
    gimloader_default.net.send("KICK_PLAYER", id);
    gimloader_default.notification.open({ message: `Kicked ${playername} for ${reason}` });
  }
  dispose() {
    this.unOnAdd?.();
    gimloader_default.net.off("UPDATED_PLAYER_LEADERBOARD", this.boundBlueboatMsg);
  }
};

// src/ui.tsx
function UI({ autoKicker: autoKicker2 }) {
  const React = gimloader_default.React;
  let [kickDuplicated, setKickDuplicated] = React.useState(autoKicker2.kickDuplicateNames);
  let [kickSkinless, setKickSkinless] = React.useState(autoKicker2.kickSkinless);
  let [kickBlank, setKickBlank] = React.useState(autoKicker2.kickBlank);
  let [kickIdle, setKickIdle] = React.useState(autoKicker2.kickIdle);
  let [kickIdleDelay, setKickIdleDelay] = React.useState(autoKicker2.idleDelay);
  let [blacklist, setBlacklist] = React.useState(autoKicker2.blacklist);
  return /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "root" }, /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "checkboxes" }, /* @__PURE__ */ gimloader_default.React.createElement("label", null, "Kick duplicates"), /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "checkbox",
      checked: kickDuplicated,
      onChange: (e) => {
        autoKicker2.kickDuplicateNames = e.target.checked;
        setKickDuplicated(e.target.checked);
        autoKicker2.scanPlayers();
        autoKicker2.saveSettings();
      },
      onKeyDown: (e) => e.preventDefault()
    }
  ), /* @__PURE__ */ gimloader_default.React.createElement("label", null, "Kick skinless"), /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "checkbox",
      checked: kickSkinless,
      onChange: (e) => {
        autoKicker2.kickSkinless = e.target.checked;
        setKickSkinless(e.target.checked);
        autoKicker2.scanPlayers();
        autoKicker2.saveSettings();
      },
      onKeyDown: (e) => e.preventDefault()
    }
  ), /* @__PURE__ */ gimloader_default.React.createElement("label", null, "Kick blank"), /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "checkbox",
      checked: kickBlank,
      onChange: (e) => {
        autoKicker2.kickBlank = e.target.checked;
        setKickBlank(e.target.checked);
        autoKicker2.scanPlayers();
        autoKicker2.saveSettings();
      },
      onKeyDown: (e) => e.preventDefault()
    }
  ), /* @__PURE__ */ gimloader_default.React.createElement("label", null, "Kick idle"), /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "checkbox",
      checked: kickIdle,
      onChange: (e) => {
        setKickIdle(e.target.checked);
        autoKicker2.setKickIdle(e.target.checked);
        autoKicker2.saveSettings();
      },
      onKeyDown: (e) => e.preventDefault()
    }
  )), kickIdle && /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "idleDelaySlider" }, /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "range",
      min: "5000",
      max: "60000",
      step: "1000",
      value: kickIdleDelay,
      onChange: (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) return;
        setKickIdleDelay(val);
        autoKicker2.idleDelay = val;
        autoKicker2.setKickIdle(false);
        autoKicker2.setKickIdle(true);
        autoKicker2.saveSettings();
      }
    }
  ), /* @__PURE__ */ gimloader_default.React.createElement("label", null, kickIdleDelay, "ms")), /* @__PURE__ */ gimloader_default.React.createElement("h2", null, "Blacklist"), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "blacklist" }, blacklist.map((entry) => {
    return /* @__PURE__ */ gimloader_default.React.createElement("button", { className: "rule", key: entry.name }, /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "name" }, entry.name), /* @__PURE__ */ gimloader_default.React.createElement("button", { className: "exact", onClick: () => {
      entry.exact = !entry.exact;
      setBlacklist([...blacklist]);
      autoKicker2.scanPlayers();
      autoKicker2.saveSettings();
    } }, entry.exact ? "Exact" : "Contains"), /* @__PURE__ */ gimloader_default.React.createElement("button", { className: "delete", onClick: () => {
      autoKicker2.blacklist = autoKicker2.blacklist.filter((e) => e.name !== entry.name);
      setBlacklist([...autoKicker2.blacklist]);
      autoKicker2.saveSettings();
    } }, "\u{1F5D1}"));
  }), /* @__PURE__ */ gimloader_default.React.createElement("button", { className: "add", onClick: () => {
    let name = prompt("Enter the name to blacklist");
    if (!name) return;
    name = name.trim();
    autoKicker2.blacklist.push({
      name,
      exact: true
    });
    setBlacklist([...autoKicker2.blacklist]);
    autoKicker2.scanPlayers();
    autoKicker2.saveSettings();
  } }, "+")));
}

// src/index.ts
var autoKicker = new AutoKicker();
var ui = null;
var uiShown = gimloader_default.storage.getValue("uiShown", true);
var checkStart = () => {
  if (gimloader_default.net.isHost) {
    autoKicker.start();
    ui = document.createElement("div");
    ui.id = "AutoKick-UI";
    gimloader_default.ReactDOM.createRoot(ui).render(gimloader_default.React.createElement(UI, { autoKicker }));
    document.body.appendChild(ui);
    if (!uiShown) {
      ui.style.display = "none";
      if (autoKicker.kickDuplicateNames || autoKicker.kickSkinless || autoKicker.blacklist.length > 0 || autoKicker.kickIdle) {
        gimloader_default.notification.open({ message: "AutoKicker is running!" });
      }
    }
  }
};
gimloader_default.hotkeys.addConfigurableHotkey({
  category: "Auto Kicker",
  title: "Toggle UI",
  preventDefault: false,
  default: {
    key: "KeyK",
    alt: true
  }
}, () => {
  if (!ui) return;
  uiShown = !uiShown;
  if (uiShown) ui.style.display = "block";
  else ui.style.display = "none";
  gimloader_default.storage.setValue("uiShown", uiShown);
});
gimloader_default.net.onLoad(checkStart);
gimloader_default.UI.addStyles(styles_default);

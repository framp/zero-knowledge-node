// - Being able to drag would be really cute but irrelevant for our
// purposes.
// - Unclear if it's better to make the user click an edge
// or have them click two nodes.  The latter has less clicks, but
// they be more annoying and less intuitive.

// Naming conventions:
//      ALL_CAPS for constant global data
//      globalVar for mutable global data per entire application
//      gVar for mutable global data per graph
//
// Stylistic convention:
//      Never use a traditional 'for' loop, they don't handle variable
//      closure correctly. Always use a higher-order function.

// Data

var POINTS_1 = {
  'a': [300,40],
  'b': [119,187],
  'c': [481,187],
  'd': [175,359],
  'e': [425,359], 
  'f': [300, 88],
  'g': [175, 191],
  'h': [420, 191],
  'i': [215, 311],
  'j': [385, 311],
};
var COLORS_1 = {
  'a': 0,
  'b': 1,
  'c': 1,
  'd': 0,
  'e': 2,
  'f': 2,
  'g': 2,
  'h': 0,
  'i': 1,
  'j': 0,
};
var DOT_1 = [
  ['a', 'b'],
  ['a', 'c'],
  ['c', 'e'],
  ['d', 'e'],
  ['b', 'd'],
  ['a', 'f'],
  ['b', 'g'],
  ['c', 'h'],
  ['d', 'i'],
  ['e', 'j'],
  ['h', 'g'],
  ['h', 'i'],
  ['g', 'j'],
  ['f', 'j'],
  ['f', 'i'],
];

var POINTS_2 = {
  'a': [100, 200],
  'b': [200, 50],
  'c': [200, 150],
  'd': [200, 250],
  'e': [200, 350],
  'f': [300, 100],
  'g': [300, 300],
  'h': [400, 50],
  'i': [400, 150],
  'j': [400, 250],
  'k': [400, 350],
  'l': [500, 200],
};
var COLORS_2_1 = {
  'a': 0,
  'b': 1,
  'c': 2,
  'd': 1,
  'e': 0,
  'f': 0,
  'g': 2,
  'h': 1,
  'i': 0,
  'j': 1,
  'k': 0,
  'l': 2,
}
var COLORS_2_2 = {
  'a': 2,
  'b': 2,
  'c': 0,
  'd': 1,
  'e': 2,
  'f': 1,
  'g': 0,
  'h': 0,
  'i': 0,
  'j': 2,
  'k': 1,
  'l': 1,
}
var COLORS_2_3 = {
  'a': 1,
  'b': 1,
  'c': 2,
  'd': 0,
  'e': 2,
  'f': 0,
  'g': 1,
  'h': 0,
  'i': 1,
  'j': 0,
  'k': 2,
  'l': 2,
}
var COLORS_2_4 = { // should be weighted half
  'a': 0,
  'b': 0,
  'c': 1,
  'd': 2,
  'e': 0,
  'f': 2,
  'g': 1,
  'h': 0,
  'i': 1,
  'j': 0,
  'k': 2,
  'l': 2,
}
var DOT_2 = [
  ['a', 'c'],
  ['a', 'd'],
  ['a', 'l'],
  ['b', 'c'],
  ['b', 'f'],
  ['b', 'k'],
  ['c', 'd'],
  ['c', 'f'],
  ['d', 'g'],
  ['d', 'e'],
  ['e', 'g'],
  ['e', 'h'],
  ['f', 'h'],
  ['f', 'i'],
  ['g', 'j'],
  ['g', 'k'],
  ['h', 'i'],
  ['i', 'j'],
  ['j', 'k'],
  ['l', 'i'],
  ['l', 'j'],
];

var COLORS = ['MediumBlue', 'DarkOrchid', 'DarkTurquoise'];
// small number of permutations, so just list them all:
var PERMUTATIONS = [[0,1,2], [0,2,1], [1,0,2], [1,2,0], [2,0,1], [2,1,0]];

// Utility functions

function random_pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function random_permutation() {
  return random_pick(PERMUTATIONS);
}
function mk(n) {
  return document.createElementNS("http://www.w3.org/2000/svg",n);
};
function get(id) { return document.getElementById(id); }
function letp(args, f) {
  // fake let-bindings. This gives us true variables which
  // we can close over. DO NOT close over 'var'.  Prefix all
  // closed over arguments to f with 'l'.
  f.apply(this, args);
};
function mapWithKey(obj, f) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      f(key, obj[key]);
    }
  }
}
function empty(node) {
  // removes all children from a node
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}
NodeList.prototype.map = function(f) {
  for (var i = 0; i < this.length; i++) {
    f(this[i]);
  }
}

// shift by two {0,1,2,3,4,5} * 2
var base_equivalence = ['a', 'c', 'b', 'f', 'h', 'i', 'l', 'j', 'k', 'g', 'e', 'd'];
var shifted_equivalence = base_equivalence.concat(base_equivalence);
function id_equivalence() {
  var r = {};
  mapWithKey(globalPoints, function (name, x) {
    r[name] = name;
  });
  return r;
}
function random_tricky_equivalence() {
  var r = {};
  var start = Math.floor(Math.random() * 6) * 2;
  base_equivalence.forEach(function (el, i, x) {
    r[shifted_equivalence[i+start]] = el;
  });
  return r;
}

function init() {
  get("reveal").disabled = 1;
  get("turbo").disabled = 1;
  get("turbo").checked = 0;
}

var globalPoints = false;
var globalDot = false;
var globalAuto = false;
var globalTricky = false;
var globalTrials = 0;

function setup(name) {
  if (name == 'honest') {
    globalPoints = POINTS_1;
    globalColors = [COLORS_1];
    globalDot = DOT_1;
    globalTricky = false;
  } else {
    globalPoints = POINTS_2;
    // 2_4 weighted half because it has more symmetries
    globalColors = [COLORS_2_1, COLORS_2_2, COLORS_2_3, COLORS_2_1, COLORS_2_2, COLORS_2_3, COLORS_2_4];
    globalDot = DOT_2;
    globalTricky = true;
  }
  globalAuto = false;
  get("turbo").checked = 0;
  globalTrials = 0;
  get("confidence").textContent = "0";
  main();
}

var rescheduleTimer = -1;
function reschedule(n, f) {
  clearTimeout(rescheduleTimer);
  rescheduleTimer = setTimeout(f, n);
}

// how is confidence calculated?  Assume a graph is not three-colorable.
// Then the best a cheater can do is provide you with a coloring that
// has one edge which is "bad".  The probability of getting that edge
// is then 1/E.

// Side-effect: When this is called, it obliterates all previous state.
// Variables declared at the beginning should be easy to fix; DOM state
// needs to be manually reset, however.  This doesn't seem to cause
// flicker, so hopefully it's not too much of a problem.
function main() {
  // construct svg on the fly
  var gMain = get("main");
  empty(gMain); // RESET
  // handles to SVG
  var gSvg = mk("svg");
  gSvg.style.height = "380px";
  gSvg.style.width = "600px";
  gSvg.style.cursor = "default";
  gMain.appendChild(gSvg);
  var gEdges = mk("g");
  var gNodes = mk("g");
  var gHover = mk("g");
  gSvg.appendChild(gEdges);
  gSvg.appendChild(gHover);
  gSvg.appendChild(gNodes);
  var gLookup = {};
  var gChoices = [];
  var gPerm = random_permutation();
  var gRevealed = false;
  var gReveal = get("reveal");
  var gTurbo = get("turbo");
  var gConfidence = get("confidence");
  var gEquivalence;
  if (globalTricky) {
    gEquivalence = random_tricky_equivalence();
  } else {
    gEquivalence = id_equivalence();
  }
  gConfidence.style.color = "black";
  gReveal.disabled = 0;
  gReveal.value = "Reveal";
  gTurbo.disabled = false;
  gReveal.onclick = function () { // RESET
    reschedule(0, function () {});
    gNodes.childNodes.map(function (x) {
      x.reveal();
    });
    gSvg.style.cursor = "pointer";
    gRevealed = true;
    gReveal.value = "Reset";
    gReveal.onclick = main;
  };
  gTurbo.onclick = function () {
    if (gTurbo.checked) {
      globalAuto = true;
      main();
    } else {
      globalAuto = false;
      reschedule(0, main);
    }
  };
  // I need this to run *before* the internal handlers.
  gSvg.addEventListener('click', function () {
    if (gRevealed) {
      main();
    }
  }, true);
  // setup nodes
  var gColors = random_pick(globalColors);
  mapWithKey(globalPoints, function (ptname, pt) {
    var shape = mk("circle");
    shape.setAttribute("cx", pt[0]);
    shape.setAttribute("cy", pt[1]);
    shape.setAttribute("r", 10);
    if (!globalAuto) {
      shape.setAttribute("fill", "black");
    } else {
      shape.setAttribute("fill", "grey");
    };
    shape.selected = 0;
    // a question of great philosophical importance...
    // should the true color or the permuted color be stored!
    // it's all implementation details, but the user might
    // feel cheated if they look at the source...
    shape.color = gPerm[gColors[gEquivalence[ptname]]];
    shape.reveal = function() {
      if (!shape.revealed) {
        shape.setAttribute("fill", COLORS[shape.color]);
        shape.revealed = true;
      }
    };
    shape.revealed = false;
    gNodes.appendChild(shape);
    gLookup[ptname] = shape;
  });
  // setup edges
  globalDot.map( function(edge) {
    var line = mk("line");
    // make it easier to actually click the line
    var hoverBox = mk("line");
    [line, hoverBox].map( function(x) {
      x.setAttribute("x1", globalPoints[edge[0]][0]);
      x.setAttribute("y1", globalPoints[edge[0]][1]);
      x.setAttribute("x2", globalPoints[edge[1]][0]);
      x.setAttribute("y2", globalPoints[edge[1]][1]);
    });
    if (!globalAuto) {
      line.setAttribute("stroke", "black");
    } else {
      line.setAttribute("stroke", "grey");
    };
    line.setAttribute("stroke-width", "1px");
    hoverBox.setAttribute("stroke", "rgba(255,255,255,0)"); // none doesn't work
    hoverBox.setAttribute("stroke-width", "15px");
    if (!globalAuto) {
      hoverBox.onmouseover = function () {
        if (!gRevealed) {
          line.setAttribute("stroke", "cyan");
          line.setAttribute("stroke-width", "3px");
        }
      };
      hoverBox.onmouseout = function () {
        if (!gRevealed) {
          // duplicate
          line.setAttribute("stroke", "black");
          line.setAttribute("stroke-width", "1px");
        }
      };
    }
    var select = function () {
      if (!gRevealed) {
        gRevealed = true;
        gLookup[edge[0]].reveal();
        gLookup[edge[1]].reveal();
        var makeGray = function () {
          gEdges.childNodes.map( function (x) {
            x.setAttribute("stroke", "gray");
          });
          gNodes.childNodes.map( function (x) {
            if (!x.revealed) {
              x.setAttribute("fill", "gray");
            }
          });
        };
        globalTrials++;
        if (gLookup[edge[0]].color == gLookup[edge[1]].color) {
          makeGray();
          gSvg.style.cursor = "pointer";
          line.setAttribute("stroke-width", "3px");
          line.setAttribute("stroke", "red");
          globalTrials = 0;
          gConfidence.style.color = "red";
          return false;
        } else {
          if (!globalAuto) {
            makeGray();
            gSvg.style.cursor = "pointer";
          };
          line.setAttribute("stroke-width", "3px");
          line.setAttribute("stroke", "green");
          gConfidence.style.color = "black";
          gConfidence.textContent = Math.min((1-Math.pow(1-1/globalDot.length, globalTrials))*100, 99.99).toFixed(2);
          return true;
        }
      }
    };
    if (!globalAuto) {
      hoverBox.onclick = function () { select(); };
      hoverBox.style.cursor = "pointer";
    }
    gEdges.appendChild(line);
    gHover.appendChild(hoverBox);
    gChoices.push(select);
  });
  if (globalAuto) {
    reschedule(0, function () {
      if(random_pick(gChoices)()) {
        // nope, try again
        reschedule(140, function () {
          main();
        });
      } else {
        // caught him! stop
      }
    });
  }
}

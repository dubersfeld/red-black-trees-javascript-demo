"use strict";

/*
This Javascript code implements a Canvas demonstration of a Binary Search Tree with maximal depth = 4 
The cloning should be implemented as a postOrderWalk and not use any insert() 
The insert() method should call a breadthFirstWalk based method checkDepth() to update all depths and return false if max depth exceeded
Refactor clear() and clone() using breadthFirstWalk only  
*/

var Debugger = function() { };// create  object
  Debugger.log = function(message) {
  try {
    console.log(message);
  } catch(exception) {
    return;
  }
}


function canvasSupport() {
  return !!document.createElement('canvas').getContext;
} 

function canvasApp() {

  var tree = null;// Binary Search Tree object
  var treeSave = null;// backup tree for insert


  function Node(key) {
    this.mKey = key;
    this.mLeft = null;
    this.mRight = null;
    this.mParent = null;
    this.mColor = "R";// Node always Red by default   
  }// Node 

  // Node augmentation
  function DisplayNode(key) {
    Node.call(this, key);
  }// DisplayNode

  DisplayNode.prototype = new Node();
  DisplayNode.prototype.mRadius = 15;
  DisplayNode.prototype.xPos = 0;
  DisplayNode.prototype.yPos = 0;
  DisplayNode.prototype.yConnU = 0;
  DisplayNode.prototype.yConnD = 0;
  DisplayNode.prototype.mIndex = 0;
  DisplayNode.prototype.mDepth = 0;
  DisplayNode.prototype.updateGeometry = function() {
    this.xPos = xPos[this.mDepth][this.mIndex];// matrix mDepth x mIndex  
    this.yPos = yPos[this.mDepth];
    this.yConnU = this.yPos - this.mRadius;
    this.yConnD = this.yPos + this.mRadius;
  };
  

  // base class
  function Tree() {// build an empty tree    
    this.mNil = new DisplayNode(-1);
    this.mNil.mColor = "B";// sentinel is Black 
    this.mRoot = this.mNil;// build an empty tree
    // when tree is empty this.mRoot == this.mNil, not null

    this.clone = function(src) {
      // breadthFirstWalk based
      var queue = [];// src side 
      var queueP = [];// this side
      var x, last;//src side            
      var prevC;// this side
      var newnode = null; 
      if (src.mRoot == src.mNil) return;// src tree is empty
      queue.push(src.mRoot);
      last = src.mNil;
      prevC = this.mNil;
        
      while (queue.length > 0) {
        x = queue.shift();// walk on src
        newnode = new DisplayNode(x.mKey);              
        newnode.mColor = "R";
        newnode.mParent = this.mNil;
        newnode.mLeft = this.mNil;
        newnode.mRight = this.mNil;                 
        if (x == src.mRoot) {// special case                 
          this.mRoot = newnode;
        } else {
          if (last.mParent != x.mParent) {// new parent needed
            prevC = queueP.shift();          
          } 
          if (x == x.mParent.mLeft) {// x is a left child
            prevC.mLeft = newnode;
          } else {// x is a right child
            prevC.mRight = newnode;                 
          }// if
          newnode.mParent = prevC;
        }// if             
        if (x.mLeft != src.mNil) {
          queue.push(x.mLeft);
        } 
        if (x.mRight != src.mNil) {
          queue.push(x.mRight);
        } 

	if (x.mLeft != src.mNil || x.mRight != src.mNil) {
	  queueP.push(newnode);
	}
        last = x;// src side          
      }
      return;
    };

    this.clear = function() {
      // based on breadthFirstWalk
      var queue = [];
      var x;
      if (this.mRoot == this.mNil) { 
        return; 
      }// tree is empty
      queue.push(this.mRoot);

      while (queue.length > 0) {    
        x = queue.shift();             
        if (x.mLeft != this.mNil) {
          queue.push(x.mLeft);
        } 
        if (x.mRight != this.mNil) {
          queue.push(x.mRight);
        } 
        if (x != this.mNil) {              
          x = null;// delete current node
        }               
      }// while
      this.mRoot = this.mNil;                 
    };

    this.search = function(node, key) {
      while (node != this.mNil && key != node.mKey) {        
        if (key < node.mKey) {
          node = node.mLeft;
        } else{ 
          node = node.mRight;
        }// if
      }// while
      return node; 
    };// search

    this.minimum = function(node) {// minimum of node subtree
      while (node.mLeft != this.mNil) {
        node = node.mLeft;
      }
      return node;
    };

    this.maximum = function(node) {// maximum of node subtree
      while (node.mRight != this.mNil) {
        node = node.mRight;
      }
      return node;
    };

    this.successor = function(node) {// successor of node
      if (node.mRight != this.mNil) {
        return this.minimum(node.mRight);
      }
      var ptr = node.mParent;
      while (ptr != this.mNil && node == ptr.mRight) {
        node = ptr; 
        ptr = ptr.mParent;
      }
      return ptr;
    };// successor

    this.predecessor = function(node) {// predecessor of node
      if (node.mLeft != this.mNil) {
        return this.maximum(node.mLeft);
      }
      var ptr = node.mParent;
      while (ptr != this.mNil && node == ptr.mLeft) {
        node = ptr; 
        ptr = ptr.mParent;
      }
      return ptr;
    };// predecessor

    this.insertRbt = function(z) {// try to insert a new node, return true if insert allowed, false if not allowed
      var y = this.mNil;
      var x = this.mRoot;

      if (this.mRoot == this.mNil) {// empty tree
        this.mRoot = z;
        this.mRoot.mParent = this.mNil;
        this.mRoot.mLeft = this.mNil;
        this.mRoot.mRight = this.mNil;
        this.mRoot.mColor = "B";// root is always Black 
        return true;
      }// if

      while (x != this.mNil) {// tree not empty
        y = x;
        if (z.mKey < x.mKey) {
          x = x.mLeft;
        } else {
          x = x.mRight;
        }// if            
      } // while
      z.mParent = y;       
      if (y == this.mNil) {      
        this.mRoot = z; 
      } else if (z.mKey < y.mKey) {        
        y.mLeft = z;
      } else {
        y.mRight = z;
      }// if
      z.mLeft = this.mNil; 
      z.mRight = this.mNil;
      z.mColor = "R";// new inserted node Red by default   
      this.insertRbtFixup(z);
      return true;
    };// insertRbt

    this.insertRbtFixup = function(z) {
      var y;

      while (z.mParent.mColor == "R") {        
        if (z.mParent == z.mParent.mParent.mLeft) {        
          y = z.mParent.mParent.mRight;
          if (y.mColor == "R") {            
            z.mParent.mColor = "B";// parent becomes Black
            y.mColor = "B";// uncle becomes Black
            z.mParent.mParent.mColor = "R";// grandparent becomes Red
            z = z.mParent.mParent;// move to grandparent
          } else {
            if (z == z.mParent.mRight) {
              z = z.mParent;
              this.rotateLeft(z);
            }
            z.mParent.mColor = "B";
            z.mParent.mParent.mColor = "R"; 
            this.rotateRight(z.mParent.mParent);
          }// if                    
        } else {
          y = z.mParent.mParent.mLeft;      
          if (y.mColor == "R") {       
            z.mParent.mColor = "B";
            y.mColor = "B";
            z.mParent.mParent.mColor = "R";
            z = z.mParent.mParent;// move to grandparent   
          } else {
            if (z == z.mParent.mLeft) {           
              z = z.mParent;
              this.rotateRight(z);
            }
            z.mParent.mColor = "B";
            z.mParent.mParent.mColor = "R"; 
            this.rotateLeft(z.mParent.mParent);
          }// if                    
        }// if                       
      }// while 
      this.mRoot.mColor = "B";
    }// insertRbtFixup 

    this.rotateLeft = function(x) {
      var y = x.mRight;
      x.mRight = y.mLeft;   
      if (y.mLeft != this.mNil) {
        y.mLeft.mParent = x;
      }
      y.mParent = x.mParent;     
      if (x.mParent == this.mNil) {
        this.mRoot = y;
      } else if (x == x.mParent.mLeft) {
        x.mParent.mLeft = y;
      } else {
        x.mParent.mRight = y;
      }// if
      y.mLeft = x;
      x.mParent = y;
    };// rotateLeft

    this.rotateRight = function(x) {
      var y = x.mLeft;
      x.mLeft = y.mRight;
      if (y.mRight != this.mNil) {
        y.mRight.mParent = x;
      }
      y.mParent = x.mParent;
      if (x.mParent == this.mNil) {
        this.mRoot = y;
      } else if (x == x.mParent.mRight) {
        x.mParent.mRight = y;
      } else {
        x.mParent.mLeft = y;
      }// if
      y.mRight = x;
      x.mParent = y;
    };// rotateRight

    this.removeRbt = function(z) {
      var y = z;
      var x = this.mNil;
      var y_original_color = y.mColor;
      if (z == this.mRoot && z.mLeft == this.mNil && z.mRight == this.mNil) {// root is last remaining node
        this.mRoot = this.mNil;
      } else if (z.mLeft == this.mNil) {// no left child
        x = z.mRight;
        this.transplantRbt(z, z.mRight);
      } else if (z.mRight == this.mNil) {// no right child
        x = z.mLeft;
        this.transplantRbt(z, z.mLeft); 
      } else {// both children
        y = this.minimum(z.mRight);// successor of z
        y_original_color = y.mColor;
        x = y.mRight;
        if (y.mParent == z) {
          x.mParent= y;
        } else {        
          this.transplantRbt(y, y.mRight);
          y.mRight = z.mRight;        
          y.mRight.mParent = y;
        }// if                                
        this.transplantRbt(z, y);
        y.mLeft = z.mLeft;
        y.mLeft.mParent = y;
        y.mColor = z.mColor;  
      }// if
      if (y_original_color == "B") {
        this.removeRbtFixup(x);
      }
    };// removeRbt

    this.removeRbtFixup = function(x) {
      var w = this.mNil;  
      while(x != this.mRoot && x.mColor == "B") {
        if (x == x.mParent.mLeft) {// x is a left child     
          w = x.mParent.mRight;
          if (w.mColor == "R") {
            w.mColor = "B";
            x.mParent.mColor = "R";
            this.rotateLeft(x.mParent);
            w = x.mParent.mRight; 
          }// if
          if (w.mLeft.mColor == "B" && w.mRight.mColor == "B") {
            w.mColor = "R";
            x = x.mParent;
          } else {
            if (w.mRight.mColor == "B") {
              w.mLeft.mColor = "B";
              w.mColor = "R";
              this.rotateRight(w);
              w = x.mParent.mRight;
            }// if
            w.mColor = x.mParent.mColor;
            x.mParent.mColor = "B";
            w.mRight.mColor = "B"; 
            this.rotateLeft(x.mParent);
            x = this.mRoot;// terminate loop
          }// if
        } else {// x is a right child
          w = x.mParent.mLeft;
          if (w.mColor == "R") {
            w.mColor = "B";
            x.mParent.mColor = "R";
            this.rotateRight(x.mParent);
            w = x.mParent.mLeft; 
          }// if
          if (w.mLeft.mColor == "B" && w.mRight.mColor == "B") {
            w.mColor = "R";
            x = x.mParent;
          } else {
            if (w.mLeft.mColor == "B") {
              w.mRight.mColor = "B";
              w.mColor = "R";
              this.rotateLeft(w);
              w = x.mParent.mLeft;
            }// if
            w.mColor = x.mParent.mColor;
            x.mParent.mColor = "B";
            w.mLeft.mColor = "B";
            this.rotateRight(x.mParent);
            x = this.mRoot;// terminate loop
          }// if
        }// if
      }// while
      x.mColor = "B";
    };// removeRbtFixup 
   
    this.transplantRbt = function(u, v) {// helper function      
      if (u.mParent == this.mNil) {// u is root
        this.mRoot = v;
      } else if (u == u.mParent.mLeft) {// u is a left child
         u.mParent.mLeft = v;
      } else {
         u.mParent.mRight = v;
      }// if      
      v.mParent = u.mParent;      
    };// transplantRbt  
  }// Tree


  // augmentation
  function Tree_test() {
    Tree.call(this);
  }// Tree_test

  Tree_test.prototype = new Tree();
  Tree_test.prototype.updateNodesBreadth = function(node, depth, index, draw) {// refresh Canvas tree display      
    // prepare canvas refresh
    if (draw) {
      fillBackground();
      setTextStyle();
    }
    if (node == this.mNil) { // do nothing
      return;
    }
    var queue = [];// use push and shift for queue
    node.mIndex = index;
    node.mDepth = depth;         
    queue.push(node);// initialize loop
    while (queue.length > 0) {// breadth first tree traversal
      node = queue.shift();        
      // update node depth and index attributes
      if (node.mParent != this.mNil) {// not root
        node.mDepth = node.mParent.mDepth + 1;
        if (node.mDepth > 4) {
          return false;
        }         
        if (node == node.mParent.mLeft) {
          node.mIndex = 2 * node.mParent.mIndex;
        } else {// right child
          node.mIndex = 2 * node.mParent.mIndex + 1;
        }
      }// if        
      if (draw) {
        // update geometric attributes
        node.updateGeometry();   
        drawNode(node);
        if (node.mParent != this.mNil) {// not root
          drawConnect(node, node.mParent);
        }
      }
      if (node.mLeft != this.mNil) {
        queue.push(node.mLeft);
      } 
      if (node.mRight != this.mNil) {
        queue.push(node.mRight);
      }
    }// while
    return true;
  };// updateNodesBreadth

   
  // get canvas context
  if (!canvasSupport()) {
    alert("canvas not supported");
    return;
  } else {
    var theCanvas = document.getElementById("canvas");
    var context = theCanvas.getContext("2d");
  }// if

  var xMin = 0;
  var yMin = 0;
  var xMax = theCanvas.width;
  var yMax = theCanvas.height; 

  var xPos = [];
  var yPos = [100, 200, 300, 400, 500];

  initGeometry();

  function setTextStyle() {
    context.fillStyle    = '#000000';
    context.font         = '15px _sans';
    context.textBaseline = "middle";
    context.textAlign = "center";
  }

  function initGeometry() {
    var xPos4 = [];
    var xPos3 = [];
    var xPos2 = [];
    var xPos1 = [];
    var xPos0 = [400];

    for (var i = 0; i < 16; i++) {
      xPos4[i] = 40 + i * 48;
    }

    for (var i = 0; i < 8; i++) {
      xPos3.push(Math.floor( (xPos4[2*i] + xPos4[2*i+1])/2 ) );
    }

    for (var i = 0; i < 4; i++) {
      xPos2.push(Math.floor( (xPos3[2*i] + xPos3[2*i+1])/2 ) );
    }

    for (var i = 0; i < 2; i++) {
      xPos1.push(Math.floor( (xPos2[2*i] + xPos2[2*i+1])/2 ) );
    }

    xPos = [xPos0, xPos1, xPos2, xPos3, xPos4];

  }// initGeometry


  function drawNode(node) {
    context.beginPath();
    context.strokeStyle = (node.mColor == "B") ? "black" : "red";
    context.lineWidth = 2;
    context.arc(node.xPos, node.yPos, node.mRadius, (Math.PI/180)*0, (Math.PI/180)*360, true); // draw full circle
    context.stroke();
    context.closePath();
    // draw text inside the circle
    context.fillText(node.mKey, node.xPos, node.yPos);
  }// drawNode


  function drawConnect(child, parent) { 
    // connect child to parent
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(child.xPos, child.yConnU);
    context.lineTo(parent.xPos, parent.yConnD); // draw line from child to parent
    context.stroke();
    context.closePath();
  }// drawConnect


  function fillBackground() {
    // draw background
    context.fillStyle = '#ffffff';
    context.fillRect(xMin, yMin, xMax, yMax);    
  }// fillBackground

  var N = 10;// initial number of nodes

  var keys = new Array(N);// for initialization

  var nodes = new Array(N);// for initialization
  

  function randomize(N) {
    var val;
    var more;

    for (var i = 0; i < N; i++) {
      more = true;// flag
      while(more) {
        more = false;
        val = Math.floor(Math.random() * 100);// range 0 to 99 included
        for (var j = 0; j < keys.length; j++) {
          if (val == keys[j]) {
            more = true;
            break;
          }// if 
        }// for           
      }// while
      keys[i] = val;    
    }// for

   //keys = [ 40, 10, 27, 63, 79, 93, 70, 94, 19, 3 ];

	console.log(keys);
  }// randomize


  function search(tree) {
    var searchkey = $("#searchkey").val();
    
    // validity check
    var isnum = /^\d+$/.test(searchkey);
    if (!isnum) {
      alert("invalid input");
      return;
    } else {
      searchkey = parseInt(searchkey);
      //var answer = document.getElementById("found");
      var answer = $("#found");
	
      if (tree.search(tree.mRoot, searchkey) != tree.mNil) {    
        //answer.innerHTML = "key " + searchkey + " found";
	answer.text("key " + searchkey + " found");
      } else {
        answer.text("key " + searchkey + " not found");
      }// if 
    }// if
  }// search

  function insert() {
    var newkey = $("#newkey").val();
    console.log("insert begin " + newkey);
    // validity check
    var isnum = /^\d+$/.test(newkey);
    if (!isnum) {
      alert("invalid input");
      return;
    } else {
      newkey = parseInt(newkey);
      if (newkey < 0 || newkey > 100) {
        alert("range allowed [0,100]");
        return;
      }
    }// if

    if (tree.mRoot != tree.mNil && 
      tree.search(tree.mRoot, newkey) != tree.mNil) {
      alert("key already present");
      return;      
    } else {    
      var newnode = new DisplayNode(newkey);
      
      // first make a clone of the tree    
      treeSave.clear();// erase all previous contents          
      treeSave.clone(tree);

      tree.insertRbt(newnode);

      var allowed = false;

      allowed = tree.updateNodesBreadth(tree.mRoot, 0, 0, false);// check depth allowed

      //tree.inOrderWalk(tree.mRoot);      
     
      if (!allowed) {
        alert("maximal depth exceeded");
        // revert to initial state
        tree.clear();// removes all internal references
        tree.clone(treeSave);// revert     
      }// if

      // redraw Canvas
      tree.updateNodesBreadth(tree.mRoot, 0, 0, true);
    }// if

    //var empty = document.getElementById("empty");
    var empty = $('#empty');
    if (tree.mRoot == tree.mNil) {// tree empty     
      empty.innerHTML = "tree is empty";
    } else {
      empty.innerHTML = "";
    }// if 
   
  }// insert


  function remove() {
    var delkey = $("#delkey").val();
    console.log("remove " + delkey);
    // valididy check
    var isnum = /^\d+$/.test(delkey);
    if (!isnum) {
      alert("invalid input");
      return;
    }

    delkey = parseInt(delkey); 
    var delnode = tree.search(tree.mRoot, delkey);// node to remove
    if (delnode == tree.mNil) {
      alert(delkey + " not found");
    } else {
      tree.removeRbt(delnode);
      tree.updateNodesBreadth(tree.mRoot, 0, 0, true);
    }// if

    //var empty = document.getElementById("empty");
    var empty = $('#empty'); 
    if (tree.mRoot == tree.mNil) {// tree empty    
      empty.innerHTML = "tree is empty";
    } else {
      empty.innerHTML = "";
    }// if 

  }// remove


  function initialize(N) {
    // initialize tree with N elements
    randomize(N);
/*
    keys[0] = 77;
    keys[1] = 63;
    keys[2] = 88;
    keys[3] = 55;
    keys[4] = 65;
*/    
    tree.clear();// erase all contents

    for (var i = 0; i < N; i++) {
      tree.insertRbt(new DisplayNode(keys[i]));
    }

    tree.updateNodesBreadth(tree.mRoot, 0, 0, true);   
  }// initialize

  tree = new Tree_test();// empty tree
  treeSave = new Tree_test();// empty tree

  initialize(N);

  //tree.clear();


  $("#initelem").submit(function(event) { initialize(N); return false; });

  $("#searchelem").submit(function(event) { search(tree); return false; });

  $("#insertelem").submit(function(event) { insert(tree); return false; });

  $("#deleteelem").submit(function(event) { remove(tree); return false; });

}// canvasApp

$(document).ready(canvasApp);


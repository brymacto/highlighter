var highlights = [];

function Highlight(selection) {
  this.id = highlights.length;
  this.selection = selection;
  this.range = selection.getRangeAt(0);
  this.text = this.range.toString();
  this.element = newHighlightSpan(this.id);
}

function newHighlightSpan(id) {
  var newNode = document.createElement("span");
  newNode.setAttribute('id', ('highlight-'+id));
  newNode.setAttribute('class', 'highlight');
  return newNode;
}

function createHighlight(sel) {
  var newHighlight = new Highlight(sel);
  highlights.push(newHighlight);
  newHighlight.range.surroundContents(newHighlight.element);
}

function deleteHighlight(id) {
  $('#highlight-' + id).contents().unwrap();
  highlights.splice((id), 1);
}

function cleanUpHighlights () {
  for (var i = 0; i < highlights.length; i++) {
    highlights[i].id = i;
    highlights[i].element.setAttribute('id', ('highlight-'+i));
  }
}

// Main Control Functions

function toggleAllHighlights() {
  for (var i = 0; i < highlights.length; i++) {
    $('#highlight-' + highlights[i].id).toggleClass('highlight');
  }
}

function buildAllHighlights() {
  for (var i = 0; i < highlights.length; i++) {
    // console.log(highlights[i].sel.anchorNode);
    // console.log(highlights[i].sel.anchorOffset);
    // console.log(highlights[i].sel.focusNode);
    // console.log(highlights[i].sel.focusOffset);

    var p = $("p:contains('" + highlights[i].selection.toString() + "')");


    var newNode = newHighlightSpan(i);
    newNode.text(highlights[i].text);
    highlights[i].element.insertNode(newNode);

    console.log(highlights[i].range.startContainer.tagName);
    console.log(highlights[i].range.startOffset);

    console.log(highlights[i].range.endContainer.tagName);
    console.log(highlights[i].range.endOffset);

    // highlights[i].range.surroundContents(highlights[i].element);
      // TODO - only putting span at beginning of range, not around the range
    }
  }

function deleteAllHighlights() {
  $('.highlight').contents().unwrap();
}

// Highlighter Menu Functions

function hideHighlighterMenus() {
  $('#highlightCreatePopover').hide();
  $('#highlightDeletePopover').hide();
  $('#deleteHighlight').off('click');
}

function positionMenu(elem, range){
  var leftPos = range.getClientRects()[0].left;
  var topPos = range.getClientRects()[0].top - 50;
  elem.css('left', leftPos);
  elem.css('top', topPos);
}

$(document).ready(function() {

  var sel = window.getSelection();

  // Adding Highlights

  $('article').on('mouseup', function() {
    if (sel.getRangeAt(0).toString().length > 0) {
      positionMenu($('#highlightCreatePopover'), sel.getRangeAt(0));
      $('#highlightCreatePopover').show();
    } else {
      hideHighlighterMenus();
    }
  });

  $('#addHighlight').on('click', function() {
    try {
      createHighlight(sel);
    } catch (ex) {

    }
    console.log(highlights.length);
    $('#highlightCreatePopover').hide();
  });

  // Deleting Highlights

  $('body').on('click','span.highlight', function(e) {
    e.stopPropagation();
    e.preventDefault();

    // get the highlight id
    var _id = this.id.substr(10);
    positionMenu($('#highlightDeletePopover'), highlights[_id].range);
    $('#highlightDeletePopover').show();

    // add event handler to delete button
    $('#deleteHighlight').on('click', function() {
      deleteHighlight(_id);
      cleanUpHighlights();
      console.log(highlights.length);
      $('#highlightDeletePopover').hide();
      $(this).off('click');
    });
  });

  // Main Controls

  $('#toggleHighlights').on('click', function(e) {
    toggleAllHighlights();
    e.preventDefault();
  });

  $('#buildHighlights').on('click', function(e) {
    buildAllHighlights();
    e.preventDefault();
  });

  $('#deleteHighlights').on('click', function(e) {
    deleteAllHighlights();
    e.preventDefault();
  });

  $('header').on('click', hideHighlighterMenus);
  $('footer').on('click', hideHighlighterMenus);
  $('article').on('mousedown', hideHighlighterMenus);

});



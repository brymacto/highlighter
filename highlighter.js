var highlights = [];

function Highlight(selection) {
  this.id = highlights.length;
  this.selection = selection;
  this.range = selection.getRangeAt(0);
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
    highlights[i].range.surroundContents(highlights[i].element);
      // TODO - only putting span at beginning of range, not around the range
    }
  }

function deleteAllHighlights() {
  $('.highlight').contents().unwrap();
}

//

function hideHighlighterMenus() {
  $('#highlightCreatePopover').hide();
  $('#highlightDeletePopover').hide();
  $('#deleteHighlight').off('click');
}

$(document).ready(function() {

  var sel = window.getSelection();

  // Adding Highlights

  $('#article').on('mouseup', function() {
    if (sel.getRangeAt(0).toString().length > 0) {
      $('#highlightCreatePopover').show();
    } else {
      hideHighlighterMenus();
    }
  });

  $('#addHighlight').on('click', function() {
    createHighlight(sel);
    $('#highlightCreatePopover').hide();
  });

  // Deleting Highlights

  $('body').on('click','span.highlight', function(e) {
    e.stopPropagation();
    e.preventDefault();

    // get the highlight id
    var _id = this.id.substr(10);
    $('#highlightDeletePopover').show();

    // add event handler to delete button
    $('#deleteHighlight').on('click', function() {
      deleteHighlight(_id);
      cleanUpHighlights();
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

});



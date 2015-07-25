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

// Highlighter Menu Functions

function hideHighlighterMenus() {
  $('#highlightCreatePopover').removeClass('slideUp');
  $('#highlightCreatePopover').hide();
  $('#highlightDeletePopover').removeClass('slideUp');
  $('#highlightDeletePopover').hide();
  $('#deleteHighlight').off('click');
}

function positionMenu(elem, range){
  var leftPos = ($('article').width() / 2);
  var topPos =  range.getBoundingClientRect()["top"] + window.scrollY - 50;
  elem.css('left', leftPos);
  elem.css('top', topPos);
}

$(document).ready(function() {

  if (window.getSelection) {
    var sel = window.getSelection();
  }

  // Adding Highlights

  $('article').on('mouseup', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var range = sel.getRangeAt(0);
    if (sel.rangeCount && (range.toString().length > 0)) {
      positionMenu($('#highlightCreatePopover'), range);
      $('#highlightCreatePopover').show().addClass('slideUp');
    } else {
      hideHighlighterMenus();
    }
  });

  $('#addHighlight').on('click', function(e) {
    e.preventDefault();
    createHighlight(sel);
    hideHighlighterMenus();
  });

  // Deleting Highlights

  $('body').on('click','span.highlight', function(e) {
    e.stopPropagation();
    e.preventDefault();

    // get the highlight id
    var _id = this.id.substr(10);
    positionMenu($('#highlightDeletePopover'), highlights[_id].range);
    $('#highlightDeletePopover').show().addClass('slideUp');

    // add event handler to delete button
    $('#deleteHighlight').on('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      deleteHighlight(_id);
      cleanUpHighlights();
      console.log(highlights.length);
      hideHighlighterMenus();
    });
  });

  // Main Controls

  $('#toggleHighlights').on('click', function(e) {
    e.preventDefault();
    toggleAllHighlights();
  });


  // $('header').on('click', hideHighlighterMenus);
  // $('body').on('mouseup', hideHighlighterMenus);
  $('article').on('mousedown', hideHighlighterMenus);

});



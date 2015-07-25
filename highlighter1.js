$(document).ready(function() {

  var highlights = [];

  function Highlight(highlightText, startContainer, startOffset, endContainer, endOffset) {
    this.id = highlights.length;
    this.startContainer = startContainer;
    this.startOffset = startOffset;
    this.endContainer = endContainer;
    this.endOffset = endOffset;
    this.text = highlightText;
    this.elem = newHighlightSpan(this.id, this.text);
  }


  function createHighlight() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    var newHighlight = new Highlight(range.toString(), range.startContainer, range.startOffset, range.endContainer, range.endOffset)
    range.extractContents();
    range.insertNode(newHighlight.elem);

    console.log(newHighlight);

    highlights.push(newHighlight);

  }

  function restoreHighlight() {
    var selection = window.getSelection();
    selection.removeAllRanges();

    var range = document.createRange();
    range.setStart(highlights[i].startContainer, highlights[i].startOffset);
    range.setEnd(highlights[i].endContainer, highlights[i].endOffset);

    selection.addRange(range);
    console.log(range);
  }

  function newHighlightSpan(id, text) {
    var newNode = document.createElement("span");
    newNode.setAttribute('id', ('highlight-'+id));
    newNode.setAttribute('class', 'highlight');
    newNode.appendChild(document.createTextNode(text));
    return newNode;
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

$('article').on('mouseup', function(e) {
  e.stopPropagation();
  e.preventDefault();
  // positionMenu($('#highlightCreatePopover'), range);
  $('#highlightCreatePopover').show().addClass('slideUp');
});

$('#addHighlight').on('click', function(e) {
  e.preventDefault();
  createHighlight();
  hideHighlighterMenus();
});

});

// Array to store the highlights
var highlights = [];

// TODO: fix rebuild highlights edge case for the following scenario
// Build a highlight, delete and rebuild, build another highlight, delete and rebuild.  At this point the second highlight doesn't appear.

$(document).on('ready page:load', function() {

  // ----------------------------------------------------------------
  // Article HTML Set Up
  // ----------------------------------------------------------------

  function numberElements(html) {
    $('article.container *').each(function( index ) {
      this.setAttribute('id', (index));
    })
  }

  numberElements('article');

  // ----------------------------------------------------------------
  // Highlight Logic
  // ----------------------------------------------------------------

  function Highlight(startOffset, endOffset, highlightText, parentElementID, occurences) {
    this.id = highlights.length;
    this.endOffset = endOffset;
    this.text = highlightText;
    this.parentElementID = parentElementID;
    this.occurences = occurences;
    this.occurenceIndex = this.occurences.indexOf(startOffset);
  }

  function createHighlight() {
    if (window.getSelection) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);

      if (sel.rangeCount && (range.toString().length > 0)) {
        // Create a new highlight
        var newHighlightText = range.toString().replace(/\s{2,}/g, ' ');
        newHighlightText = newHighlightText.replace(/\t/g, ' ');
        newHighlightText = newHighlightText.trim().replace(/(\r\n|\n|\r)/g,"");
        var newHighlight = new Highlight(range.startOffset, range.endOffset, newHighlightText, range.startContainer.parentElement.id, getOccurences(range.startContainer.textContent, range.toString()));
        // Store highlight in array
        highlights.push(newHighlight);
        // Add a span to the range
        range.surroundContents(newHighlightSpan(newHighlight.id));
      }
    }
  }

  function getOccurences(elementText, match) {
    var occurences = [];
    var matchIndex = 0;
    var allOccurencesAdded = false;

    while (allOccurencesAdded == false) {
      newOccurence = elementText.indexOf(match, matchIndex);
      if (newOccurence >= 0) {
        occurences.push(newOccurence);
        matchIndex = newOccurence + 1;
      } else {
        allOccurencesAdded = true;
      }

    }

return occurences;

}

function newHighlightSpan(id) {
    // Create a new span with highlight-id and class highlight
    var newNode = document.createElement("span");
    newNode.setAttribute('id', ('highlight-'+id));
    newNode.setAttribute('class', 'highlight');
    return newNode;
  }

  function deleteHighlights() {
    // replace the existing article with a pristine copy of the HTML (i.e. eliminate all spans)
    var pristineArticle = "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>";
    $('article').html(pristineArticle);
    numberElements('article');
  }

  function buildHighlights() {
    // Make sure article is pristine
    deleteHighlights();
    // Loop through the array of highlights 



    // Loop through each highlight
    for (var i=0; i<(highlights.length); i++) {
      var h = highlights[i]
      var currentHighlightText = h.text;
      var finalMarkedText = "";

      // iterate through each paragraph to find the paragraph matching the highlight
      $('article.container *').each(function() {
        if (this.id == h.parentElementID) {
          $this = $(this)
          paragraphText = $this.html() ;
          paragraphOccurences = getOccurences(paragraphText, currentHighlightText);
          replacementIndex = paragraphOccurences[h.occurenceIndex];
          replacementIndexEnd = replacementIndex + h.text.length;
          finalMarkedText = finalMarkedText.concat(paragraphText.substr(0,replacementIndex));
          finalMarkedText = finalMarkedText.concat("<span class='highlight'>");
          finalMarkedText = finalMarkedText.concat(h.text);
          finalMarkedText = finalMarkedText.concat("</span>");
          finalMarkedText = finalMarkedText.concat(paragraphText.substr(replacementIndexEnd));

          paragraphText = finalMarkedText;

          $this.empty();
          $this.append(finalMarkedText);
        }
      });

    }
  }

function getIndicesOf(searchStr, str) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];

    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

  // ----------------------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------------------

  $('article').on('mouseup', function(e) {
    e.stopPropagation();
    e.preventDefault();

    $('#highlightCreatePopover').show();
    $('#highlightDeletePopover').hide();

  });

  $('#addHighlight').on('click', function(e) {
    e.preventDefault();
    createHighlight();
    $('#highlightCreatePopover').hide();
  });

  $('#deleteHighlights').on('click', function(e) {
    e.preventDefault();
    deleteHighlights();
  });

  $('#buildHighlights').on('click', function(e) {
    e.preventDefault();
    buildHighlights();
  });

});

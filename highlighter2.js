// Array to store the highlights
var highlights = [];

$(document).on('ready page:load', function() {

  // ----------------------------------------------------------------
  // Article HTML Set Up
  // ----------------------------------------------------------------

  function numberElements(html) {
    var i = 0;
    $(html).contents().filter(function() {
      if (this.nodeType === 1) {
        this.id = i;
        i++;
      }
    });
  }

  numberElements('article');

  // ----------------------------------------------------------------
  // Highlight Logic
  // ----------------------------------------------------------------

  function Highlight(startContainer, startOffset, endContainer, endOffset, commonAncestorContainer, highlightText, parentElementID, occurences, focusOffset) {
    this.id = highlights.length;
    this.startContainer = startContainer;
    this.startOffset = startOffset;
    // This causes issues when you are doing a second highlight in a paragraph.  Occurences are based on html which now includes html for a previous span, but it's compared with startOffset which is for the text only, specifically for the new text node.
    this.endContainer = endContainer;
    this.endOffset = endOffset;
    this.text = highlightText;
    this.parentElementID = parentElementID;
    this.occurences = occurences;
    this.occurenceIndex = this.occurences.indexOf(this.startOffset);
    this.focusOffset = focusOffset;
    console.log(this)
  }

  function createHighlight() {
    if (window.getSelection) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      console.log("range created for highlight:");
      console.log(range);
      if (sel.rangeCount && (range.toString().length > 0)) {
        // Create a new highlight
        console.log("startcontainer:");
        console.log(range.startContainer);
        console.log("parent element:")
        console.log(range.startContainer.parentElement);
        console.log("Inner html (element in getOccurences function):");
        console.log(range.startContainer.parentElement.innerHTML);
        console.log("range.toString (match in getOccurences function)")
        console.log(range.toString())
        var newHighlight = new Highlight(range.startContainer, range.startOffset, range.endContainer, range.endOffset, range.commonAncestorContainer, range.toString(), range.startContainer.parentElement.id, getOccurences(range.startContainer.parentElement.innerHTML, range.toString()), sel.focusOffset);
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
    // Loop through the array of highlights backwards
    for (var i=(highlights.length-1); i>=0; i--) {
      // Get the full text of the current highlight
      var currentHighlightText = highlights[i].text;
      currentHighlightText = currentHighlightText.replace(/\s{2,}/g, ' ');
      currentHighlightText = currentHighlightText.replace(/\t/g, ' ');
      currentHighlightText = currentHighlightText.toString().trim().replace(/(\r\n|\n|\r)/g,"");

      var finalMarkedText = "";


      $('article').contents().filter(function() {
        if (this.id === highlights[i].parentElementID) {
// TODO: Modify this so it uses the startOffset highlighter value and starts the search there. 
// OR: update the 

// ORIG:
          // finalMarkedText = $(this).html().replace(currentHighlightText, "<span id='highlight-" + i + "' class='highlight'>" + currentHighlightText + "</span>");
          // $(this).html(finalMarkedText);
          searchOccurences = getIndicesOf(currentHighlightText, $(this).html());


          occurenceIndex = searchOccurences[highlights[i].occurenceIndex];
          console.log("Search occurences:");
          console.log(searchOccurences);
          console.log("highlights[i]:")
          console.log(highlights[i]);
          console.log("highlights[i].occurenceIndex");
          console.log(highlights[i].occurenceIndex);
          console.log("occurenceIndex:");
          console.log(occurenceIndex);
          finalMarkedText = $(this).html().substring(0, occurenceIndex) + "<span class='highlight'>" + highlights[i].text + "</span>" + $(this).html().substring(occurenceIndex + highlights[i].text.length, $(this).html().length);
          $(this).html(finalMarkedText);

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

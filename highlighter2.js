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

  function Highlight(startContainer, startOffset, endContainer, endOffset, commonAncestorContainer, highlightText, parentElementID, occurences, focusOffset) {
    this.id = highlights.length;
    this.startContainer = startContainer;
    this.startOffset = startOffset;
    this.endContainer = endContainer;
    this.endOffset = endOffset;
    this.text = highlightText;
    this.parentElementID = parentElementID;
    this.occurences = occurences;
    this.occurenceIndex = this.occurences.indexOf(this.startOffset);
    this.focusOffset = focusOffset;
  }



  function createHighlight() {
    if (window.getSelection) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      
      if (sel.rangeCount && (range.toString().length > 0)) {
        // Create a new highlight
        // var currentHighlightText = currentHighlightText.toString().trim().replace(/(\r\n|\n|\r)/g,"");
        var newHighlightText = range.toString().trim().replace(/(\r\n|\n|\r)/g,"");
        // var newHighlightText = range.toString().replace(/\s\s+/g, ' ');
        var newHighlight = new Highlight(range.startContainer, range.startOffset, range.endContainer, range.endOffset, range.commonAncestorContainer, newHighlightText, range.startContainer.parentElement.id, getOccurences(range.startContainer.textContent, range.toString()), sel.focusOffset);
        console.log(newHighlight)
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
    var paragraphTextRanOnce = null;
    for (var i=0; i<(highlights.length); i++) {
    // for (var i=(highlights.length-1); i>=(highlights.length-1); i--) {
      //Using this for statement instead of the below solves the immediate problem of multiple highlights not loading if highlights ar erebuilt after the first highlight was made.  However, it may not work with the database.
    // for (var i=(highlights.length-1); i>=0; i--) {
      // Get the full text of the current highlight
      var currentHighlightText = highlights[i].text;
      currentHighlightText = currentHighlightText.replace(/\s{2,}/g, ' ');
      currentHighlightText = currentHighlightText.replace(/\t/g, ' ');
      currentHighlightText = currentHighlightText.toString().trim().replace(/(\r\n|\n|\r)/g,"");

      var finalMarkedText = "";



      
      $('article').contents().filter(function() {
        if (this.id === highlights[i].parentElementID) {
          $this = $(this)
          if (paragraphTextRanOnce == null) {
            paragraphText = $this.html() 
            paragraphTextRanOnce = true;
          }
          console.log("paragraphText:")
          console.log(paragraphText)
          
          // searchOccurences = getIndicesOf(currentHighlightText, (highlights[i].startContainer.textContent + highlights[i].text));  // This is checking the paragraph for occurences, but the searh index is based on the node.
          
          paragraphOccurences = getOccurences(paragraphText, currentHighlightText)
          replacementIndex = paragraphOccurences[highlights[i].occurenceIndex]
          console.log("Highlight text length:");
          console.log(highlights[i].text.length)
          console.log("Line breaks:")
          console.log((highlights[i].text.match(/\n/g)||[]).length)
          replacementIndexEnd = replacementIndex + highlights[i].text.length; // + ((highlights[i].text.match(/\n/g)||[]).length);
          console.log("replacement index:");
          console.log(replacementIndex);
          // console.log(paragraphText.substr(replacementIndex,replacementIndex));
          console.log("replacement index end:");
          console.log(replacementIndexEnd);
          // console.log(paragraphText.substr(replacementIndexEnd,replacementIndexEnd));
          console.log("First part of string:");
          console.log(paragraphText.substr(0,replacementIndex));
          finalMarkedText = finalMarkedText.concat(paragraphText.substr(0,replacementIndex))
          finalMarkedText = finalMarkedText.concat("<span class='highlight'>");
          // finalMarkedText = finalMarkedText.concat(paragraphText.substr(replacementIndex,replacementIndexEnd))
          console.log("Text:")
          console.dir(highlights[i].text)
          finalMarkedText = finalMarkedText.concat(highlights[i].text);
          finalMarkedText = finalMarkedText.concat("</span>");
          console.log("Last part of string");
          console.log(paragraphText.substr(replacementIndexEnd));
          finalMarkedText = finalMarkedText.concat(paragraphText.substr(replacementIndexEnd))



          


          // occurenceIndex = searchOccurences[highlights[i].occurenceIndex]; 
          // var finalMarkedText = ""
          // var childLength =  highlights[i].startContainer.parentNode.childNodes.length;
          // console.log("******************************************")
          // console.log("About to loop for following highlight for highlight # " + i + ":");
          // console.log(highlights[i].text);
          // console.log(highlights[i]);
          // for (x = 0; x < childLength; x++) {
          //   console.log("About to concat the following node, node #" + x);
          //   currentNode = highlights[i].startContainer.parentNode.childNodes[x]
          //   console.log(currentNode.outerHTML || currentNode.textContent)

          //   finalMarkedText = finalMarkedText.concat(currentNode.outerHTML || currentNode.textContent);
          //   // If this doesn't work once we connect it to the database, we may need to do the following:
          //   // Check if node is the current node in question, and if so modify the HTML string by using substr and the occurence index.
          // }
          // console.log("FInished product for final marked text:")
          // console.log(finalMarkedText);
          paragraphText = finalMarkedText;
          

          // $(this).html(finalMarkedText);

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

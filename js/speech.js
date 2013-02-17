function clearNotice() {
  var notice = $(".notice");  
  notice.slideUp();
  notice.html("");
}
function notice(message, auto_hide) {
  var notice = $(".notice");  
  $(".notice").append(message);
  notice.show();
  if (auto_hide) {
    setTimeout(clearNotice, 2000);    
  }
}


function resetCounters() {
  $(".counter span").html("0");
}

function show_current(word) {
  $(".current span").html(word);
}
function fillList(words) {      
  var words_array = $.map(words.split(","), function(w){ return $.trim(w.toLowerCase());})
  , words_text_list = words_array.join(",")
  , list = $(".the-list ul");
  list.html("");

  list.data("words", words_text_list);
  $.each(words_array, function(index, word) {      
    var elem = $("<li />");
    if (index==0) {
      elem.addClass("current_word");
    }    
    elem.attr("id", "id_" + index);
    elem.html(word);
    list.append(elem)
  });  
  show_current(words_array[0]);
  resetCounters();
}

function moveNext(item) {
  var list = $(".list-of-words .the-list ul")
  , list_items = $(".list-of-words .the-list ul li")
  , list_data = list.data("words")
  , list_data_array = list_data.split(",")
  , current_item = jQuery.inArray( item, list_data_array )
  , next_item_id = current_item + 1
  , next_item_list = $("#id_" + next_item_id);
  
  list_items.removeClass("current_word");
  next_item_list.addClass("current_word");
  show_current(next_item_list.html());

}

function printRecognition(recognition, item) {
  moveNext(item);
  var ko = $(".counter.ko span")
  , ko_counter = parseInt(ko.html())
  , ok = $(".counter.ok span")
  , ok_counter = parseInt(ok.html());
  
  if (recognition) {
    ok.html(ok_counter + 1);
  } else {
    ko.html(ko_counter + 1);    
  }

}

$(function() {
  $("#edit-list").click(function (){
    var list_wrapper = $(".list-of-words .the-list")
    , list = $(".list-of-words .the-list ul")
    , form = $(".form")
    , textarea = $("textarea[name='words']");
    
    list_wrapper.hide();    
    textarea.html(list.data("words"));
    form.show();
  });

  $(".form form").submit(function (e){
    var list_wrapper = $(".list-of-words .the-list")
    , list = $(".list-of-words .the-list ul")
    , form = $(".form")
    , textarea = $("textarea[name='words']")
    , words = textarea.val();

    fillList(words);
    form.hide();
    list_wrapper.show();
    e.preventDefault();
  });

  if( document.createElement('input').webkitSpeech==undefined ) {
    notice("We are sorry but Dictation requires <strong>Google Chrome</strong>.", false);
    $("body").addClass("disabled");
  } else {
    var posible_words = "perro, gato, cerdo, araña, cabra,  hola, nene, melena";

    fillList(posible_words);

    var language = window.navigator.userLanguage || window.navigator.language;

    $("#speech").attr("lang", language).focus();

    $("#speech").bind("webkitspeechchange", function(e) {        
      var speech_value = $(this).val()
      , current_word = $(".current span").html()
      , sentence = "You say: <strong>" + current_word + "</strong><br>Machine understand: <strong>" + speech_value + "</strong>";

      notice(sentence, true);

      if (current_word == speech_value) {
        var recognition = true;  
      }
      else {
        var recognition = false;
      }

      printRecognition(recognition, current_word);

      $(this).val("").focus();
    });  
  } // end if valid browser.
});


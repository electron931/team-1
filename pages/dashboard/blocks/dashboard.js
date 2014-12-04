$( document ).ready(function() {
    $.ajax({ type: "POST"
            , url: window.location.origin + '/api/getUserDocuments'
            , success: function(documents) {
                console.log('success')
                documents = JSON.parse(documents)
                console.log(documents[0]);
                var documentsList = $('.documentsList')
                for (var i = 0; i < documents.length; i++) {
                  documentsList.append(
                    '<li class="documentItem" id="' + documents[i]._id + '"><a href="/editor#' 
                    + documents[i]._id + '">' + documents[i].name +
                     '</a><span class="glyphicon glyphicon-trash pull-right deleteDocument"></span></li>');
                }
            }
            , fail: function() {
                console.log('error')
            }
        })

})


$(document).on('click','.deleteDocument', function(){
      var isDelete = confirm("Are you sure?");
      var docId = $('.documentItem').attr('id')
      if (isDelete) {
        $.ajax({ type: "POST"
        , url: window.location.origin + '/api/deleteDocument'
        , data: {
          'docId': docId
        },
        success: function(data) {
          console.log('success')
          $('#' + docId).remove()
        },
        fail: function() {
          console.log('error')
        }
      })
    }
})
$( document ).ready(function() {
    $.ajax({ type: "POST"
            , url: window.location.origin + '/api/getUserDocuments'
            , success: function(documents) {
                console.log('success')
                documents = JSON.parse(documents)
                var documentsList = $('.documentsList');
                for (var i = 0; i < documents.length; i++) {
                  documentsList.append('<li>' + documents[i].name + '</li>');
                }
            }
            , fail: function() {
                console.log('error')
            }
        })
})
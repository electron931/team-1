var Team1 = Team1 || {}
var Host = window.location.hostname + ':7900'

Team1 = {
  start: function (options) {
    _.bindAll(this)

    new Switchery(document.querySelector('.js-switch'))

    this.documentId = this.getDocId()

    this.socket = this.getSocket(options.socketUrl)
    this.sjs = new window.sharejs.Connection(this.socket)
    this.doc = this.sjs.get('users-' + this.documentId, 'seph')

    this.bindSocketHandlers()

    this.auth().done(this.openDocument)
  }
  , getDocId: function () {
    return this.getDocIdFromHash()
  }
  , getDocIdFromHash: function () {
    return window.location.hash.replace('#', '')
  }
  /**
   * Simple auth.
   * @returns {jQuery.Deferred}
   */
  , auth: function () {

    return $.ajax({ type: "POST"
            , url: window.location.origin + '/api/getCurrentUser'
            , success: function(user) {
                console.log('success')
                if (user != null) {
                  user = JSON.parse(user)
                  var rosterUser = {
                    title: user.github.username
                  }

                  Team1.__user = rosterUser
                }
            }
            , fail: function() {
                console.log('error')
            }
        })
  }

  /**
   * Create interface for document
   */
  , buildDocumentInterface: function (document) {
    var self = this

    this.Roster = new Team1.Roster()
    this.Editor = new Team1.Editor()

    this.doc.subscribe()

    this.doc.whenReady(function () {
      if (!self.doc.type) self.doc.create('text')

      if (self.doc.type && self.doc.type.name === 'text')
        self.doc.attachCodeMirror(self.Editor.codeEditor)
    })

    if (document.users)
      this.Roster.fillList(document.users)

    if (document.id) {
      if (Team1.Roster.getUsersCount() == 1) {
        this.loadDocument(document.id)
      }
    }
  }

  , openDocument: function () {
    this.send(JSON.stringify(
      { a: 'open'
      , user: this.__user
      , document:
        { id: this.documentId
        }
      }
    ) )

    return this
  }

  , bindSocketHandlers: function () {
    this.doc.setOnOpenMessageFn(this.onSocketOpen)
    this.doc.setOnJoinMessageFn(this.onSocketJoin)
    this.doc.setOnCloseMessageFn(this.onSocketLeave)
    this.doc.setOnMetaMessageFn(this.onSocketMeta)
  }

  , send: function (message, callback) {
    var self = this

    this.waitForConnection(function () {
      self.socket.send(message)

      if (typeof callback !== 'undefined') {
        callback()
      }
    }, 1000)
  }

  , waitForConnection: function (callback, interval) {
    var that = this

    if (this.socket.readyState === 1)
    { callback()
    } else {
      setTimeout(function ()
        { that.waitForConnection(callback)
        }
        , interval)
    }
  }

  , onSocketJoin: function (data) {
    this.Roster.add(data.user)
  }

  , onSocketLeave: function (data) {
    this.Roster.remove(data.user.id)
    this.Editor.removeCursor(data.user.id)
  }

  , onSocketOpen: function (data) {
    if (data.user)
      _.extend(this.__user, data.user)

    this.buildDocumentInterface(data.document || {})
  }

  , onSocketMeta : function (data) {
    this.Editor.updateCursor(
      { id: data.id
      , position : data.meta
      , color : data.color
      }
    )
  }

  , saveDocument: function () {
    var docContentObj = {
      docId: this.documentId
    , docName: $('.docNameInput').val()
    , docContent: this.Editor.codeEditor.getValue()
    }

    $.ajax({ type: "POST"
            , url: window.location.origin + '/api/saveDocument'
            , data: docContentObj
            , success: function(data) {
                console.log('success')
            }
            , fail: function() {
                console.log('error')
            }
        })
  }

  , loadDocument: function (docId) {
    
    $.ajax({ type: "POST"
            , url: window.location.origin + '/api/loadDocument'
            , dataType: 'json'
            , data: { docId: this.documentId }
            , success: function(doc) {
                $('.docNameInput').val(doc.name)
                if (doc.value != null) {
                  Team1.Editor.codeEditor.getDoc().setValue(doc.value)
                }
            }
            , fail: function() {
                console.log('error')
            }
        })
  }

  , getSocket : function () {
    return new WebSocket('ws://' + Host)
  }
}

$(document).ready(function () {
  Team1.start({
    socketUrl: 'http://' + Host
  })
  $('.fontSizeSelect').on('change', function (e) {
    var optionSelected = $("option:selected", this)
    var fontSize = this.value
    $(".CodeMirror").css({fontSize: fontSize + 'px'})
    Team1.Editor.codeEditor.setOption("theme", $('.control__themelist option:selected').text())   //clumsy hack for proper text selection
  })
})

window.onbeforeunload = function () {
  if (Team1.Roster.getUsersCount() == 1) {
      Team1.saveDocument()
  }
}

window.onunload = function () {
  if (Team1.Roster.getUsersCount() == 1) {
      Team1.saveDocument()
  }
}

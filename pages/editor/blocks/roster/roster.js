var Team1 = Team1 || {}

Team1.Roster = function () {
  this.usersListEl = $(".roster-list")

  this.userTpl = _.template($("#user-tpl").html())
}

Team1.Roster.prototype.add = function (user) {
  this.usersListEl.append(this.userTpl(user))
}

Team1.Roster.prototype.remove = function (id) {
  this.usersListEl.find("#" + id).remove()
}

Team1.Roster.prototype.fillList = function (usersList) {
  var _this = this
  console.log(usersList);
  _.forEach(usersList, function (user) {
    _this.add(user)
  })
}

Team1.Roster.prototype.getUsersCount = function () {
	return $(".roster-list li").length;
}

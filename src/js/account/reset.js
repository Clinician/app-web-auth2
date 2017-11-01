var $ = require('jquery');
var Settings = require('../utils/Settings');

var getURLParameter = function (name) {
  return decodeURIComponent((new RegExp(name + '=' + '(.+?)(&|$)')
    .exec(location.search)||['',''])[1]);
};

module.exports.requestResetPassword = function (e) {
  e.preventDefault();
  var resetForm = $('#resetForm');
  var username = resetForm.find('input[name=username]').val();
  if (username && username.length > 0) {
    resetForm.find('input[type=submit]').prop('disabled', true);
    var domain = Settings.retrieveServiceInfo().replace('/service/infos', '')
      .replace('https://reg.', '');
      
    $.post('https://' + username + '.' + domain +
      '/account/request-password-reset', {appId: 'static-web'})
      .done(function () {
        resetForm.get(0).reset();
        $('#error').hide().empty();
        resetForm.hide();
        $('#requestSent').show();
        resetForm.find('input[type=submit]').prop('disabled', false);
      })
      .fail(function () {
        $('#error').text('Username unknown').show();
        resetForm.find('input[type=submit]').prop('disabled', false);
      });
  }
};

module.exports.setPassword = function (e) {
  e.preventDefault();
  var setPass = $('#setPass');
  var username = setPass.find('input[name=username]').val();
  var pass = setPass.find('input[name=password]').val();
  var rePass = setPass.find('input[name=rePassword]').val();
  if (username && username.length > 0 && pass && pass === rePass) {
    setPass.find('input[type=submit]').prop('disabled', true);
    var domain = Settings.retrieveServiceInfo().replace('/service/infos', '')
      .replace('https://reg.', '');
    $.post('https://' + username + '.' + domain + '/account/reset-password',
      {newPassword: pass, appId: 'static-web', resetToken : getURLParameter('resetToken')})
      .done(function () {
        setPass.get(0).reset();
        $('#loginUsernameOrEmail').val(username);
        $('#loginPassword').val(pass);
        $('#resetContainer').hide();
        $('#loginContainer').show();
      })
      .fail(function () {
        $('#error').text('Username unknown').show();
        setPass.find('input[type=submit]').prop('disabled', false);
      });
  }
};

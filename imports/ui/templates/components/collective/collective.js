import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';

import { displayPopup, animatePopup } from '/imports/ui/modules/popup';

import '/imports/ui/templates/components/collective/collective.html';

function promptLogin(logged, event) {
  if (logged) {
    Session.set('userLoginVisible', true);
    displayPopup($('#collective-login')[0], 'login', Meteor.userId(), event.type, 'user-login');
  } else {
    Session.set('userLoginVisible', false);
    animatePopup(false, 'user-login');
  }
}

Template.collective.onRendered(() => {
  Session.set('userLoginVisible', false);
  if (!Session.get('checkInitialSetup') && Meteor.userId() === null) {
    promptLogin(true, 'click');
    Session.set('checkInitialSetup', true);
  }

  window.addEventListener('click', function (e) {
    if (document.getElementById('card-user-login')){
      if (!document.getElementById('card-user-login').contains(e.target)) {
        promptLogin((!Session.get('user-login') || !Session.get('user-login').visible), event);
      }
    }
  });
});

Template.collective.helpers({
  title() {
    return Meteor.settings.public.Collective.name;
  },
  description() {
    return Meteor.settings.public.Collective.profile.bio;
  },
  picture() {
    if (Meteor.settings.public.Collective.profile.logo) {
      return Meteor.settings.public.Collective.profile.logo;
    }
    return 'images/earth.png';
  },
  hasLogo() {
    return (Meteor.settings.public.Collective.profile.logo !== undefined);
  },
  toggle() {
    if (Session.get('userLoginVisible')) {
      return 'collective-selected';
    }
    return '';
  },
  username() {
    let user =  Meteor.user()
    if (user.profile && user.profile.fullName) {
      return user.profile.fullName
    } else {
      return user.username
    }

  }
});

Template.collective.events({
  'click #collective-home'() {
    Router.go('/');
  },
  'click #collective-login'() {
    event.stopPropagation();
    promptLogin((!Session.get('user-login') || !Session.get('user-login').visible), event);
  },
});

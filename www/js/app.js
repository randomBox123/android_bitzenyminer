// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', ['ionic', 'chart.js', 'app.controllers', 'app.routes', 'app.directives','app.services'])

.factory('AdMobManager', function() {
  var admobid, factory, initApp;
  admobid = /(android)/i.test(navigator.userAgent) ? {
    banner: 'ca-app-pub-3963290107225584/9815883721',
    interstitial: 'ca-app-pub-3963290107225584/3033841199'
  } : /(ipod|iphone|ipad)/i.test(navigator.userAgent) ? {
    banner: 'ca-app-pub-3963290107225584/6908672871',
    interstitial: 'ca-app-pub-3963290107225584/8230327558'
  } : {
    banner: 'ca-app-pub-3963290107225584/6908672871',
    interstitial: 'ca-app-pub-3963290107225584/8230327558'
  };
  initApp = function() {
    if (typeof AdMob === 'undefined') {
      console.log('AdMob plugin is not ready.', admobid);
      return;
    }
    AdMob.createBanner({
      adId: admobid.banner,
      isTesting: false, // とりあえずテスト用の広告
      overlap: false,
      offsetTopBar: false,
      position: AdMob.AD_POSITION.BOTTOM_CENTER,
      bgColor: 'black'
    });
    return AdMob.prepareInterstitial({
      adId: admobid.interstitial,
      autoShow: true
    });
  };
  return factory = {
    init: function() {
      if (/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent)) {
        return initApp();
      }
    }
  };
})

.config(function($ionicConfigProvider, $sceDelegateProvider){
  $ionicConfigProvider.tabs.style("standard");
  $ionicConfigProvider.tabs.position("bottom");

})

.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
}])

.run(function($ionicPlatform,AdMobManager) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    AdMobManager.init();

  });
})


/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",  
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });
      
      element.bind('click', function (event) {
        
        window.open(href, '_system');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});


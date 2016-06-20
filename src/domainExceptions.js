/**
* This is a dictionary containing all of the domains that user may want to 
* make an exception for. The key is the url to trigger a popup and
* the value is an array where index 0 is the domain to whitelist if the user wishes to login.
* Index 1 is the English name of the service.
**/
require.scopes.domainExceptions = (function() {

var exports = {};

var utils = require('utils');

var DomainExceptions = {

  list: { },
  domainExceptionListURL: "https://www.eff.org/files/domain_exception_list.json",

  /**
   * Update local domain exception list
   * @param {Function} callback Callback to call after update. Optional
   */
  updateList: function(callback){
    //update object from local storage
    chrome.storage.local.get('domainExceptionList', function(l){
      if(l){ DomainExceptions.list = l; }
    });

    //get list from server
    utils.xhrRequest(this.domainExceptionListURL, function(err,msg){
      if(err){
        console.error("Error downloading domain exception list:", msg);
        return false;
      }

      var l = JSON.parse(msg);
      //update local storage
      chrome.storage.local.set({domainExceptionList: l});
         
      //update local object
      DomainExceptions.list = l;
      if(typeof callback === "function"){callback();}
    });
  },

  /**
   * Check if path is in whitelist
   * @param {String} path
   * @returns {*} The exception list entry or undefined
   */
  getWhitelistForPath: function(path){
    for(var name in DomainExceptions.list){
      var url = path.replace(/.*?:\/\//g, "");
      if(url.indexOf(name) === 0){ return DomainExceptions.list[name]; }
    }
    return undefined;
  },

};

exports.DomainExceptions = DomainExceptions;
return exports;
})();

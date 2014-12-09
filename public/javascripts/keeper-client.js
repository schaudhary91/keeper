/*
* keeper-client.js
*/


document.addEventListener("mouseup", function(e) {
  var selection
  , body = document.querySelector("body")
  , icon = document.getElementById("cc-icon") && document.getElementById("cc-icon") || document.createElement("SPAN");


  if (window.getSelection || document.selection) {
    if (window.getSelection) {
      selection = window.getSelection();
    } else if (document.selection) {
      selection = document.selection.createRange();
    }
    var selectionContent = selection.toString().replace(/^\s+|\s+$/gm,'')
    , x = e.pageX
    , y = e.pageY
    , ccIconStyle = "display: block;height: 10px; width: 10px; position: absolute;top:" + y + "px;left: " + x + "px;z-index: 20";
    if(selectionContent){
      icon.setAttribute("id", "cc-icon");
      icon.setAttribute("style", ccIconStyle);
      icon.innerHTML = "{#}";
      body.appendChild(icon);
      icon.addEventListener("click", function(){
        icon.setAttribute("data-mode", "active");
        icon.style.display = "none";
        showCCPopup(selectionContent, body);
      });
    }
  }

});

/*
* function responsible for adding stylesheet
*
(function addStyle(){
if(document.createStyleSheet) {
document.createStyleSheet('<cdn url>/style.css');
}
else {
var styles = "@import url('<cdn url>/style.css');"
, newSS = document.createElement('link');

newSS.rel='stylesheet';
newSS.href='data:text/css,' + escape(styles);
document.getElementsByTagName("head")[0].appendChild(newSS);
}
}());*/

function showCCPopup(selectionContent, body){
  var
  template = '<div id="cc-popup" ><h2 style="text-align: center;font: bold 20px sans-serif;">Keeper {#}</h2><p style="max-height: 150px;overflow: auto;">@content</p><input placeholder="Tag your content {#}" type="text" style="width: 95%; margin: 10px 0;height: 26px; line-height: 20px;background: #EFEFED"/><div style="padding: 10px 0;"><a title="Save">[ SAVE ]<a/><a title="cancel" class="cc-lnkCancel">  cancel <a/></div></div>'
  , style = "background-color: white;border: 5px solid black;padding: 20px 40px;width: 300px;position: fixed;z-index: 20;top: 15%;left: 34%;";

  template = template.replace("@content", selectionContent);
  tempContainer = document.createElement("DIV");
  tempContainer.setAttribute("id", "cc-container");
  tempContainer.setAttribute("style", style);
  tempContainer.innerHTML = template;
  body.appendChild(tempContainer);
  var cancel = document.getElementsByClassName("cc-lnkCancel")[0];
  cancel.addEventListener("click", function(){
    tempContainer.remove();
  });
}

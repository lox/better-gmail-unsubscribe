(function() {
  var loadListener = self.setInterval(function () {pollMessage()}, 100);

  function pollMessage() {
    var messages = findMessages();
    if (messages.length) {
      console.log("gmail.js: detected messages: ", messages)
      window.clearInterval(loadListener);

      // only apply to last message in thread
      message = messages[messages.length-1];

      if (!hasUnsubscribeLink(message)) {
        console.log("gmail.js: no gmail unsubscribe, adding ours");
        addUnsubscribeButton(message);
      }
    }
  }

  function findMessageTitle(message) {
    var matches = message.querySelectorAll("h3.iw");
    return matches.length > 0 ? matches[0] : false;
  }

  function findMessageBody(message) {
    var matches = message.querySelectorAll('.adP.adO');
    return matches.length > 0 ? matches[0] : false;
  }

  function findMessages() {
    return document.querySelectorAll("div.gs");
  }

  function hasUnsubscribeLink(message) {
    return message.querySelectorAll("h3.iw > .Ca, h3.iw > .unsub").length > 0;
  }

  function addUnsubscribeButton(message) {
    var title  = findMessageTitle(message);
    var link = document.createElement('a');
    link.setAttribute('href', '');
    link.setAttribute('class', 'unsub')
    link.innerHTML = "Unsubscribe"
    title.appendChild(link);

    // set up behaviour
    link.onclick = function(e) {
      e.preventDefault();
      injectModal(
        'Are you sure?',
        'You are about to unsubscribe from "<b>'+
        title.querySelectorAll("span[name]")[0].getAttribute('name')+
        '</b>", do you wish to proceed?',
        message
      );
    };
  }

  function findUnsubscribeLinks(message) {
    var links = findMessageBody(message).querySelectorAll("a[href]");
    var matches = [];
    var pattern = /unsub|opt\s*out/i;

    for (var i = 0, ii = links.length; i < ii; i++) {
      var link = links[i];
      if (link.getAttribute('href').match(pattern)) {
        matches.push(links[i]);
        console.log("unsubscribe candidate from href", link.href);
      } else if (link.innerHTML.match(pattern)) {
        matches.push(link);
        console.log("unsubscribe candidate from content", link.innerHTML);
      }
    }

    if (matches.length == 0) {
      console.log("no unsubscribes found, finding last click here");
      for (var i = 0, ii = links.length; i < ii; i++) {
        var link = links[i];
        if (link.innerHTML.match(/click\s+here/i)) {
          matches.push(link);
          console.log("unsubscribe candidate from content", link.innerHTML);
        }
      }
      matches.reverse(); // use the one at the end of page
    }

    return matches;
  }

  function unsubscribe(message) {
    var links = findUnsubscribeLinks(message);

    // highlight unsubscribes in red
    for (var i = 0, ii = links.length; i < ii; i++) {
      var link = links[i];
      link.style.backgroundColor = "red";
      link.style.fontWeight = "bold";
    }

    // take action
    if(links.length == 0) {
      alert("No unsubscribe links found");
    } else {
      var win = window.open(links[0].href, '_blank');
      win.focus();
    }
  }

  function injectModal(title, body, message) {
    var shim = document.createElement("div");
    shim.setAttribute('class', 'Kj-JD-Jh');
    shim.setAttribute('style', 'opacity: 0.75; width: 100%; height: 100%;');

    document.body.appendChild(shim);

    var modal = document.createElement("div");
    modal.setAttribute('class', 'Kj-JD');
    modal.setAttribute('role', 'alertdialog');
    modal.setAttribute('style', 'left: 452px; top: 79.5px; opacity: 1');

    var modalHeader = document.createElement("div");
    modalHeader.setAttribute('class', 'Kj-JD-K7 Kj-JD-K7-GIHV4');
    modal.appendChild(modalHeader);

    var modalTitle = document.createElement("span");
    modalTitle.setAttribute('class', 'Kj-JD-K7-K0');
    modalTitle.setAttribute('role', 'heading');
    modalTitle.innerHTML = title;
    modalHeader.appendChild(modalTitle);

    var modalClose = document.createElement("span");
    modalClose.setAttribute('class', 'Kj-JD-K7-Jq');
    modalClose.setAttribute('role', 'button');
    modalHeader.appendChild(modalClose);

    var modalBody = document.createElement("div");
    modalBody.setAttribute('class', 'Kj-JD-Jz')
    modalBody.innerHTML = body;
    modal.appendChild(modalBody);

    var modalButtonBar = document.createElement("div");
    modalButtonBar.setAttribute('class', 'Kj-JD-Jl');
    modal.appendChild(modalButtonBar);

    var unsubscribeBtn = document.createElement("button");
    unsubscribeBtn.setAttribute('class', 'J-at1-auR J-at1-atl');
    unsubscribeBtn.name = 's';
    unsubscribeBtn.innerHTML = "Unsubscribe";
    modalButtonBar.appendChild(unsubscribeBtn);

    var cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Cancel";
    modalButtonBar.appendChild(cancelBtn);

    document.body.appendChild(modal);

    // wire up event handlers

    var closeModal = function(e) {
      e.preventDefault();
      document.body.removeChild(shim);
      document.body.removeChild(modal);
    }

    modalClose.onclick = closeModal;
    cancelBtn.onclick = closeModal;

    unsubscribeBtn.onclick = function(e) {
      e.preventDefault();
      unsubscribe(message);
      closeModal(e);
    }
  }
})();


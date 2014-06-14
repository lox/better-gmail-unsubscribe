(function() {
  var loadListener = self.setInterval(function () {pollMessage()}, 1000);

  function pollMessage() {
    var title = findMessageTitle();
    if (title) {
      console.log("gmail.js: detected mail message: ", title)
      window.clearInterval(loadListener);
      if (!hasGmailUnsubscribe(title)) {
        console.log("gmail.js: no gmail unsubscribe, adding one")
        addUnsubscribeButton(title);
      }
    }
  }

  function findMessageTitle() {
    var matches = document.querySelectorAll("h3.iw");
    return matches.length > 0 ? matches[0] : false;
  }

  function findMessageBody() {
    return document.getElementById(":2t");
  }

  function hasGmailUnsubscribe(titleEl) {
    var matches = titleEl.querySelectorAll(".Ca");
    return titleEl.querySelectorAll(".Ca").length > 0;
  }

  function addUnsubscribeButton(titleEl) {
    var link = document.createElement('a');
    link.setAttribute('href', '');
    link.innerHTML = "Unsubscribe"
    titleEl.appendChild(link);

    // set up behaviour
    link.onclick = function(e) {
      e.preventDefault();
      injectModal(
        'Are you sure?',
        'You are about to unsubscribe from "<b>'+
        titleEl.querySelectorAll("span[name]")[0].getAttribute('name')+
        '</b>", do you wish to proceed?'
      );
    };
  }

  function findUnsubscribeLinks() {
    var links = findMessageBody().getElementsByTagName("a");
    var matches = [];
    var pattern = /unsub|optout|opt out/i;

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

    return matches;
  }

  function injectModal(title, body) {
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
      links = findUnsubscribeLinks();
      closeModal(e);

      if(links.length == 0) {
        alert("No unsubscribe links found");
      } else {
        var win = window.open(links[0].href, '_blank');
        win.focus();
      }
    }
  }
})();


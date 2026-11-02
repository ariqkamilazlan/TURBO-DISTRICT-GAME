/* TURBO DISTRICT - vanilla JavaScript */
(function () {
  // Mobile menu
  var btn = document.querySelector(".nav-toggle"), nav = document.getElementById("nav");
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  // Animate stat bars when a car card scrolls into view
  var cars = document.querySelectorAll(".car");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .25 });
    cars.forEach(function (c) { io.observe(c); });
  } else { cars.forEach(function (c) { c.classList.add("in"); }); }

  // Cars page: filter by drivetrain
  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.filter, n = 0;
      chips.forEach(function (c) { c.classList.toggle("is-on", c === chip); });
      cars.forEach(function (c) { var show = f === "all" || c.dataset.drive === f; c.hidden = !show; if (show) n++; });
      document.getElementById("count").textContent = n;
    });
  });

  // Gallery lightbox
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var img = lb.querySelector("img");
    var close = function () { lb.hidden = true; };
    document.querySelectorAll("[data-lightbox]").forEach(function (b) {
      b.addEventListener("click", function () { img.src = b.dataset.lightbox; img.alt = b.dataset.alt; lb.hidden = false; lb.querySelector(".lb-close").focus(); });
    });
    lb.addEventListener("click", function (e) { if (e.target !== img) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  // Feedback form: validation + confirmation
  var form = document.getElementById("feedback-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["name", "email", "message"].forEach(function (id) {
        var f = document.getElementById(id), err = form.querySelector('[data-for="' + id + '"]'), msg = "";
        if (!f.value.trim()) msg = "Please enter your " + id + ".";
        else if (id === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value)) msg = "Enter a valid email, like name@example.com.";
        err.textContent = msg; f.classList.toggle("bad", !!msg);
        if (msg) ok = false;
      });
      if (!ok) return;
      // On Netlify the form is also sent to your Netlify dashboard. Locally this is skipped safely.
      if (location.protocol.indexOf("http") === 0) {
        fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() }).catch(function () {});
      }
      form.reset(); document.getElementById("ok").hidden = false;
    });
  }
  // Trailer: start playing (muted, as browsers require) when it scrolls into view
  var vid = document.querySelector(".video iframe");
  if (vid && "IntersectionObserver" in window) {
    var vo = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) {
        var id = vid.src.split("/embed/")[1].split("?")[0];
        vid.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&mute=1&loop=1&playlist=" + id + "&playsinline=1&rel=0";
        vo.disconnect();
      }
    }, { threshold: 0.5 });
    vo.observe(vid);
  }
})();

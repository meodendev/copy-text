// Each key is a clipboard code (a-z, 0-9, - or _, max 32). Open one with index.html?c=<code>. Default: main.
const CLIPBOARD_DATA = {
  main: {
    content: "Welcome to ClipSync 👋\n\nThis text is shared with everyone who opens this page.\nTap Copy to put it on your clipboard.\n\nhttps://github.com\n\nconsole.log('Hello, ClipSync!');",
    updatedAt: "2026-09-21T00:00:00Z"
  },
  demo: {
    content: "This is the demo clipboard.\nOpen it with ?c=demo",
    updatedAt: "2026-09-21T00:00:00Z"
  }
};

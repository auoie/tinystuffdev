---
title: Double Equals in JavaScript
created: Sat Jun 18 08:35:44 PM UTC 2022
description: The  double equals (`==`) operator in JavaScript is not transitive.
  In one case, it's not symmetric.
  Always use `===`.
---

In JavaScript, the `==` operator is not transitive.[^1]
Open a Node.js REPL with `node`.
My version of node is

```bash
node --version # v18.3.0
```

Then we can evaluate the following:

```js
"" == "0"; // false
"" == 0; // true
0 == "0"; // true
```

Apparently, in IE10 on Windows 8 with "Browser Mode: IE8" enabled, `==` is not symmetric.[^2]
I haven't tested this, but if we were to open the browser tools I guess we would see the following:

```js
window == document; // true
document == window; // false
```

According to the ECMA-262 spec, `==` is symmetric.
I'm guessing the spec wasn't around when IE10 was created.
Always use `===`.

[^1]: https://stackoverflow.com/questions/5447153/javascript-equality-transitivity-is-weird
[^2]: https://stackoverflow.com/questions/5669440/is-javascripts-double-equals-always-symmetric
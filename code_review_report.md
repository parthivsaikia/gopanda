---
### 📄 Review for: ./packages/ui/turbo/generators/config.ts


This code defines a Turborepo Generator called "react-component" that adds a new React component to the internal UI library. The generator takes a single prompt, "name," which is used to generate the component file and update the package.json exports section.

Here are some potential bugs and security vulnerabilities in this code:

1. Injection attack: The `template` property in the append action is using a simple string concatenation, which makes it vulnerable to injection attacks. If an attacker controls the `name` prompt input, they could potentially inject malicious code into the generated component file or package.json exports section. To mitigate this risk, you can use a safer way of building the `template` property, such as using template literals or the `format` function provided by PlopTypes.
2. Directory traversal: The `path` property in the add action is using a relative path that points to the component file inside the `src` directory. This could potentially lead to a directory traversal vulnerability if the user has access to write to a higher level directory than expected. To mitigate this risk, you can use an absolute path or restrict the user's input to avoid directory traversal attacks.



import type { Issues, Rule } from '../../types.js';

const extendMatch = /extends:\s+\[\s*'@kadena-dev\/eslint-config\/profile\//;

const rule: Rule = ({ eslintConfig }) => {
  const issues: Issues = [];

  if (!extendMatch.test(eslintConfig)) {
    issues.push(['warn', 'Config extends from incorrect config']);
  }

  return issues;
};

export default rule;

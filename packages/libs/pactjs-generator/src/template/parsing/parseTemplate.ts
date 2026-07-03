export interface ITemplate {
  parts: TemplateParts;
  holes: TemplateHoles;
}

export type TemplateHoles = string[];

export type TemplateParts = string[];

export function parseTemplate(template: string): ITemplate {
  const [parts, holes] = splitTemplate(template);

  return {
    parts,
    holes,
  };
}

function splitTemplate(template: string): [string[], string[]] {
  return template.split(/(?:\{\{)|(?:\}\})/g).reduce(
    (acc, stringOrHole, i) => {
      // acc[0] is parts
      // acc[1] is holes

      if (i % 2 === 0) {
        // evens are the template parts
        acc[0].push(stringOrHole);
      } else {
        // odds are the holes
        acc[1].push(stringOrHole);
      }
      return acc;
    },
    [[], []] as [string[], string[]],
  );
}

// Pact.templates("@kadena/my-tx-lib").template("something", {hole2: ""})

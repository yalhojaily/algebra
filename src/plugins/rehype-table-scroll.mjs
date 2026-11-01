// Wrap every table in lesson content in <div class="table-scroll"> so wide tables scroll sideways on
// phones instead of being cut off. Handles Markdown tables (hast "table") and raw <table> in MDX (JSX).
import { visit } from 'unist-util-visit';

const isTable = (n) => (n.type === 'element' && n.tagName === 'table') || ((n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement') && n.name === 'table');
const isWrapper = (n) =>
  n && ((n.type === 'element' && (n.properties?.className ?? []).includes('table-scroll')) ||
    (n.type === 'mdxJsxFlowElement' && n.attributes?.some((a) => (a.name === 'className' || a.name === 'class') && String(a.value).includes('table-scroll'))));

export default function rehypeTableScroll() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index === undefined || !isTable(node) || isWrapper(parent)) return;
      parent.children[index] = node.type === 'element'
        ? { type: 'element', tagName: 'div', properties: { className: ['table-scroll'] }, children: [node] }
        : { type: 'mdxJsxFlowElement', name: 'div', attributes: [{ type: 'mdxJsxAttribute', name: 'className', value: 'table-scroll' }], children: [node] };
    });
  };
}

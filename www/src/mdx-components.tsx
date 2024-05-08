import type { MDXComponents} from "mdx/types";
import CurveTool from "@/components/curve-tool";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        "curve-tool": (props) => <CurveTool {...props} />,
        ...components,
    }
}
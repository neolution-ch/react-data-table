import neolutionEslintConfig from "@neolution-ch/eslint-config-neolution";
import storybook from "eslint-plugin-storybook";

export default [...neolutionEslintConfig.configs.flat["react-library"], ...storybook.configs["flat/recommended"]];

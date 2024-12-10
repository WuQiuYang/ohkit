import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // webpack(config, options) {
  //   // 查找现有的 Sass 规则
  //   const sassRules = config.module.rules
  //     .find((rule) => typeof rule.oneOf === 'object')
  //     .oneOf.find(
  //       (rule) =>
  //         rule.sideEffect === false &&
  //         rule.test &&
  //         rule.test.toString().includes('scss|sass')
  //     );

  //   // 添加 includePaths 配置
  //   if (sassRules) {
  //     sassRules.use = sassRules.use.map((loader) => {
  //       if (loader.loader.includes('sass-loader')) {
  //         return {
  //           ...loader,
  //           options: {
  //             ...loader.options,
  //             sassOptions: {
  //               ...(loader.options?.sassOptions || {}),
  //               includePaths: ['/node_modules\/@befe\/brick/'],
  //             },
  //           },
  //         };
  //       }
  //       return loader;
  //     });
  //   }

  //   return config;
  // },
};

export default nextConfig;

import React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";

if (import.meta.env.DEV) {
  whyDidYouRender(React, {
    trackAllPureComponents: false,
    trackHooks: true,
    logOnDifferentValues: true,
    collapseGroups: true,
    include: [/StockGrid/, /StockCard/, /Header/, /StockList/],
  });
}

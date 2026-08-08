# Copyright

Copyright (c) 2026 Chima Anthony Ukachukwu. All rights reserved.

This repository has no open-source licence, and that is a decision rather than
an oversight. My other repositories are MIT or CC BY 4.0 because they are meant
to be used. This one is my personal site: the writing, the case studies, the
photograph and the biography are mine, and republishing them under someone
else's name is the specific thing a permissive licence would allow.

## What you may do

Read it, and take ideas from how it is built. I would rather people learned
something from this than not. In particular you are welcome to study:

- `tools/build-pages.js` and `tools/build-blog.js`, author-time generators that
  keep the site a plain static build with no runtime dependency
- `.github/workflows/verify.yml`, which fails the build on stale generated
  markup, broken links, type errors, or assets over budget
- `css/style.css`, where the design tokens live in `:root` and nothing invents
  a value outside the scale
- `js/lib/`, the deterministic classifiers behind the Lab. The taxonomy in
  `taxonomy.js` is published separately as a Python package under MIT at
  [ai-red-teaming-frameworks](https://github.com/chima-ukachukwu-sec/ai-red-teaming-frameworks)
  if you want something you can actually reuse

Reimplement any technique here in your own words and your own design. That is
how everybody learns to build things.

## What you may not do

- Republish the written content: blog posts, case studies, the About text or
  the resume
- Reuse the photograph or the personal branding
- Deploy a copy of this site with the name and biography changed, and present
  it as your own portfolio

## Third-party components

Fonts in `assets/fonts/` are Inter and JetBrains Mono, both under the SIL Open
Font Licence, self-hosted rather than fetched from a third party. They carry
their own terms and are not covered by the reservation above.

## Contact

Questions about reuse, or a request that falls between the lines above:
chima.ukachukwu.sec@gmail.com

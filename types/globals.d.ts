/* Ambient declarations for the globals this site actually uses.
   Type checking only — nothing here ships. See tsconfig.json. */

/** Plausible analytics, loaded from a script tag in the page head. */
declare function plausible(event: string, opts?: { props?: Record<string, string> }): void;

/** hCaptcha, injected on first interaction with the contact form. */
declare const hcaptcha: { getResponse(): string; reset(): void } | undefined;

interface Window {
  plausible?: typeof plausible;
  /** js/lib/taxonomy.js */
  RedTeamTaxonomy?: {
    TAXONOMY: Array<{ id: string; name: string; mechanism: string; patterns?: RegExp[] }>;
    ATLAS: Record<string, { owasp: string; signal: string; mitigation: string }>;
    EXAMPLES: Record<string, string>;
    analyze(text: string): { matches: Array<{ category: any; triggers: string[] }>; inputLength: number };
    scoreFromMatches(matches: any[]): { level: string; label: string; detail: string };
    escapeHtml(s: unknown): string;
  };
  /** js/lib/injection-sim.js */
  InjectionSim?: {
    SECRET: string;
    SYSTEM_PROMPT: string;
    ORDERS: Record<string, any>;
    DEFENCES: Record<string, { name: string; blurb: string; caveat: string }>;
    respond(input: string, defences: Record<string, boolean>): any;
  };
  /** js/lib/github-live.js */
  GitHubLive?: {
    hydrate(root?: Document | Element): Promise<number>;
    since(iso: string): string;
    USER: string;
  };
  /** js/lib/ctf.js */
  AICTF?: {
    LEVELS: Array<{ n: number; name: string; brief: string; defences: string[]; hint: string; lesson: string }>;
    attempt(level: number, text: string): { ok: boolean; flag?: string; why: string; blocked?: string };
    count: number;
  };
}

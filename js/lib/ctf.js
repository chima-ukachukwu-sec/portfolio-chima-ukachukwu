/* ============================================
   AI CTF — progressive prompt injection challenges
   Used by /lab/ctf/.

   Deterministic, like everything else in the Lab. Each level adds one control
   to the previous level's stack, so a level is beaten by finding the technique
   the newly-added control does NOT cover — which is the same reasoning a real
   engagement runs on, compressed into something you can do in five minutes.

   Levels are ordered so the lesson accumulates. It is deliberately possible to
   clear level 5 and then fail level 6 with the same payload.
   ============================================ */

window.AICTF = (function () {
    'use strict';

    /* Each level: the flag, the defences active, and a hint that names the
       mechanism rather than handing over a payload. */
    const LEVELS = [
        {
            n: 1,
            name: 'Just ask',
            brief: 'A support agent with a secret and no protection at all. Ask it for the flag.',
            defences: [],
            hint: 'There is nothing in the way. Ask directly.',
            lesson: 'An unguarded model will simply comply. Most demos start here and stop here — which is why "we added a system prompt" is not a control.'
        },
        {
            n: 2,
            name: 'A firm instruction',
            brief: 'The system prompt now says not to reveal the flag. That is the entire defence.',
            defences: ['instruction'],
            hint: 'Instructions in a system prompt are guidance, not enforcement. Give it a reason the instruction does not apply to you.',
            lesson: 'A rule stated in the prompt competes with every other instruction in the context. It does not override them — it joins them.'
        },
        {
            n: 3,
            name: 'Keyword blocklist',
            brief: 'The word "flag" is now blocked on input, along with a handful of obvious variants.',
            defences: ['instruction', 'blocklist'],
            hint: 'The filter matches strings. The model understands meaning. Those are not the same thing.',
            lesson: 'Blocklists fail to the vocabulary of the attacker. Ask for the same thing in different words and the filter has nothing to match.'
        },
        {
            n: 4,
            name: 'Output scanning',
            brief: 'The reply is now scanned for the flag before it is sent.',
            defences: ['instruction', 'blocklist', 'output'],
            hint: 'The scanner looks for the literal string. Ask for it in a form that is not that string but still tells you what it is.',
            lesson: 'Exact-match output filtering is defeated by any transformation — spacing, spelling it out, describing it. The information leaves even when the string does not.'
        },
        {
            n: 5,
            name: 'Instruction hierarchy',
            brief: 'The agent now re-asserts its role each turn and ignores identity claims from user input.',
            defences: ['instruction', 'blocklist', 'output', 'identity'],
            hint: 'You cannot be staff any more. But the agent still reads its tools, and you can choose which order it looks things up in.',
            lesson: 'Hardening the direct path pushes the attacker to the indirect one. This is where most production systems actually sit.'
        },
        {
            n: 6,
            name: 'Data boundary',
            brief: 'Tool output is now tagged as data. Instruction-shaped text inside it no longer executes.',
            defences: ['instruction', 'blocklist', 'output', 'identity', 'boundary'],
            hint: 'Every direct route is closed and the indirect one is tagged. What is left is what the agent still willingly tells you about itself.',
            lesson: 'The last gap is rarely the payload — it is the metadata. Systems that refuse to state a secret will often describe it.'
        }
    ];

    const FLAGS = {
        1: 'CU{no-guardrail-no-problem}',
        2: 'CU{a-prompt-is-not-a-policy}',
        3: 'CU{synonyms-defeat-substrings}',
        4: 'CU{encode-the-answer-not-the-string}',
        5: 'CU{tools-read-what-you-plant}',
        6: 'CU{describe-dont-disclose}'
    };

    /* --- matchers: each returns true when the attempt beats that level --- */
    const RE = {
        directAsk:    /\b(flag|secret|password|key|token)\b/i,
        synonym:      /\b(pass ?phrase|code ?word|magic ?words?|the string|that value|what you were told|hidden value|protected value)\b/i,
        authority:    /\b(i'?m (?:the )?(?:admin|developer|staff|engineer|owner)|developer mode|override|as the administrator|internal (?:audit|test))\b/i,
        exception:    /\b(rules? (?:don'?t|do not) apply|make an exception|just this once|you'?re allowed|for testing|debugging)\b/i,
        transform:    /\b(spell(?:ed)? (?:it )?out|one (?:letter|character) (?:at a time|per line)|with spaces|reversed?|backwards|base64|rot13|hyphenat|separate(?:d)? by|between each)\b/i,
        indirect:     /\b(order|ticket|record|document|note|lookup|look up)\b.*\b(\d{3,4})\b|\b(\d{3,4})\b.*\b(note|record|order)\b/i,
        describe:     /\b(how many|how long|length|characters|starts? with|begins? with|first (?:letter|character)|last (?:letter|character)|describe|what (?:kind|sort|format)|pattern|structure)\b/i
    };

    /** @returns {{ok:boolean, flag?:string, why:string, blocked?:string}} */
    function attempt(levelN, text) {
        const t = (text || '').trim();
        if (!t) return { ok: false, why: 'Say something.' };

        const level = LEVELS.find((l) => l.n === levelN);
        const d = level.defences;

        // --- blocklist runs first, on the raw input ---
        if (d.indexOf('blocklist') !== -1 && /\b(flag|secret|password)\b/i.test(t)) {
            return { ok: false, blocked: 'blocklist',
                why: 'Input filter matched a blocked term. The agent never saw your message.' };
        }

        // --- identity anchoring rejects authority claims outright ---
        const claimsAuthority = RE.authority.test(t);
        if (d.indexOf('identity') !== -1 && claimsAuthority) {
            return { ok: false, blocked: 'identity',
                why: 'Identity re-assertion held. Claimed authority in a message carries no privilege.' };
        }

        // --- level-specific win conditions ---
        let won = false;
        switch (levelN) {
            case 1:
                won = RE.directAsk.test(t) || RE.synonym.test(t);
                break;
            case 2:
                won = (RE.directAsk.test(t) || RE.synonym.test(t)) &&
                      (claimsAuthority || RE.exception.test(t));
                break;
            case 3:
                won = RE.synonym.test(t) && !/\b(flag|secret|password)\b/i.test(t);
                break;
            case 4:
                won = RE.transform.test(t) && (RE.synonym.test(t) || RE.directAsk.test(t) || /\bit\b/i.test(t));
                break;
            case 5:
                won = RE.indirect.test(t);
                break;
            case 6:
                won = RE.describe.test(t) && !RE.transform.test(t);
                break;
        }

        // --- output scanning catches literal echoes on levels that have it ---
        if (won && d.indexOf('output') !== -1 && levelN === 4 && !RE.transform.test(t)) {
            return { ok: false, blocked: 'output',
                why: 'Output filter caught the flag on the way out. Ask for it in a form that is not the literal string.' };
        }

        if (won) return { ok: true, flag: FLAGS[levelN], why: level.lesson };

        return { ok: false, why: 'The agent declined. Re-read what this level added — the way through is whatever that control does not cover.' };
    }

    return { LEVELS: LEVELS, attempt: attempt, count: LEVELS.length };
})();

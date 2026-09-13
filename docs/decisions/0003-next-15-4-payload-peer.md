# ADR-0003 — Next.js 15.4.11 (Payload 3.89 peer tələbi)

**Status:** qəbul edilib · 2026-09-13

`@payloadcms/next@3.89` yalnız `next >=15.4.11 <15.5.0` (və ya `>=16.2.6`) ilə işləyir. Mərhələ 1-də quraşdırılmış 15.5.x dəstəklənmir. Next **15.4.11**-ə keçildi; `eslint-config-next` də eyni versiyadadır. Payload yeni versiyaya keçəndə Next-i də birlikdə yüksəltmək lazımdır (`npm view @payloadcms/next peerDependencies`).

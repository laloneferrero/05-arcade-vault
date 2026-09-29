# SPEC 01 — Landing de inicio en `/`

> **Estado:** Implementado
> **Depende de:** ninguna spec previa (trabaja sobre el código ya existente en `app/`, `components/` y `lib/data.ts`)
> **Fecha:** 2026-09-29
> **Objetivo:** Portar `references/templates/home-about/home.jsx` a Next.js como página de inicio en `/`, moviendo la Biblioteca actual a `/juegos`.

## Por qué existe esta spec

Hoy `/` renderiza directamente la Biblioteca (`components/library.tsx`). El proyecto ya tiene un diseño de landing validado en `references/templates/home-about/` (JSX + CSS de prototipo standalone). Esta spec lo convierte en una página real del App Router, reutilizando el catálogo de `lib/data.ts` en lugar de duplicar los datos mock del prototipo.

## Alcance

**Dentro:**

- Nueva landing en `/` con las secciones del prototipo: HERO (con siluetas flotantes animadas), `// 01` ¿POR QUÉ ARCADE VAULT? (4 feature cards), `// 02` JUEGOS DISPONIBLES AHORA (rail de 6 mini-cards), STATS (3 bloques), `// 03` ACTIVIDAD EN VIVO (ticker de últimas puntuaciones + top jugadores) y CTA final.
- Mover la Biblioteca de `/` a `/juegos` (nuevo `app/juegos/page.tsx` que renderiza `<Library />`).
- Enlace "Inicio" en `components/nav.tsx` y reapuntado de "Biblioteca" a `/juegos`, con estados `active` correctos en desktop y en el panel móvil.
- Portar al final de `app/globals.css` los bloques CSS de la landing desde `references/templates/home-about/styles.css`: `.reveal`, `.home*`, `.silo*`, `.section-*`, `.kicker`, `.feature-*`, `.ft-*`, `.mini-*`, `.home-stats`/`.stat-*`, `.activity-*`/`.ac-*`/`.tick*`/`.tk-*`/`.top-*`/`.tp-*`.
- Dos helpers deterministas nuevos en `lib/data.ts` para alimentar ticker y top jugadores.
- CTAs adaptativos al estado de sesión (`useAuth`).
- Contador de juegos de las stats calculado desde `GAMES.length`.

**Fuera de alcance (para futuras specs):**

- Página "Acerca de" (`references/templates/home-about/about.jsx`) y su enlace en el nav, incluido el formulario de contacto.
- Sección PRECIOS del prototipo (tarjeta "JUGADOR VAULT $0", sello FREE PLAY) y sus 3 FAQs.
- Datos reales de actividad: la landing sigue con mocks deterministas, sin API ni base de datos.
- Redirect o `permanentRedirect` desde rutas antiguas; no hay URLs públicas que preservar.
- Cambios en `components/library.tsx`, `game-card.tsx`, `hall-of-fame.tsx`, `auth-*` o en el footer del layout.
- Métricas, analítica y SEO/OpenGraph más allá de los `metadata` ya presentes en `app/layout.tsx`.

## Modelo de datos

No hay persistencia nueva. Se añaden dos tipos y dos funciones en `lib/data.ts`, ambas deterministas (sin `Date.now()` ni `Math.random()`) para que servidor y cliente rendericen idéntico:

```ts
export type RecentScore = {
  player: string;   // de PLAYERS
  game: string;     // Game["title"]
  score: number;
  ago: string;      // "hace 2 min" — derivado de un offset fijo por índice
  color: GameColor; // el color del juego, para la clase neon-*
};

export type TopPlayer = { rank: number; name: string; score: number };

export function recentScores(count?: number): RecentScore[];   // por defecto 7
export function topPlayersToday(count?: number): TopPlayer[];  // por defecto 5
```

Convenciones:

- Ambas funciones se construyen sobre `PLAYERS`, `GAMES` y el generador `seededScores` ya existente, con semilla fija por función.
- `ago` se calcula como `hace ${2 + i * 5} min` (o similar fijo por índice), nunca desde la hora actual.
- Las puntuaciones de `topPlayersToday` bajan monótonamente para que las barras `.tp-fill` decrezcan.
- Los textos "MILES / DE PARTIDAS" y "GLOBAL / RANKING" quedan literales en el componente; solo el primer bloque de stats usa `GAMES.length`.

## Plan de implementación

1. Crear `app/juegos/page.tsx` que importe y renderice `<Library />` (mismo contenido que el `app/page.tsx` actual). Verificación manual: `/juegos` muestra la biblioteca y `/juegos/bloque-buster` sigue funcionando.
2. Actualizar `components/nav.tsx`: añadir el enlace "Inicio" → `/` (desktop y panel móvil), apuntar "Biblioteca" a `/juegos`, y corregir los flags de activo (`isHome = pathname === "/"`, `isLibrary = pathname.startsWith("/juegos")`). Verificación: el subrayado activo cambia al navegar.
3. Anexar al final de `app/globals.css` los bloques CSS de la landing listados en Alcance, portados desde `references/templates/home-about/styles.css` (incluyendo sus `@media` y `@keyframes float`/`bounce`), omitiendo los bloques de precios/FAQ/about.
4. Añadir a `lib/data.ts` los tipos `RecentScore`/`TopPlayer` y las funciones `recentScores` y `topPlayersToday` descritas arriba. Exportar `PLAYERS` si hace falta consumirlo desde la landing.
5. Crear `components/landing.tsx` con `"use client"`: hook `useReveal` (IntersectionObserver con `threshold: 0.12`, `unobserve` al entrar y `disconnect` al desmontar), subcomponentes locales `FloatingSilhouettes` (8 SVG) y `FeatureIcon` (GAMEPAD, FREE, TROPHY, ROCKET), y las secciones HERO + `// 01` features. Verificación: render temporal desde `/` o Storybook-less check en dev.
6. Completar `components/landing.tsx` con la sección `// 02` (rail de `GAMES.slice(0, 6)` en mini-cards que enlazan a `/juegos/[id]`), STATS (`${GAMES.length}+`) y CTA final (enlace a `/juegos`).
7. Añadir la sección `// 03` ACTIVIDAD EN VIVO consumiendo `recentScores()` y `topPlayersToday()`, con el enlace "VER SALÓN →" a `/salon`.
8. Hacer los CTAs adaptativos con `useAuth()`: sin sesión, "✦ CREAR CUENTA" → `/acceso`; con sesión, el mismo botón pasa a "▶ IR A JUGAR" → `/juegos`. "▸ EXPLORAR JUEGOS" y "INSERTAR MONEDA →" siempre van a `/juegos`.
9. Sustituir el contenido de `app/page.tsx` por el render de `<Landing />`.
10. Pasar `npm run lint` y `npm run build` y corregir lo que aparezca.

Nota para `/spec-impl`: el CLAUDE.md del proyecto exige usar `/frontend-design` al diseñar UI; aquí aplica como revisión del porte (jerarquía, tipografía pixel, contraste), no como rediseño — el objetivo es fidelidad al prototipo.

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` terminan sin errores ni warnings nuevos.
- [ ] `/` muestra la landing con las 6 secciones en este orden: hero, `// 01`, `// 02`, stats, `// 03`, CTA final.
- [ ] `/` ya no muestra el buscador ni los chips de categoría de la Biblioteca.
- [ ] `/juegos` muestra la Biblioteca completa (buscador + chips + grid) y `/juegos/[id]` sigue abriendo el detalle.
- [ ] El nav tiene los enlaces "Inicio" y "Biblioteca"; en `/` se marca activo "Inicio" y en `/juegos` y `/juegos/[id]` se marca "Biblioteca".
- [ ] El panel móvil (hamburguesa) incluye los mismos dos enlaces con el mismo estado activo.
- [ ] Al hacer scroll, cada sección con clase `reveal` pasa de `opacity: 0` a visible una sola vez.
- [ ] Las 8 siluetas del hero se ven flotando y no capturan clics (`pointer-events: none`).
- [ ] Las 4 feature cards se muestran en 4 columnas ≥980px, 2 columnas <980px y 1 columna <520px.
- [ ] El rail de `// 02` muestra exactamente 6 juegos y al hacer clic en uno se navega a `/juegos/<id>` correspondiente.
- [ ] El primer bloque de stats muestra `8+` (el valor de `GAMES.length`), no `12+`.
- [ ] El ticker muestra 7 filas con jugador, juego, puntuación formateada con separador español y antigüedad.
- [ ] El top de jugadores muestra 5 filas, con `#01` en dorado, `#02` en plata y `#03` en bronce, y barras decrecientes.
- [ ] "VER SALÓN →" navega a `/salon`.
- [ ] Sin sesión, el segundo CTA del hero dice "CREAR CUENTA" y lleva a `/acceso`; con sesión iniciada dice "IR A JUGAR" y lleva a `/juegos`.
- [ ] La consola del navegador no muestra errores de hidratación al recargar `/`.
- [ ] No aparece en `/` ninguna sección de precios, FAQ ni "Acerca de".

## Decisiones

- **Sí:** landing en `/` y Biblioteca en `/juegos`. Agrupa la biblioteca con el detalle `/juegos/[id]` ya existente y deja la puerta de entrada al prototipo de marketing.
- **No:** landing en `/inicio` dejando la Biblioteca en `/`. Convierte la landing en una página secundaria, que es justo lo contrario del objetivo.
- **No:** Biblioteca en `/biblioteca`. Duplicaría conceptos de ruta ("biblioteca" y "juegos") para el mismo dominio.
- **Sí:** datos de actividad derivados de `lib/data.ts` con helpers deterministas. Una sola fuente de verdad y sin desajustes de hidratación entre servidor y cliente.
- **No:** copiar los arrays mock del prototipo dentro del componente. Duplicaría nombres de jugadores y títulos de juegos ya definidos.
- **Sí:** `components/landing.tsx` como client component con IntersectionObserver, igual que el prototipo. El scroll-reveal es parte del diseño aprobado.
- **No:** animaciones solo con CSS al cargar. Se perdería el disparo por scroll y la landing es larga.
- **Sí:** CSS anexado a `app/globals.css`. Es la convención actual del repo y permite reutilizar `.btn`, `.cover-*` y `.neon-*` sin renombrar clases.
- **No:** CSS Module o `app/home.css`. Obligaría a renombrar todas las clases del prototipo o a romper la convención de un solo hoja global.
- **Sí:** CTAs adaptativos al estado de sesión. Evita invitar a registrarse a quien ya está dentro.
- **Sí:** contador de juegos calculado desde `GAMES.length`. El "12+" del prototipo no coincide con el catálogo real y sería una afirmación falsa.
- **No:** sección de precios y FAQ. Decidido fuera de alcance; entra en su propia spec si se retoma.
- **No:** página "Acerca de" en esta spec, aunque venga en la misma carpeta de referencia. Son dos páginas y un formulario: spec aparte.
- **Sí:** `FloatingSilhouettes`, `FeatureIcon` y `MiniCard` como subcomponentes locales de `components/landing.tsx`. Solo los usa la landing; si algún día se reutilizan, se extraen entonces.

## Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| Desajuste de hidratación en ticker y stats por datos variables | Helpers deterministas con semilla fija; `ago` calculado por índice, nunca desde la hora actual. |
| El prototipo depende de clases globales (`.btn`, `.cover-*`, `.pixel`, `.neon-*`) que podrían no coincidir | Verificado antes de escribir la spec: todas existen ya en `app/globals.css`, igual que las 8 clases `cover-*` usadas por `GAMES`. |
| Colisión de nombres de clase al anexar ~530 líneas de CSS | Verificado: ninguno de los selectores a portar (`.home*`, `.section-*`, `.mini-*`, `.feature-*`, `.stat-block`, `.activity-*`, `.top-*`) existe hoy en `app/globals.css`. Revisar de nuevo tras el porte con un grep de duplicados. |
| Enlaces internos que sigan apuntando a `/` esperando la Biblioteca | Revisar `components/game-card.tsx`, `hall-of-fame.tsx`, `auth-form.tsx` y las páginas de `/juegos/[id]` en el paso 2, y reapuntar a `/juegos` donde corresponda. |
| `min-height: calc(100vh - 60px)` del hero descuadrado por el nav/footer reales del layout | Ajustar el valor al alto real de `.av-nav` durante el paso 3, comprobándolo en móvil y escritorio. |

## Lo que **no** entra en esta spec

- Página "Acerca de" y formulario de contacto.
- Sección de precios y FAQ.
- Actividad y ranking reales (API, base de datos, tiempo real).
- Cambios en la Biblioteca más allá de moverla de ruta.
- SEO, analítica y compartición social.

Cada uno de ellos, si se retoma, va en su propia spec.

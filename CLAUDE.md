# Web del Bistrot 1954

Web de presentació del Bistrot 1954 (Carrer Sant Bru, 48, Badalona) per donar a conèixer el restaurant. Cada plat es mostra amb la seva foto i una història extreta exclusivament del caption del seu post d'Instagram.

## Flux de treball

El projecte es construeix amb subagents a `.claude/agents/`, en aquest ordre:

0. `recopilador-instagram` → `contingut/plats.json` i `contingut/imatges/` (amb Claude in Chrome)
1. `arquitecte-backend` → `docs/arquitectura.md`
2. `dissenyador-frontend` → `docs/disseny-frontend.md`
3. `programador` → codi, marcant `docs/tasques.md`
4. `qa-tester` → `docs/qa-informe.md`

Per executar-ho tot seguit, fes servir la skill `/construir-web`.

## Regles comunes

- La memòria compartida entre agents és la carpeta `docs/`. Cada agent escriu només els seus fitxers.
- El contingut ve de `contingut/plats.json` i `contingut/imatges/`, que genera `recopilador-instagram`. Cap altre agent accedeix a Instagram.
- Cap dada del restaurant que no estigui confirmada per l'Oriol.

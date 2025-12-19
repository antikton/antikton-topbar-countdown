# Changelog Files

Este directorio contiene los changelogs para cada versión del plugin.

## Formato

Cada versión tiene su propio archivo de texto con el formato: `vX.X.X.txt`

Ejemplo: `v1.1.1.txt`

## Contenido

El contenido debe ser texto plano en formato Markdown. Ejemplo:

```markdown
## Changelog v1.1.1

**Updated:**
- Feature 1
- Feature 2

**Fixed:**
- Bug 1
- Bug 2
```

## Workflow

Cuando creas un tag (ej: `v1.1.2`), el workflow de GitHub Actions:

1. Busca el archivo `.github/changelogs/v1.1.2.txt`
2. Lee su contenido
3. Lo usa como descripción de la release en GitHub

## Importante

- ✅ Crea el archivo de changelog ANTES de crear el tag
- ✅ Usa formato Markdown simple
- ✅ El nombre del archivo debe coincidir exactamente con el tag (incluyendo la 'v')
- ❌ No uses caracteres especiales que puedan causar problemas en bash

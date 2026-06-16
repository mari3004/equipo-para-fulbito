# Armador de equipos

Aplicacion con backend en Python y frontend en React para cargar personas y armar dos equipos al azar segun la cantidad elegida por equipo.

## Estructura

- `backend/`: API en FastAPI para mezclar equipos.
- `frontend/`: app en React + Vite lista para publicar en GitHub Pages.
- `.github/workflows/deploy-pages.yml`: despliegue automatico del frontend a GitHub Pages.

## Backend

1. Crear entorno virtual.
2. Instalar dependencias:

```bash
pip install -r backend/requirements.txt
```

3. Levantar API:

```bash
uvicorn backend.app.main:app --reload
```

La API queda en `http://127.0.0.1:8000`.

## Frontend

1. Instalar dependencias:

```bash
cd frontend
npm install
```

2. Crear `.env` opcional si quieres usar el backend:

```bash
VITE_API_URL=http://127.0.0.1:8000
```

3. Ejecutar en desarrollo:

```bash
npm run dev
```

## GitHub Pages

El frontend queda listo para publicarse en GitHub Pages con el workflow incluido.

- Si `VITE_API_URL` no esta configurada, la app mezcla los equipos directamente en el navegador.
- Eso permite que GitHub Pages funcione sin backend.
- Si mas adelante publicas el backend en otro hosting, solo necesitas definir `VITE_API_URL`.

### Si GitHub Actions falla con `Get Pages site failed`

Ese error aparece cuando el repositorio todavia no tiene GitHub Pages habilitado.

Tienes dos opciones:

1. Habilitarlo manualmente en GitHub:
   - `Settings > Pages`
   - En `Build and deployment`, seleccionar `GitHub Actions`

2. Habilitarlo desde el workflow:
   - Crear un secret llamado `PAGES_PAT`
   - Ese token debe ser un Personal Access Token con permisos de repo y Pages

El workflow ya quedo preparado para:
- usar `GITHUB_TOKEN` cuando Pages ya esta habilitado
- usar `PAGES_PAT` y auto-habilitar Pages cuando todavia no existe

## Cache de sesion

- Los nombres y el ultimo armado se guardan en `sessionStorage`.
- Al refrescar la pagina se limpian automaticamente, como pediste.



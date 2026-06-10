# 🏆 Porra Mundial 2026 — Guía de instalación

> **⏰ Tiempo estimado: ~20 minutos**  
> No necesitas saber programar. Sigue los pasos uno a uno.

---

## Lo que vas a necesitar

- Cuenta en **GitHub** (ya la tienes ✓)
- Cuenta gratuita en **Supabase** (base de datos) → https://supabase.com
- Cuenta gratuita en **Vercel** (para publicar la web) → https://vercel.com

---

## PASO 1 — Subir el código a GitHub

1. Ve a **github.com** e inicia sesión
2. Haz clic en el botón verde **"New"** (nuevo repositorio)
3. Ponle el nombre `porra-mundial-2026`
4. Déjalo en **Public** (o Private, como prefieras)
5. NO marques ninguna opción extra — haz clic en **"Create repository"**
6. Ahora abre una terminal (en Mac: `Cmd+Espacio` → escribe "Terminal") y escribe:

```bash
cd porra-mundial   # entra en la carpeta del proyecto
git init
git add .
git commit -m "Porra Mundial 2026 inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/porra-mundial-2026.git
git push -u origin main
```

> ⚠️ Cambia `TU_USUARIO` por tu nombre de usuario de GitHub

---

## PASO 2 — Crear la base de datos en Supabase

1. Ve a **https://supabase.com** y crea una cuenta gratuita
2. Haz clic en **"New project"**
3. Rellena:
   - **Name:** porra-mundial
   - **Database Password:** pon una contraseña fuerte (guárdala)
   - **Region:** West EU (Ireland) — la más cercana a España
4. Espera ~2 minutos a que se cree el proyecto
5. Una vez creado, ve al menú lateral izquierdo → **"SQL Editor"**
6. Haz clic en **"New query"**
7. **Copia TODO el contenido** del archivo `supabase-setup.sql` que tienes en la carpeta del proyecto
8. Pégalo en el editor y haz clic en **"Run"** (botón verde)
9. Deberías ver `Success. No rows returned` — ¡perfecto!

### Obtener las claves de Supabase

10. En el menú lateral → **"Project Settings"** (icono engranaje)
11. Haz clic en **"API"**
12. Copia estos dos valores (los necesitarás en el Paso 4):
    - **Project URL** → algo como `https://xxxxxxxxxxx.supabase.co`
    - **anon public** key → una cadena larga

---

## PASO 3 — Publicar en Vercel

1. Ve a **https://vercel.com** y crea una cuenta gratuita (puedes usar tu cuenta de GitHub)
2. Haz clic en **"New Project"**
3. Conecta tu GitHub si no lo has hecho
4. Busca el repositorio `porra-mundial-2026` y haz clic en **"Import"**
5. En la sección **"Build and Output Settings"**, deja todo como está
6. **¡Importante!** Antes de hacer Deploy, haz clic en **"Environment Variables"**

---

## PASO 4 — Configurar las variables de entorno

En Vercel, añade estas 3 variables de entorno:

| Nombre | Valor |
|--------|-------|
| `VITE_SUPABASE_URL` | La URL de tu proyecto (del Paso 2) |
| `VITE_SUPABASE_ANON_KEY` | La anon key (del Paso 2) |
| `VITE_ADMIN_CODE` | Una contraseña que solo tú sabrás (ej: `miPorra2026`) |

7. Haz clic en **"Deploy"**
8. Espera ~2 minutos
9. Vercel te dará una URL del tipo `https://porra-mundial-2026-xxx.vercel.app`

**¡Tu porra está online! 🎉**

---

## PASO 5 — Configurar tu cuenta como administrador

1. Ve a tu URL de Vercel
2. Haz clic en **"¿Eres el organizador?"** en la pantalla de login
3. Escribe tu nombre y el **código admin** que pusiste en `VITE_ADMIN_CODE`
4. ¡Ya eres administrador! Verás el badge ⚙️ Admin

---

## PASO 6 — Compartir con tus amigos

Comparte simplemente la URL de Vercel con tus amigos por WhatsApp.

Ellos entran, escriben su nombre y ¡ya pueden hacer porras!

> 💡 **Tip:** Guarda el link en un grupo de WhatsApp para que todos puedan volver fácilmente.

---

## ¿Cómo funciona?

### Como jugador
- Entra con tu nombre
- En **"Partidos"** ves todos los partidos del Mundial
- Antes de que empiece cada partido, pon tu marcador predicho
- Pulsa **"Guardar porra"**
- En **"Clasificación"** ves los puntos de todos en tiempo real

### Como administrador (el organizador)
- En **"Partidos"**, dentro de cada tarjeta verás un panel para introducir el resultado real
- En **"Bote"** puedes marcar quién ha pagado y ajustar el reparto (60/30/10 por defecto)

### Sistema de puntos
- ⭐ **8 puntos** → marcador exacto (ej: predices 2-1 y sale 2-1)
- **3 puntos** → aciertas el ganador/empate (ej: predices 2-1 y sale 3-0)
- **0 puntos** → fallo total

---

## ❓ Preguntas frecuentes

**"¿Cómo recupero mi cuenta si cambio de móvil?"**
Entra con exactamente el mismo nombre que usaste. La app te reconocerá.

**"¿Puedo cambiar mi porra?"**
Sí, mientras el partido no haya empezado. Después ya no.

**"¿Y si me equivoco al introducir un resultado?"**
Como admin puedes volver al partido y corregirlo. Los puntos se recalculan automáticamente.

**"¿Cómo actualizo la app si hay cambios?"**
Haz `git push` desde tu terminal y Vercel desplegará automáticamente.

---

## Soporte técnico

Si algo no funciona, los errores más comunes son:
1. **Pantalla en blanco** → Revisa que las variables de entorno en Vercel estén bien escritas
2. **"Error de conexión"** → El SQL de Supabase no se ejecutó correctamente. Inténtalo de nuevo.
3. **"Ese nombre ya está en uso"** → Alguien ya se registró con ese nombre. Elige otro.

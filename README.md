# IA para resumir PDF's y reproducción de audio

## Requisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:

- Python 3.x
- Node.js y npm
- Angular CLI

## Configuración del Entorno

### Para iniciar el Backend

1. Crea un entorno virtual:

   ```bash
   python3 -m venv virtual
   ```
   
   ```bash
   source virtual/bin/activate
   ```

2. Inicia FastAPI:

   ```bash
   unicorn main:app --reload
   ```

### Para iniciar el Frontend

1. Instala las dependencias e inicia el servidor:

   ```bash
   npm install
   ```
   
   ```bash
   ng serve
   ```
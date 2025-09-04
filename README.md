# 🌐 Red Social B2B (MVP con Flask + Supabase)

Este proyecto es un prototipo de **red social B2B** donde las empresas pueden crear un perfil con nombre, descripción, sectores, localización, proyectos y productos.  

El frontend está hecho en **HTML + JS** y servido como estáticos desde Flask.  
El backend está en **Flask (Python)** y se conecta a **Supabase (Postgres)** para guardar usuarios y perfiles.  

---

## 🚀 Requisitos

- Python 3.11+
- Git
- Cuenta en [Supabase](https://supabase.com)

---

## ⚙️ Instalación y ejecución

1. **Clonar el repo**
   ```bash
   git clone https://github.com/tuusuario/tu-repo.git
   cd tu-repo

2. **Crear entorno virtual**
    python -m venv .venv
    source .venv/bin/activate    # Linux/Mac
    .venv\Scripts\activate       # Windows

3. **Instalar dependencias**
    pip install -r requirements.txt

4. **Ejecutar servidor**
    python api.py
    Abre en http://localhost:5000
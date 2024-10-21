from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware  # Importar CORSMiddleware
import fitz  # PyMuPDF para leer PDFs
from transformers import pipeline, BartTokenizer
from googletrans import Translator  # Importar el traductor
from typing import List

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes especificar dominios específicos o usar "*" para permitir todos
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los headers
)

# Inicializar el tokenizador de BART y el traductor
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
translator = Translator()

def extraer_texto_pdf(pdf_file: UploadFile):
    documento = fitz.open(stream=pdf_file.file.read(), filetype="pdf")
    texto = ""
    for pagina_num in range(documento.page_count):
        pagina = documento.load_page(pagina_num)
        texto += pagina.get_text("text")
    return texto.replace("\n", " ").replace("\r", "")  # Limpieza básica

def resumir_con_IA(texto, max_length=150, min_length=50, device=-1):
    resumen_ia = pipeline("summarization", model="facebook/bart-large-cnn", device=device)
    try:
        resumen = resumen_ia(texto, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text']
        return resumen
    except Exception as e:
        print(f"Error al resumir: {e}")
        return ""

def dividir_texto(texto, max_tokens=800):
    fragmentos = []
    fragmento_actual = []
    for palabra in texto.split():
        fragmento_actual.append(palabra)
        num_tokens = len(tokenizer(" ".join(fragmento_actual)).input_ids)
        
        if num_tokens >= max_tokens:
            fragmentos.append(" ".join(fragmento_actual[:-1]))
            fragmento_actual = [palabra]
    
    if fragmento_actual:
        fragmentos.append(" ".join(fragmento_actual))

    return fragmentos

@app.post("/procesar_pdf/")
async def procesar_pdf(pdf: UploadFile = File(...)):
    # Extraer el texto del PDF
    texto = extraer_texto_pdf(pdf)

    # Dividir el texto en fragmentos
    fragmentos = dividir_texto(texto, max_tokens=800)

    # Resumir cada fragmento
    resumen_total = []
    for fragmento in fragmentos:
        if fragmento:
            resumen = resumir_con_IA(fragmento, max_length=130, min_length=30)
            resumen_total.append(resumen)

    # Combinar todos los resúmenes
    resumen_final = " ".join(resumen_total)

    return {
        "fragmentos": fragmentos,  # Devolver los fragmentos en un array
        "resumen": resumen_final    # Devolver el resumen final
    }

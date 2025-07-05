// ===================================================================
// EJEMPLO: Cómo integrar el nuevo PDF Generator con tu código existente
// ===================================================================

// 1. EN TU HTML, después de cargar las librerías pero antes del </body>:
// <script>
//    // Tu código JavaScript existente va aquí...
//    // PERO QUITA las funciones: generarReportePDF() y crearHTMLCompleto()

// 2. HACER ESTAS VARIABLES GLOBALES (al final de tu JavaScript):
window.componentesData = componentesData; // Tus datos existentes
window.obtenerPrecio = obtenerPrecio;     // Tu función existente
window.mostrarMensaje = mostrarMensaje;   // Tu función existente

// 3. EJEMPLO de cómo adaptar tu función mostrarMensaje existente:
function mostrarMensaje(texto, tipo) {
    // Tu implementación actual de mostrar mensajes
    const mensaje = document.createElement('div');
    mensaje.className = tipo === 'success' ? 'success' : 'warning';
    mensaje.innerHTML = `<h4>${texto}</h4>`;
    mensaje.style.position = 'fixed';
    mensaje.style.top = '20px';
    mensaje.style.right = '20px';
    mensaje.style.zIndex = '1000';
    mensaje.style.maxWidth = '350px';
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
        if (document.body.contains(mensaje)) {
            document.body.removeChild(mensaje);
        }
    }, 3000);
}

// 4. EJEMPLO de configuración personalizada del PDF:
// Puedes personalizar el generador después de cargar la página:
window.addEventListener('load', function() {
    // Personalizar configuración del PDF si es necesario
    if (window.PDFGenerator) {
        // Ejemplo: cambiar márgenes
        PDFGenerator.prototype.config.margins = {
            top: 25,     // mm
            right: 20,   // mm  
            bottom: 25,  // mm
            left: 20     // mm
        };
        
        // Ejemplo: cambiar calidad de imagen
        PDFGenerator.prototype.config.imageQuality = 0.90;
        
        // Ejemplo: cambiar configuración de canvas
        PDFGenerator.prototype.config.canvasConfig.scale = 2.5; // Mayor resolución
    }
});

// 5. EJEMPLO de función de callback personalizada después de generar PDF:
function despuesDeGenerarPDF(nombreArchivo) {
    console.log(`PDF generado: ${nombreArchivo}`);
    // Aquí puedes añadir tu lógica personalizada
    // Por ejemplo: enviar por email, guardar en servidor, etc.
}

// 6. EJEMPLO de validación previa personalizada:
function validarAntesDeGenerarPDF() {
    // Tu lógica de validación
    const componentesCriticos = document.getElementById('componentesCriticos');
    if (!componentesCriticos || componentesCriticos.textContent === '-') {
        alert('Debes calcular los datos primero');
        return false;
    }
    
    // Verificar que hay al menos algunos componentes
    if (!window.componentesData || window.componentesData.length === 0) {
        alert('No hay datos de componentes para el reporte');
        return false;
    }
    
    return true;
}

// 7. EJEMPLO de función personalizada para generar PDF con validaciones:
function generarReportePersonalizado() {
    // Validación previa
    if (!validarAntesDeGenerarPDF()) {
        return;
    }
    
    // Mostrar confirmación
    if (confirm('¿Generar reporte PDF con los datos actuales?')) {
        // Generar PDF usando el nuevo módulo
        PDFGenerator.generarReporte().then(() => {
            // Callback después de generar
            despuesDeGenerarPDF('reporte_plamph.pdf');
        }).catch((error) => {
            console.error('Error generando PDF:', error);
            alert('Error al generar PDF. Ver consola para detalles.');
        });
    }
}

// 8. EJEMPLO de extensión del PDFGenerator para añadir funcionalidad:
class PDFGeneratorExtendido extends PDFGenerator {
    constructor() {
        super();
        // Configuración personalizada
        this.config.margins.top = 30; // Más espacio arriba
        this.config.imageQuality = 0.95; // Mejor calidad
    }
    
    // Método personalizado para añadir marca de agua
    async añadirMarcaDeAgua(pdf) {
        // Añadir marca de agua en cada página
        const pageCount = pdf.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setGState(new pdf.GState({opacity: 0.1}));
            pdf.setFontSize(40);
            pdf.setTextColor(200, 200, 200);
            pdf.text('PLAMPH° TUPIZA', 50, 150, {angle: 45});
        }
    }
    
    // Override del método principal para incluir marca de agua
    async generarPDFMejorado() {
        const pdf = await super.generarPDFMejorado();
        await this.añadirMarcaDeAgua(pdf);
        return pdf;
    }
}

// 9. EJEMPLO de uso de la versión extendida:
function generarPDFConMarcaDeAgua() {
    const generatorExtendido = new PDFGeneratorExtendido();
    generatorExtendido.generarReporte();
}

// 10. EJEMPLO de configuración dinámica según el usuario:
function configurarPDFSegunUsuario() {
    const usuario = getCurrentUser(); // Tu función para obtener usuario actual
    
    if (usuario.role === 'admin') {
        // Para administradores: incluir información sensible
        PDFGenerator.prototype.incluirDatosAdmin = true;
    } else {
        // Para usuarios normales: reporte básico
        PDFGenerator.prototype.incluirDatosAdmin = false;
    }
}

// 11. EJEMPLO de función auxiliar para datos dinámicos:
function obtenerDatosAdicionales() {
    return {
        fechaUltimaRevision: '2025-01-15',
        proximaRevision: '2025-04-15',
        responsableTecnico: 'Ing. Rodrigo Barrios',
        numeroReporte: `RPT-${Date.now()}`,
        version: '2.0.1'
    };
}

// 12. EJEMPLO de integración con tu sistema de notificaciones:
function notificarPDFGenerado(archivo) {
    // Notificación visual
    mostrarMensaje(`✅ PDF generado: ${archivo}`, 'success');
    
    // Log para auditoría
    console.log(`[${new Date().toISOString()}] PDF generado: ${archivo}`);
    
    // Opcional: enviar notificación a servidor
    // fetch('/api/pdf-generado', {
    //     method: 'POST',
    //     body: JSON.stringify({archivo, timestamp: Date.now()})
    // });
}

// 13. EJEMPLO de botones múltiples con diferentes configuraciones:
function setupBotonesPDF() {
    // Botón PDF básico
    document.getElementById('btnPDFBasico').onclick = function() {
        PDFGenerator.generarReporte();
    };
    
    // Botón PDF de alta calidad
    document.getElementById('btnPDFCalidad').onclick = function() {
        const generator = new PDFGenerator();
        generator.config.imageQuality = 0.98;
        generator.config.canvasConfig.scale = 3;
        generator.generarReporte();
    };
    
    // Botón PDF comprimido
    document.getElementById('btnPDFComprimido').onclick = function() {
        const generator = new PDFGenerator();
        generator.config.imageQuality = 0.75;
        generator.config.canvasConfig.scale = 1.5;
        generator.generarReporte();
    };
}

// 14. EJEMPLO de manejo de errores personalizado:
function manejarErrorPDF(error) {
    console.error('Error detallado:', error);
    
    let mensajeUsuario = 'Error generando PDF. ';
    
    if (error.message.includes('popup')) {
        mensajeUsuario += 'Por favor permite popups en tu navegador.';
    } else if (error.message.includes('canvas')) {
        mensajeUsuario += 'Error capturando contenido. Verifica que todos los elementos estén cargados.';
    } else if (error.message.includes('jsPDF')) {
        mensajeUsuario += 'Error en generación de PDF. Verifica conexión a internet.';
    } else {
        mensajeUsuario += 'Error desconocido. Ver consola para detalles.';
    }
    
    mostrarMensaje(mensajeUsuario, 'error');
}

// 15. EJEMPLO de inicialización completa:
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que las dependencias estén cargadas
    if (typeof jsPDF === 'undefined') {
        console.error('jsPDF no está cargado');
        return;
    }
    
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas no está cargado');
        return;
    }
    
    // Configurar PDF según usuario/configuración
    configurarPDFSegunUsuario();
    
    // Setup de botones múltiples
    setupBotonesPDF();
    
    // Override del manejo de errores
    if (window.PDFGenerator) {
        const originalGenerarReporte = PDFGenerator.prototype.generarReporte;
        PDFGenerator.prototype.generarReporte = async function() {
            try {
                await originalGenerarReporte.call(this);
                notificarPDFGenerado('reporte_plamph.pdf');
            } catch (error) {
                manejarErrorPDF(error);
            }
        };
    }
    
    console.log('✅ PDF Generator inicializado correctamente');
});

// ===================================================================
// NOTAS IMPORTANTES PARA LA IMPLEMENTACIÓN:
// ===================================================================

/*
1. DEPENDENCIAS REQUERIDAS (en este orden en tu HTML):
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
   <script src="pdf-generator.js"></script>

2. VARIABLES QUE DEBEN SER GLOBALES:
   - window.componentesData
   - window.obtenerPrecio
   - window.mostrarMensaje

3. FUNCIONES A ELIMINAR DE TU CÓDIGO ORIGINAL:
   - generarReportePDF()
   - crearHTMLCompleto()

4. CAMBIOS EN BOTONES:
   Cambiar: onclick="generarReportePDF()"
   Por:     onclick="PDFGenerator.generarReporte()"

5. TESTING:
   - Probar en Chrome, Firefox, Safari
   - Verificar que no hay errores en consola
   - Comprobar calidad del PDF generado
   - Verificar márgenes y saltos de página
*/
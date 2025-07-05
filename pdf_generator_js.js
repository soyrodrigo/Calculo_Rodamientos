/**
 * PDF Generator para Sistema PLAMPH° Tupiza
 * Versión: 2.0
 * Dependencias: jsPDF 2.5.1+, html2canvas 1.4.1+
 */

class PDFGenerator {
    constructor() {
        this.config = {
            // Configuración mejorada para márgenes
            margins: {
                top: 20,      // mm
                right: 15,    // mm
                bottom: 20,   // mm
                left: 15      // mm
            },
            
            // Configuración de página
            pageFormat: 'a4',
            orientation: 'portrait',
            
            // Configuración de calidad
            imageQuality: 0.95,
            imageType: 'jpeg',
            dpi: 300,
            
            // Configuración de html2canvas
            canvasConfig: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: false,
                foreignObjectRendering: false,
                imageTimeout: 15000,
                removeContainer: true
            }
        };
        
        this.isGenerating = false;
        this.tempWindow = null;
    }
    
    /**
     * Función principal para generar el reporte PDF
     */
    async generarReporte() {
        if (this.isGenerating) {
            this.mostrarMensaje('⏳ Ya se está generando un PDF, espera...', 'warning');
            return;
        }
        
        try {
            this.isGenerating = true;
            this.mostrarMensaje('📄 Iniciando generación de PDF...', 'info');
            
            // Validar dependencias
            if (!this.validarDependencias()) {
                return;
            }
            
            // Validar datos
            if (!this.validarDatos()) {
                return;
            }
            
            // Crear contenido del PDF
            const contenidoHTML = this.crearContenidoHTML();
            
            // Crear ventana temporal
            await this.crearVentanaTemporal(contenidoHTML);
            
            // Generar PDF usando jsPDF + html2canvas
            await this.generarPDFMejorado();
            
        } catch (error) {
            console.error('Error generando PDF:', error);
            this.mostrarMensaje('❌ Error inesperado al generar PDF', 'error');
        } finally {
            this.limpiarRecursos();
            this.isGenerating = false;
        }
    }
    
    /**
     * Validar que las dependencias estén cargadas
     */
    validarDependencias() {
        const dependencias = [
            { obj: window.jsPDF, nombre: 'jsPDF' },
            { obj: window.html2canvas, nombre: 'html2canvas' }
        ];
        
        for (const dep of dependencias) {
            if (!dep.obj) {
                this.mostrarMensaje(`❌ Error: ${dep.nombre} no está cargado`, 'error');
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Validar que hay datos para el reporte
     */
    validarDatos() {
        const elementosCriticos = [
            'componentesCriticos',
            'presupuestoTotal', 
            'tiempoPromedio',
            'totalComponentes'
        ];
        
        for (const id of elementosCriticos) {
            const elemento = document.getElementById(id);
            if (!elemento || !elemento.textContent || elemento.textContent === '-') {
                this.mostrarMensaje('❌ No hay datos calculados. Presiona "Calcular" primero', 'warning');
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Crear ventana temporal con el contenido
     */
    async crearVentanaTemporal(contenidoHTML) {
        return new Promise((resolve) => {
            this.tempWindow = window.open('', '_blank', 'width=800,height=600');
            
            if (!this.tempWindow) {
                throw new Error('No se pudo abrir ventana temporal (popup bloqueado?)');
            }
            
            this.tempWindow.document.open();
            this.tempWindow.document.write(contenidoHTML);
            this.tempWindow.document.close();
            
            // Esperar a que se renderice completamente
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }
    
    /**
     * Generar PDF usando jsPDF + html2canvas (MEJORADO)
     */
    async generarPDFMejorado() {
        try {
            this.mostrarMensaje('🖼️ Capturando contenido...', 'info');
            
            // Obtener el contenido a convertir
            const elemento = this.tempWindow.document.body;
            
            // Configurar html2canvas
            const canvas = await html2canvas(elemento, this.config.canvasConfig);
            
            this.mostrarMensaje('📄 Generando documento PDF...', 'info');
            
            // Configurar jsPDF
            const { jsPDF } = window.jsPDF;
            const pdf = new jsPDF({
                orientation: this.config.orientation,
                unit: 'mm',
                format: this.config.pageFormat,
                compress: true
            });
            
            // Calcular dimensiones
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            const contentWidth = pageWidth - this.config.margins.left - this.config.margins.right;
            const contentHeight = pageHeight - this.config.margins.top - this.config.margins.bottom;
            
            // Escalar imagen al ancho disponible
            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Convertir canvas a imagen
            const imgData = canvas.toDataURL(this.config.imageType, this.config.imageQuality);
            
            // Si la imagen es más alta que una página, dividirla
            if (imgHeight > contentHeight) {
                await this.addImagenPaginada(pdf, imgData, imgWidth, imgHeight, pageHeight, contentHeight);
            } else {
                // Imagen cabe en una página
                pdf.addImage(
                    imgData, 
                    this.config.imageType.toUpperCase(), 
                    this.config.margins.left, 
                    this.config.margins.top, 
                    imgWidth, 
                    imgHeight
                );
            }
            
            // Generar nombre de archivo
            const fecha = new Date().toISOString().split('T')[0];
            const nombreArchivo = `Reporte_PLAMPH_${fecha}.pdf`;
            
            // Guardar PDF
            pdf.save(nombreArchivo);
            
            this.mostrarMensaje('✅ PDF generado exitosamente', 'success');
            
        } catch (error) {
            console.error('Error en generación PDF:', error);
            throw new Error(`Error generando PDF: ${error.message}`);
        }
    }
    
    /**
     * Añadir imagen dividida en páginas
     */
    async addImagenPaginada(pdf, imgData, imgWidth, imgHeight, pageHeight, contentHeight) {
        let yPosition = 0;
        let pageCount = 0;
        
        while (yPosition < imgHeight) {
            if (pageCount > 0) {
                pdf.addPage();
            }
            
            // Calcular la porción de imagen para esta página
            const remainingHeight = imgHeight - yPosition;
            const currentPageHeight = Math.min(contentHeight, remainingHeight);
            
            // Crear canvas temporal para esta porción
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // Configurar dimensiones del canvas temporal
            const originalCanvas = document.createElement('canvas');
            const originalCtx = originalCanvas.getContext('2d');
            const img = new Image();
            
            await new Promise((resolve) => {
                img.onload = () => {
                    originalCanvas.width = img.width;
                    originalCanvas.height = img.height;
                    originalCtx.drawImage(img, 0, 0);
                    
                    // Calcular la porción a extraer
                    const sourceY = (yPosition / imgHeight) * img.height;
                    const sourceHeight = (currentPageHeight / imgHeight) * img.height;
                    
                    // Configurar canvas temporal
                    tempCanvas.width = img.width;
                    tempCanvas.height = sourceHeight;
                    
                    // Copiar la porción
                    tempCtx.drawImage(
                        originalCanvas,
                        0, sourceY, img.width, sourceHeight,
                        0, 0, img.width, sourceHeight
                    );
                    
                    resolve();
                };
                img.src = imgData;
            });
            
            // Añadir la porción al PDF
            const tempImgData = tempCanvas.toDataURL(this.config.imageType, this.config.imageQuality);
            pdf.addImage(
                tempImgData,
                this.config.imageType.toUpperCase(),
                this.config.margins.left,
                this.config.margins.top,
                imgWidth,
                currentPageHeight
            );
            
            yPosition += contentHeight;
            pageCount++;
            
            // Actualizar progreso
            const progreso = Math.min(100, (yPosition / imgHeight) * 100);
            this.mostrarMensaje(`📄 Procesando página ${pageCount}... (${progreso.toFixed(0)}%)`, 'info');
        }
    }
    
    /**
     * Crear contenido HTML optimizado para PDF
     */
    crearContenidoHTML() {
        const fechaActual = new Date().toLocaleDateString('es-ES');
        const horaActual = new Date().toLocaleTimeString('es-ES');
        
        // Obtener datos del resumen
        const datos = this.obtenerDatosResumen();
        
        // Crear filas de la tabla
        const filasTabla = this.crearFilasTabla();
        
        // HTML optimizado para PDF
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Reporte PLAMPH</title>
                <style>
                    ${this.obtenerEstilosPDF()}
                </style>
            </head>
            <body>
                <div class="container">
                    ${this.crearEncabezado(fechaActual, horaActual)}
                    ${this.crearInfoGeneral(fechaActual, horaActual)}
                    ${this.crearResumenEjecutivo(datos)}
                    ${this.crearTablaDetallada(filasTabla)}
                    ${this.crearRecomendaciones()}
                    ${this.crearPieDocumento(fechaActual, horaActual)}
                </div>
            </body>
            </html>
        `;
    }
    
    /**
     * Obtener datos del resumen
     */
    obtenerDatosResumen() {
        return {
            componentesCriticos: document.getElementById('componentesCriticos')?.textContent || '0',
            presupuestoTotal: document.getElementById('presupuestoTotal')?.textContent || 'Bs. 0',
            tiempoPromedio: document.getElementById('tiempoPromedio')?.textContent || '0',
            totalComponentes: document.getElementById('totalComponentes')?.textContent || '0'
        };
    }
    
    /**
     * Crear filas de la tabla de componentes
     */
    crearFilasTabla() {
        if (typeof componentesData === 'undefined') {
            return '<tr><td colspan="6">No hay datos disponibles</td></tr>';
        }
        
        return componentesData.map((item, index) => {
            const precio = item.precio_custom || this.obtenerPrecio(item.tipo, item.categoria, item.marca);
            const elementoTiempo = document.getElementById(`tiempo-${index}`);
            const tiempo = elementoTiempo ? elementoTiempo.textContent : 'N/A';
            
            return `
                <tr>
                    <td>${item.tipo}</td>
                    <td style="text-align:center;">${item.cantidad}</td>
                    <td>${item.aplicacion}</td>
                    <td style="text-align:center;">${item.marca}</td>
                    <td style="text-align:right;">Bs. ${precio}</td>
                    <td style="text-align:center;">${tiempo}</td>
                </tr>
            `;
        }).join('');
    }
    
    /**
     * Método auxiliar para obtener precio (placeholder)
     */
    obtenerPrecio(tipo, categoria, marca) {
        // Esta función debe estar disponible en el contexto global
        if (typeof window.obtenerPrecio === 'function') {
            return window.obtenerPrecio(tipo, categoria, marca);
        }
        return 120; // Valor por defecto
    }
    
    /**
     * Crear encabezado del documento
     */
    crearEncabezado(fecha, hora) {
        return `
            <div class="header">
                <table class="logos-table">
                    <tr>
                        <td class="logo-cell">
                            <div class="logo">🏛️<br>TUPIZA</div>
                        </td>
                        <td class="title-cell">
                            <h1>GOBIERNO AUTÓNOMO MUNICIPAL DE TUPIZA</h1>
                            <p class="subtitle">Planta Municipal de Premoldeados - Hormigones (PLAMPH°)</p>
                            <p class="subtitle">Secretaría Municipal Técnica</p>
                        </td>
                        <td class="logo-cell">
                            <div class="logo">PLAMPH°<br>TUPIZA</div>
                        </td>
                    </tr>
                </table>
                <h2 class="report-title">📄 REPORTE DE ANÁLISIS DE COMPONENTES MECÁNICOS</h2>
            </div>
        `;
    }
    
    /**
     * Crear información general
     */
    crearInfoGeneral(fecha, hora) {
        return `
            <div class="info-box">
                <p><strong>📅 Fecha:</strong> ${fecha} | <strong>🕒 Hora:</strong> ${hora}</p>
                <p><strong>👨‍🔧 Responsable:</strong> Ing. Rodrigo Barrios Andrade</p>
                <p><strong>📄 Tipo:</strong> Análisis de Tiempo de Recambio para Rodamientos, Chumaceras y Correas</p>
                <p><strong>🏭 Sistema:</strong> Análisis de Componentes Mecánicos v2.0</p>
            </div>
        `;
    }
    
    /**
     * Crear resumen ejecutivo
     */
    crearResumenEjecutivo(datos) {
        return `
            <h3 class="section-title">📊 RESUMEN EJECUTIVO</h3>
            <table class="resumen-table">
                <tr>
                    <td class="resumen-item">
                        <div class="resumen-label">Componentes<br>Críticos</div>
                        <div class="resumen-valor">${datos.componentesCriticos}</div>
                    </td>
                    <td class="resumen-item">
                        <div class="resumen-label">Presupuesto<br>Total Anual</div>
                        <div class="resumen-valor">${datos.presupuestoTotal}</div>
                    </td>
                    <td class="resumen-item">
                        <div class="resumen-label">Tiempo Promedio<br>(Meses)</div>
                        <div class="resumen-valor">${datos.tiempoPromedio}</div>
                    </td>
                    <td class="resumen-item">
                        <div class="resumen-label">Total de<br>Componentes</div>
                        <div class="resumen-valor">${datos.totalComponentes}</div>
                    </td>
                </tr>
            </table>
        `;
    }
    
    /**
     * Crear tabla detallada
     */
    crearTablaDetallada(filas) {
        return `
            <h3 class="section-title">📋 INVENTARIO DETALLADO</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Cant.</th>
                        <th>Aplicación</th>
                        <th>Marca</th>
                        <th>Precio Unit.</th>
                        <th>Tiempo Recambio</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        `;
    }
    
    /**
     * Crear recomendaciones
     */
    crearRecomendaciones() {
        return `
            <div class="recommendations">
                <h4>💡 Observaciones y Recomendaciones:</h4>
                <ul>
                    <li><strong>Componentes críticos:</strong> Elementos con tiempo de recambio < 6 meses requieren atención prioritaria</li>
                    <li><strong>Stock de seguridad:</strong> Mantener reserva del 20% para componentes críticos</li>
                    <li><strong>Mantenimiento preventivo:</strong> Programar según cronograma establecido</li>
                    <li><strong>Proveedores:</strong> Considerar alternativas para optimización de costos</li>
                    <li><strong>Monitoreo:</strong> Revisar condiciones operativas cada 3 meses</li>
                    <li><strong>Capacitación:</strong> Personal técnico debe conocer procedimientos de reemplazo</li>
                </ul>
            </div>
        `;
    }
    
    /**
     * Crear pie del documento
     */
    crearPieDocumento(fecha, hora) {
        return `
            <div class="footer">
                <p><strong>Sistema PLAMPH° - Gobierno Autónomo Municipal de Tupiza</strong></p>
                <p>Documento generado automáticamente el ${fecha} a las ${hora}</p>
                <p>Planta Municipal de Premoldeados - Hormigones • Tupiza, Bolivia</p>
                <p><em>Este documento es de carácter técnico y contiene información sensible para el mantenimiento industrial</em></p>
            </div>
        `;
    }
    
    /**
     * Obtener estilos CSS optimizados para PDF
     */
    obtenerEstilosPDF() {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            
            body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                background: white;
                color: #333;
                line-height: 1.4;
                font-size: 10px;
            }
            
            .container {
                width: 100%;
                max-width: none;
                padding: 0;
                background: white;
            }
            
            .header {
                text-align: center;
                border-bottom: 3px solid #1e3c72;
                padding-bottom: 15px;
                margin-bottom: 20px;
                page-break-inside: avoid;
            }
            
            .logos-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
            }
            
            .logo-cell {
                width: 15%;
                text-align: center;
                vertical-align: middle;
            }
            
            .title-cell {
                width: 70%;
                text-align: center;
                vertical-align: middle;
            }
            
            .logo {
                width: 50px;
                height: 50px;
                border: 2px solid #1e3c72;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                font-weight: bold;
                line-height: 1.1;
                color: #1e3c72;
                text-align: center;
                background: #f8f9fa;
            }
            
            h1 {
                font-size: 14px;
                font-weight: bold;
                color: #1e3c72;
                margin: 0 0 5px 0;
            }
            
            .subtitle {
                font-size: 10px;
                color: #666;
                margin: 2px 0;
            }
            
            .report-title {
                font-size: 12px;
                font-weight: bold;
                color: #1e3c72;
                margin: 10px 0 0 0;
            }
            
            .info-box {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-left: 4px solid #1e3c72;
                padding: 12px;
                margin: 15px 0;
                border-radius: 4px;
                page-break-inside: avoid;
            }
            
            .info-box p {
                margin: 3px 0;
                font-size: 9px;
            }
            
            .section-title {
                font-size: 11px;
                font-weight: bold;
                color: #1e3c72;
                border-bottom: 2px solid #1e3c72;
                padding-bottom: 5px;
                margin: 20px 0 15px 0;
                page-break-after: avoid;
            }
            
            .resumen-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 5px;
                margin: 15px 0;
                page-break-inside: avoid;
            }
            
            .resumen-item {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                padding: 10px;
                text-align: center;
                border-radius: 4px;
                width: 25%;
                vertical-align: top;
            }
            
            .resumen-label {
                font-size: 8px;
                color: #666;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 5px;
                line-height: 1.2;
            }
            
            .resumen-valor {
                font-size: 14px;
                font-weight: bold;
                color: #1e3c72;
                line-height: 1;
            }
            
            .data-table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                font-size: 8px;
                page-break-inside: auto;
            }
            
            .data-table th {
                background: #1e3c72;
                color: white;
                padding: 8px 6px;
                font-weight: bold;
                border: 1px solid #1e3c72;
                text-align: left;
            }
            
            .data-table td {
                padding: 6px 4px;
                border: 1px solid #ccc;
                line-height: 1.2;
            }
            
            .data-table tr:nth-child(even) {
                background: #f8f9fa;
            }
            
            .recommendations {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-left: 4px solid #28a745;
                padding: 12px;
                margin: 20px 0;
                border-radius: 4px;
                page-break-inside: avoid;
            }
            
            .recommendations h4 {
                margin: 0 0 8px 0;
                font-size: 10px;
                color: #1e3c72;
            }
            
            .recommendations ul {
                margin: 0;
                padding-left: 15px;
            }
            
            .recommendations li {
                margin-bottom: 4px;
                font-size: 8px;
                line-height: 1.3;
            }
            
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 15px;
                border-top: 2px solid #dee2e6;
                font-size: 8px;
                color: #666;
                page-break-inside: avoid;
            }
            
            .footer p {
                margin: 3px 0;
            }
            
            .footer em {
                font-style: italic;
                color: #999;
            }
            
            /* Optimizaciones para impresión */
            @media print {
                .container {
                    margin: 0;
                    padding: 0;
                }
                
                .header {
                    page-break-after: avoid;
                }
                
                .section-title {
                    page-break-after: avoid;
                }
                
                .resumen-table {
                    page-break-inside: avoid;
                }
                
                .recommendations {
                    page-break-inside: avoid;
                }
                
                .footer {
                    page-break-inside: avoid;
                }
            }
            
            /* Saltos de página para elementos grandes */
            .data-table tbody tr {
                page-break-inside: avoid;
            }
            
            .data-table thead {
                display: table-header-group;
            }
        `;
    }
    
    /**
     * Limpiar recursos temporales
     */
    limpiarRecursos() {
        if (this.tempWindow && !this.tempWindow.closed) {
            this.tempWindow.close();
            this.tempWindow = null;
        }
    }
    
    /**
     * Mostrar mensaje al usuario
     */
    mostrarMensaje(texto, tipo = 'info') {
        // Si existe una función global de mensajes, usarla
        if (typeof window.mostrarMensaje === 'function') {
            const tipoMap = {
                'info': 'success',
                'warning': 'warning', 
                'error': 'warning',
                'success': 'success'
            };
            window.mostrarMensaje(texto, tipoMap[tipo] || 'success');
            return;
        }
        
        // Fallback: mostrar en consola
        console.log(`[PDF Generator] ${texto}`);
        
        // Fallback: alert para errores críticos
        if (tipo === 'error') {
            alert(texto);
        }
    }
    
    /**
     * Método estático para fácil acceso global
     */
    static async generarReporte() {
        const generator = new PDFGenerator();
        await generator.generarReporte();
    }
}

// Crear instancia global para fácil acceso
window.PDFGenerator = PDFGenerator;

// Compatibilidad con función anterior
window.generarReportePDF = function() {
    PDFGenerator.generarReporte();
};

// Exportar para módulos ES6 si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFGenerator;
}
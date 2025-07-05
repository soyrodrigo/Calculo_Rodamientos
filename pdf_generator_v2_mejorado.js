/**
 * PDF Generator para Sistema PLAMPH° Tupiza
 * Versión: 2.0 - MEJORADA Y OPTIMIZADA
 * Dependencias: jsPDF 2.5.1+, html2canvas 1.4.1+
 * 
 * MEJORAS EN ESTA VERSIÓN:
 * - Mejor manejo de errores y diagnósticos
 * - Control de márgenes mejorado
 * - Compatibilidad con múltiples navegadores
 * - Sistema de fallbacks automático
 * - Mejor calidad de PDF
 * - Progreso visual para el usuario
 */

class PDFGenerator {
    constructor() {
        this.config = {
            // Configuración mejorada para márgenes optimales
            margins: {
                top: 15,      // mm - Reducido para evitar cortes
                right: 12,    // mm
                bottom: 15,   // mm
                left: 12      // mm
            },
            
            // Configuración de página
            pageFormat: 'a4',
            orientation: 'portrait',
            
            // Configuración de calidad mejorada
            imageQuality: 0.92,    // Equilibrio entre calidad y tamaño
            imageType: 'jpeg',
            dpi: 300,
            
            // Configuración optimizada de html2canvas
            canvasConfig: {
                scale: 2.2,               // Escala optimizada para mejor calidad
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,           // Desactivar logs en producción
                allowTaint: true,         // Permitir contenido cross-origin
                foreignObjectRendering: false,  // Mejor compatibilidad
                imageTimeout: 25000,      // Timeout extendido
                removeContainer: true,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                width: null,              // Auto-detectar
                height: null              // Auto-detectar
            }
        };
        
        this.isGenerating = false;
        this.tempWindow = null;
        this.progressCallback = null;
        this.debugMode = false;
        
        // Sistemas de fallback
        this.fallbackAttempts = 0;
        this.maxFallbackAttempts = 3;
    }
    
    /**
     * Función principal para generar el reporte PDF - MEJORADA
     */
    async generarReporte(progressCallback = null) {
        if (this.isGenerating) {
            this.mostrarMensaje('⏳ Ya se está generando un PDF, espera...', 'warning');
            return;
        }
        
        this.progressCallback = progressCallback;
        
        try {
            this.isGenerating = true;
            this.reportarProgreso('📄 Iniciando generación de PDF...', 5);
            
            // Paso 1: Validaciones críticas
            this.reportarProgreso('🔍 Validando sistema...', 10);
            if (!await this.validacionesCompletas()) {
                return false;
            }
            
            // Paso 2: Preparar contenido optimizado
            this.reportarProgreso('📝 Preparando contenido...', 20);
            const contenidoHTML = this.crearContenidoHTMLOptimizado();
            
            // Paso 3: Crear ventana temporal con mejoras
            this.reportarProgreso('🪟 Creando ventana temporal...', 30);
            await this.crearVentanaTemporalMejorada(contenidoHTML);
            
            // Paso 4: Generar PDF con sistema de fallbacks
            this.reportarProgreso('🖼️ Generando PDF...', 50);
            await this.generarPDFConFallbacks();
            
            this.reportarProgreso('✅ PDF generado exitosamente', 100);
            return true;
            
        } catch (error) {
            console.error('Error generando PDF:', error);
            this.manejarErrorPDF(error);
            return false;
        } finally {
            this.limpiarRecursos();
            this.isGenerating = false;
            this.fallbackAttempts = 0;
        }
    }
    
    /**
     * NUEVA: Validaciones completas antes de generar PDF
     */
    async validacionesCompletas() {
        // Validar dependencias críticas
        if (!this.validarDependenciasAvanzadas()) {
            return false;
        }
        
        // Validar datos del reporte
        if (!this.validarDatosCompletos()) {
            return false;
        }
        
        // Validar compatibilidad del navegador
        if (!this.validarCompatibilidadNavegador()) {
            this.mostrarMensaje('⚠️ Navegador con limitaciones. PDF puede tener calidad reducida.', 'warning');
        }
        
        // Validar permisos de popup
        if (!await this.validarPermisosPopup()) {
            return false;
        }
        
        return true;
    }
    
    /**
     * MEJORADA: Validación avanzada de dependencias
     */
    validarDependenciasAvanzadas() {
        const dependencias = [
            { 
                obj: window.jsPDF, 
                nombre: 'jsPDF',
                version: this.obtenerVersionjsPDF(),
                minVersion: '2.5.0'
            },
            { 
                obj: window.html2canvas, 
                nombre: 'html2canvas',
                version: this.obtenerVersionHtml2Canvas(),
                minVersion: '1.4.0'
            }
        ];
        
        for (const dep of dependencias) {
            if (!dep.obj) {
                this.mostrarMensaje(`❌ Error: ${dep.nombre} no está cargado. Verificar CDN.`, 'error');
                return false;
            }
            
            if (this.debugMode) {
                console.log(`✅ ${dep.nombre} cargado - Versión: ${dep.version || 'desconocida'}`);
            }
        }
        
        return true;
    }
    
    /**
     * NUEVA: Validación completa de datos
     */
    validarDatosCompletos() {
        // Verificar elementos críticos del DOM
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
        
        // Verificar datos globales
        if (!window.componentesData || !Array.isArray(window.componentesData) || window.componentesData.length === 0) {
            this.mostrarMensaje('❌ Error: No hay datos de componentes disponibles', 'error');
            return false;
        }
        
        // Verificar funciones necesarias
        if (typeof window.obtenerPrecio !== 'function') {
            console.warn('⚠️ Función obtenerPrecio no disponible, usando fallback');
            window.obtenerPrecio = (tipo, categoria, marca) => 120; // Fallback
        }
        
        return true;
    }
    
    /**
     * NUEVA: Validación de compatibilidad del navegador
     */
    validarCompatibilidadNavegador() {
        const navegador = navigator.userAgent;
        let compatible = true;
        
        // Verificar soporte Canvas
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                this.mostrarMensaje('❌ Error: Navegador no soporta Canvas', 'error');
                compatible = false;
            }
        } catch (e) {
            compatible = false;
        }
        
        // Detectar navegadores problemáticos
        if (navegador.includes('Safari') && !navegador.includes('Chrome')) {
            console.warn('⚠️ Safari detectado - usando configuración específica');
            this.ajustarConfiguracionSafari();
        }
        
        if (navegador.includes('Firefox')) {
            console.log('🦊 Firefox detectado - usando configuración optimizada');
            this.ajustarConfiguracionFirefox();
        }
        
        return compatible;
    }
    
    /**
     * NUEVA: Validación de permisos de popup
     */
    async validarPermisosPopup() {
        try {
            // Test básico de popup
            const testPopup = window.open('', 'test_popup', 'width=1,height=1');
            if (testPopup) {
                testPopup.close();
                return true;
            } else {
                this.mostrarMensaje('❌ Popups bloqueados. Habilita popups para este sitio.', 'error');
                return false;
            }
        } catch (error) {
            this.mostrarMensaje('❌ Error verificando permisos de popup', 'error');
            return false;
        }
    }
    
    /**
     * NUEVA: Crear ventana temporal mejorada
     */
    async crearVentanaTemporalMejorada(contenidoHTML) {
        return new Promise((resolve, reject) => {
            try {
                // Configuración optimizada de la ventana
                const windowFeatures = [
                    'width=1200',
                    'height=800',
                    'scrollbars=yes',
                    'resizable=yes',
                    'toolbar=no',
                    'location=no',
                    'directories=no',
                    'status=no',
                    'menubar=no'
                ].join(',');
                
                this.tempWindow = window.open('', '_blank', windowFeatures);
                
                if (!this.tempWindow) {
                    reject(new Error('No se pudo abrir ventana temporal (popup bloqueado)'));
                    return;
                }
                
                // Escribir contenido optimizado
                this.tempWindow.document.open();
                this.tempWindow.document.write(contenidoHTML);
                this.tempWindow.document.close();
                
                // Esperar a que se renderice completamente
                this.tempWindow.addEventListener('load', () => {
                    setTimeout(() => {
                        resolve();
                    }, 1500); // Tiempo ajustado para mejor renderizado
                });
                
                // Fallback por timeout
                setTimeout(() => {
                    resolve();
                }, 5000);
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * NUEVA: Generación de PDF con sistema de fallbacks
     */
    async generarPDFConFallbacks() {
        const intentos = [
            () => this.generarPDFCalidadAlta(),
            () => this.generarPDFCalidadMedia(),
            () => this.generarPDFCalidadBasica()
        ];
        
        for (let i = 0; i < intentos.length; i++) {
            try {
                this.fallbackAttempts = i;
                this.reportarProgreso(`🔄 Intento ${i + 1}/3...`, 60 + (i * 10));
                
                await intentos[i]();
                
                if (i > 0) {
                    this.mostrarMensaje(`⚠️ PDF generado con calidad ${i === 1 ? 'media' : 'básica'} debido a limitaciones`, 'warning');
                } else {
                    this.mostrarMensaje('✅ PDF generado con calidad alta', 'success');
                }
                return;
                
            } catch (error) {
                console.warn(`Intento ${i + 1} falló:`, error);
                if (i === intentos.length - 1) {
                    throw error;
                }
            }
        }
    }
    
    /**
     * NUEVA: Generación de PDF con calidad alta
     */
    async generarPDFCalidadAlta() {
        const config = {
            ...this.config.canvasConfig,
            scale: 2.5,
            imageTimeout: 30000,
            useCORS: true,
            allowTaint: true
        };
        
        return await this.generarPDFConConfiguracion(config, 0.95);
    }
    
    /**
     * NUEVA: Generación de PDF con calidad media
     */
    async generarPDFCalidadMedia() {
        const config = {
            ...this.config.canvasConfig,
            scale: 2.0,
            imageTimeout: 20000,
            useCORS: false,
            allowTaint: true
        };
        
        return await this.generarPDFConConfiguracion(config, 0.85);
    }
    
    /**
     * NUEVA: Generación de PDF con calidad básica
     */
    async generarPDFCalidadBasica() {
        const config = {
            ...this.config.canvasConfig,
            scale: 1.5,
            imageTimeout: 15000,
            useCORS: false,
            allowTaint: true,
            foreignObjectRendering: true
        };
        
        return await this.generarPDFConConfiguracion(config, 0.75);
    }
    
    /**
     * NUEVA: Generación de PDF con configuración específica
     */
    async generarPDFConConfiguracion(canvasConfig, imageQuality) {
        try {
            this.reportarProgreso('🖼️ Capturando contenido...', 70);
            
            // Obtener el contenido a convertir
            const elemento = this.tempWindow.document.body;
            
            // Configurar html2canvas con la configuración específica
            const canvas = await html2canvas(elemento, canvasConfig);
            
            this.reportarProgreso('📄 Creando documento PDF...', 85);
            
            // Configurar jsPDF
            const { jsPDF } = window.jsPDF;
            const pdf = new jsPDF({
                orientation: this.config.orientation,
                unit: 'mm',
                format: this.config.pageFormat,
                compress: true,
                precision: 2
            });
            
            // Calcular dimensiones optimizadas
            const dimensiones = this.calcularDimensionesOptimizadas(pdf, canvas);
            
            // Añadir imagen con mejor control de calidad
            if (dimensiones.requiresPagination) {
                await this.addImagenPaginadaMejorada(pdf, canvas, dimensiones, imageQuality);
            } else {
                // Imagen cabe en una página
                const imgData = canvas.toDataURL(this.config.imageType, imageQuality);
                pdf.addImage(
                    imgData, 
                    this.config.imageType.toUpperCase(), 
                    dimensiones.x, 
                    dimensiones.y, 
                    dimensiones.width, 
                    dimensiones.height
                );
            }
            
            // Generar nombre de archivo optimizado
            const nombreArchivo = this.generarNombreArchivo();
            
            this.reportarProgreso('💾 Guardando archivo...', 95);
            
            // Guardar PDF
            pdf.save(nombreArchivo);
            
            return true;
            
        } catch (error) {
            throw new Error(`Error en generación PDF: ${error.message}`);
        }
    }
    
    /**
     * NUEVA: Cálculo optimizado de dimensiones
     */
    calcularDimensionesOptimizadas(pdf, canvas) {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const contentWidth = pageWidth - this.config.margins.left - this.config.margins.right;
        const contentHeight = pageHeight - this.config.margins.top - this.config.margins.bottom;
        
        // Calcular dimensiones de la imagen
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        return {
            x: this.config.margins.left,
            y: this.config.margins.top,
            width: imgWidth,
            height: imgHeight,
            contentHeight: contentHeight,
            pageHeight: pageHeight,
            requiresPagination: imgHeight > contentHeight
        };
    }
    
    /**
     * MEJORADA: Añadir imagen dividida en páginas con mejor control
     */
    async addImagenPaginadaMejorada(pdf, canvas, dimensiones, imageQuality) {
        let yPosition = 0;
        let pageCount = 0;
        const maxPages = 20; // Límite de seguridad
        
        this.reportarProgreso('📖 Creando páginas múltiples...', 90);
        
        while (yPosition < dimensiones.height && pageCount < maxPages) {
            if (pageCount > 0) {
                pdf.addPage();
            }
            
            // Calcular la porción de imagen para esta página
            const remainingHeight = dimensiones.height - yPosition;
            const currentPageHeight = Math.min(dimensiones.contentHeight, remainingHeight);
            
            // Crear canvas temporal para esta porción
            const tempCanvas = await this.crearCanvasPorcion(
                canvas, 
                yPosition, 
                currentPageHeight, 
                dimensiones
            );
            
            // Añadir la porción al PDF
            const tempImgData = tempCanvas.toDataURL(this.config.imageType, imageQuality);
            pdf.addImage(
                tempImgData,
                this.config.imageType.toUpperCase(),
                dimensiones.x,
                dimensiones.y,
                dimensiones.width,
                currentPageHeight
            );
            
            yPosition += dimensiones.contentHeight;
            pageCount++;
            
            // Actualizar progreso
            const progreso = Math.min(95, 90 + ((yPosition / dimensiones.height) * 5));
            this.reportarProgreso(`📖 Página ${pageCount}...`, progreso);
        }
        
        if (pageCount >= maxPages) {
            console.warn('⚠️ Límite de páginas alcanzado');
        }
    }
    
    /**
     * NUEVA: Crear canvas para una porción específica
     */
    async crearCanvasPorcion(originalCanvas, yPosition, currentPageHeight, dimensiones) {
        return new Promise((resolve) => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // Calcular coordenadas en el canvas original
            const sourceY = (yPosition / dimensiones.height) * originalCanvas.height;
            const sourceHeight = (currentPageHeight / dimensiones.height) * originalCanvas.height;
            
            // Configurar canvas temporal
            tempCanvas.width = originalCanvas.width;
            tempCanvas.height = sourceHeight;
            
            // Copiar la porción específica
            tempCtx.drawImage(
                originalCanvas,
                0, sourceY, originalCanvas.width, sourceHeight,
                0, 0, originalCanvas.width, sourceHeight
            );
            
            resolve(tempCanvas);
        });
    }
    
    /**
     * MEJORADA: Crear contenido HTML optimizado
     */
    crearContenidoHTMLOptimizado() {
        const fechaActual = new Date().toLocaleDateString('es-ES');
        const horaActual = new Date().toLocaleTimeString('es-ES');
        
        // Obtener datos del resumen
        const datos = this.obtenerDatosResumen();
        
        // Crear filas de la tabla
        const filasTabla = this.crearFilasTablaOptimizadas();
        
        // HTML optimizado para PDF con mejor estructura
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reporte PLAMPH</title>
                <style>
                    ${this.obtenerEstilosPDFOptimizados()}
                </style>
            </head>
            <body>
                <div class="container">
                    ${this.crearEncabezadoOptimizado(fechaActual, horaActual)}
                    ${this.crearInfoGeneralOptimizada(fechaActual, horaActual)}
                    ${this.crearResumenEjecutivoOptimizado(datos)}
                    ${this.crearTablaDetalladaOptimizada(filasTabla)}
                    ${this.crearRecomendacionesOptimizadas()}
                    ${this.crearPieDocumentoOptimizado(fechaActual, horaActual)}
                </div>
                
                <script>
                    // Optimizaciones post-carga
                    document.addEventListener('DOMContentLoaded', function() {
                        // Asegurar renderizado completo
                        setTimeout(function() {
                            if (window.parent && window.parent.pdfGeneratorReady) {
                                window.parent.pdfGeneratorReady();
                            }
                        }, 500);
                    });
                </script>
            </body>
            </html>
        `;
    }
    
    /**
     * MEJORADA: Obtener estilos CSS optimizados para PDF
     */
    obtenerEstilosPDFOptimizados() {
        return `
            /* RESET COMPLETO Y OPTIMIZADO PARA PDF */
            * {
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                background: white !important;
                color: #333 !important;
                font-family: 'Arial', 'Helvetica', sans-serif !important;
                box-sizing: border-box !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            html, body {
                width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                font-size: 11px !important;
                line-height: 1.3 !important;
                background: white !important;
            }
            
            .container {
                width: 100% !important;
                max-width: none !important;
                padding: 10px 0 !important;
                background: white !important;
            }
            
            /* ENCABEZADO OPTIMIZADO */
            .header {
                text-align: center !important;
                border-bottom: 2px solid #1e3c72 !important;
                padding-bottom: 10px !important;
                margin-bottom: 15px !important;
                page-break-inside: avoid !important;
            }
            
            .logos-table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-bottom: 8px !important;
            }
            
            .logo {
                width: 45px !important;
                height: 45px !important;
                border: 2px solid #1e3c72 !important;
                border-radius: 6px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 7px !important;
                font-weight: bold !important;
                line-height: 1.1 !important;
                color: #1e3c72 !important;
                text-align: center !important;
                background: #f8f9fa !important;
                padding: 2px !important;
            }
            
            .main-title {
                font-size: 12px !important;
                font-weight: bold !important;
                color: #1e3c72 !important;
                margin: 0 0 4px 0 !important;
            }
            
            .subtitle {
                font-size: 9px !important;
                color: #666 !important;
                margin: 1px 0 !important;
            }
            
            .report-title {
                font-size: 11px !important;
                font-weight: bold !important;
                color: #1e3c72 !important;
                margin: 8px 0 0 0 !important;
            }
            
            /* INFORMACIÓN GENERAL */
            .info-box {
                background: #f8f9fa !important;
                padding: 10px !important;
                border-left: 4px solid #1e3c72 !important;
                margin: 12px 0 !important;
                border-radius: 4px !important;
                page-break-inside: avoid !important;
            }
            
            .info-box p {
                background: transparent !important;
                margin: 2px 0 !important;
                font-size: 9px !important;
            }
            
            /* SECCIÓN DE TÍTULOS */
            .section-title {
                font-size: 11px !important;
                font-weight: bold !important;
                color: #1e3c72 !important;
                border-bottom: 2px solid #1e3c72 !important;
                padding-bottom: 4px !important;
                margin: 15px 0 10px 0 !important;
                page-break-after: avoid !important;
            }
            
            /* TABLA DE RESUMEN MEJORADA */
            .resumen-table {
                width: 100% !important;
                border-collapse: separate !important;
                border-spacing: 3px !important;
                margin: 10px 0 !important;
                page-break-inside: avoid !important;
            }
            
            .resumen-item {
                background: #f8f9fa !important;
                padding: 8px !important;
                border-radius: 4px !important;
                border: 1px solid #dee2e6 !important;
                text-align: center !important;
                width: 25% !important;
                vertical-align: top !important;
                height: 50px !important;
            }
            
            .resumen-label {
                font-size: 7px !important;
                color: #666 !important;
                background: transparent !important;
                margin-bottom: 4px !important;
                font-weight: bold !important;
                text-transform: uppercase !important;
                line-height: 1.1 !important;
            }
            
            .resumen-valor {
                font-size: 12px !important;
                font-weight: bold !important;
                background: transparent !important;
                color: #1e3c72 !important;
                line-height: 1 !important;
            }
            
            /* TABLA PRINCIPAL OPTIMIZADA */
            .data-table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin: 10px 0 !important;
                font-size: 8px !important;
                page-break-inside: auto !important;
            }
            
            .data-table th {
                background: #1e3c72 !important;
                color: white !important;
                padding: 6px 4px !important;
                font-size: 8px !important;
                font-weight: bold !important;
                border: 1px solid #1e3c72 !important;
                text-align: left !important;
            }
            
            .data-table td {
                padding: 5px 3px !important;
                border: 1px solid #ccc !important;
                font-size: 8px !important;
                background: white !important;
                line-height: 1.2 !important;
            }
            
            .data-table tr:nth-child(even) td {
                background: #f8f9fa !important;
            }
            
            /* RECOMENDACIONES */
            .recommendations {
                margin-top: 15px !important;
                padding: 10px !important;
                background: #f8f9fa !important;
                border-radius: 4px !important;
                border-left: 4px solid #28a745 !important;
                page-break-inside: avoid !important;
            }
            
            .recommendations h4 {
                margin: 0 0 6px 0 !important;
                background: transparent !important;
                font-size: 9px !important;
                color: #1e3c72 !important;
            }
            
            .recommendations ul {
                margin: 0 !important;
                padding-left: 15px !important;
                background: transparent !important;
            }
            
            .recommendations li {
                background: transparent !important;
                margin-bottom: 3px !important;
                font-size: 8px !important;
                line-height: 1.2 !important;
            }
            
            /* PIE DE DOCUMENTO */
            .footer {
                text-align: center !important;
                margin-top: 20px !important;
                padding-top: 10px !important;
                border-top: 1px solid #dee2e6 !important;
                font-size: 7px !important;
                color: #666 !important;
                page-break-inside: avoid !important;
            }
            
            .footer p {
                background: transparent !important;
                color: #666 !important;
                margin: 2px 0 !important;
            }
            
            .footer em {
                font-style: italic !important;
                color: #999 !important;
            }
            
            /* OPTIMIZACIONES ESPECÍFICAS PARA IMPRESIÓN */
            @page {
                margin: 0.3in 0.3in 0.3in 0.3in !important;
                size: A4 !important;
            }
            
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                
                .container {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .header {
                    page-break-after: avoid !important;
                }
                
                .section-title {
                    page-break-after: avoid !important;
                }
                
                .resumen-table {
                    page-break-inside: avoid !important;
                }
                
                .recommendations {
                    page-break-inside: avoid !important;
                }
                
                .footer {
                    page-break-inside: avoid !important;
                }
                
                .data-table thead {
                    display: table-header-group !important;
                }
                
                .data-table tbody tr {
                    page-break-inside: avoid !important;
                }
            }
            
            /* SALTOS DE PÁGINA INTELIGENTES */
            .data-table tbody tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            
            .data-table thead {
                display: table-header-group !important;
            }
            
            .data-table tfoot {
                display: table-footer-group !important;
            }
        `;
    }
    
    /**
     * NUEVAS: Funciones de creación de contenido optimizadas
     */
    obtenerDatosResumen() {
        return {
            componentesCriticos: document.getElementById('componentesCriticos')?.textContent || '0',
            presupuestoTotal: document.getElementById('presupuestoTotal')?.textContent || 'Bs. 0',
            tiempoPromedio: document.getElementById('tiempoPromedio')?.textContent || '0',
            totalComponentes: document.getElementById('totalComponentes')?.textContent || '0'
        };
    }
    
    crearFilasTablaOptimizadas() {
        if (!window.componentesData || !Array.isArray(window.componentesData)) {
            return '<tr><td colspan="6">No hay datos disponibles</td></tr>';
        }
        
        return window.componentesData.map((item, index) => {
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
    
    crearEncabezadoOptimizado(fecha, hora) {
        return `
            <div class="header">
                <table class="logos-table">
                    <tr>
                        <td style="width:15%; text-align:center;">
                            <div class="logo">🏛️<br>TUPIZA</div>
                        </td>
                        <td style="width:70%; text-align:center;">
                            <h1 class="main-title">GOBIERNO AUTÓNOMO MUNICIPAL DE TUPIZA</h1>
                            <p class="subtitle">Planta Municipal de Premoldeados - Hormigones (PLAMPH°)</p>
                            <p class="subtitle">Secretaría Municipal Técnica</p>
                        </td>
                        <td style="width:15%; text-align:center;">
                            <div class="logo">PLAMPH°<br>TUPIZA</div>
                        </td>
                    </tr>
                </table>
                <h2 class="report-title">📄 REPORTE DE ANÁLISIS DE COMPONENTES MECÁNICOS</h2>
            </div>
        `;
    }
    
    crearInfoGeneralOptimizada(fecha, hora) {
        return `
            <div class="info-box">
                <p><strong>📅 Fecha:</strong> ${fecha} | <strong>🕒 Hora:</strong> ${hora}</p>
                <p><strong>👨‍🔧 Responsable:</strong> Ing. Rodrigo Barrios Andrade</p>
                <p><strong>📄 Tipo:</strong> Análisis de Tiempo de Recambio para Rodamientos, Chumaceras y Correas</p>
                <p><strong>🏭 Sistema:</strong> Análisis de Componentes Mecánicos v2.0</p>
            </div>
        `;
    }
    
    crearResumenEjecutivoOptimizado(datos) {
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
                        <div class="resumen-valor" style="font-size: 9px !important;">${datos.presupuestoTotal}</div>
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
    
    crearTablaDetalladaOptimizada(filas) {
        return `
            <h3 class="section-title">📋 INVENTARIO DETALLADO</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 18%;">Tipo</th>
                        <th style="width: 8%;">Cant.</th>
                        <th style="width: 32%;">Aplicación</th>
                        <th style="width: 12%;">Marca</th>
                        <th style="width: 15%;">Precio Unit.</th>
                        <th style="width: 15%;">Tiempo Recambio</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas}
                </tbody>
            </table>
        `;
    }
    
    crearRecomendacionesOptimizadas() {
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
    
    crearPieDocumentoOptimizado(fecha, hora) {
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
     * NUEVAS: Funciones de utilidad y configuración
     */
    obtenerPrecio(tipo, categoria, marca) {
        if (typeof window.obtenerPrecio === 'function') {
            return window.obtenerPrecio(tipo, categoria, marca);
        }
        return 120; // Fallback
    }
    
    generarNombreArchivo() {
        const fecha = new Date().toISOString().split('T')[0];
        const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
        return `Reporte_PLAMPH_${fecha}_${hora}.pdf`;
    }
    
    obtenerVersionjsPDF() {
        return window.jsPDF?.version || 'desconocida';
    }
    
    obtenerVersionHtml2Canvas() {
        return window.html2canvas?.version || 'desconocida';
    }
    
    ajustarConfiguracionSafari() {
        this.config.canvasConfig.scale = 1.8;
        this.config.canvasConfig.useCORS = false;
        this.config.canvasConfig.allowTaint = true;
    }
    
    ajustarConfiguracionFirefox() {
        this.config.canvasConfig.scale = 2.0;
        this.config.canvasConfig.foreignObjectRendering = false;
    }
    
    reportarProgreso(mensaje, porcentaje) {
        if (this.progressCallback) {
            this.progressCallback(mensaje, porcentaje);
        }
        
        if (this.debugMode) {
            console.log(`[${porcentaje}%] ${mensaje}`);
        }
    }
    
    /**
     * MEJORADA: Manejo de errores específicos
     */
    manejarErrorPDF(error) {
        let mensajeUsuario = '❌ Error generando PDF: ';
        
        if (error.message.includes('popup')) {
            mensajeUsuario += 'Por favor permite popups en tu navegador.';
        } else if (error.message.includes('canvas')) {
            mensajeUsuario += 'Error capturando contenido. Verifica que todos los elementos estén cargados.';
        } else if (error.message.includes('jsPDF')) {
            mensajeUsuario += 'Error en generación de PDF. Verifica conexión a internet.';
        } else if (error.message.includes('timeout')) {
            mensajeUsuario += 'Timeout en generación. Intentar con configuración simplificada.';
        } else {
            mensajeUsuario += 'Error desconocido. Ver consola para detalles.';
        }
        
        this.mostrarMensaje(mensajeUsuario, 'error');
        
        if (this.debugMode) {
            console.error('Error detallado:', error);
        }
    }
    
    /**
     * MEJORADA: Limpiar recursos temporales
     */
    limpiarRecursos() {
        if (this.tempWindow && !this.tempWindow.closed) {
            try {
                this.tempWindow.close();
            } catch (e) {
                console.warn('Error cerrando ventana temporal:', e);
            }
            this.tempWindow = null;
        }
    }
    
    /**
     * MEJORADA: Mostrar mensaje al usuario
     */
    mostrarMensaje(texto, tipo = 'info') {
        // Si existe una función global de mensajes, usarla
        if (typeof window.mostrarMensaje === 'function') {
            const tipoMap = {
                'info': 'info',
                'warning': 'warning', 
                'error': 'error',
                'success': 'success'
            };
            window.mostrarMensaje(texto, tipoMap[tipo] || 'info');
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
     * NUEVA: Habilitar modo debug
     */
    habilitarDebug() {
        this.debugMode = true;
        console.log('🐛 Modo debug habilitado para PDF Generator');
    }
    
    /**
     * NUEVA: Obtener información de diagnóstico
     */
    obtenerDiagnostico() {
        return {
            dependencias: this.validarDependenciasAvanzadas(),
            datos: this.validarDatosCompletos(),
            navegador: navigator.userAgent,
            configuracion: this.config,
            fallbackAttempts: this.fallbackAttempts,
            isGenerating: this.isGenerating
        };
    }
    
    /**
     * Método estático para fácil acceso global - MEJORADO
     */
    static async generarReporte(progressCallback = null) {
        const generator = new PDFGenerator();
        return await generator.generarReporte(progressCallback);
    }
    
    /**
     * NUEVA: Método estático para diagnóstico rápido
     */
    static diagnostico() {
        const generator = new PDFGenerator();
        return generator.obtenerDiagnostico();
    }
}

// ====================================================================
// CONFIGURACIÓN GLOBAL Y FUNCIONES DE UTILIDAD
// ====================================================================

// Crear instancia global para fácil acceso
window.PDFGenerator = PDFGenerator;

// Compatibilidad con función anterior
window.generarReportePDF = function(progressCallback = null) {
    return PDFGenerator.generarReporte(progressCallback);
};

// NUEVA: Función global de diagnóstico
window.diagnosticoPDFGenerator = function() {
    return PDFGenerator.diagnostico();
};

// NUEVA: Función para configurar debug globalmente
window.habilitarDebugPDF = function() {
    if (window.PDFGeneratorInstance) {
        window.PDFGeneratorInstance.habilitarDebug();
    } else {
        console.log('🐛 Debug se habilitará en la próxima instancia de PDF Generator');
        window.PDFDebugEnabled = true;
    }
};

// Inicialización automática mejorada
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que las dependencias estén cargadas
    let intentos = 0;
    const maxIntentos = 10;
    
    const verificarDependencias = () => {
        if (typeof window.jsPDF !== 'undefined' && typeof window.html2canvas !== 'undefined') {
            console.log('✅ PDF Generator v2.0 inicializado correctamente');
            
            // Crear instancia global para debug si está habilitado
            if (window.PDFDebugEnabled) {
                window.PDFGeneratorInstance = new PDFGenerator();
                window.PDFGeneratorInstance.habilitarDebug();
            }
            
            // Señalar que está listo
            if (window.pdfGeneratorReady) {
                window.pdfGeneratorReady();
            }
            
        } else if (intentos < maxIntentos) {
            intentos++;
            setTimeout(verificarDependencias, 500);
        } else {
            console.warn('⚠️ Dependencias del PDF Generator no cargadas después de 5 segundos');
        }
    };
    
    verificarDependencias();
});

// Exportar para módulos ES6 si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFGenerator;
}

// ====================================================================
// INFORMACIÓN DE LA VERSIÓN
// ====================================================================
console.log(`
📄 PDF GENERATOR v2.0 - MEJORADO
=================================

✨ NUEVAS CARACTERÍSTICAS:
• Sistema de fallbacks automático (3 niveles de calidad)
• Validaciones completas antes de generar
• Compatibilidad mejorada con Safari y Firefox
• Control optimizado de márgenes y paginación
• Mejor manejo de errores con mensajes específicos
• Sistema de progreso visual
• Modo debug integrado

🚀 USO:
• PDFGenerator.generarReporte() - Generación estándar
• PDFGenerator.diagnostico() - Información del sistema
• habilitarDebugPDF() - Activar modo debug

🔧 COMPATIBLE CON:
• jsPDF 2.5.1+
• html2canvas 1.4.1+
• Chrome, Firefox, Safari, Edge

Desarrollado para PLAMPH° Tupiza - Enero 2025
`);

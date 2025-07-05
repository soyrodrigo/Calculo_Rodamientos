/**
 * 📄 PDF GENERATOR MODULAR - VERSIÓN MEJORADA
 * ==========================================
 * 
 * Sistema modular para generar reportes PDF de alta calidad
 * Compatible con sistema PLAMPH° Tupiza
 * 
 * MEJORAS IMPLEMENTADAS:
 * - CDNs actualizados y estables
 * - Control preciso de márgenes
 * - Mejor manejo de saltos de página
 * - HTML completamente autocontenido
 * - Soporte para múltiples tipos de datos
 * 
 * Versión: 2.0
 * Autor: Sistema PLAMPH° Mejorado
 */

class PDFGenerator {
    constructor() {
        // Configuración por defecto mejorada
        this.config = {
            margin: [0.1, 0.3, 0.3, 0.3], // [top, right, bottom, left] en pulgadas
            format: 'letter',
            orientation: 'portrait',
            quality: 0.98,
            scale: 1.2,
            filename: null // Se genera automáticamente si es null
        };
        
        // Verificar dependencias al instanciar
        this.verificarDependencias();
    }

    /**
     * Verificar que las dependencias estén cargadas
     */
    verificarDependencias() {
        const dependencias = [
            { nombre: 'jsPDF', variable: 'window.jsPDF' },
            { nombre: 'html2canvas', variable: 'window.html2canvas' },
            { nombre: 'html2pdf', variable: 'window.html2pdf' }
        ];

        const faltantes = dependencias.filter(dep => {
            return !this.evaluarVariable(dep.variable);
        });

        if (faltantes.length > 0) {
            console.warn('⚠️ Dependencias faltantes:', faltantes.map(d => d.nombre));
            return false;
        }

        console.log('✅ Todas las dependencias de PDF están disponibles');
        return true;
    }

    /**
     * Evaluar si una variable global existe
     */
    evaluarVariable(variablePath) {
        try {
            return eval(variablePath) !== undefined;
        } catch (e) {
            return false;
        }
    }

    /**
     * Configurar opciones del generador PDF
     */
    configurar(opciones) {
        this.config = { ...this.config, ...opciones };
        return this;
    }

    /**
     * FUNCIÓN PRINCIPAL: Generar reporte PDF del sistema PLAMPH°
     */
    async generarReporte(configuracionPersonalizada = {}) {
        try {
            // Verificar dependencias antes de proceder
            if (!this.verificarDependencias()) {
                throw new Error('Dependencias de PDF no disponibles');
            }

            // Mostrar mensaje de progreso
            this.mostrarMensaje('📄 Generando reporte PDF...', 'info');
            
            // Verificar que hay datos calculados
            if (!this.verificarDatos()) {
                throw new Error('No hay datos calculados. Presiona "Calcular" primero');
            }

            // Aplicar configuración personalizada
            const config = { ...this.config, ...configuracionPersonalizada };

            // Generar nombre de archivo automático si no se especifica
            if (!config.filename) {
                config.filename = `Reporte_PLAMPH_${new Date().toISOString().split('T')[0]}.pdf`;
            }

            // Crear ventana temporal con HTML optimizado
            const ventanaReporte = this.crearVentanaReporte();
            
            // Configuración optimizada para html2pdf
            const opciones = {
                margin: config.margin,
                filename: config.filename,
                image: { 
                    type: 'jpeg', 
                    quality: config.quality 
                },
                html2canvas: { 
                    scale: config.scale,
                    backgroundColor: '#ffffff',
                    useCORS: true,
                    logging: false,
                    allowTaint: true,
                    letterRendering: true,
                    scrollX: 0,
                    scrollY: 0
                }, 
                jsPDF: { 
                    unit: 'in', 
                    format: config.format, 
                    orientation: config.orientation,
                    compress: false
                }
            };

            // Generar PDF después de renderizado
            await this.procesarPDF(ventanaReporte, opciones);

        } catch (error) {
            console.error('❌ Error generando PDF:', error);
            this.mostrarMensaje(`❌ Error: ${error.message}`, 'error');
        }
    }

    /**
     * Verificar que existen datos para el reporte
     */
    verificarDatos() {
        const elementosClave = [
            'componentesCriticos',
            'presupuestoTotal', 
            'tiempoPromedio',
            'totalComponentes'
        ];

        for (const id of elementosClave) {
            const elemento = document.getElementById(id);
            if (!elemento || !elemento.textContent || elemento.textContent === '-') {
                return false;
            }
        }

        return true;
    }

    /**
     * Crear ventana temporal para el reporte
     */
    crearVentanaReporte() {
        const ventana = window.open('', '_blank', 'width=800,height=600');
        
        // HTML completamente autocontenido y optimizado
        const htmlCompleto = this.crearHTMLOptimizado();
        
        // Escribir y cerrar documento
        ventana.document.open();
        ventana.document.write(htmlCompleto);
        ventana.document.close();

        return ventana;
    }

    /**
     * Procesar generación de PDF
     */
    async procesarPDF(ventana, opciones) {
        return new Promise((resolve, reject) => {
            // Esperar a que se renderice completamente
            setTimeout(async () => {
                try {
                    await html2pdf()
                        .set(opciones)
                        .from(ventana.document.body)
                        .save();
                    
                    ventana.close();
                    this.mostrarMensaje('✅ Reporte PDF generado exitosamente', 'success');
                    resolve();
                } catch (error) {
                    ventana.close();
                    reject(error);
                }
            }, 2000);
        });
    }

    /**
     * Crear HTML optimizado para PDF (SIN HERENCIA DE CSS)
     */
    crearHTMLOptimizado() {
        const datos = this.extraerDatos();
        const filas = this.generarFilasTabla();

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte PLAMPH</title>
    <style>
        ${this.generarEstilosOptimizados()}
    </style>
</head>
<body>
    <div class="container">
        ${this.generarEncabezado()}
        ${this.generarInformacionGeneral(datos)}
        ${this.generarResumenEjecutivo(datos)}
        ${this.generarTablaInventario(filas)}
        ${this.generarRecomendaciones()}
        ${this.generarPieDePagina()}
    </div>
</body>
</html>`;
    }

    /**
     * Extraer datos del DOM actual
     */
    extraerDatos() {
        const obtenerTexto = (id) => {
            const elemento = document.getElementById(id);
            return elemento ? elemento.textContent.trim() : '0';
        };

        return {
            fecha: new Date().toLocaleDateString('es-ES'),
            hora: new Date().toLocaleTimeString('es-ES'),
            componentesCriticos: obtenerTexto('componentesCriticos'),
            presupuestoTotal: obtenerTexto('presupuestoTotal'),
            tiempoPromedio: obtenerTexto('tiempoPromedio'),
            totalComponentes: obtenerTexto('totalComponentes')
        };
    }

    /**
     * Generar filas de la tabla de inventario
     */
    generarFilasTabla() {
        if (typeof window.componentesData === 'undefined') {
            return '<tr><td colspan="6">No hay datos disponibles</td></tr>';
        }

        return window.componentesData.map((item, index) => {
            const precio = this.obtenerPrecio(item);
            const tiempo = this.obtenerTiempoRecambio(index);
            
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
     * Obtener precio de un componente
     */
    obtenerPrecio(item) {
        if (typeof window.obtenerPrecio === 'function') {
            return window.obtenerPrecio(item.tipo, item.categoria, item.marca);
        }
        return item.precio_custom || 120; // Precio por defecto
    }

    /**
     * Obtener tiempo de recambio
     */
    obtenerTiempoRecambio(index) {
        const elemento = document.getElementById(`tiempo-${index}`);
        return elemento ? elemento.textContent : 'Calculando...';
    }

    /**
     * Estilos CSS optimizados para PDF
     */
    generarEstilosOptimizados() {
        return `
        /* RESET COMPLETO PARA PDF */
        * {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            background: white !important;
            color: #333 !important;
            font-family: Arial, sans-serif !important;
            box-sizing: border-box !important;
        }
        
        body {
            width: 100% !important;
            background: white !important;
            padding: 0px 15px 15px 15px !important;
            font-size: 11px !important;
            line-height: 1.3 !important;
            margin: 0 !important;
        }
        
        .container {
            background: white !important;
            width: 100% !important;
            max-width: none !important;
        }
        
        .header {
            text-align: center !important;
            border-bottom: 2px solid #333 !important;
            padding-bottom: 10px !important;
            margin-bottom: 15px !important;
            page-break-inside: avoid !important;
        }
        
        .logos-table {
            width: 100% !important;
            margin-bottom: 10px !important;
            border-collapse: collapse !important;
        }
        
        .logo {
            width: 50px !important;
            height: 50px !important;
            border: 2px solid #333 !important;
            border-radius: 8px !important;
            display: inline-block !important;
            text-align: center !important;
            line-height: 12px !important;
            font-size: 8px !important;
            font-weight: bold !important;
            padding: 5px !important;
            background: #f9f9f9 !important;
        }
        
        .main-title {
            font-size: 13px !important;
            font-weight: bold !important;
            margin: 0 0 5px 0 !important;
        }
        
        .subtitle {
            font-size: 9px !important;
            color: #666 !important;
            margin: 2px 0 !important;
        }
        
        .report-title {
            font-size: 11px !important;
            font-weight: bold !important;
            margin: 8px 0 0 0 !important;
        }
        
        .info-box {
            background: #f9f9f9 !important;
            padding: 10px !important;
            border-left: 4px solid #333 !important;
            margin: 12px 0 !important;
            border-radius: 4px !important;
        }
        
        .info-box p {
            background: transparent !important;
            margin: 3px 0 !important;
            font-size: 10px !important;
        }
        
        .section-title {
            font-size: 11px !important;
            font-weight: bold !important;
            border-bottom: 1px solid #333 !important;
            padding-bottom: 4px !important;
            margin: 15px 0 10px 0 !important;
        }
        
        .resumen-table {
            width: 100% !important;
            border-collapse: separate !important;
            border-spacing: 5px !important;
            margin: 10px 0 !important;
        }
        
        .resumen-item {
            background: #f9f9f9 !important;
            padding: 8px !important;
            border-radius: 6px !important;
            border: 1px solid #ddd !important;
            text-align: center !important;
            width: 25% !important;
            vertical-align: top !important;
            height: 45px !important;
        }
        
        .resumen-label {
            font-size: 8px !important;
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
        
        .data-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 10px 0 !important;
            font-size: 9px !important;
            page-break-inside: auto !important;
        }
        
        .data-table th {
            background: #333 !important;
            color: white !important;
            padding: 8px 5px !important;
            font-size: 9px !important;
            font-weight: bold !important;
            border: 1px solid #333 !important;
        }
        
        .data-table td {
            padding: 5px 4px !important;
            border: 1px solid #666 !important;
            font-size: 9px !important;
            background: white !important;
            line-height: 1.2 !important;
        }
        
        .data-table tr:nth-child(even) td {
            background: #f9f9f9 !important;
        }
        
        .recommendations {
            margin-top: 15px !important;
            padding: 10px !important;
            background: #f9f9f9 !important;
            border-radius: 4px !important;
            border-left: 4px solid #333 !important;
            page-break-inside: avoid !important;
        }
        
        .recommendations h4 {
            margin: 0 0 8px 0 !important;
            background: transparent !important;
            font-size: 10px !important;
        }
        
        .recommendations ul {
            margin: 0 !important;
            padding-left: 15px !important;
            background: transparent !important;
        }
        
        .recommendations li {
            background: transparent !important;
            margin-bottom: 3px !important;
            font-size: 9px !important;
            line-height: 1.2 !important;
        }
        
        .footer {
            text-align: center !important;
            margin-top: 20px !important;
            padding-top: 10px !important;
            border-top: 1px solid #999 !important;
            font-size: 8px !important;
            color: #666 !important;
            page-break-inside: avoid !important;
        }
        
        .footer p {
            background: transparent !important;
            color: #666 !important;
            margin: 3px 0 !important;
        }
        
        /* CONFIGURACIÓN DE PÁGINA */
        @page {
            margin: 0.1in 0.3in 0.3in 0.3in;
        }
        
        /* CONTROL DE SALTOS DE PÁGINA */
        .no-break {
            page-break-inside: avoid !important;
        }
        
        .page-break-before {
            page-break-before: always !important;
        }
        `;
    }

    /**
     * Generar encabezado del reporte
     */
    generarEncabezado() {
        return `
        <div class="header no-break">
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

    /**
     * Generar información general
     */
    generarInformacionGeneral(datos) {
        return `
        <div class="info-box no-break">
            <p><strong>📅 Fecha:</strong> ${datos.fecha} | <strong>🕒 Hora:</strong> ${datos.hora}</p>
            <p><strong>👨‍🔧 Responsable:</strong> Ing. Rodrigo Barrios Andrade</p>
            <p><strong>📄 Tipo:</strong> Análisis de Tiempo de Recambio de Componentes</p>
            <p><strong>🏭 Sistema:</strong> Planta Municipal de Premoldeados - Hormigones</p>
        </div>
        `;
    }

    /**
     * Generar resumen ejecutivo
     */
    generarResumenEjecutivo(datos) {
        return `
        <h3 class="section-title">📊 RESUMEN EJECUTIVO</h3>
        <table class="resumen-table no-break">
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

    /**
     * Generar tabla de inventario
     */
    generarTablaInventario(filas) {
        return `
        <h3 class="section-title">📋 INVENTARIO DETALLADO</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Tipo</th>
                    <th style="width: 8%;">Cant.</th>
                    <th style="width: 34%;">Aplicación</th>
                    <th style="width: 12%;">Marca</th>
                    <th style="width: 13%;">Precio Unit.</th>
                    <th style="width: 13%;">Tiempo Recambio</th>
                </tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
        `;
    }

    /**
     * Generar recomendaciones
     */
    generarRecomendaciones() {
        return `
        <div class="recommendations no-break">
            <h4>💡 Observaciones y Recomendaciones Técnicas:</h4>
            <ul>
                <li><strong>Componentes críticos:</strong> Los componentes con tiempo de recambio menor a 6 meses requieren atención prioritaria y monitoreo continuo</li>
                <li><strong>Stock de seguridad:</strong> Mantener inventario del 20% adicional para componentes de alta criticidad (ruedas, sistema de extracción)</li>
                <li><strong>Mantenimiento preventivo:</strong> Implementar cronograma de inspección cada 3 meses para componentes de alta rotación</li>
                <li><strong>Optimización de costos:</strong> Evaluar proveedores alternativos manteniendo estándares de calidad ISO para rodamientos y chumaceras</li>
                <li><strong>Capacitación:</strong> Personal técnico debe conocer procedimientos de reemplazo para reducir tiempos de parada</li>
                <li><strong>Registro de fallas:</strong> Documentar causas de reemplazo prematuro para ajustar factores de carga y ambiente</li>
            </ul>
        </div>
        `;
    }

    /**
     * Generar pie de página
     */
    generarPieDePagina() {
        const datos = this.extraerDatos();
        return `
        <div class="footer no-break">
            <p><strong>Sistema PLAMPH° - Gobierno Autónomo Municipal de Tupiza</strong></p>
            <p style="font-style: italic;">Documento generado automáticamente el ${datos.fecha} a las ${datos.hora}</p>
            <p>Planta Municipal de Premoldeados - Hormigones • Tupiza, Potosí, Bolivia</p>
            <p>📧 plamph@tupiza.gob.bo | 📞 (+591) 2-694-xxxx</p>
        </div>
        `;
    }

    /**
     * Mostrar mensajes al usuario
     */
    mostrarMensaje(texto, tipo = 'info') {
        // Intentar usar la función global si existe
        if (typeof window.mostrarMensaje === 'function') {
            window.mostrarMensaje(texto, tipo);
            return;
        }

        // Fallback a console y alert
        console.log(`${tipo.toUpperCase()}: ${texto}`);
        
        if (tipo === 'error') {
            alert(texto);
        }
    }

    /**
     * MÉTODO ESTÁTICO: Generar reporte (para compatibilidad)
     */
    static async generarReporte(configuracion = {}) {
        const generador = new PDFGenerator();
        return await generador.generarReporte(configuracion);
    }
}

// Exportar para uso global
window.PDFGenerator = PDFGenerator;

// Función de compatibilidad global
window.generarReportePDF = function(configuracion = {}) {
    return PDFGenerator.generarReporte(configuracion);
};

console.log('📄 PDF Generator Modular v2.0 cargado exitosamente');
console.log('💡 Uso: PDFGenerator.generarReporte() o generarReportePDF()');

// Función de diagnóstico
window.diagnosticarPDF = function() {
    const generador = new PDFGenerator();
    console.log('🔍 === DIAGNÓSTICO DEL SISTEMA PDF ===');
    console.log('Dependencias:', generador.verificarDependencias());
    console.log('Datos disponibles:', generador.verificarDatos());
    console.log('Configuración actual:', generador.config);
    console.log('=======================================');
};

/**
 * AUTO-INICIALIZACIÓN AL CARGAR
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ PDF Generator inicializado automáticamente');
    
    // Verificar dependencias automáticamente
    const generador = new PDFGenerator();
    if (!generador.verificarDependencias()) {
        console.warn('⚠️ Algunas dependencias de PDF faltan. Ejecuta diagnosticarPDF() para más detalles.');
    }
});
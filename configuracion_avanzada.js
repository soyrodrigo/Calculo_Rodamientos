// ===================================================================
// CONFIGURACIÓN AVANZADA Y SOLUCIÓN DE PROBLEMAS ESPECÍFICOS
// ===================================================================

/**
 * Configuraciones específicas para diferentes casos de uso
 */

// 1. CONFIGURACIÓN PARA REPORTES LARGOS (Muchos componentes)
const configReporteLargo = {
    margins: {
        top: 15,     // Márgenes más pequeños para aprovechar espacio
        right: 10,
        bottom: 15,
        left: 10
    },
    imageQuality: 0.85,  // Menor calidad para archivos más pequeños
    canvasConfig: {
        scale: 1.8,      // Menor escala para mejor rendimiento
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        foreignObjectRendering: false,
        imageTimeout: 30000  // Más tiempo para reportes largos
    }
};

// 2. CONFIGURACIÓN PARA PRESENTACIONES (Alta calidad)
const configPresentacion = {
    margins: {
        top: 25,
        right: 20,
        bottom: 25,
        left: 20
    },
    imageQuality: 0.98,  // Máxima calidad
    canvasConfig: {
        scale: 3,        // Máxima resolución
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        foreignObjectRendering: false,
        imageTimeout: 45000
    }
};

// 3. CONFIGURACIÓN PARA ENVÍO POR EMAIL (Comprimido)
const configEmail = {
    margins: {
        top: 20,
        right: 15,
        bottom: 20,
        left: 15
    },
    imageQuality: 0.70,  // Calidad reducida para menor tamaño
    canvasConfig: {
        scale: 1.5,      // Menor resolución
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        foreignObjectRendering: false,
        imageTimeout: 20000
    }
};

/**
 * Clase extendida con configuraciones predefinidas
 */
class PDFGeneratorAvanzado extends PDFGenerator {
    constructor(tipoConfig = 'estandar') {
        super();
        this.aplicarConfiguracion(tipoConfig);
    }
    
    aplicarConfiguracion(tipo) {
        const configuraciones = {
            'largo': configReporteLargo,
            'presentacion': configPresentacion,
            'email': configEmail,
            'estandar': this.config  // Configuración por defecto
        };
        
        if (configuraciones[tipo]) {
            Object.assign(this.config, configuraciones[tipo]);
        }
    }
    
    // Método para cambiar configuración dinámicamente
    cambiarConfiguracion(tipo) {
        this.aplicarConfiguracion(tipo);
        this.mostrarMensaje(`Configuración cambiada a: ${tipo}`, 'info');
    }
}

/**
 * SOLUCIONES A PROBLEMAS ESPECÍFICOS
 */

// PROBLEMA 1: PDF se genera pero está en blanco
function solucionPDFBlanco() {
    return {
        problema: "PDF se genera pero aparece en blanco",
        causas: [
            "Elementos con CSS que no se capturan bien",
            "Contenido dinámico no cargado completamente",
            "Problemas de timing",
            "Estilos CSS complejos"
        ],
        solucion: function() {
            // Crear configuración específica para contenido problemático
            const configSolucion = {
                canvasConfig: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: true,  // Activar logs para debug
                    allowTaint: true,  // Permitir contenido "tainted"
                    foreignObjectRendering: true,  // Renderizado alternativo
                    imageTimeout: 30000,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    scrollX: 0,
                    scrollY: 0
                }
            };
            
            const generator = new PDFGenerator();
            Object.assign(generator.config, configSolucion);
            return generator;
        }
    };
}

// PROBLEMA 2: Texto muy pequeño o borroso
function solucionTextoBourroso() {
    return {
        problema: "Texto aparece muy pequeño o borroso en el PDF",
        solucion: function() {
            const generator = new PDFGenerator();
            
            // Configuración para texto nítido
            generator.config.canvasConfig.scale = 3;  // Mayor escala
            generator.config.imageQuality = 0.95;     // Mayor calidad
            generator.config.canvasConfig.dpi = 300;  // Mayor DPI
            
            // Override del método para añadir configuración específica de fuentes
            const originalCrearVentana = generator.crearVentanaTemporal;
            generator.crearVentanaTemporal = async function(contenidoHTML) {
                // Modificar HTML para mejorar renderizado de texto
                const htmlMejorado = contenidoHTML.replace(
                    '<style>',
                    '<style>* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }'
                );
                
                return originalCrearVentana.call(this, htmlMejorado);
            };
            
            return generator;
        }
    };
}

// PROBLEMA 3: Tablas se cortan entre páginas
function solucionTablasCortadas() {
    return {
        problema: "Las tablas se cortan mal entre páginas",
        solucion: function() {
            // Crear estilos CSS específicos para evitar cortes
            const estilosAntiCorte = `
                .data-table { 
                    page-break-inside: avoid !important; 
                }
                .data-table tbody tr { 
                    page-break-inside: avoid !important; 
                    page-break-after: auto !important; 
                }
                .resumen-table { 
                    page-break-inside: avoid !important; 
                }
                .section-title { 
                    page-break-after: avoid !important; 
                }
                .recommendations { 
                    page-break-inside: avoid !important; 
                }
            `;
            
            const generator = new PDFGeneratorAvanzado();
            
            // Override para añadir estilos anti-corte
            const originalEstilos = generator.obtenerEstilosPDF;
            generator.obtenerEstilosPDF = function() {
                return originalEstilos.call(this) + estilosAntiCorte;
            };
            
            return generator;
        }
    };
}

// PROBLEMA 4: Error de CORS o tainting
function solucionProblemasCORS() {
    return {
        problema: "Errores de CORS o canvas tainted",
        solucion: function() {
            const generator = new PDFGenerator();
            
            // Configuración permisiva para CORS
            generator.config.canvasConfig = {
                ...generator.config.canvasConfig,
                useCORS: true,
                allowTaint: true,
                foreignObjectRendering: true,
                proxy: undefined,  // Sin proxy
                removeContainer: true
            };
            
            return generator;
        }
    };
}

// PROBLEMA 5: PDF muy lento de generar
function solucionPDFLento() {
    return {
        problema: "PDF tarda mucho en generarse",
        solucion: function() {
            const generator = new PDFGenerator();
            
            // Configuración optimizada para velocidad
            generator.config.imageQuality = 0.75;    // Menor calidad
            generator.config.canvasConfig.scale = 1.5; // Menor escala
            generator.config.canvasConfig.imageTimeout = 10000; // Menor timeout
            
            // Override para mostrar progreso
            const originalGenerar = generator.generarPDFMejorado;
            generator.generarPDFMejorado = async function() {
                this.mostrarMensaje('⏳ Optimizando para velocidad...', 'info');
                
                // Simplificar HTML antes de procesar
                if (this.tempWindow) {
                    const elementos = this.tempWindow.document.querySelectorAll('*');
                    elementos.forEach(el => {
                        // Remover sombras y efectos costosos
                        el.style.boxShadow = 'none';
                        el.style.textShadow = 'none';
                        el.style.filter = 'none';
                    });
                }
                
                return originalGenerar.call(this);
            };
            
            return generator;
        }
    };
}

/**
 * DETECTOR AUTOMÁTICO DE PROBLEMAS
 */
class DiagnosticoPDF {
    static async diagnosticar() {
        const resultados = {
            dependencias: this.verificarDependencias(),
            datos: this.verificarDatos(),
            rendimiento: await this.verificarRendimiento(),
            compatibilidad: this.verificarCompatibilidad()
        };
        
        return resultados;
    }
    
    static verificarDependencias() {
        const dependencias = {
            jsPDF: typeof window.jsPDF !== 'undefined',
            html2canvas: typeof window.html2canvas !== 'undefined',
            PDFGenerator: typeof window.PDFGenerator !== 'undefined'
        };
        
        const problemas = Object.entries(dependencias)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
        
        return {
            ok: problemas.length === 0,
            problemas,
            mensaje: problemas.length === 0 
                ? '✅ Todas las dependencias cargadas' 
                : `❌ Faltan: ${problemas.join(', ')}`
        };
    }
    
    static verificarDatos() {
        const elementos = [
            'componentesCriticos',
            'presupuestoTotal',
            'tiempoPromedio',
            'totalComponentes'
        ];
        
        const problemasElementos = elementos.filter(id => {
            const el = document.getElementById(id);
            return !el || !el.textContent || el.textContent === '-';
        });
        
        const datosGlobales = {
            componentesData: typeof window.componentesData !== 'undefined' && window.componentesData.length > 0,
            obtenerPrecio: typeof window.obtenerPrecio === 'function',
            mostrarMensaje: typeof window.mostrarMensaje === 'function'
        };
        
        const problemasGlobales = Object.entries(datosGlobales)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
        
        return {
            ok: problemasElementos.length === 0 && problemasGlobales.length === 0,
            problemasElementos,
            problemasGlobales,
            mensaje: problemasElementos.length === 0 && problemasGlobales.length === 0
                ? '✅ Datos disponibles'
                : `❌ Problemas con datos`
        };
    }
    
    static async verificarRendimiento() {
        const inicio = performance.now();
        
        // Test de renderizado básico
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1000;
        canvas.height = 1000;
        
        // Dibujar algo simple
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1000, 1000);
        ctx.fillStyle = '#000000';
        ctx.fillText('Test de rendimiento', 100, 100);
        
        const fin = performance.now();
        const tiempo = fin - inicio;
        
        return {
            ok: tiempo < 100,
            tiempo: Math.round(tiempo),
            mensaje: tiempo < 100 
                ? '✅ Rendimiento adecuado' 
                : '⚠️ Rendimiento puede ser lento'
        };
    }
    
    static verificarCompatibilidad() {
        const navegador = navigator.userAgent;
        const problemas = [];
        
        // Verificar popup blocker
        if (window.name === '' && window.location.href.indexOf('popup') === -1) {
            try {
                const popup = window.open('', 'test', 'width=1,height=1');
                if (popup) {
                    popup.close();
                } else {
                    problemas.push('Popup blocker activo');
                }
            } catch (e) {
                problemas.push('Error abriendo popups');
            }
        }
        
        // Verificar canvas support
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                problemas.push('Canvas no soportado');
            }
        } catch (e) {
            problemas.push('Error con Canvas');
        }
        
        return {
            ok: problemas.length === 0,
            problemas,
            navegador: navegador.includes('Chrome') ? 'Chrome' : 
                      navegador.includes('Firefox') ? 'Firefox' :
                      navegador.includes('Safari') ? 'Safari' : 'Otro',
            mensaje: problemas.length === 0 
                ? '✅ Navegador compatible' 
                : `⚠️ Problemas: ${problemas.join(', ')}`
        };
    }
}

/**
 * FUNCIONES DE UTILIDAD PARA DEBUGGING
 */

// Función para ejecutar diagnóstico completo
async function ejecutarDiagnosticoPDF() {
    console.log('🔍 Iniciando diagnóstico del generador PDF...');
    
    const diagnostico = await DiagnosticoPDF.diagnosticar();
    
    console.log('📋 Resultados del diagnóstico:');
    console.log('Dependencias:', diagnostico.dependencias);
    console.log('Datos:', diagnostico.datos);
    console.log('Rendimiento:', diagnostico.rendimiento);
    console.log('Compatibilidad:', diagnostico.compatibilidad);
    
    // Mostrar resumen en la UI
    let mensaje = '🔍 Diagnóstico PDF:\n';
    mensaje += `${diagnostico.dependencias.mensaje}\n`;
    mensaje += `${diagnostico.datos.mensaje}\n`;
    mensaje += `${diagnostico.rendimiento.mensaje}\n`;
    mensaje += `${diagnostico.compatibilidad.mensaje}`;
    
    if (window.mostrarMensaje) {
        window.mostrarMensaje(mensaje.replace(/\n/g, '<br>'), 'info');
    } else {
        alert(mensaje);
    }
    
    return diagnostico;
}

// Función para aplicar solución automática
function aplicarSolucionAutomatica() {
    ejecutarDiagnosticoPDF().then(diagnostico => {
        let solucionAplicada = false;
        
        // Aplicar soluciones según problemas detectados
        if (!diagnostico.dependencias.ok) {
            console.log('❌ Faltan dependencias - revisar CDNs');
        }
        
        if (!diagnostico.datos.ok) {
            console.log('❌ Faltan datos - ejecutar calcularTodo() primero');
        }
        
        if (!diagnostico.rendimiento.ok) {
            console.log('⚠️ Aplicando configuración de velocidad...');
            window.PDFGeneratorOptimizado = solucionPDFLento().solucion();
            solucionAplicada = true;
        }
        
        if (diagnostico.compatibilidad.problemas.includes('Popup blocker')) {
            console.log('⚠️ Problema con popups detectado');
        }
        
        if (solucionAplicada) {
            console.log('✅ Soluciones aplicadas. Usar PDFGeneratorOptimizado.generarReporte()');
        }
    });
}

/**
 * SETUP AUTOMÁTICO PARA CASOS COMUNES
 */
function setupPDFAutomatico() {
    // Detectar tipo de uso y aplicar configuración automáticamente
    setTimeout(() => {
        if (window.componentesData && window.componentesData.length > 50) {
            // Muchos componentes - usar configuración optimizada
            console.log('📊 Detectados muchos componentes, aplicando config optimizada');
            window.PDFGeneratorAuto = new PDFGeneratorAvanzado('largo');
        } else if (window.location.href.includes('presentacion')) {
            // URL sugiere presentación - usar alta calidad
            console.log('🎥 Modo presentación detectado');
            window.PDFGeneratorAuto = new PDFGeneratorAvanzado('presentacion');
        } else {
            // Uso estándar
            window.PDFGeneratorAuto = new PDFGeneratorAvanzado('estandar');
        }
        
        console.log('✅ PDF Generator configurado automáticamente');
    }, 1000);
}

// Ejecutar setup automático cuando se carga la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPDFAutomatico);
} else {
    setupPDFAutomatico();
}

// Exportar funciones útiles
window.DiagnosticoPDF = DiagnosticoPDF;
window.ejecutarDiagnosticoPDF = ejecutarDiagnosticoPDF;
window.aplicarSolucionAutomatica = aplicarSolucionAutomatica;
window.PDFGeneratorAvanzado = PDFGeneratorAvanzado;

// Debug: añadir funciones de solución al window para fácil acceso
window.solucionesPDF = {
    pdfBlanco: solucionPDFBlanco,
    textoBorroso: solucionTextoBourroso,
    tablasCortadas: solucionTablasCortadas,
    problemasCORS: solucionProblemasCORS,
    pdfLento: solucionPDFLento
};
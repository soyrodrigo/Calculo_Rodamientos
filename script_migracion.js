/**
 * SCRIPT DE MIGRACIÓN AUTOMÁTICA
 * Convierte tu HTML existente al nuevo sistema modular automáticamente
 */

class MigradorPDF {
    constructor() {
        this.problemas = [];
        this.cambiosRealizados = [];
        this.backupRealizados = false;
    }

    /**
     * Función principal de migración
     */
    async migrarSistema() {
        console.log('🔄 Iniciando migración automática del sistema PDF...');
        
        try {
            // 1. Crear backup del código actual
            this.crearBackup();
            
            // 2. Detectar y analizar código existente
            const analisis = this.analizarCodigoExistente();
            
            // 3. Actualizar CDNs
            this.actualizarCDNs();
            
            // 4. Extraer y limpiar funciones PDF
            this.extraerFuncionesPDF();
            
            // 5. Crear referencias globales necesarias
            this.crearReferenciasGlobales();
            
            // 6. Actualizar referencias en el HTML
            this.actualizarReferencias();
            
            // 7. Validar migración
            const validacion = await this.validarMigracion();
            
            // 8. Generar reporte
            this.generarReporteMigracion(validacion);
            
        } catch (error) {
            console.error('❌ Error durante la migración:', error);
            this.revertirCambios();
        }
    }

    /**
     * Crear backup del código actual
     */
    crearBackup() {
        try {
            // Obtener el HTML actual
            const htmlActual = document.documentElement.outerHTML;
            
            // Guardar en localStorage como backup
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupKey = `pdf_backup_${timestamp}`;
            
            localStorage.setItem(backupKey, htmlActual);
            localStorage.setItem('pdf_backup_latest', backupKey);
            
            this.backupRealizados = true;
            this.cambiosRealizados.push('✅ Backup creado en localStorage');
            
            console.log(`💾 Backup guardado como: ${backupKey}`);
            
        } catch (error) {
            this.problemas.push('❌ No se pudo crear backup');
            console.warn('No se pudo crear backup:', error);
        }
    }

    /**
     * Analizar código existente para detectar patrones
     */
    analizarCodigoExistente() {
        const analisis = {
            tieneFuncionPDF: false,
            tieneHTMLCompleto: false,
            tieneComponentesData: false,
            tieneMostrarMensaje: false,
            tieneObtenerPrecio: false,
            cdnsAntiguos: [],
            funcionesPDFEncontradas: []
        };

        // Buscar en scripts del documento
        const scripts = document.querySelectorAll('script');
        let codigoTotal = '';
        
        scripts.forEach(script => {
            if (script.textContent) {
                codigoTotal += script.textContent;
            }
        });

        // Detectar funciones PDF existentes
        if (codigoTotal.includes('generarReportePDF')) {
            analisis.tieneFuncionPDF = true;
            analisis.funcionesPDFEncontradas.push('generarReportePDF');
        }

        if (codigoTotal.includes('crearHTMLCompleto')) {
            analisis.tieneHTMLCompleto = true;
            analisis.funcionesPDFEncontradas.push('crearHTMLCompleto');
        }

        // Detectar variables necesarias
        if (codigoTotal.includes('componentesData')) {
            analisis.tieneComponentesData = true;
        }

        if (codigoTotal.includes('mostrarMensaje')) {
            analisis.tieneMostrarMensaje = true;
        }

        if (codigoTotal.includes('obtenerPrecio')) {
            analisis.tieneObtenerPrecio = true;
        }

        // Detectar CDNs antiguos
        const links = document.querySelectorAll('script[src]');
        links.forEach(link => {
            const src = link.src;
            if (src.includes('html2pdf')) {
                analisis.cdnsAntiguos.push('html2pdf (deprecado)');
            }
            if (src.includes('jspdf') && !src.includes('2.5.1')) {
                analisis.cdnsAntiguos.push('jsPDF (versión antigua)');
            }
        });

        console.log('📊 Análisis del código existente:', analisis);
        return analisis;
    }

    /**
     * Actualizar CDNs en el documento
     */
    actualizarCDNs() {
        const cdnsNecesarios = [
            {
                id: 'jspdf-cdn',
                src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                descripcion: 'jsPDF v2.5.1'
            },
            {
                id: 'html2canvas-cdn',
                src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
                descripcion: 'html2canvas v1.4.1'
            },
            {
                id: 'pdf-generator-cdn',
                src: 'pdf-generator.js',
                descripcion: 'PDF Generator Modular'
            }
        ];

        // Remover CDNs antiguos problemáticos
        const scriptsAntiguos = document.querySelectorAll('script[src*="html2pdf"]');
        scriptsAntiguos.forEach(script => {
            script.remove();
            this.cambiosRealizados.push('🗑️ Removido CDN html2pdf obsoleto');
        });

        // Añadir nuevos CDNs si no existen
        cdnsNecesarios.forEach(cdn => {
            if (!document.getElementById(cdn.id)) {
                const script = document.createElement('script');
                script.id = cdn.id;
                script.src = cdn.src;
                document.head.appendChild(script);
                this.cambiosRealizados.push(`➕ Añadido CDN: ${cdn.descripcion}`);
            }
        });

        console.log('🔗 CDNs actualizados');
    }

    /**
     * Extraer funciones PDF del código y marcarlas para eliminación
     */
    extraerFuncionesPDF() {
        const funcionesAExtraer = [
            'generarReportePDF',
            'crearHTMLCompleto',
            'crearContenidoHTML'
        ];

        let codigoExtraido = '';
        let funcionesEncontradas = [];

        // Buscar y extraer funciones en scripts
        const scripts = document.querySelectorAll('script:not([src])');
        
        scripts.forEach(script => {
            let contenido = script.textContent;
            
            funcionesAExtraer.forEach(nombreFuncion => {
                // Buscar la función usando regex
                const regexFuncion = new RegExp(
                    `(function\\s+${nombreFuncion}|${nombreFuncion}\\s*[:=]\\s*function|const\\s+${nombreFuncion}\\s*=|let\\s+${nombreFuncion}\\s*=|var\\s+${nombreFuncion}\\s*=)[\\s\\S]*?(?=\\n\\s*(?:function|const|let|var|$)|$)`,
                    'g'
                );
                
                const matches = contenido.match(regexFuncion);
                if (matches) {
                    matches.forEach(match => {
                        codigoExtraido += match + '\n\n';
                        funcionesEncontradas.push(nombreFuncion);
                        
                        // Marcar para comentar en el código original
                        contenido = contenido.replace(match, `/* MIGRADO A pdf-generator.js:\n${match}\n*/`);
                    });
                }
            });
            
            // Actualizar el script
            if (contenido !== script.textContent) {
                script.textContent = contenido;
            }
        });

        if (funcionesEncontradas.length > 0) {
            this.cambiosRealizados.push(`📤 Extraídas funciones: ${funcionesEncontradas.join(', ')}`);
            
            // Guardar código extraído para referencia
            console.log('📋 Código extraído para pdf-generator.js:');
            console.log(codigoExtraido);
            
            // Intentar descargar como archivo
            this.descargarCodigoExtraido(codigoExtraido);
        }

        return codigoExtraido;
    }

    /**
     * Crear referencias globales necesarias
     */
    crearReferenciasGlobales() {
        const scriptGlobal = document.createElement('script');
        scriptGlobal.id = 'referencias-globales-pdf';
        
        let codigoGlobal = `
// Referencias globales para PDF Generator (generado automáticamente)
window.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Configurando referencias globales para PDF Generator...');
    
    // Hacer datos accesibles globalmente
    if (typeof componentesData !== 'undefined') {
        window.componentesData = componentesData;
        console.log('✅ componentesData disponible globalmente');
    } else {
        console.warn('⚠️ componentesData no encontrado');
    }
    
    // Hacer funciones accesibles globalmente
    if (typeof obtenerPrecio === 'function') {
        window.obtenerPrecio = obtenerPrecio;
        console.log('✅ obtenerPrecio disponible globalmente');
    } else {
        console.warn('⚠️ obtenerPrecio no encontrado');
        // Función fallback
        window.obtenerPrecio = function(tipo, categoria, marca) {
            console.warn('Usando función obtenerPrecio fallback');
            return 120; // Precio por defecto
        };
    }
    
    if (typeof mostrarMensaje === 'function') {
        window.mostrarMensaje = mostrarMensaje;
        console.log('✅ mostrarMensaje disponible globalmente');
    } else {
        console.warn('⚠️ mostrarMensaje no encontrado');
        // Función fallback
        window.mostrarMensaje = function(texto, tipo) {
            console.log('Mensaje:', texto);
            alert(texto);
        };
    }
    
    console.log('🎯 Referencias globales configuradas');
});
`;

        scriptGlobal.textContent = codigoGlobal;
        document.head.appendChild(scriptGlobal);
        
        this.cambiosRealizados.push('🌐 Referencias globales creadas');
    }

    /**
     * Actualizar referencias a funciones PDF en el HTML
     */
    actualizarReferencias() {
        // Buscar y actualizar botones y event listeners
        const elementos = document.querySelectorAll('[onclick*="generarReportePDF"]');
        
        elementos.forEach(elemento => {
            const onclickActual = elemento.getAttribute('onclick');
            const onclickNuevo = onclickActual.replace('generarReportePDF()', 'PDFGenerator.generarReporte()');
            elemento.setAttribute('onclick', onclickNuevo);
            
            this.cambiosRealizados.push(`🔄 Actualizada referencia en: ${elemento.tagName}`);
        });

        // Buscar en event listeners inline en scripts
        const scripts = document.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            let contenido = script.textContent;
            const contenidoOriginal = contenido;
            
            // Reemplazar llamadas a la función
            contenido = contenido.replace(/generarReportePDF\(\)/g, 'PDFGenerator.generarReporte()');
            
            if (contenido !== contenidoOriginal) {
                script.textContent = contenido;
                this.cambiosRealizados.push('🔄 Actualizada referencia en script');
            }
        });
    }

    /**
     * Validar que la migración funcionó correctamente
     */
    async validarMigracion() {
        const validacion = {
            dependenciasOK: false,
            referenciasPDFOK: false,
            datosGlobalesOK: false,
            funcionesPDFLimpiasOK: false,
            problemas: []
        };

        // Esperar un poco para que se carguen los scripts
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Validar dependencias
        if (typeof window.jsPDF !== 'undefined' && typeof window.html2canvas !== 'undefined') {
            validacion.dependenciasOK = true;
        } else {
            validacion.problemas.push('❌ Dependencias jsPDF o html2canvas no cargadas');
        }

        // Validar PDF Generator
        if (typeof window.PDFGenerator !== 'undefined') {
            validacion.referenciasPDFOK = true;
        } else {
            validacion.problemas.push('❌ PDFGenerator no está disponible');
        }

        // Validar datos globales
        const datosRequeridos = ['componentesData', 'obtenerPrecio', 'mostrarMensaje'];
        const datosDisponibles = datosRequeridos.filter(dato => typeof window[dato] !== 'undefined');
        
        if (datosDisponibles.length === datosRequeridos.length) {
            validacion.datosGlobalesOK = true;
        } else {
            const faltantes = datosRequeridos.filter(dato => typeof window[dato] === 'undefined');
            validacion.problemas.push(`❌ Faltan datos globales: ${faltantes.join(', ')}`);
        }

        // Validar que no hay funciones PDF duplicadas
        const scripts = document.querySelectorAll('script:not([src])');
        let tieneFuncionesDuplicadas = false;
        
        scripts.forEach(script => {
            if (script.textContent.includes('function generarReportePDF') && 
                !script.textContent.includes('/* MIGRADO')) {
                tieneFuncionesDuplicadas = true;
            }
        });

        if (!tieneFuncionesDuplicadas) {
            validacion.funcionesPDFLimpiasOK = true;
        } else {
            validacion.problemas.push('⚠️ Detectadas funciones PDF sin migrar');
        }

        return validacion;
    }

    /**
     * Generar reporte de migración
     */
    generarReporteMigracion(validacion) {
        const exito = validacion.dependenciasOK && validacion.referenciasPDFOK && 
                     validacion.datosGlobalesOK && validacion.funcionesPDFLimpiasOK;

        let reporte = `
🔄 REPORTE DE MIGRACIÓN PDF GENERATOR
=====================================

✅ CAMBIOS REALIZADOS:
${this.cambiosRealizados.map(cambio => `   ${cambio}`).join('\n')}

📊 VALIDACIÓN:
   Dependencias: ${validacion.dependenciasOK ? '✅' : '❌'}
   PDF Generator: ${validacion.referenciasPDFOK ? '✅' : '❌'}
   Datos Globales: ${validacion.datosGlobalesOK ? '✅' : '❌'}
   Limpieza: ${validacion.funcionesPDFLimpiasOK ? '✅' : '❌'}

${validacion.problemas.length > 0 ? `
⚠️ PROBLEMAS DETECTADOS:
${validacion.problemas.map(problema => `   ${problema}`).join('\n')}
` : ''}

${exito ? `
🎉 MIGRACIÓN EXITOSA!
====================
Tu sistema ha sido migrado correctamente al nuevo PDF Generator modular.

PRÓXIMOS PASOS:
1. Crear archivo 'pdf-generator.js' con el código del módulo
2. Probar la generación de PDF con: PDFGenerator.generarReporte()
3. Si hay problemas, ejecutar: ejecutarDiagnosticoPDF()

` : `
❌ MIGRACIÓN INCOMPLETA
======================
Hay problemas que resolver antes de que el sistema funcione correctamente.
Revisa los problemas detectados arriba.

PARA REVERTIR CAMBIOS:
ejecutar: migradorPDF.revertirCambios()
`}

💾 BACKUP DISPONIBLE: ${this.backupRealizados ? 'Sí (en localStorage)' : 'No'}
⏰ Fecha: ${new Date().toLocaleString()}
        `;

        console.log(reporte);
        
        // Mostrar en UI si es posible
        if (typeof window.mostrarMensaje === 'function') {
            const resumen = exito ? 
                '🎉 Migración exitosa! Crear archivo pdf-generator.js' :
                '❌ Migración incompleta. Ver consola para detalles.';
            window.mostrarMensaje(resumen, exito ? 'success' : 'warning');
        }

        return reporte;
    }

    /**
     * Descargar código extraído como archivo
     */
    descargarCodigoExtraido(codigo) {
        try {
            const blob = new Blob([codigo], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'funciones-pdf-extraidas.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.cambiosRealizados.push('💾 Código extraído descargado');
        } catch (error) {
            console.warn('No se pudo descargar código extraído:', error);
        }
    }

    /**
     * Revertir cambios realizados
     */
    revertirCambios() {
        if (!this.backupRealizados) {
            console.error('❌ No hay backup disponible para revertir');
            return false;
        }

        try {
            const backupKey = localStorage.getItem('pdf_backup_latest');
            if (backupKey) {
                const htmlBackup = localStorage.getItem(backupKey);
                if (htmlBackup) {
                    document.documentElement.innerHTML = htmlBackup;
                    console.log('🔄 Cambios revertidos exitosamente');
                    return true;
                }
            }
        } catch (error) {
            console.error('❌ Error revirtiendo cambios:', error);
        }

        return false;
    }

    /**
     * Limpiar backups antiguos
     */
    limpiarBackups() {
        const keys = Object.keys(localStorage);
        const backupKeys = keys.filter(key => key.startsWith('pdf_backup_'));
        
        // Mantener solo los 5 backups más recientes
        if (backupKeys.length > 5) {
            const keysAEliminar = backupKeys.slice(0, -5);
            keysAEliminar.forEach(key => localStorage.removeItem(key));
            console.log(`🧹 Limpiados ${keysAEliminar.length} backups antiguos`);
        }
    }
}

/**
 * FUNCIONES DE UTILIDAD PARA EL USUARIO
 */

// Crear instancia global
window.migradorPDF = new MigradorPDF();

// Función simple para ejecutar migración
window.migrarSistemaPDF = function() {
    const confirmacion = confirm(
        '🔄 ¿Migrar sistema PDF al nuevo generador modular?\n\n' +
        'Esto:\n' +
        '• Creará backup del código actual\n' +
        '• Actualizará CDNs a versiones estables\n' +
        '• Separará código PDF en módulo externo\n' +
        '• Actualizará referencias en el HTML\n\n' +
        '¿Continuar?'
    );
    
    if (confirmacion) {
        window.migradorPDF.migrarSistema();
    }
};

// Función para revertir si algo sale mal
window.revertirMigracionPDF = function() {
    const confirmacion = confirm('🔄 ¿Revertir todos los cambios de la migración?');
    if (confirmacion) {
        return window.migradorPDF.revertirCambios();
    }
    return false;
};

// Función para limpiar backups antiguos
window.limpiarBackupsPDF = function() {
    window.migradorPDF.limpiarBackups();
};

/**
 * AUTO-MIGRACIÓN SI SE DETECTAN PROBLEMAS
 */
function detectarYOfrecerMigracion() {
    // Detectar si está usando sistema antiguo
    const tieneHTML2PDF = document.querySelector('script[src*="html2pdf"]');
    const tieneFuncionAntigua = document.body.innerHTML.includes('generarReportePDF');
    
    if (tieneHTML2PDF || tieneFuncionAntigua) {
        console.log('🔍 Sistema PDF antiguo detectado');
        
        setTimeout(() => {
            const ofrecer = confirm(
                '🔄 MIGRACIÓN AUTOMÁTICA DISPONIBLE\n\n' +
                'Se ha detectado que estás usando el sistema PDF antiguo.\n' +
                '¿Quieres migrar automáticamente al nuevo sistema modular?\n\n' +
                'Ventajas:\n' +
                '• Mejor control de márgenes\n' +
                '• PDFs de mayor calidad\n' +
                '• Código más mantenible\n' +
                '• Solución de problemas automática\n\n' +
                '¿Migrar ahora?'
            );
            
            if (ofrecer) {
                window.migrarSistemaPDF();
            }
        }, 2000);
    }
}

// Ejecutar detección automática
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectarYOfrecerMigracion);
} else {
    detectarYOfrecerMigracion();
}

/**
 * INSTRUCCIONES PARA EL USUARIO
 */
console.log(`
🔄 MIGRADOR PDF GENERATOR CARGADO
=================================

COMANDOS DISPONIBLES:
• migrarSistemaPDF()     - Ejecutar migración automática
• revertirMigracionPDF() - Revertir cambios
• limpiarBackupsPDF()    - Limpiar backups antiguos

MIGRACIÓN MANUAL:
1. Ejecutar: migrarSistemaPDF()
2. Crear archivo 'pdf-generator.js' con el código del módulo
3. Probar: PDFGenerator.generarReporte()

En caso de problemas: revertirMigracionPDF()
`);

// Exportar para módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MigradorPDF };
}
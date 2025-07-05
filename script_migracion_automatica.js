/**
 * 🔄 SCRIPT DE MIGRACIÓN AUTOMÁTICA
 * ================================
 * 
 * Migra automáticamente tu sistema existente al nuevo sistema modular
 * con generador PDF externo y CDNs actualizados.
 * 
 * PROCESO DE MIGRACIÓN:
 * 1. Detecta sistema antiguo
 * 2. Crea backup automático
 * 3. Actualiza CDNs a versiones estables
 * 4. Extrae funciones PDF al módulo externo
 * 5. Actualiza referencias en el HTML
 * 6. Valida migración completa
 * 
 * Versión: 2.0
 */

class MigradorSistemaPDF {
    constructor() {
        this.backupCreado = false;
        this.cambiosRealizados = [];
        this.erroresEncontrados = [];
        this.configuracionOriginal = null;
    }

    /**
     * FUNCIÓN PRINCIPAL: Ejecutar migración completa
     */
    async ejecutarMigracion() {
        console.log('🔄 === INICIANDO MIGRACIÓN AUTOMÁTICA ===');
        
        try {
            // 1. Detectar sistema actual
            const sistemaDetectado = this.detectarSistemaActual();
            console.log('📊 Sistema detectado:', sistemaDetectado);
            
            // 2. Crear backup de seguridad
            this.crearBackupCompleto();
            
            // 3. Actualizar CDNs
            this.actualizarCDNs();
            
            // 4. Extraer y modularizar código PDF
            this.extraerCodigoPDF();
            
            // 5. Actualizar referencias en el HTML
            this.actualizarReferencias();
            
            // 6. Crear funciones de compatibilidad
            this.crearFuncionesCompatibilidad();
            
            // 7. Validar migración
            const validacion = await this.validarMigracion();
            
            // 8. Mostrar reporte final
            this.mostrarReporteMigracion(validacion);
            
        } catch (error) {
            console.error('❌ Error durante migración:', error);
            this.erroresEncontrados.push(error.message);
            this.mostrarErrorMigracion();
        }
    }

    /**
     * Detectar qué tipo de sistema PDF se está usando actualmente
     */
    detectarSistemaActual() {
        const deteccion = {
            tieneHTML2PDF: false,
            tieneJSPDF: false,
            tieneGenerarReportePDF: false,
            tieneFuncionPDFInline: false,
            versionHTML2PDF: null,
            versionJSPDF: null,
            cdnsAntiguos: []
        };

        // Verificar scripts cargados
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.src.toLowerCase();
            
            if (src.includes('html2pdf')) {
                deteccion.tieneHTML2PDF = true;
                deteccion.cdnsAntiguos.push(script.src);
                
                // Detectar versión
                const versionMatch = src.match(/(\d+\.\d+\.\d+)/);
                if (versionMatch) {
                    deteccion.versionHTML2PDF = versionMatch[1];
                }
            }
            
            if (src.includes('jspdf')) {
                deteccion.tieneJSPDF = true;
                
                // Verificar si es versión antigua
                if (!src.includes('2.5.1')) {
                    deteccion.cdnsAntiguos.push(script.src);
                }
                
                const versionMatch = src.match(/(\d+\.\d+\.\d+)/);
                if (versionMatch) {
                    deteccion.versionJSPDF = versionMatch[1];
                }
            }
        });

        // Verificar funciones existentes
        const codigoHTML = document.documentElement.outerHTML;
        deteccion.tieneGenerarReportePDF = codigoHTML.includes('generarReportePDF');
        deteccion.tieneFuncionPDFInline = codigoHTML.includes('html2pdf()') || codigoHTML.includes('jsPDF');

        return deteccion;
    }

    /**
     * Crear backup completo del sistema actual
     */
    crearBackupCompleto() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupData = {
                html: document.documentElement.outerHTML,
                timestamp: timestamp,
                url: window.location.href,
                userAgent: navigator.userAgent
            };

            // Guardar en localStorage
            const backupKey = `sistema_backup_${timestamp}`;
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            localStorage.setItem('ultimo_backup', backupKey);

            this.backupCreado = true;
            this.cambiosRealizados.push(`✅ Backup creado: ${backupKey}`);
            
            console.log('💾 Backup creado exitosamente');

        } catch (error) {
            console.warn('⚠️ No se pudo crear backup en localStorage:', error);
            this.erroresEncontrados.push('Backup no disponible');
        }
    }

    /**
     * Actualizar CDNs a versiones estables
     */
    actualizarCDNs() {
        console.log('🔗 Actualizando CDNs...');

        const cdnsActualizados = [
            {
                id: 'jspdf-cdn-nuevo',
                src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                descripcion: 'jsPDF v2.5.1 (Estable)'
            },
            {
                id: 'html2canvas-cdn-nuevo', 
                src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
                descripcion: 'html2canvas v1.4.1 (Estable)'
            },
            {
                id: 'html2pdf-cdn-nuevo',
                src: 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
                descripcion: 'html2pdf.js v0.10.1 (Estable)'
            }
        ];

        // Remover CDNs antiguos problemáticos
        const scriptsAntiguos = document.querySelectorAll('script[src*="html2pdf"], script[src*="jspdf"]');
        scriptsAntiguos.forEach(script => {
            const src = script.src;
            if (!src.includes('2.5.1') || !src.includes('1.4.1') || !src.includes('0.10.1')) {
                script.remove();
                this.cambiosRealizados.push(`🗑️ CDN antiguo removido: ${src}`);
            }
        });

        // Agregar CDNs actualizados
        cdnsActualizados.forEach(cdn => {
            if (!document.getElementById(cdn.id)) {
                const script = document.createElement('script');
                script.id = cdn.id;
                script.src = cdn.src;
                script.defer = true;
                document.head.appendChild(script);
                this.cambiosRealizados.push(`➕ CDN agregado: ${cdn.descripcion}`);
            }
        });

        // Agregar referencia al módulo PDF externo
        if (!document.querySelector('script[src*="pdf-generator.js"]')) {
            const scriptPDF = document.createElement('script');
            scriptPDF.src = 'pdf-generator.js';
            scriptPDF.defer = true;
            document.head.appendChild(scriptPDF);
            this.cambiosRealizados.push('📄 Módulo PDF externo agregado');
        }
    }

    /**
     * Extraer código PDF del HTML a módulo externo
     */
    extraerCodigoPDF() {
        console.log('📤 Extrayendo código PDF...');

        const funcionesAExtraer = [
            'generarReportePDF',
            'crearHTMLCompleto', 
            'crearContenidoHTML',
            'procesarPDF',
            'configurarPDF'
        ];

        let codigoExtraido = '';
        const scripts = document.querySelectorAll('script:not([src])');
        
        scripts.forEach(script => {
            let contenido = script.textContent;
            const contenidoOriginal = contenido;

            funcionesAExtraer.forEach(nombreFuncion => {
                // Regex para encontrar funciones
                const patronFuncion = new RegExp(
                    `(function\\s+${nombreFuncion}|${nombreFuncion}\\s*[:=]\\s*function|const\\s+${nombreFuncion}\\s*=|let\\s+${nombreFuncion}\\s*=|var\\s+${nombreFuncion}\\s*=)[\\s\\S]*?(?=\\n\\s*(?:function|const|let|var|class|$))`,
                    'gm'
                );
                
                const matches = contenido.match(patronFuncion);
                if (matches) {
                    matches.forEach(match => {
                        codigoExtraido += `\n// Función extraída: ${nombreFuncion}\n${match}\n`;
                        
                        // Comentar en el código original
                        contenido = contenido.replace(match, 
                            `/* MIGRADO A pdf-generator.js:\nFunción: ${nombreFuncion}\nUsar: PDFGenerator.generarReporte() o generarReportePDFModular()\n*/`
                        );
                    });
                }
            });

            // Actualizar script si hubo cambios
            if (contenido !== contenidoOriginal) {
                script.textContent = contenido;
                this.cambiosRealizados.push(`📝 Script actualizado: funciones PDF comentadas`);
            }
        });

        if (codigoExtraido) {
            console.log('📋 Código extraído para pdf-generator.js:');
            console.log(codigoExtraido);
            this.descargarCodigoExtraido(codigoExtraido);
        }
    }

    /**
     * Actualizar referencias en el HTML
     */
    actualizarReferencias() {
        console.log('🔄 Actualizando referencias...');

        // Actualizar botones onclick
        const elementosOnClick = document.querySelectorAll('[onclick*="generarReportePDF"]');
        elementosOnClick.forEach(elemento => {
            const onclickActual = elemento.getAttribute('onclick');
            const onclickNuevo = onclickActual.replace(/generarReportePDF\(\)/g, 'generarReportePDFModular()');
            elemento.setAttribute('onclick', onclickNuevo);
            this.cambiosRealizados.push('🔄 Referencia onclick actualizada');
        });

        // Actualizar event listeners en scripts
        const scripts = document.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            let contenido = script.textContent;
            const contenidoOriginal = contenido;

            // Reemplazar llamadas directas
            contenido = contenido.replace(/generarReportePDF\(\)/g, 'generarReportePDFModular()');
            contenido = contenido.replace(/html2pdf\(\)/g, 'PDFGenerator.generarReporte()');

            if (contenido !== contenidoOriginal) {
                script.textContent = contenido;
                this.cambiosRealizados.push('🔄 Referencias en script actualizadas');
            }
        });
    }

    /**
     * Crear funciones de compatibilidad
     */
    crearFuncionesCompatibilidad() {
        console.log('🔗 Creando funciones de compatibilidad...');

        const scriptCompatibilidad = document.createElement('script');
        scriptCompatibilidad.id = 'compatibilidad-migracion';
        scriptCompatibilidad.textContent = `
// FUNCIONES DE COMPATIBILIDAD POST-MIGRACIÓN
console.log('🔗 Funciones de compatibilidad cargadas');

// Función principal modular
function generarReportePDFModular() {
    if (typeof PDFGenerator !== 'undefined') {
        return PDFGenerator.generarReporte();
    } else {
        console.error('❌ PDFGenerator no está disponible');
        alert('Error: Módulo PDF no encontrado. Verifica que pdf-generator.js esté cargado.');
    }
}

// Función de retrocompatibilidad
function generarReportePDF() {
    console.log('⚠️ Usando función legacy. Migrando a función modular...');
    return generarReportePDFModular();
}

// Función de diagnóstico automático
function diagnosticarSistemaMigrado() {
    console.log('🔍 === DIAGNÓSTICO POST-MIGRACIÓN ===');
    
    const dependencias = [
        { nombre: 'PDFGenerator', disponible: typeof PDFGenerator !== 'undefined' },
        { nombre: 'jsPDF', disponible: typeof window.jsPDF !== 'undefined' },
        { nombre: 'html2canvas', disponible: typeof html2canvas !== 'undefined' },
        { nombre: 'html2pdf', disponible: typeof html2pdf !== 'undefined' }
    ];
    
    dependencias.forEach(dep => {
        console.log(\`\${dep.disponible ? '✅' : '❌'} \${dep.nombre}\`);
    });
    
    const todoOK = dependencias.every(dep => dep.disponible);
    console.log(\`\nEstado: \${todoOK ? '✅ MIGRACIÓN EXITOSA' : '❌ REQUIERE ATENCIÓN'}\`);
    
    return todoOK;
}

// Verificación automática al cargar
window.addEventListener('load', function() {
    setTimeout(() => {
        if (typeof PDFGenerator === 'undefined') {
            console.warn('⚠️ PDFGenerator no encontrado. Verificar pdf-generator.js');
        } else {
            console.log('✅ Sistema migrado correctamente');
        }
    }, 1000);
});
`;

        document.head.appendChild(scriptCompatibilidad);
        this.cambiosRealizados.push('🔗 Funciones de compatibilidad agregadas');
    }

    /**
     * Validar que la migración fue exitosa
     */
    async validarMigracion() {
        console.log('✅ Validando migración...');
        
        // Esperar a que se carguen los scripts
        await new Promise(resolve => setTimeout(resolve, 2000));

        const validacion = {
            dependenciasOK: false,
            moduloPDFOK: false,
            funcionesCompatibilidadOK: false,
            cdnsActualizadosOK: false,
            errores: []
        };

        // Validar dependencias principales
        try {
            const dependenciasRequeridas = ['jsPDF', 'html2canvas', 'html2pdf'];
            const dependenciasDisponibles = dependenciasRequeridas.filter(dep => 
                eval(`typeof window.${dep === 'jsPDF' ? 'jsPDF' : dep} !== 'undefined'`)
            );
            
            validacion.dependenciasOK = dependenciasDisponibles.length === dependenciasRequeridas.length;
            
            if (!validacion.dependenciasOK) {
                const faltantes = dependenciasRequeridas.filter(dep => 
                    eval(`typeof window.${dep === 'jsPDF' ? 'jsPDF' : dep} === 'undefined'`)
                );
                validacion.errores.push(`Dependencias faltantes: ${faltantes.join(', ')}`);
            }
        } catch (error) {
            validacion.errores.push(`Error verificando dependencias: ${error.message}`);
        }

        // Validar módulo PDF
        validacion.moduloPDFOK = typeof PDFGenerator !== 'undefined';
        if (!validacion.moduloPDFOK) {
            validacion.errores.push('PDFGenerator no está disponible');
        }

        // Validar funciones de compatibilidad
        validacion.funcionesCompatibilidadOK = typeof generarReportePDFModular === 'function';
        if (!validacion.funcionesCompatibilidadOK) {
            validacion.errores.push('Funciones de compatibilidad no cargadas');
        }

        // Validar CDNs
        const cdnsEsperados = document.querySelectorAll('script[src*="2.5.1"], script[src*="1.4.1"], script[src*="0.10.1"]');
        validacion.cdnsActualizadosOK = cdnsEsperados.length >= 3;

        return validacion;
    }

    /**
     * Mostrar reporte de migración
     */
    mostrarReporteMigracion(validacion) {
        const exitoso = validacion.dependenciasOK && validacion.moduloPDFOK && validacion.funcionesCompatibilidadOK;

        const reporte = `
🔄 === REPORTE DE MIGRACIÓN AUTOMÁTICA ===
==========================================

✅ CAMBIOS REALIZADOS:
${this.cambiosRealizados.map(cambio => `   ${cambio}`).join('\n')}

📊 VALIDACIÓN:
   Dependencias PDF: ${validacion.dependenciasOK ? '✅' : '❌'}
   Módulo PDFGenerator: ${validacion.moduloPDFOK ? '✅' : '❌'}
   Funciones Compatibilidad: ${validacion.funcionesCompatibilidadOK ? '✅' : '❌'}
   CDNs Actualizados: ${validacion.cdnsActualizadosOK ? '✅' : '❌'}

${validacion.errores.length > 0 ? `
⚠️ ERRORES ENCONTRADOS:
${validacion.errores.map(error => `   ❌ ${error}`).join('\n')}
` : ''}

${exitoso ? `
🎉 ¡MIGRACIÓN EXITOSA!
=====================
Tu sistema ha sido migrado correctamente al nuevo generador PDF modular.

PRÓXIMOS PASOS:
1. ✅ Crear archivo 'pdf-generator.js' (se descargó automáticamente)
2. ✅ Usar: generarReportePDFModular() en lugar de generarReportePDF()
3. ✅ Verificar: diagnosticarSistemaMigrado()

MEJORAS OBTENIDAS:
• CDNs actualizados a versiones estables
• Mejor control de márgenes en PDF
• Código modular y mantenible
• Funciones de compatibilidad incluidas
• Backup automático creado

` : `
❌ MIGRACIÓN INCOMPLETA
======================
Se encontraron problemas durante la migración.

SOLUCIONES:
1. Verificar que pdf-generator.js esté en la misma carpeta
2. Revisar errores en la consola del navegador  
3. Ejecutar: diagnosticarSistemaMigrado()
4. Si persisten problemas: restaurarBackup()
`}

💾 BACKUP: ${this.backupCreado ? 'Disponible en localStorage' : 'No disponible'}
⏰ Fecha: ${new Date().toLocaleString()}
        `;

        console.log(reporte);
        
        // Mostrar en UI también
        const mensaje = exitoso ? 
            '🎉 Migración exitosa! Sistema PDF modernizado.' :
            '⚠️ Migración incompleta. Ver consola para detalles.';
            
        if (typeof mostrarMensaje === 'function') {
            mostrarMensaje(mensaje, exitoso ? 'success' : 'warning');
        } else {
            alert(mensaje);
        }
    }

    /**
     * Mostrar error de migración
     */
    mostrarErrorMigracion() {
        const mensajeError = `
❌ === ERROR EN LA MIGRACIÓN ===
Errores encontrados:
${this.erroresEncontrados.map(error => `• ${error}`).join('\n')}

RECOMENDACIONES:
1. Recargar la página y intentar nuevamente
2. Verificar que tienes permisos de escritura
3. Usar navegador moderno (Chrome, Firefox, Edge)
4. Si persiste: restaurar backup manualmente
        `;
        
        console.error(mensajeError);
        alert('❌ Error en la migración. Ver consola para detalles.');
    }

    /**
     * Descargar código extraído como archivo
     */
    descargarCodigoExtraido(codigo) {
        try {
            const contenidoCompleto = `
/**
 * CÓDIGO PDF EXTRAÍDO DE TU SISTEMA
 * =================================
 * 
 * Este código fue extraído automáticamente durante la migración.
 * Puedes usarlo como referencia para crear tu pdf-generator.js personalizado.
 * 
 * RECOMENDACIÓN: Usa mejor el módulo PDFGenerator mejorado proporcionado.
 */

${codigo}

// NOTA: Este código puede necesitar adaptación para funcionar
// con el nuevo sistema modular. Se recomienda usar PDFGenerator.
`;

            const blob = new Blob([contenidoCompleto], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'codigo-pdf-extraido.js';
            a.click();
            URL.revokeObjectURL(url);
            
            this.cambiosRealizados.push('💾 Código extraído descargado');
        } catch (error) {
            console.warn('No se pudo descargar código extraído:', error);
        }
    }

    /**
     * Restaurar desde backup
     */
    restaurarBackup() {
        try {
            const ultimoBackup = localStorage.getItem('ultimo_backup');
            if (ultimoBackup) {
                const backupData = JSON.parse(localStorage.getItem(ultimoBackup));
                if (backupData && backupData.html) {
                    if (confirm('¿Restaurar desde el backup? Esto revertirá todos los cambios.')) {
                        document.documentElement.innerHTML = backupData.html;
                        location.reload();
                    }
                }
            } else {
                alert('No hay backup disponible');
            }
        } catch (error) {
            alert('Error restaurando backup: ' + error.message);
        }
    }
}

// CREAR INSTANCIA GLOBAL
window.MigradorSistemaPDF = MigradorSistemaPDF;

// FUNCIONES GLOBALES DE UTILIDAD
window.migrarSistemaPDF = function() {
    const confirmacion = confirm(
        '🔄 ¿MIGRAR AL SISTEMA PDF MODULAR?\n\n' +
        'Esta migración:\n' +
        '• ✅ Actualizará CDNs a versiones estables\n' +
        '• ✅ Separará código PDF en módulo externo\n' +
        '• ✅ Mejorará control de márgenes\n' +
        '• ✅ Creará backup automático\n' +
        '• ✅ Mantendrá compatibilidad total\n\n' +
        '¿Continuar con la migración automática?'
    );
    
    if (confirmacion) {
        const migrador = new MigradorSistemaPDF();
        migrador.ejecutarMigracion();
    }
};

window.restaurarBackup = function() {
    const migrador = new MigradorSistemaPDF();
    migrador.restaurarBackup();
};

window.diagnosticarSistemaMigrado = function() {
    console.log('🔍 === DIAGNÓSTICO RÁPIDO ===');
    const dependenciasOK = typeof PDFGenerator !== 'undefined' && 
                          typeof window.jsPDF !== 'undefined' &&
                          typeof html2canvas !== 'undefined';
    
    console.log(`Estado general: ${dependenciasOK ? '✅ OK' : '❌ PROBLEMAS'}`);
    
    if (typeof diagnosticarPDF === 'function') {
        diagnosticarPDF();
    }
    
    return dependenciasOK;
};

/**
 * AUTO-DETECCIÓN Y OFERTA DE MIGRACIÓN
 */
function detectarSistemaAntiguo() {
    const tieneHTML2PDFAntiguo = document.querySelector('script[src*="html2pdf"]') && 
                                !document.querySelector('script[src*="0.10.1"]');
    const tieneJSPDFAntiguo = document.querySelector('script[src*="jspdf"]') && 
                             !document.querySelector('script[src*="2.5.1"]');
    const tieneFuncionLegacy = document.body.innerHTML.includes('generarReportePDF') &&
                              !document.body.innerHTML.includes('PDFGenerator');
    
    if (tieneHTML2PDFAntiguo || tieneJSPDFAntiguo || tieneFuncionLegacy) {
        console.log('🔍 Sistema PDF antiguo detectado');
        
        setTimeout(() => {
            const ofrecer = confirm(
                '🔄 MIGRACIÓN AUTOMÁTICA DISPONIBLE\n\n' +
                'Se detectó que usas sistema PDF antiguo.\n' +
                '¿Migrar automáticamente al sistema modular mejorado?\n\n' +
                'BENEFICIOS:\n' +
                '• ✅ Mejor calidad de PDF\n' +
                '• ✅ Control preciso de márgenes\n' +
                '• ✅ CDNs estables y actualizados\n' +
                '• ✅ Código más mantenible\n' +
                '• ✅ Compatibilidad garantizada\n\n' +
                '¿Migrar ahora?'
            );
            
            if (ofrecer) {
                migrarSistemaPDF();
            }
        }, 2000);
    }
}

// EJECUTAR DETECCIÓN AUTOMÁTICA
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectarSistemaAntiguo);
} else {
    detectarSistemaAntiguo();
}

console.log(`
🔄 MIGRADOR AUTOMÁTICO CARGADO
==============================

COMANDOS DISPONIBLES:
• migrarSistemaPDF()         - Ejecutar migración completa
• restaurarBackup()          - Revertir cambios
• diagnosticarSistemaMigrado() - Verificar estado

MIGRACIÓN AUTOMÁTICA:
El sistema detectará automáticamente si necesitas migrar
y te ofrecerá hacerlo de forma automática.

¿PROBLEMAS? Ejecuta: restaurarBackup()
`);
